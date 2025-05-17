import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { isGoogleAccountConnected } from "@/lib/google-auth";
import { google } from 'googleapis';

/**
 * GET route to check Google Drive connection status
 */
export async function GET() {
  try {
    // Get the current authenticated user
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ 
        connected: false, 
        error: 'Authentication required' 
      }, { status: 401 });
    }
    
    // Verify if basic oauth values are set
    const hasBasicCredentials = !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;
    const hasTokens = !!process.env.GOOGLE_ACCESS_TOKEN && !!process.env.GOOGLE_REFRESH_TOKEN;
    
    if (!hasBasicCredentials) {
      return NextResponse.json({ 
        connected: false,
        message: 'Missing Google API credentials',
        action: 'setup_credentials'
      });
    }
    
    if (!hasTokens) {
      return NextResponse.json({ 
        connected: false,
        message: 'Missing OAuth tokens',
        action: 'authorize',
        authUrl: `/api/google-auth/start` // URL to start the auth flow
      });
    }
    
    // Try to validate the tokens by making a simple API call
    let tokenValid = false;
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.REDIRECT_URI
      );
      
      oauth2Client.setCredentials({
        access_token: process.env.GOOGLE_ACCESS_TOKEN,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      });
      
      // Test with a simple API call
      const drive = google.drive({ version: 'v3', auth: oauth2Client });
      await drive.about.get({ fields: 'user' });
      tokenValid = true;
    } catch (tokenError) {
      console.error('Token validation error:', tokenError);
      tokenValid = false;
    }
    
    // Check if the OAuth tokens are available and valid
    const isConnected = hasTokens && tokenValid;
    
    return NextResponse.json({ 
      connected: isConnected,
      hasTokens: hasTokens,
      tokenValid: tokenValid,
      message: isConnected 
        ? 'OAuth tokens available and valid' 
        : (hasTokens ? 'OAuth tokens invalid or expired' : 'OAuth tokens missing'),
      action: !isConnected ? 'reauthorize' : undefined,
      authUrl: !isConnected ? `/api/google-auth/start` : undefined
    });
  } catch (error) {
    console.error('Error checking storage status:', error);
    return NextResponse.json(
      { 
        connected: false,
        message: `Error checking Google Drive connection: ${(error as Error).message}`,
        error: (error as Error).message
      }
    );
  }
}
