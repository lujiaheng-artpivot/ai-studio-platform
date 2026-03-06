import { NextResponse } from 'next/server';
import {
  getCanonicalHost,
  getClerkFrontendApiHost,
  getGoogleOAuthRequirements,
  getPublicAppUrl,
  hasGeminiApiKey,
} from '@/lib/config';

function isConfigured(value?: string): boolean {
  return Boolean(value && value.trim().length > 0);
}

export async function GET() {
  const oauth = getGoogleOAuthRequirements();
  const stripeWebhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || '').trim();
  const stripeWebhookSecretValid = stripeWebhookSecret.length > 0 && stripeWebhookSecret !== 'whsec_placeholder';
  const checks = {
    clerkPublishableKey: isConfigured(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
    clerkSecretKey: isConfigured(process.env.CLERK_SECRET_KEY),
    clerkFrontendApiHost: isConfigured(getClerkFrontendApiHost()),
    geminiApiKey: hasGeminiApiKey(),
    stripeSecretKey: isConfigured(process.env.STRIPE_SECRET_KEY),
    stripeWebhookSecret: stripeWebhookSecretValid,
    databaseUrl: isConfigured(process.env.DATABASE_URL),
    blobStorage: isConfigured(process.env.BLOB_READ_WRITE_TOKEN),
  };

  const criticalReady =
    checks.clerkPublishableKey &&
    checks.clerkSecretKey &&
    checks.geminiApiKey &&
    checks.stripeWebhookSecret;
  const status = criticalReady ? 'ok' : 'degraded';

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      domain: {
        canonicalHost: getCanonicalHost(),
        publicAppUrl: getPublicAppUrl(),
      },
      oauth,
      checks,
    },
    { status: criticalReady ? 200 : 503 }
  );
}
