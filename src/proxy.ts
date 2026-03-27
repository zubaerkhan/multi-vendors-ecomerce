import { NextResponse, type NextRequest } from 'next/server'
import { auth } from './auth'

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const publicRoute = [
    '/login',
    '/register',
    '/api/auth',
    '/payment/success',
    '/payment/fail',
    '/favicon.ico',
    '/_next',
  ]

  if (publicRoute.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const session = await auth()

  if (!session) {
    const loginUrl = new URL('/login', req.url)

    loginUrl.searchParams.set(
      'callbackUrl',
      req.nextUrl.pathname + req.nextUrl.search,
    )

    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|css|js)$).*)',
  ],
}
