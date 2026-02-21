import { NextRequest, NextResponse } from 'next/server'
import { paymentGateway, currentGateway } from '@/lib/payment-gateway'
import { redis } from '@/lib/redis'
import { siteConfig } from '@/lib/config'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const transactionId = searchParams.get('id')
    const invoiceCode = searchParams.get('invoice')

    if (!transactionId && !invoiceCode) {
      return NextResponse.json(
        { error: 'Transaction ID or Invoice Code required' },
        { status: 400 }
      )
    }

    // Get from Redis first
    let transactionData: any
    if (invoiceCode) {
      transactionData = await redis.hgetall(siteConfig.redis.keys.invoice(invoiceCode))
    } else if (transactionId) {
      transactionData = await redis.hgetall(siteConfig.redis.keys.transaction(transactionId))
    }

    if (!transactionData || !transactionData.id) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    console.log('[Yilzi] Checking status for transaction:', transactionData.id, 'Current status:', transactionData.status, 'Gateway:', transactionData.gateway || currentGateway)

    // If transaction is already in a terminal state (cancel, success, failed, expired), 
    // return from Redis directly - no need to call gateway API
    const terminalStatuses = ['cancel', 'success', 'failed', 'expired']
    if (terminalStatuses.includes(transactionData.status as string)) {
      console.log('[Yilzi] Transaction is in terminal state:', transactionData.status, '- returning from Redis directly')
      
      let paymentDataToReturn: any = null
      if (transactionData.paymentData) {
        try {
          paymentDataToReturn = typeof transactionData.paymentData === 'string' 
            ? JSON.parse(transactionData.paymentData)
            : transactionData.paymentData
        } catch (e) {
          console.error('[Yilzi] Failed to parse paymentData:', e)
        }
      }
      
      return NextResponse.json({
        success: true,
        transaction: {
          ...transactionData,
          paymentData: paymentDataToReturn,
          canUseInstantDeposit: false,
        },
      })
    }

    // Check latest status from payment gateway
    // Pass amount for Pakasir (required by their API)
    const gateway = (transactionData.gateway || currentGateway) as string
    const amount = parseInt(transactionData.amount as string) || 0
    
    let statusResponse
    if (gateway.toLowerCase() === 'pakasir') {
      const { pakasirAPI } = await import('@/lib/pakasir')
      statusResponse = await pakasirAPI.getTransactionStatus({
        order_id: transactionData.id,
        amount: amount
      })
    } else {
      statusResponse = await paymentGateway.getDepositStatus(transactionData.id)
    }

    console.log(`[Yilzi] ${transactionData.gateway || currentGateway} status response:`, {
      success: statusResponse.status,
      newStatus: statusResponse.data?.status,
      oldStatus: transactionData.status
    })

    if (statusResponse.status && statusResponse.data) {
      // Check if stats already recorded for this transaction (wait for webhook)
      const alreadyRecorded = transactionData.statsRecorded === 'true' || transactionData.statsRecorded === true

      // Update transaction status metadata (but NOT stats - they wait for webhook)
      if (statusResponse.data.status !== transactionData.status) {
        console.log('[Yilzi] Atlantic status changed from', transactionData.status, 'to', statusResponse.data.status)
        
        const updateFields: any = {
          status: statusResponse.data.status,
          updatedAt: new Date().toISOString(),
        }
        
        await redis.hset(siteConfig.redis.keys.transaction(transactionData.id), updateFields)
        
        if (transactionData.invoiceCode) {
          await redis.hset(siteConfig.redis.keys.invoice(transactionData.invoiceCode), updateFields)
        }

        // IMPORTANT: Stats are ONLY updated by the webhook handler (payment.success)
        // This prevents premature updates before payment confirmation
        console.log('[Yilzi] Status updated - Stats will be updated when webhook is received')
      }

      // BACKUP: If status is success but stats not recorded yet, record them now
      // (Backup in case webhook doesn't fire or takes too long)
      if (statusResponse.data.status === 'success' && !alreadyRecorded) {
        console.log('[Yilzi] BACKUP: Status is success and stats not recorded - updating stats now')
        try {
          const amount = parseInt(transactionData.amount as string) || 0
          if (amount > 0) {
            // Update main stats
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

            // Update leaderboard
            const transactionType2 = transactionData.type as string
            const isAnonymous = transactionData.anonymous === 'true' || transactionData.anonymous === true
            
            if (!isAnonymous && transactionData.email) {
              const today = new Date()
              const year = today.getFullYear()
              const month = String(today.getMonth() + 1).padStart(2, '0')
              const day = String(today.getDate()).padStart(2, '0')
              const week = getWeekNumber(today)
              const quarter = Math.floor(today.getMonth() / 3) + 1
              
              const typePrefix = transactionType2 === 'donation' ? 'donations' : 'payments'
              
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
                await redis.zincrby(key, amount, transactionData.email as string)
              }
              
              // Update "all" type leaderboards
              const allLeaderboardKeys = [
                `leaderboard:all:alltime`,
                `leaderboard:all:yearly:${year}`,
                `leaderboard:all:quarterly:${year}-Q${quarter}`,
                `leaderboard:all:monthly:${year}-${month}`,
                `leaderboard:all:weekly:${year}-W${week}`,
                `leaderboard:all:daily:${year}-${month}-${day}`,
              ]
              
              for (const key of allLeaderboardKeys) {
                await redis.zincrby(key, amount, transactionData.email as string)
              }

              // Update contributor info
              await redis.hset(`contributor:${transactionData.email}`, {
                name: transactionData.name,
                email: transactionData.email,
                lastTransaction: new Date().toISOString(),
                count: '1',
              })
            }

            // Add to recent transactions
            await redis.lpush(
              siteConfig.redis.keys.recentTransactions,
              JSON.stringify({
                id: transactionData.id,
                name: isAnonymous ? 'Anonymous' : transactionData.name,
                amount: amount,
                type: transactionData.type,
                createdAt: transactionData.createdAt,
                status: 'success',
              })
            )
            await redis.ltrim(siteConfig.redis.keys.recentTransactions, 0, 99)

            // Mark as recorded
            await redis.hset(siteConfig.redis.keys.transaction(transactionData.id), {
              statsRecorded: 'true',
            })
            if (transactionData.invoiceCode) {
              await redis.hset(siteConfig.redis.keys.invoice(transactionData.invoiceCode), {
                statsRecorded: 'true',
              })
            }

            console.log('[Yilzi] BACKUP: Stats and leaderboard recorded successfully')
          }
        } catch (error) {
          console.error('[Yilzi] BACKUP: Error updating stats:', error)
        }
      }

      // Check if instant deposit is available (only for Atlantic with processing status)
      const isAtlantic = (transactionData.gateway || currentGateway) === 'atlantic'
      const canUseInstant = isAtlantic && statusResponse.data.status === 'processing'
      
      // Check if instant deposit has already been triggered by checking if metadata exists
      const instantDepositAlreadyTriggered = !!transactionData.totalReceived || !!transactionData.instantFee
      
      // AUTO-TRIGGER INSTANT DEPOSIT when using Atlantic, status is processing AND hasn't been triggered yet
      if (canUseInstant && !instantDepositAlreadyTriggered) {
        console.log('[Yilzi] Atlantic status is processing - AUTO-TRIGGERING instant deposit for transaction:', transactionData.id)
        try {
          const { atlanticAPI } = await import('@/lib/atlantic')
          const instantResponse = await atlanticAPI.instantDeposit(transactionData.id, true)
          console.log('[Yilzi] Auto instant deposit response:', {
            success: instantResponse.status,
            instantFee: instantResponse.data?.penanganan,
            totalReceived: instantResponse.data?.total_diterima,
          })
          
          if (instantResponse.status && instantResponse.data) {
            // Update transaction with instant deposit metadata
            const instantUpdateData = {
              instantFee: instantResponse.data.penanganan,
              totalFee: instantResponse.data.total_fee,
              totalReceived: instantResponse.data.total_diterima,
              updatedAt: new Date().toISOString(),
            }
            
            await redis.hset(siteConfig.redis.keys.transaction(transactionData.id), instantUpdateData)
            
            if (transactionData.invoiceCode) {
              await redis.hset(siteConfig.redis.keys.invoice(transactionData.invoiceCode), instantUpdateData)
            }
            
            console.log('[Yilzi] Auto instant deposit completed - stored metadata (instantFee:', instantResponse.data.penanganan, ', totalReceived:', instantResponse.data.total_diterima, '), awaiting webhook confirmation')
          } else {
            console.error('[Yilzi] Auto instant deposit failed:', instantResponse.message)
          }
        } catch (error) {
          console.error('[Yilzi] Error in auto instant deposit:', error)
          // Don't throw - just log the error and continue
        }
      } else if (canUseInstant && instantDepositAlreadyTriggered) {
        console.log('[Yilzi] Instant deposit already triggered for this transaction - metadata exists')
      }
      
      // Parse existing paymentData if it's a string
      let existingPaymentData: any = null
      if (transactionData.paymentData) {
        try {
          existingPaymentData = typeof transactionData.paymentData === 'string' 
            ? JSON.parse(transactionData.paymentData)
            : transactionData.paymentData
        } catch (e) {
          console.error('[Yilzi] Failed to parse paymentData:', e)
        }
      }
      
      console.log(`[Yilzi] Status check complete for ${transactionData.gateway || currentGateway}. Can use instant:`, canUseInstant, '- Stats recording waits for webhook')
      
      const paymentDataToReturn = existingPaymentData ? {
        ...existingPaymentData,
        status: statusResponse.data.status,
      } : statusResponse.data
      
      console.log('[Yilzi] Returning paymentData:', {
        has_qr_image: !!paymentDataToReturn?.qr_image,
        has_qr_string: !!paymentDataToReturn?.qr_string,
        qr_image_preview: paymentDataToReturn?.qr_image?.substring(0, 80),
      })

      return NextResponse.json({
        success: true,
        transaction: {
          ...transactionData,
          status: statusResponse.data.status,
          // Keep existing paymentData (contains qr_image, qr_string) and only update status fields
          paymentData: paymentDataToReturn,
          canUseInstantDeposit: canUseInstant,
          instantDepositTriggered: instantDepositAlreadyTriggered,
          instantFee: transactionData.instantFee,
          totalReceived: transactionData.totalReceived,
          message: canUseInstant && !instantDepositAlreadyTriggered 
            ? 'Instant deposit auto-triggered - awaiting webhook confirmation' 
            : canUseInstant && instantDepositAlreadyTriggered
            ? 'Instant deposit already processed - awaiting webhook confirmation'
            : undefined,
          statsRecordingWaitsForWebhook: true, // Stats updated only when webhook 'payment.success' is received
        },
      })
    }

    // If Atlantic API call failed, still return existing transaction data with original paymentData
    let paymentDataToReturn: any = null
    if (transactionData.paymentData) {
      try {
        paymentDataToReturn = typeof transactionData.paymentData === 'string' 
          ? JSON.parse(transactionData.paymentData)
          : transactionData.paymentData
      } catch (e) {
        console.error('[Yilzi] Failed to parse paymentData:', e)
      }
    }
    
    return NextResponse.json({
      success: true,
      transaction: {
        ...transactionData,
        paymentData: paymentDataToReturn,
        canUseInstantDeposit: transactionData.status === 'processing',
      },
    })
  } catch (error) {
    console.error('[Yilzi] Status check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function censorEmail(email: string): string {
  if (!email) return 'Anonymous'
  const [localPart, domain] = email.split('@')
  if (!domain) return email
  
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`
  }
  
  return `${localPart[0]}${'*'.repeat(localPart.length - 1)}@${domain}`
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

// Stats are now updated ONLY by the webhook handler (webhook/route.ts)
// This ensures data consistency and prevents premature updates
                
