import { NextResponse } from "next/server";
import { getOAuth2Client } from "@/lib/google-auth";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET handler for OAuth2 callback from Google
 */
export async function GET(request: Request) {
  try {
    // Get the current authenticated user
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.redirect(new URL('/?error=unauthorized', request.url));
    }
    
    // Get the authorization code from the URL
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      return NextResponse.redirect(new URL('/?error=missing-code', request.url));
    }
    
    // Get OAuth2 client
    const oauth2Client = getOAuth2Client();
    
    // Exchange the code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    // Save tokens to database
    await prisma.userAuth.upsert({
      where: { clerkId: user.id },
      update: {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token || undefined,
        googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null
      },
      create: {
        clerkId: user.id,
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token || undefined,
        googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null
      }
    });
    
    // Redirect back to application with success
    return NextResponse.redirect(new URL('/?google-auth=success', request.url));
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(`/?error=auth-failed&message=${encodeURIComponent((error as Error).message)}`, request.url)
    );
  }
}