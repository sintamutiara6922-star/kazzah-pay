import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import { siteConfig } from '@/lib/config'
import crypto from 'crypto'

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-signature')

    // Verify webhook signature for Atlantic
    if (WEBHOOK_SECRET && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(body)
        .digest('hex')

      if (signature !== expectedSignature) {
        console.error('[Yilzi] Invalid webhook signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const data = JSON.parse(body)
    console.log('[Yilzi] Webhook received:', data)

    // Detect webhook format (Atlantic vs Pakasir)
    if (data.project && data.order_id) {
      // Pakasir webhook format (has project and order_id fields)
      console.log('[Yilzi] Detected Pakasir webhook')
      await handlePakasirWebhook(data)
    } else if (data.event) {
      // Atlantic webhook format
      console.log('[Yilzi] Detected Atlantic webhook')
      // Handle different webhook events
      if (data.event === 'payment.success') {
        await handlePaymentSuccess(data)
      } else if (data.event === 'payment.pending') {
        await handlePaymentPending(data)
      } else if (data.event === 'payment.failed') {
        await handlePaymentFailed(data)
      } else if (data.event === 'payment.expired') {
        await handlePaymentExpired(data)
      }
    } else {
      console.error('[Yilzi] Unknown webhook format:', data)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Yilzi] Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handlePaymentSuccess(data: any) {
  const transactionId = data.transaction_id || data.id
  
  console.log('[Yilzi] Webhook - Processing payment.success for transaction:', transactionId)
  
  // Update transaction status in Redis
  const transactionData = await redis.hgetall(
    siteConfig.redis.keys.transaction(transactionId)
  )

  if (!transactionData || !transactionData.id) {
    console.error('[Yilzi] Webhook - Transaction not found:', transactionId)
    return
  }

  // Check if stats already recorded (prevent duplicate processing)
  const alreadyRecorded = transactionData.statsRecorded === 'true' || transactionData.statsRecorded === true
  
  if (alreadyRecorded) {
    console.log('[Yilzi] Webhook - Stats already recorded for transaction:', transactionId, '- Skipping duplicate')
    return
  }

  try {
    // Mark as processed first to prevent race conditions
    await redis.hset(siteConfig.redis.keys.transaction(transactionId), {
      statsRecorded: 'true',
    })

    // Update transaction status to success
    await redis.hset(siteConfig.redis.keys.transaction(transactionId), {
      status: 'success',
      paidAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    // Update invoice status
    if (transactionData.invoiceCode) {
      await redis.hset(siteConfig.redis.keys.invoice(transactionData.invoiceCode as string), {
        status: 'success',
        paidAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statsRecorded: 'true',
      })
    }

    const amount = parseInt(transactionData.amount as string) || 0
    if (amount > 0) {
      // Update main stats - ONLY for successful payments
      await redis.hincrby(siteConfig.redis.keys.stats, 'totalAmount', amount)
      await redis.hincrby(siteConfig.redis.keys.stats, 'totalTransactions', 1)
      await redis.hincrby(siteConfig.redis.keys.stats, 'successfulTransactions', 1)

      // Update type-specific stats
      const transactionType = transactionData.type as string
      if (transactionType === 'donation') {
        await redis.hincrby(siteConfig.redis.keys.stats, 'totalDonations', 1)
        await redis.hincrby(siteConfig.redis.keys.stats, 'donationAmount', amount)
      } else {
        await redis.hincrby(siteConfig.redis.keys.stats, 'totalPayments', 1)
        await redis.hincrby(siteConfig.redis.keys.stats, 'paymentAmount', amount)
      }
    }

    // Update leaderboard based on transaction type
    const transactionType = transactionData.type as string
    const isAnonymous = transactionData.anonymous === 'true' || transactionData.anonymous === true
    
    if (!isAnonymous && transactionData.email) {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      const week = getWeekNumber(today)
      const quarter = Math.floor(today.getMonth() / 3) + 1
      
      // Determine type prefix for leaderboard keys
      const typePrefix = transactionType === 'donation' ? 'donations' : 'payments'
      
      // Update all leaderboard periods
      const leaderboardKeys = [
        `leaderboard:${typePrefix}:alltime`,
        `leaderboard:${typePrefix}:yearly:${year}`,
        `leaderboard:${typePrefix}:quarterly:${year}-Q${quarter}`,
        `leaderboard:${typePrefix}:monthly:${year}-${month}`,
        `leaderboard:${typePrefix}:weekly:${year}-W${week}`,
        `leaderboard:${typePrefix}:daily:${year}-${month}-${day}`,
      ]
      
      for (const key of leaderboardKeys) {
        await redis.zincrby(
          key,
          amount,
          transactionData.email as string
        )
      }
      
      // Update also "all" type leaderboards (combined donations + payments)
      const allLeaderboardKeys = [
        `leaderboard:all:alltime`,
        `leaderboard:all:yearly:${year}`,
        `leaderboard:all:quarterly:${year}-Q${quarter}`,
        `leaderboard:all:monthly:${year}-${month}`,
        `leaderboard:all:weekly:${year}-W${week}`,
        `leaderboard:all:daily:${year}-${month}-${day}`,
      ]
      
      for (const key of allLeaderboardKeys) {
        await redis.zincrby(
          key,
          amount,
          transactionData.email as string
        )
      }

      // Update contributor details
      await redis.hset(`contributor:${transactionData.email}`, {
        name: transactionData.name,
        email: transactionData.email,
        lastTransaction: new Date().toISOString(),
        count: '1',
      })
    }

    // Add to recent transactions ONLY after successful payment
    await redis.lpush(
      siteConfig.redis.keys.recentTransactions,
      JSON.stringify({
        id: transactionId,
        name: isAnonymous ? 'Anonymous' : transactionData.name,
        amount: amount,
        type: transactionType,
        createdAt: transactionData.createdAt,
        status: 'success',
      })
    )
    await redis.ltrim(siteConfig.redis.keys.recentTransactions, 0, 99)

    console.log('[Yilzi] Payment success handled and stats updated:', transactionId)
  } catch (error) {
    console.error('[Yilzi] Error handling payment success:', error)
    // Reset statsRecorded flag if something went wrong
    await redis.hset(siteConfig.redis.keys.transaction(transactionId), {
      statsRecorded: 'false',
    })
    throw error
  }
}

async function handlePaymentPending(data: any) {
  const transactionId = data.transaction_id || data.id
  await redis.hset(siteConfig.redis.keys.transaction(transactionId), {
    status: 'pending',
    updatedAt: new Date().toISOString(),
  })
}

async function handlePaymentFailed(data: any) {
  const transactionId = data.transaction_id || data.id
  await redis.hset(siteConfig.redis.keys.transaction(transactionId), {
    status: 'failed',
    updatedAt: new Date().toISOString(),
  })
  await redis.hincrby(siteConfig.redis.keys.stats, 'failedTransactions', 1)
}

async function handlePaymentExpired(data: any) {
  const transactionId = data.transaction_id || data.id
  await redis.hset(siteConfig.redis.keys.transaction(transactionId), {
    status: 'expired',
    updatedAt: new Date().toISOString(),
  })
}

// Handle Pakasir webhook
async function handlePakasirWebhook(data: {
  amount: number
  order_id: string
  project: string
  status: 'completed' | 'pending' | 'expired' | 'cancelled'
  payment_method: string
  completed_at?: string
}) {
  console.log('[Yilzi] Processing Pakasir webhook:', data)
  
  // Map Pakasir status to our status
  if (data.status === 'completed') {
    await handlePaymentSuccess({
      transaction_id: data.order_id,
      amount: data.amount,
      payment_method: data.payment_method,
      completed_at: data.completed_at,
    })
  } else if (data.status === 'pending') {
    await handlePaymentPending({ transaction_id: data.order_id })
  } else if (data.status === 'expired') {
    await handlePaymentExpired({ transaction_id: data.order_id })
  } else if (data.status === 'cancelled') {
    await handlePaymentFailed({ transaction_id: data.order_id })
  }
}

function getWeekNumber(date: Date): string {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  return String(weekNum).padStart(2, '0')
                          }
      
