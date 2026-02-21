import { NextRequest, NextResponse } from 'next/server'
import { paymentGateway, currentGateway } from '@/lib/payment-gateway'
import { redis } from '@/lib/redis'
import { siteConfig } from '@/lib/config'
import { z } from 'zod'

const cancelDepositSchema = z.object({
  id: z.string().min(1, 'Transaction ID required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = cancelDepositSchema.parse(body)

    console.log('[Yilzi] Cancel deposit request:', validated.id)

    // Get transaction from Redis
    const transactionData = await redis.hgetall(
      siteConfig.redis.keys.transaction(validated.id)
    )

    if (!transactionData || !transactionData.id) {
      console.log('[Yilzi] Transaction not found:', validated.id)
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    console.log('[Yilzi] Current transaction status:', transactionData.status)

    // Check if transaction can be cancelled
    if (transactionData.status === 'success') {
      return NextResponse.json(
        {
          error: 'Cannot cancel',
          message: 'Completed transactions cannot be cancelled',
        },
        { status: 400 }
      )
    }

    if (transactionData.status === 'cancel' || transactionData.status === 'cancelled') {
      return NextResponse.json(
        {
          error: 'Already cancelled',
          message: 'This transaction is already cancelled',
        },
        { status: 400 }
      )
    }

    // Call payment gateway cancel API
    // Pass amount for Pakasir (required by their API)
    const gateway = (transactionData.gateway || currentGateway) as string
    const amount = parseInt(transactionData.amount as string) || 0
    
    let cancelResponse
    if (gateway.toLowerCase() === 'pakasir') {
      const { pakasirAPI } = await import('@/lib/pakasir')
      cancelResponse = await pakasirAPI.cancelTransaction({
        order_id: validated.id,
        amount: amount
      })
    } else {
      cancelResponse = await paymentGateway.cancelDeposit(validated.id)
    }

    console.log(`[Yilzi] ${transactionData.gateway || currentGateway} cancel response:`, {
      status: cancelResponse.status,
      hasData: !!cancelResponse.data,
    })

    // For Pakasir: if the gateway says "already canceled", treat it as success
    // The transaction is canceled on their end, we just need to update our Redis
    const alreadyCanceled = !cancelResponse.status && 
      cancelResponse.message?.toLowerCase().includes('canceled')

    if (!cancelResponse.status && !alreadyCanceled) {
      console.error('[Yilzi] Cancel deposit failed:', cancelResponse.message)
      return NextResponse.json(
        {
          error: 'Failed to cancel deposit',
          details: cancelResponse.message,
        },
        { status: 400 }
      )
    }

    // Update Redis - always use 'cancel' as the status (matches Transaction type)
    const updatedData = {
      status: 'cancel',
      cancelledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await redis.hset(siteConfig.redis.keys.transaction(validated.id), updatedData)

    if (transactionData.invoiceCode) {
      await redis.hset(siteConfig.redis.keys.invoice(transactionData.invoiceCode as string), updatedData)
    }

    console.log('[Yilzi] Deposit cancelled successfully')

    return NextResponse.json({
      success: true,
      message: 'Deposit cancelled successfully',
      data: {
        id: validated.id,
        status: 'cancel',
        cancelledAt: updatedData.cancelledAt,
      },
    })
  } catch (error) {
    console.error('[Yilzi] Cancel deposit error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
        }
      
