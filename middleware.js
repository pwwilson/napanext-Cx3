import { NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/feed', '/denied', '/api/entries']
const STATIC_PREFIXES = ['/_next', '/static', '/favicon.ico', '/robots.txt']

export function middleware(req) {
  const url = req.nextUrl
  const { pathname, searchParams } = url

  const isPublic = PUBLIC_PATHS.includes(pathname)
  const isStatic = STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  if (isPublic || isStatic || pathname.match(/\.(png|jpg|jpeg|gif|svg|ico)$/i)) {
    return NextResponse.next()
  }

  const validKey = process.env.NEXT_PUBLIC_ACCESS_KEY || 'cx3party2024'
  const key = searchParams.get('key')
  const cookieAccess = req.cookies.get('cx3_access')?.value === 'granted'

  if (key === validKey) {
    const res = NextResponse.next()
    res.cookies.set('cx3_access', 'granted', {
      path: '/',
      maxAge: 60 * 60 * 12,
      sameSite: 'lax'
    })
    return res
  }

  if (cookieAccess) {
    return NextResponse.next()
  }

  const deniedUrl = url.clone()
  deniedUrl.pathname = '/denied'
  deniedUrl.search = ''
  return NextResponse.redirect(deniedUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/entries|feed|denied).*)']
}
