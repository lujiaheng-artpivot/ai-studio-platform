import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { extractEmailFromSessionClaims, resolvePaidAccess } from '@/lib/server/paid-access';

export async function GET() {
  try {
    const { userId, sessionClaims } = await auth();
    const sessionEmail = extractEmailFromSessionClaims(sessionClaims);
    const paidAccess = userId
      ? await resolvePaidAccess(userId, { clerkEmail: sessionEmail })
      : null;
    
    const clerkConfig = {
      publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 20) + '...',
      secretKey: process.env.CLERK_SECRET_KEY ? 'configured' : 'missing',
      frontendApi: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API,
      userId: userId || 'not logged in',
      sessionEmail: sessionEmail || null,
    };

    return NextResponse.json({
      status: 'ok',
      clerk: clerkConfig,
      paidAccess,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json({
      status: 'error',
      error: message,
      stack: process.env.NODE_ENV === 'development' ? stack : undefined,
    }, { status: 500 });
  }
}
