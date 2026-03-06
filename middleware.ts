import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/script-types(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/pricing',
  '/robots.txt',
  '/sitemap.xml',
  '/llms.txt',
  '/api/webhooks(.*)',
  '/api/health(.*)',
  '/api/test-clerk(.*)',
  '/api/check-errors(.*)',
]);
const isApiRoute = createRouteMatcher(['/api(.*)', '/trpc(.*)']);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  if (pathname === '/pricing') {
    return NextResponse.redirect(new URL('/new.html?billing=1', request.url));
  }

  if (pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/new.html?space=creation', request.url));
  }

  if (pathname.startsWith('/script-types') || pathname === '/setup' || pathname === '/demo-dashboard' || pathname === '/en') {
    return NextResponse.redirect(new URL('/new.html', request.url));
  }

  if (isPublicRoute(request)) {
    return;
  }

  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    if (isApiRoute(request)) {
      return new Response('Unauthorized', { status: 401 });
    }
    return redirectToSignIn({ returnBackUrl: request.url });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|txt|xml|json|mp4|webm|mov|m4v|avi|mp3|wav|m4a|aac|ogg|ogv)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
