import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest, verifySession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = getSessionFromRequest(request)

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const session = await verifySession(token)

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        email: session.email,
        isAdmin: session.isAdmin,
      },
    })
  } catch (error) {
    console.error('Admin verify error:', error)
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
