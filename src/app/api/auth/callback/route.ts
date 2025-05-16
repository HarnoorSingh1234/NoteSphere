import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { prisma } from '@/lib/db';

// Initialize OAuth2 client
const getOAuth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
};

// Handle OAuth callback
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get code and state from URL params
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // This should contain the user ID
    
    if (!code || !state) {
      return NextResponse.json(
        { error: 'Missing required parameters' }, 
        { status: 400 }
      );
    }

    // Get tokens from Google
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    
    // Store the tokens in the database associated with the user
    await prisma.userAuth.upsert({
      where: { clerkId: state },
      update: {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token,
        googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null
      },
      create: {
        clerkId: state,
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token,
        googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null
      }
    });

    // Redirect to a success page
    return NextResponse.redirect(new URL('/auth-success', request.url));
  } catch (error: unknown) {
    console.error('OAuth callback error:', error);
    
    // Redirect to an error page
    return NextResponse.redirect(new URL('/auth-error', request.url));
  }
}
