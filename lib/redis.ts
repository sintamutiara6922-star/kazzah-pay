import { Redis } from '@upstash/redis'

// Check if Redis credentials are available
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || ''
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || ''

const hasRedisConfig = Boolean(REDIS_URL && REDIS_TOKEN)

if (!hasRedisConfig) {
  console.warn('[Redis] WARNING: Redis is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.')
  console.warn('[Redis] The application will run with limited functionality (no data persistence).')
}

// Initialize Upstash Redis client
export const redis = new Redis({
  url: REDIS_URL,
  token: REDIS_TOKEN,
})

// Check if Redis is available
export const isRedisAvailable = () => hasRedisConfig

// Helper functions for common operations
export const redisHelpers = {
  // Transaction operations
  async getTransaction(id: string) {
    return redis.hgetall(`transaction:${id}`)
  },

  async setTransaction(id: string, data: Record<string, any>) {
    return redis.hset(`transaction:${id}`, data)
  },

  async getUserTransactions(email: string, limit = 50) {
    const transactions = await redis.zrange(
      `user:transactions:${email}`,
      0,
      limit - 1,
      { rev: true }
    )
    return transactions
  },

  // Leaderboard operations
  async getLeaderboard(type: 'donors' | 'payments', period: string, limit = 10) {
    const key = `leaderboard:${type}:${period}`
    return redis.zrange(key, 0, limit - 1, { rev: true, withScores: true })
  },

  async addToLeaderboard(
    type: 'donors' | 'payments',
    periods: string[],
    userId: string,
    amount: number
  ) {
    const pipeline = redis.pipeline()
    periods.forEach((period) => {
      pipeline.zadd(`leaderboard:${type}:${period}`, {
        score: amount,
        member: userId,
      })
    })
    return pipeline.exec()
  },

  // Statistics
  async getStats(date: string) {
    return redis.hgetall(`stats:${date}`)
  },

  async updateStats(date: string, data: Record<string, any>) {
    return redis.hincrby(`stats:${date}`, 'revenue', data.revenue || 0)
  },

  // Rate limiting
  async checkRateLimit(key: string, limit: number, window: number) {
    const current = await redis.incr(`ratelimit:${key}`)
    if (current === 1) {
      await redis.expire(`ratelimit:${key}`, window)
    }
    return current <= limit
  },

  // Cache operations
  async getCache<T>(key: string): Promise<T | null> {
    const data = await redis.get(key)
    return data as T | null
  },

  async setCache(key: string, value: any, ttl?: number) {
    if (ttl) {
      return redis.setex(key, ttl, JSON.stringify(value))
    }
    return redis.set(key, JSON.stringify(value))
  },

  // Activity feed
  async addToFeed(type: 'donations' | 'payments', data: any) {
    await redis.lpush(`feed:${type}`, JSON.stringify(data))
    await redis.ltrim(`feed:${type}`, 0, 99) // Keep last 100
  },

  async getFeed(type: 'donations' | 'payments', limit = 20) {
    const feed = await redis.lrange(`feed:${type}`, 0, limit - 1)
    return feed.map((item) => JSON.parse(item as string))
  },
}
