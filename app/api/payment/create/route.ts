import { NextRequest, NextResponse } from 'next/server'
import { paymentGateway, currentGateway } from '@/lib/payment-gateway'
import { redis } from '@/lib/redis'
import { siteConfig } from '@/lib/config'
import { generateId } from '@/lib/utils'
import { z } from 'zod'

const createPaymentSchema = z.object({
  amount: z.number().min(siteConfig.payment.minAmount).max(siteConfig.payment.maxAmount),
  method: z.string(),
  type: z.enum(['payment', 'donation']),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().max(500).optional(),
  anonymous: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = createPaymentSchema.parse(body)
    console.log('[Yilzi] Payment request validated:', { amount: validated.amount, type: validated.type })

    // Generate unique reference ID
    const reffId = generateId('TRX')
    const invoiceCode = generateId().toUpperCase()

    // First, get available payment methods from the selected gateway
    console.log(`[Yilzi] Step 1: Fetching available payment methods from ${currentGateway}...`)
    const methodsResponse = await paymentGateway.getMethods()
    console.log('[Yilzi] Step 1 complete. Methods response:', { status: methodsResponse.status, count: methodsResponse.data?.length || 0, message: methodsResponse.message })
    
    if (!methodsResponse.status || !methodsResponse.data || methodsResponse.data.length === 0) {
      console.error('[Yilzi] Failed to fetch payment methods:', methodsResponse.message)
      console.error('[Yilzi] Full response:', methodsResponse)
      return NextResponse.json(
        {
          success: false,
          error: 'Payment methods not available at the moment',
          details: methodsResponse.message,
        },
        { status: 503 }
      )
    }
    
    console.log('[Yilzi] Available methods:', methodsResponse.data.map(m => ({ 
      metode: m.metode, 
      name: m.name, 
      type: m.type,
      status: m.status 
    })))
    
    // Find QRIS method from available methods
    const qrisMethod = methodsResponse.data.find(m => 
      m.status === 'aktif' && m.metode?.toUpperCase() === 'QRIS'
    )
    
    if (!qrisMethod) {
      console.error(`[Yilzi] No active QRIS method available in ${currentGateway} account`)
      console.error('[Yilzi] Available methods:', methodsResponse.data.map(m => ({ metode: m.metode, status: m.status })))
      return NextResponse.json(
        {
          success: false,
          error: `QRIS payment method is not available or not active. Please check your ${currentGateway} account settings.`,
        },
        { status: 503 }
      )
    }
    
    console.log('[Yilzi] Step 2: Using QRIS method:', { metode: qrisMethod.metode, type: qrisMethod.type, name: qrisMethod.name })
    console.log(`[Yilzi] Step 3: Creating deposit with ${currentGateway} API...`)
    
    // Create payment via the selected gateway API using the QRIS method metode
    const response = await paymentGateway.createDeposit({
      reff_id: reffId,
      nominal: validated.amount,
      type: qrisMethod.type,
      metode: qrisMethod.metode,
      customer_name: validated.name,
      customer_email: validated.email,
      customer_phone: validated.phone || '',
    })

    if (!response.status || !response.data) {
      console.error('[Yilzi] Step 3 failed. Response:', { status: response.status, code: response.code, message: response.message, hasData: !!response.data })
      return NextResponse.json(
        { success: false, error: response.message || 'Failed to create payment', details: response },
        { status: 400 }
      )
    }
    
    console.log('[Yilzi] Step 4: Deposit created successfully. ID:', response.data.id)

    // Save to Redis with PENDING status only (no stats update)
    const transactionData = {
      id: response.data.id,
      invoiceCode,
      reffId,
      amount: validated.amount,
      method: validated.method,
      type: validated.type,
      name: validated.name,
      email: validated.email,
      phone: validated.phone || '',
      message: validated.message || '',
      anonymous: validated.anonymous || false,
      gateway: currentGateway, // Track which gateway was used
      status: 'pending', // Set to pending - wait for webhook confirmation
      paymentData: JSON.stringify(response.data),
      statsRecorded: 'false', // Flag to track if stats have been recorded
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await redis.hset(siteConfig.redis.keys.transaction(response.data.id), transactionData)
    await redis.hset(siteConfig.redis.keys.invoice(invoiceCode), transactionData)
    await redis.expire(siteConfig.redis.keys.transaction(response.data.id), 86400) // 24 hours
    await redis.expire(siteConfig.redis.keys.invoice(invoiceCode), 86400)

    // Do NOT add to recent transactions or update stats yet - wait for webhook confirmation
    // This ensures stats are only updated after successful payment

    // Return invoice URL
    return NextResponse.json({
      success: true,
      invoiceUrl: `${siteConfig.url}/invoice/${invoiceCode}`,
      invoiceCode,
      transactionId: response.data.id,
      paymentData: response.data,
    })
  } catch (error) {
    console.error('[Yilzi] Payment creation error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
      }
      
