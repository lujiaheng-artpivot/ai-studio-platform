import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { SUBSCRIPTION_PLANS } from '@/lib/constants';
import { prisma } from '@/lib/prisma';

export type SubscriptionTier = keyof typeof SUBSCRIPTION_PLANS;
export type PaidTier = Exclude<SubscriptionTier, 'free'>;

export type PaidAccessReason =
  | 'NO_ACCOUNT'
  | 'FREE_TIER'
  | 'EXPIRED'
  | 'PAYMENT_ISSUE'
  | 'SYSTEM_ERROR';

export type PaidAccessResult = {
  hasAccess: boolean;
  tier: SubscriptionTier;
  reason?: PaidAccessReason;
  userId?: string;
};

export type PaidAccessOptions = {
  clerkEmail?: string | null;
};

const PAID_TIERS = new Set<PaidTier>(['lite', 'standard', 'pro']);
const BLOCKED_STATUSES = new Set([
  'past_due',
  'unpaid',
  'incomplete',
  'incomplete_expired',
  'paused',
]);
const DEFAULT_SUPERUSER_EMAILS = new Set(['lujiaheng2001@gmail.com']);

function normalizeIdentity(value: string | null | undefined): string {
  return (value || '').trim().toLowerCase();
}

function parseIdentitySet(raw: string | undefined): Set<string> {
  if (!raw) return new Set();
  return new Set(
    raw
      .split(',')
      .map((item) => normalizeIdentity(item))
      .filter(Boolean)
  );
}

const SUPERUSER_EMAILS = parseIdentitySet(process.env.SUPERUSER_EMAILS);
const SUPERUSER_CLERK_IDS = parseIdentitySet(process.env.SUPERUSER_CLERK_IDS);

function isSuperuserEmail(email: string | null | undefined): boolean {
  const normalizedEmail = normalizeIdentity(email);
  if (!normalizedEmail) return false;
  return DEFAULT_SUPERUSER_EMAILS.has(normalizedEmail) || SUPERUSER_EMAILS.has(normalizedEmail);
}

function isSuperuserClerkId(clerkUserId: string): boolean {
  return SUPERUSER_CLERK_IDS.has(normalizeIdentity(clerkUserId));
}

async function resolveClerkPrimaryEmail(clerkUserId: string): Promise<string | null> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(clerkUserId);
    if (!user.emailAddresses.length) return null;
    const primary = user.emailAddresses.find((item) => item.id === user.primaryEmailAddressId);
    return primary?.emailAddress || user.emailAddresses[0]?.emailAddress || null;
  } catch {
    return null;
  }
}

export function extractEmailFromSessionClaims(sessionClaims: unknown): string | null {
  if (!sessionClaims || typeof sessionClaims !== 'object') {
    return null;
  }

  const claims = sessionClaims as Record<string, unknown>;
  const candidateKeys = ['email', 'email_address', 'primary_email_address'];

  for (const key of candidateKeys) {
    const value = claims[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

const PRICE_ID_TO_TIER = new Map<string, PaidTier>();
for (const [tier, plan] of Object.entries(SUBSCRIPTION_PLANS)) {
  if (tier === 'free') continue;
  const priceId = plan.stripePriceId?.trim();
  if (!priceId) continue;
  PRICE_ID_TO_TIER.set(priceId, tier as PaidTier);
}

export function normalizeSubscriptionTier(raw: string | null | undefined): SubscriptionTier {
  const normalized = (raw || '').trim().toLowerCase();
  if (normalized === 'lite' || normalized === 'standard' || normalized === 'pro') {
    return normalized;
  }
  return 'free';
}

export function isPaidTier(tier: string | null | undefined): tier is PaidTier {
  if (!tier) return false;
  return PAID_TIERS.has(normalizeSubscriptionTier(tier) as PaidTier);
}

export function resolveTierFromPriceId(priceId: string | null | undefined): PaidTier | null {
  if (!priceId) return null;
  return PRICE_ID_TO_TIER.get(priceId) || null;
}

export function getComputeSecondsForTier(tier: SubscriptionTier): number {
  if (!isPaidTier(tier)) return 0;
  return SUBSCRIPTION_PLANS[tier].computeSeconds;
}

function isExpired(periodEnd: Date | null | undefined): boolean {
  if (!periodEnd) return false;
  return periodEnd.getTime() <= Date.now();
}

export async function resolvePaidAccess(
  clerkUserId: string,
  options: PaidAccessOptions = {}
): Promise<PaidAccessResult> {
  const optionClerkEmail = options.clerkEmail || null;

  try {
    if (isSuperuserClerkId(clerkUserId)) {
      return {
        hasAccess: true,
        tier: 'pro',
      };
    }

    if (isSuperuserEmail(optionClerkEmail)) {
      return {
        hasAccess: true,
        tier: 'pro',
      };
    }

    if (!optionClerkEmail) {
      const clerkEmail = await resolveClerkPrimaryEmail(clerkUserId);
      if (isSuperuserEmail(clerkEmail)) {
        return {
          hasAccess: true,
          tier: 'pro',
        };
      }
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      select: {
        id: true,
        email: true,
        subscriptionTier: true,
        stripeCurrentPeriodEnd: true,
      },
    });

    if (isSuperuserEmail(user?.email)) {
      return {
        hasAccess: true,
        tier: 'pro',
        userId: user?.id,
      };
    }

    if (!user) {
      return {
        hasAccess: false,
        tier: 'free',
        reason: 'NO_ACCOUNT',
      };
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
      select: {
        status: true,
        tier: true,
        stripeCurrentPeriodEnd: true,
      },
    });

    const tier = normalizeSubscriptionTier(subscription?.tier || user.subscriptionTier);
    if (!isPaidTier(tier)) {
      return {
        hasAccess: false,
        tier,
        reason: 'FREE_TIER',
        userId: user.id,
      };
    }

    const normalizedStatus = (subscription?.status || '').trim().toLowerCase();
    if (normalizedStatus && BLOCKED_STATUSES.has(normalizedStatus)) {
      return {
        hasAccess: false,
        tier,
        reason: 'PAYMENT_ISSUE',
        userId: user.id,
      };
    }

    const effectivePeriodEnd = subscription?.stripeCurrentPeriodEnd || user.stripeCurrentPeriodEnd;
    if (isExpired(effectivePeriodEnd)) {
      return {
        hasAccess: false,
        tier,
        reason: 'EXPIRED',
        userId: user.id,
      };
    }

    return {
      hasAccess: true,
      tier,
      userId: user.id,
    };
  } catch (error: unknown) {
    if (isSuperuserClerkId(clerkUserId) || isSuperuserEmail(optionClerkEmail)) {
      return {
        hasAccess: true,
        tier: 'pro',
      };
    }

    const fallbackEmail = await resolveClerkPrimaryEmail(clerkUserId);
    if (isSuperuserEmail(fallbackEmail)) {
      return {
        hasAccess: true,
        tier: 'pro',
      };
    }

    console.error('❌ resolvePaidAccess database error:', error);
    return {
      hasAccess: false,
      tier: 'free',
      reason: 'SYSTEM_ERROR',
    };
  }
}

export async function requirePaidApiAccess(
  clerkUserId: string,
  options: PaidAccessOptions = {}
): Promise<NextResponse | null> {
  try {
    const access = await resolvePaidAccess(clerkUserId, options);
    if (access.hasAccess) {
      return null;
    }

    return NextResponse.json(
      {
        success: false,
        error: '请先完成会员订阅后再使用该功能',
        code: 'PAYMENT_REQUIRED',
        reason: access.reason || 'FREE_TIER',
        redirectTo: '/pricing',
      },
      { status: 402 }
    );
  } catch (error: unknown) {
    console.error('❌ Paid access check failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: '会员状态校验失败，请稍后重试',
        code: 'PAID_ACCESS_SYSTEM_ERROR',
      },
      { status: 503 }
    );
  }
}
