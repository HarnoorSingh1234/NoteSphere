import { getCurrentUser } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

/**
 * This endpoint provides the access token for Google Drive uploads.
 * It uses OAuth refresh token to generate a fresh access token for the client.
 */
export async function GET() {
  try {
    // Check if the user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Make sure we have the required environment variables
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
      console.error('Missing Google OAuth credentials in environment variables');
      return NextResponse.json({ error: 'OAuth configuration is incomplete' }, { status: 500 });
    }

    // Create OAuth client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    
    // Set the refresh token
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
    
    // Get a fresh access token using the refresh token
    const tokenResponse = await oauth2Client.refreshAccessToken();
    const credentials = tokenResponse.credentials;
    
    if (!credentials.access_token) {
      console.error('Failed to refresh access token:', tokenResponse);
      return NextResponse.json({ error: 'Failed to generate access token' }, { status: 500 });
    }
    
    const accessToken = credentials.access_token;
    console.log(`Generated fresh access token for direct upload (starts with: ${accessToken.substring(0, 5)}...)`);
    
    // Return the access token to the client
    return NextResponse.json({
      accessToken: accessToken,
      expiresIn: credentials.expiry_date 
        ? Math.floor((credentials.expiry_date - Date.now()) / 1000) 
        : 3600 // Default to 1 hour if no expiry date
    });
  } catch (error) {
    console.error('Error getting auth token:', error);
    return NextResponse.json({ 
      error: 'Failed to get authentication token',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
