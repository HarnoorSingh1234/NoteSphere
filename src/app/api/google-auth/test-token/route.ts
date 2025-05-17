import { getCurrentUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * This endpoint is for testing the Google Drive tokens
 * It logs information about the tokens to help diagnose issues
 */
export async function GET() {
  try {
    // Check if the user is authenticated
     const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if we have the required environment variables
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const accessToken = process.env.GOOGLE_ACCESS_TOKEN;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    const redirectUri = process.env.REDIRECT_URI;

    const tokenInfo = {
      clientIdAvailable: !!clientId,
      clientSecretAvailable: !!clientSecret,
      accessTokenAvailable: !!accessToken,
      refreshTokenAvailable: !!refreshToken,
      redirectUriAvailable: !!redirectUri,
      accessTokenPrefix: accessToken ? accessToken.substring(0, 5) + '...' : 'N/A',
      refreshTokenPrefix: refreshToken ? refreshToken.substring(0, 5) + '...' : 'N/A',
    };

    // Return detailed token info
    return NextResponse.json({
      status: 'Token information retrieved',
      tokenInfo,
      environmentVariables: {
        NODE_ENV: process.env.NODE_ENV,
        // Add any other relevant environment variables here
      }
    });
  } catch (error) {
    console.error('Error in token test endpoint:', error);
    return NextResponse.json({ 
      error: 'Failed to test tokens',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
