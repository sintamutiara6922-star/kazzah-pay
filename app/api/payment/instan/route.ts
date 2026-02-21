import { NextRequest, NextResponse } from 'next/server'
import { atlanticAPI } from '@/lib/atlantic'
import { redis } from '@/lib/redis'
import { siteConfig } from '@/lib/config'
import { z } from 'zod'

const instantDepositSchema = z.object({
  id: z.string().min(1, 'Transaction ID required'),
  action: z.boolean().optional().default(false),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = instantDepositSchema.parse(body)

    console.log('[Yilzi] Instant deposit request received:', {
      id: validated.id,
      action: validated.action,
    })

    // Get transaction from Redis
    const transactionData = await redis.hgetall(
      siteConfig.redis.keys.transaction(validated.id)
    )

    if (!transactionData || !transactionData.id) {
      console.log('[Yilzi] Transaction not found in Redis:', validated.id)
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    console.log('[Yilzi] Transaction found, current status:', transactionData.status)

    // Check if transaction is in processing status
    if (transactionData.status !== 'processing') {
      console.log('[Yilzi] Transaction not in processing status:', {
        currentStatus: transactionData.status,
        message: 'Only processing transactions can use instant deposit',
      })
      return NextResponse.json(
        {
          error: 'Invalid status',
          message:
            'Instant deposit is only available for transactions with processing status',
          currentStatus: transactionData.status,
        },
        { status: 400 }
      )
    }

    // Call Atlantic instant deposit API
    const instantResponse = await atlanticAPI.instantDeposit(
      validated.id,
      validated.action
    )

    console.log('[Yilzi] Atlantic instant deposit response:', {
      status: instantResponse.status,
      action: validated.action,
      hasData: !!instantResponse.data,
    })

    if (!instantResponse.status || !instantResponse.data) {
      console.error('[Yilzi] Instant deposit failed:', instantResponse.message)
      return NextResponse.json(
        {
          error: 'Failed to process instant deposit',
          details: instantResponse.message,
        },
        { status: 400 }
      )
    }

    const responseData = instantResponse.data

    // If action=true, update transaction metadata only (DO NOT update stats here)
    if (validated.action) {
      console.log('[Yilzi] Processing instant deposit - storing metadata')
      
      const updatedData = {
        instantFee: instantResponse.data.penanganan,
        totalFee: instantResponse.data.total_fee,
        totalReceived: instantResponse.data.total_diterima,
        updatedAt: new Date().toISOString(),
        // Keep status as 'pending' - it will be updated to 'success' only when webhook confirms
      }

      await redis.hset(siteConfig.redis.keys.transaction(validated.id), updatedData)

      if (transactionData.invoiceCode) {
        await redis.hset(siteConfig.redis.keys.invoice(transactionData.invoiceCode as string), updatedData)
      }

      // Stats and leaderboard are ONLY updated when webhook 'payment.success' is received
      // This ensures data integrity - no double counting or premature stats updates

      console.log('[Yilzi] Instant deposit metadata stored - awaiting webhook confirmation')
    } else {
      console.log('[Yilzi] Instant deposit fee check (preview mode)')
    }

    return NextResponse.json({
      success: true,
      action: validated.action,
      message: validated.action
        ? 'Deposit instantly processed to your balance'
        : 'Instant deposit fee preview',
      data: {
        id: responseData.id,
        reff_id: responseData.reff_id,
        originalAmount: responseData.nominal,
        handlingFee: responseData.penanganan,
        totalFee: responseData.total_fee,
        finalAmount: responseData.total_diterima,
        status: responseData.status,
        processed: validated.action,
      },
    })
  } catch (error) {
    console.error('[Yilzi] Instant deposit error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
