import { NextResponse, type NextRequest } from 'next/server'
import { redis } from '@/lib/redis'
import { verifyAdmin } from '@/lib/auth'

const startTime = Date.now()

export async function GET(request: NextRequest) {
  const authResult = await verifyAdmin(request)
  if (!authResult.isValid) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // Check Redis connection
    let redisHealthy = false
    try {
      await redis.ping()
      redisHealthy = true
    } catch (error) {
      console.error('[Yilzi] Redis health check failed:', error)
    }

    // Calculate uptime
    const uptime = Math.floor((Date.now() - startTime) / 1000)

    const health = {
      status: redisHealthy ? 'healthy' : 'degraded',
      uptime,
      redis: redisHealthy,
      api: true,
      lastCheck: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      health,
    })
  } catch (error) {
    console.error('[Yilzi] Health check error:', error)
    return NextResponse.json(
      {
        success: false,
        health: {
          status: 'down',
          uptime: 0,
          redis: false,
          api: false,
          lastCheck: new Date().toISOString(),
        },
      },
      { status: 500 }
    )
  }
}
