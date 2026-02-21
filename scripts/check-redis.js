#!/usr/bin/env node

/**
 * Script to verify Redis connection and environment variables
 * Run this to check if your Redis setup is working correctly
 */

const { Redis } = require('@upstash/redis')
require('dotenv').config()

console.log('='.repeat(60))
console.log('REDIS CONNECTION CHECK')
console.log('='.repeat(60))
console.log('')

// Check environment variables
console.log('1. Checking Environment Variables...')
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

if (!REDIS_URL) {
  console.log('   ❌ UPSTASH_REDIS_REST_URL is NOT set')
} else {
  console.log('   ✅ UPSTASH_REDIS_REST_URL is set:', REDIS_URL.substring(0, 30) + '...')
}

if (!REDIS_TOKEN) {
  console.log('   ❌ UPSTASH_REDIS_REST_TOKEN is NOT set')
} else {
  console.log('   ✅ UPSTASH_REDIS_REST_TOKEN is set: ' + REDIS_TOKEN.substring(0, 20) + '...')
}

console.log('')

if (!REDIS_URL || !REDIS_TOKEN) {
  console.log('❌ CONFIGURATION ERROR:')
  console.log('')
  console.log('Redis credentials are missing from environment variables.')
  console.log('')
  console.log('STEPS TO FIX:')
  console.log('1. Create a .env.local file in the project root')
  console.log('2. Add these lines to .env.local:')
  console.log('')
  console.log('   UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io')
  console.log('   UPSTASH_REDIS_REST_TOKEN=your-token-here')
  console.log('')
  console.log('3. RESTART your dev server (Ctrl+C then npm run dev)')
  console.log('')
  console.log('Get your credentials from: https://console.upstash.com/')
  console.log('')
  process.exit(1)
}

// Test Redis connection
console.log('2. Testing Redis Connection...')
const redis = new Redis({
  url: REDIS_URL,
  token: REDIS_TOKEN,
})

;(async () => {
  try {
    // Try a simple ping
    const testKey = `test:connection:${Date.now()}`
    await redis.set(testKey, 'Hello from PaymentHub!', { ex: 10 })
    const value = await redis.get(testKey)
    
    if (value === 'Hello from PaymentHub!') {
      console.log('   ✅ Redis connection successful!')
      console.log('   ✅ Read/Write test passed')
      
      // Clean up
      await redis.del(testKey)
      
      console.log('')
      console.log('='.repeat(60))
      console.log('✅ ALL CHECKS PASSED!')
      console.log('='.repeat(60))
      console.log('')
      console.log('Your Redis is configured correctly.')
      console.log('New transactions will now appear in leaderboards automatically.')
      console.log('')
    } else {
      throw new Error('Read/Write test failed')
    }
  } catch (error) {
    console.log('   ❌ Redis connection failed:', error.message)
    console.log('')
    console.log('TROUBLESHOOTING:')
    console.log('1. Check if your Redis database is active in Upstash console')
    console.log('2. Verify the URL and TOKEN are correct')
    console.log('3. Check if your IP is allowed (if IP allowlist is enabled)')
    console.log('')
    process.exit(1)
  }
})()
              
