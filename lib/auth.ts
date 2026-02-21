import { NextRequest } from 'next/server'
import { redis } from './redis'

const ADMIN_EMAIL = process.env.USER_ADMIN || ''
const ADMIN_PASSWORD = process.env.PASS_ADMIN || ''
const SESSION_EXPIRY = 60 * 60 * 24 // 24 hours in seconds

export function isAdmin(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD
}

export async function createSession(email: string): Promise<string> {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
  
  // Store session in Redis with expiry
  await redis.setex(
    `admin:session:${sessionId}`,
    SESSION_EXPIRY,
    JSON.stringify({
      email,
      isAdmin: true,
      createdAt: Date.now(),
    })
  )
  
  return sessionId
}

export async function verifySession(sessionId: string): Promise<{
  email: string
  isAdmin: boolean
} | null> {
  try {
    const sessionData = await redis.get(`admin:session:${sessionId}`)
    
    if (!sessionData) {
      return null
    }
    
    // Handle both string and object from Redis
    const session = typeof sessionData === 'string' 
      ? JSON.parse(sessionData) 
      : sessionData
      
    return {
      email: session.email,
      isAdmin: session.isAdmin,
    }
  } catch (error) {
    console.error('[Yilzi] Session verification error:', error)
    return null
  }
}

export async function verifyAdmin(request: NextRequest): Promise<{
  isValid: boolean
  email?: string
}> {
  const sessionId = getSessionFromRequest(request)
  
  if (!sessionId) {
    return { isValid: false }
  }
  
  const session = await verifySession(sessionId)
  
  if (!session || !session.isAdmin) {
    return { isValid: false }
  }
  
  return { isValid: true, email: session.email }
}

export async function deleteSession(sessionId: string): Promise<void> {
  await redis.del(`admin:session:${sessionId}`)
}

export function getSessionFromRequest(request: NextRequest): string | null {
  // Try to get from cookie first
  const cookieSession = request.cookies.get('admin-session')?.value
  if (cookieSession) return cookieSession
  
  // Try to get from Authorization header
  const authHeader = request.headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  return null
}
