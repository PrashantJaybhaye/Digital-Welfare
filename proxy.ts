import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Block access to dangerous dotfiles or hidden paths (.env, .git, etc.)
  if (pathname.includes('/.') || pathname.startsWith('/.')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // 2. CSRF & Origin Validation for state-changing API mutations
  const method = request.method.toUpperCase();
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method) && pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    // If an Origin header is present (browser fetch), verify it matches the current host
    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        // Allow localhost in development, match host in production
        if (originUrl.host !== host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
          return NextResponse.json(
            { success: false, error: 'Cross-Site Request Forgery (CSRF) blocked: Invalid Origin' },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json(
          { success: false, error: 'Malformed Origin header' },
          { status: 400 }
        );
      }
    }
  }

  // 3. Clone response and apply security defense-in-depth headers
  const response = NextResponse.next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static assets (.svg, .png, .jpg, .css, .js)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
