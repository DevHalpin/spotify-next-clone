import { NextApiRequest } from 'next'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

type NextApiRequestCustom = NextApiRequest & NextRequest

export async function middleware(req: NextApiRequestCustom) {
  //Check if token exists (ie user is logged in)
  const token = await getToken({ req, secret: process.env.JWT_SECRET })

  const PUBLIC_FILE = /\.(.*)$/

  const url = req.nextUrl.clone()
  url.pathname = '/login'
  const { pathname } = req.nextUrl

  // Allow request if 1) Token exists or 2) Its a request for next-auth
  if (pathname.includes('/api/auth') || token) return NextResponse.next()

  if (
    !token &&
    pathname !== '/login' &&
    !PUBLIC_FILE.test(req.nextUrl.pathname)
  )
    return NextResponse.redirect(url)
}
