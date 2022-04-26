import { NextApiRequest } from 'next'
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

type NextApiRequestCustom = NextApiRequest & {
  nextUrl: {
    pathname: string
  }
}

export async function middleware(req: NextApiRequestCustom) {
  //Check if token exists (ie user is logged in)
  const token = await getToken({ req, secret: process.env.JWT_SECRET })

  const { pathname } = req.nextUrl

  // Allow request if 1) Token exists or 2) Its a request for next-auth
  if (pathname.includes('/api/auth') || token) return NextResponse.next()

  if (!token && pathname !== '/login') return NextResponse.redirect('/login')
}
