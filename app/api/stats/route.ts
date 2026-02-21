import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import { siteConfig } from '@/lib/config'
import { currentGateway } from '@/lib/payment-gateway'

export async function GET() {
  try {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const todayKey = `${year}-${month}-${day}`

    // Get all transactions from Redis
    const recentTransactionsRaw = await redis.lrange(
      siteConfig.redis.keys.recentTransactions,
      0,
      99
    )
    
    const recentTransactions = recentTransactionsRaw.map((item) =>
      typeof item === 'string' ? JSON.parse(item) : item
    )

    // Calculate stats from transactions
    let totalAmount = 0
    let totalTransactions = recentTransactions.length
    let totalDonations = 0
    let totalPayments = 0
    let donationAmount = 0
    let paymentAmount = 0
    let todayAmount = 0
    let todayTransactions = 0
    let todayDonations = 0
    let todayPayments = 0
    let successfulTransactions = 0

    recentTransactions.forEach((tx: any) => {
      const amount = parseInt(tx.amount || 0)
      const txDate = new Date(tx.createdAt).toISOString().split('T')[0]
      const isToday = txDate === todayKey
      
      totalAmount += amount
      
      if (tx.status === 'completed' || tx.status === 'success') {
        successfulTransactions++
      }

      if (tx.type === 'donation') {
        totalDonations++
        donationAmount += amount
        if (isToday) {
          todayDonations++
        }
      } else if (tx.type === 'payment') {
        totalPayments++
        paymentAmount += amount
        if (isToday) {
          todayPayments++
        }
      }

      if (isToday) {
        todayAmount += amount
        todayTransactions++
      }
    })

    // Count active users (unique emails in last 24 hours)
    const now = Date.now()
    const oneDayAgo = now - 24 * 60 * 60 * 1000
    const uniqueUsers = new Set(
      recentTransactions
        .filter((tx: any) => new Date(tx.createdAt).getTime() > oneDayAgo)
        .map((tx: any) => tx.email)
        .filter((email: string) => email)
    )
    const activeUsers = uniqueUsers.size

    // Calculate success rate
    const successRate =
      totalTransactions > 0
        ? parseFloat(((successfulTransactions / totalTransactions) * 100).toFixed(1))
        : 100

    // Calculate average amount
    const avgAmount = totalTransactions > 0 ? Math.floor(totalAmount / totalTransactions) : 0

    // Get gateway profile/status (only for Atlantic)
    let atlanticProfile = null
    const gateway = currentGateway.toLowerCase()
    
    if (gateway === 'atlantic') {
      try {
        const { atlanticAPI } = await import('@/lib/atlantic')
        const [methodsResponse, profileResponse] = await Promise.all([
          atlanticAPI.getMethods(),
          atlanticAPI.getProfile()
        ])
        
        if (methodsResponse.status && methodsResponse.data) {
          atlanticProfile = {
            connected: true,
            gateway: 'atlantic',
            availableMethods: methodsResponse.data.length,
            methods: methodsResponse.data.slice(0, 5).map((m: any) => ({
              name: m.name,
              type: m.type,
              status: m.status,
            })),
            profile: profileResponse.status && profileResponse.data ? {
              name: profileResponse.data.name,
              username: profileResponse.data.username,
              email: profileResponse.data.email,
              phone: profileResponse.data.phone,
              balance: profileResponse.data.balance,
              status: profileResponse.data.status,
            } : null
          }
        }
      } catch (error) {
        console.error('[Yilzi] Atlantic profile fetch error:', error)
        atlanticProfile = { connected: false, gateway: 'atlantic' }
      }
    } else if (gateway === 'pakasir') {
      // Pakasir doesn't have profile API, just indicate it's connected
      atlanticProfile = {
        connected: true,
        gateway: 'pakasir',
        availableMethods: 1, // QRIS only
        methods: [{
          name: 'QRIS',
          type: 'qris',
          status: 'aktif',
        }],
        profile: null
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalAmount,
        totalTransactions,
        totalDonations,
        totalPayments,
        donationAmount,
        paymentAmount,
        activeUsers,
        successRate,
        avgAmount,
        todayAmount,
        todayTransactions,
        todayDonations,
        todayPayments,
        successfulTransactions,
      },
      recentTransactions: recentTransactions.slice(0, 20),
      atlanticProfile,
    })
  } catch (error) {
    console.error('[Yilzi] Stats API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        stats: {
          totalAmount: 0,
          totalTransactions: 0,
          totalDonations: 0,
          totalPayments: 0,
          donationAmount: 0,
          paymentAmount: 0,
          activeUsers: 0,
          successRate: 100,
          avgAmount: 0,
          todayAmount: 0,
          todayTransactions: 0,
          todayDonations: 0,
          todayPayments: 0,
          successfulTransactions: 0,
        },
        recentTransactions: [],
      },
      { status: 200 }
    )
  }
      }
      
