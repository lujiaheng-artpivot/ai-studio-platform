import type { NextRequest } from 'next/server';

const DEFAULT_CANONICAL_HOST = 'artpivot.top';

function isLocalHost(hostname: string): boolean {
  const value = hostname.toLowerCase();
  return value === 'localhost' || value === '127.0.0.1' || value === '0.0.0.0';
}

function normalizeAppUrl(raw?: string): string | undefined {
  if (!raw) return undefined;

  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    // Protect production from accidental localhost configuration.
    if (process.env.NODE_ENV === 'production' && isLocalHost(parsed.hostname)) {
      return undefined;
    }
    return parsed.origin;
  } catch {
    return undefined;
  }
}

function normalizeHost(raw?: string): string | undefined {
  if (!raw) return undefined;

  return raw
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/+$/, '')
    .toLowerCase();
}

function normalizeForwardedHost(raw?: string | null): string | undefined {
  if (!raw) return undefined;
  const first = raw.split(',')[0]?.trim();
  if (!first) return undefined;
  return normalizeHost(first);
}

function normalizeForwardedProto(raw?: string | null): 'http' | 'https' | undefined {
  if (!raw) return undefined;
  const first = raw.split(',')[0]?.trim().toLowerCase();
  if (first === 'http' || first === 'https') {
    return first;
  }
  return undefined;
}

function getHostVariants(host: string): string[] {
  const bare = host.replace(/^www\./, '');
  return Array.from(new Set([bare, `www.${bare}`, `app.${bare}`]));
}

export function getPublicAppUrl(): string {
  return normalizeAppUrl(process.env.NEXT_PUBLIC_APP_URL) ?? `https://${DEFAULT_CANONICAL_HOST}`;
}

export function getPublicAppUrlFromRequest(req: NextRequest): string | undefined {
  const forwardedHost = normalizeForwardedHost(req.headers.get('x-forwarded-host'));
  const host = forwardedHost ?? normalizeForwardedHost(req.headers.get('host'));
  const proto = normalizeForwardedProto(req.headers.get('x-forwarded-proto')) ?? 'https';

  if (host) {
    return `${proto}://${host}`;
  }

  const nextOrigin = normalizeAppUrl(req.nextUrl?.origin);
  return nextOrigin;
}

export function resolvePublicAppUrl(req?: NextRequest): string {
  return req ? getPublicAppUrlFromRequest(req) ?? getPublicAppUrl() : getPublicAppUrl();
}

export function getCanonicalHost(): string {
  const configuredHost = normalizeHost(process.env.NEXT_PUBLIC_CANONICAL_HOST);
  if (configuredHost && !(process.env.NODE_ENV === 'production' && isLocalHost(configuredHost))) {
    return configuredHost;
  }

  const appUrl = normalizeAppUrl(process.env.NEXT_PUBLIC_APP_URL);
  if (appUrl) {
    const host = new URL(appUrl).host.toLowerCase();
    if (!(process.env.NODE_ENV === 'production' && isLocalHost(host))) {
      return host;
    }
  }

  return DEFAULT_CANONICAL_HOST;
}

export function getPublicHosts(): string[] {
  const canonical = getCanonicalHost();
  return getHostVariants(canonical);
}

export function getClerkFrontendApiHost(): string | undefined {
  return normalizeHost(
    process.env.NEXT_PUBLIC_CLERK_FRONTEND_API ||
      process.env.CLERK_FRONTEND_API ||
      process.env.NEXT_PUBLIC_CLERK_FAPI
  );
}

export function getGoogleOAuthRequirements(): {
  origins: string[];
  redirectUris: string[];
  clerkFrontendApiHost?: string;
} {
  const appUrl = getPublicAppUrl();
  const appOrigin = normalizeAppUrl(appUrl) || `https://${DEFAULT_CANONICAL_HOST}`;
  const canonicalHost = getCanonicalHost();
  const clerkFrontendApiHost = getClerkFrontendApiHost();

  const origins = new Set<string>([appOrigin]);
  for (const host of getHostVariants(canonicalHost)) {
    origins.add(`https://${host}`);
  }
  if (clerkFrontendApiHost) {
    origins.add(`https://${clerkFrontendApiHost}`);
  }

  const redirectUris = clerkFrontendApiHost
    ? [`https://${clerkFrontendApiHost}/v1/oauth_callback`]
    : [];

  return {
    origins: Array.from(origins),
    redirectUris,
    clerkFrontendApiHost,
  };
}

export function getGeminiApiKey(): string | undefined {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
  const trimmed = key?.trim();
  return trimmed || undefined;
}

export function hasGeminiApiKey(): boolean {
  return Boolean(getGeminiApiKey());
}
