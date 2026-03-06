import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { extractEmailFromSessionClaims, requirePaidApiAccess } from '@/lib/server/paid-access';

type PaidAuthSuccess = {
  ok: true;
  userId: string;
};

type PaidAuthFailure = {
  ok: false;
  response: NextResponse;
};

export async function requirePaidApiUser(): Promise<PaidAuthSuccess | PaidAuthFailure> {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return {
      ok: false,
      response: NextResponse.json({ success: false, error: '未授权' }, { status: 401 }),
    };
  }

  const paymentRequiredResponse = await requirePaidApiAccess(userId, {
    clerkEmail: extractEmailFromSessionClaims(sessionClaims),
  });
  if (paymentRequiredResponse) {
    return {
      ok: false,
      response: paymentRequiredResponse,
    };
  }

  return {
    ok: true,
    userId,
  };
}
