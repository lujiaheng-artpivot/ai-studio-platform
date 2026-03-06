import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import { resolvePublicAppUrl } from '@/lib/config';
import { prisma } from '@/lib/prisma';
import { SUBSCRIPTION_PLANS } from '@/lib/constants';
import {
  getComputeSecondsForTier,
  isPaidTier,
  normalizeSubscriptionTier,
  type PaidTier,
} from '@/lib/server/paid-access';

function getStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  return new Stripe(key, {
    apiVersion: '2025-12-15.clover',
  });
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const { priceId, planName } = await req.json();

    if (!priceId || typeof priceId !== 'string') {
      return NextResponse.json({ error: '缺少价格 ID' }, { status: 400 });
    }

    const requestedTier = normalizeSubscriptionTier(typeof planName === 'string' ? planName : '');
    if (!isPaidTier(requestedTier)) {
      return NextResponse.json({ error: '免费计划不可直接使用，请选择付费套餐' }, { status: 400 });
    }

    const expectedPriceId = SUBSCRIPTION_PLANS[requestedTier].stripePriceId;
    if (!expectedPriceId || expectedPriceId !== priceId) {
      return NextResponse.json({ error: '套餐与价格 ID 不匹配' }, { status: 400 });
    }

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress?.trim();
    if (!email) {
      return NextResponse.json({ error: '无法获取账号邮箱，请先在 Clerk 绑定邮箱' }, { status: 400 });
    }

    const displayName =
      clerkUser?.firstName ||
      clerkUser?.fullName ||
      email.split('@')[0] ||
      null;

    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        email,
        name: displayName,
        imageUrl: clerkUser?.imageUrl || null,
      },
      create: {
        clerkId: userId,
        email,
        name: displayName,
        imageUrl: clerkUser?.imageUrl || null,
        subscriptionTier: 'free',
        computeSeconds: getComputeSecondsForTier('free'),
        usedSeconds: 0,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    const appUrl = resolvePublicAppUrl(req);
    const stripe = getStripeClient();
    const tier = requestedTier as PaidTier;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: dbUser.stripeCustomerId || undefined,
      customer_email: dbUser.stripeCustomerId ? undefined : email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/new.html?space=creation&success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/new.html?billing=1&canceled=1`,
      client_reference_id: userId,
      metadata: {
        userId,
        clerkUserId: userId,
        planName: tier,
        tier,
      },
      subscription_data: {
        metadata: {
          userId,
          clerkUserId: userId,
          tier,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: unknown) {
    console.error('❌ 创建支付会话错误:', error);
    const message = error instanceof Error ? error.message : '创建支付会话失败，请重试';
    const normalized = message.toLowerCase();
    const isDatabaseAuthError =
      normalized.includes('tenant or user not found') ||
      normalized.includes('authentication failed') ||
      normalized.includes('error code: p1000');
    const isDatabaseUnavailable =
      normalized.includes("can't reach database server") ||
      normalized.includes('error code: p1001');

    if (isDatabaseAuthError) {
      return NextResponse.json(
        {
          error: '数据库连接配置失效（DATABASE_URL 无法通过鉴权），请联系管理员更新生产环境数据库连接串',
          code: 'DATABASE_AUTH_INVALID',
        },
        { status: 503 }
      );
    }

    if (isDatabaseUnavailable) {
      return NextResponse.json(
        {
          error: '数据库暂时不可用，请稍后重试',
          code: 'DATABASE_UNAVAILABLE',
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
