import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // Handle double slash redirects
  if (pathname.includes('//')) {
    const correctedPath = pathname.replace(/\/+/g, '/')
    return NextResponse.redirect(
      new URL(correctedPath + search, request.url),
      { status: 301 }
    )
  }

  // HTTPS enforcement (for environments that need it)
  if (process.env.NODE_ENV === 'production' && !request.url.startsWith('https://')) {
    return NextResponse.redirect(
      new URL(request.url.replace('http://', 'https://')),
      { status: 301 }
    )
  }

  // 301 redirects for specific paths
  const redirects: Record<string, string> = {
    '/old-path': '/new-path',
    // Add more redirects as needed
  }

  if (redirects[pathname]) {
    return NextResponse.redirect(
      new URL(redirects[pathname] + search, request.url),
      { status: 301 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
