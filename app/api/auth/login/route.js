import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    const { password } = await request.json()
    
    if (password === process.env.DASHBOARD_PASSWORD) {
      const cookieStore = await cookies()
      cookieStore.set('dashboard_auth', 'true', {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax',
      })
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json(
      { success: false, message: 'Password salah!' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan' },
      { status: 500 }
    )
  }
}
