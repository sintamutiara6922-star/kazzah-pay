import { NextResponse } from 'next/server'

export async function GET() {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN
  
  return NextResponse.json({
    hasRedisUrl: Boolean(redisUrl),
    hasRedisToken: Boolean(redisToken),
    redisUrlPreview: redisUrl ? `${redisUrl.substring(0, 30)}...` : 'NOT FOUND',
    redisTokenPreview: redisToken ? `${redisToken.substring(0, 20)}...` : 'NOT FOUND',
    allEnvKeys: Object.keys(process.env).filter(key => 
      key.includes('REDIS') || key.includes('UPSTASH')
    ),
  })
}
