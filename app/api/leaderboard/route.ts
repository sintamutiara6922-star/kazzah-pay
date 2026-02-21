import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import { getDonationTier } from '@/lib/utils'

function censorEmail(email: string): string {
  if (!email) return 'Anonymous'
  const [localPart, domain] = email.split('@')
  if (!domain) return email
  
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`
  }
  
  return `${localPart[0]}${'*'.repeat(localPart.length - 1)}@${domain}`
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'alltime'
    const type = searchParams.get('type') || 'all' // 'all', 'donation', 'payment'

    // Determine which sorted set to query based on period
    const redisKey = getRedisKeyByPeriod(period, type)
    console.log('[Yilzi] Leaderboard API - Redis key:', redisKey)

    // Get members with scores using Upstash zrange
    const rawData = await redis.zrange(redisKey, 0, 99, {
      withScores: true,
      rev: true,
    }).catch(err => {
      console.error('[Yilzi] Redis zrange error:', err)
      return []
    })
    
    console.log('[Yilzi] Leaderboard API - Raw data from Redis:', rawData)

    // Parse the data into a consistent format
    const entries: { email: string; amount: number }[] = []

    if (rawData && rawData.length > 0) {
      const firstItem = rawData[0]
      
      if (typeof firstItem === 'object' && firstItem !== null && ('score' in firstItem || 'value' in firstItem || 'member' in firstItem)) {
        // Object format: [{score: number, value/member: string}, ...]
        for (const item of rawData) {
          const obj = item as any
          entries.push({
            email: String(obj.value || obj.member || obj),
            amount: Number(obj.score || 0),
          })
        }
      } else if (typeof firstItem === 'string' || typeof firstItem === 'number') {
        // Flat format: [member, score, member, score, ...]
        for (let i = 0; i < rawData.length; i += 2) {
          entries.push({
            email: String(rawData[i]),
            amount: Number(rawData[i + 1] || 0),
          })
        }
      }
    }

    // Build leaderboard with contributor details
    const leaderboard = []
    for (let i = 0; i < entries.length; i++) {
      const { email, amount } = entries[i]
      
      // Get contributor details
      const details = await redis.hgetall(`contributor:${email}`).catch(err => {
        console.error('[Yilzi] Failed to get contributor details:', err)
        return null
      }) as Record<string, string> | null
      
      const displayName = details?.name || censorEmail(email)

      leaderboard.push({
        rank: i + 1,
        id: censorEmail(email),
        name: displayName,
        amount,
        count: parseInt(details?.count || '1'),
        tier: getDonationTier(amount) || 'bronze',
        lastTransaction: details?.lastTransaction || new Date().toISOString(),
      })
    }

    console.log('[Yilzi] Leaderboard API - Final response:', {
      success: true,
      period,
      type,
      leaderboard: leaderboard.slice(0, 3),
      total: leaderboard.length,
    })

    return NextResponse.json({
      success: true,
      period,
      type,
      leaderboard,
      total: leaderboard.length,
    })
  } catch (error) {
    console.error('[Yilzi] Leaderboard API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getRedisKeyByPeriod(period: string, type: string): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const week = getWeekNumber(today)
  const quarter = Math.floor(today.getMonth() / 3) + 1

  const typePrefix = type === 'donation' ? 'donations' : type === 'payment' ? 'payments' : 'all'

  switch (period) {
    case 'realtime':
    case 'today':
      return `leaderboard:${typePrefix}:daily:${year}-${month}-${day}`
    case 'week':
      return `leaderboard:${typePrefix}:weekly:${year}-W${week}`
    case 'month':
      return `leaderboard:${typePrefix}:monthly:${year}-${month}`
    case 'quarter':
      return `leaderboard:${typePrefix}:quarterly:${year}-Q${quarter}`
    case 'year':
      return `leaderboard:${typePrefix}:yearly:${year}`
    case 'alltime':
    default:
      return `leaderboard:${typePrefix}:alltime`
  }
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
      }
      
