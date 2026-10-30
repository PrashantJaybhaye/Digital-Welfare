import { NextResponse } from 'next/server';
import { isAuthorizedAdmin, verifyAdminRequest } from '@/lib/admin-auth';
import { rateLimit, getClientIp } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const clientIp = getClientIp(req);
  
  // Rate limit: 5 login attempts per 15 minutes per IP
  const limiter = rateLimit(`admin-auth-${clientIp}`, 5, 15 * 60 * 1000);
  if (!limiter.success) {
    const minutesLeft = Math.ceil(limiter.resetMs / 60000);
    return NextResponse.json({
      success: false,
      error: `Too many login attempts. Please try again in ${minutesLeft} minute(s).`
    }, { 
      status: 429,
      headers: {
        'Retry-After': Math.ceil(limiter.resetMs / 1000).toString(),
        'X-RateLimit-Limit': limiter.limit.toString(),
        'X-RateLimit-Remaining': '0'
      }
    });
  }

  try {
    const body = await req.json();
    const passcode = body.passcode;

    if (!passcode || !isAuthorizedAdmin(passcode)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid Admin Access Key. Access Denied.'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: 'Authentication successful.'
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request payload' }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const isAuth = verifyAdminRequest(req);
  return NextResponse.json({ authenticated: isAuth }, { status: isAuth ? 200 : 401 });
}

