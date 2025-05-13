import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',                  // Home page
  '/sign-in(.*)',       // Matches anything starting with "/sign-in"
  '/sign-up(.*)',       // Matches anything starting with "/sign-up"
  '/api/webhooks(.*)',  // Webhook routes
  '/academics(.*)',     // Public academic pages
  '/subjects(.*)',      // Public subject listings
  '/allnotes(.*)',      // Public notes listings
  '/notes(.*)',         // Individual notes pages
  '/favicon.ico',       // Favicon
  '/_next/(.*)' ,       // Next.js assets
])

export default clerkMiddleware(async (auth, req) => {
  // For auth routes, ensure we don't redirect to auth pages
  if (req.nextUrl.pathname.startsWith('/sign-in') || req.nextUrl.pathname.startsWith('/sign-up')) {
    // Skip protection for auth routes
    return NextResponse.next();
  }

  // Protect all routes except the ones defined as public
  if (!isPublicRoute(req)) {
    await auth.protect() // Protect the route if it's not public
  }
})

// This matcher ensures Clerk middleware runs for API and TRPC routes, and skips unnecessary files
export const config = {
  matcher: [
    // Exclude Next.js internals and static assets from middleware processing
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', 
    
    // Always run Clerk middleware for API routes and TRPC routes
    '/(api|trpc)(.*)',
  ],
}