import { NextResponse } from 'next/server';
import { google } from 'googleapis';

/**
 * GET route to test Google OAuth tokens
 * Access this endpoint at /api/google-auth/test to check if your tokens are valid
 */
export async function GET() {
  try {
    console.log('Testing Google OAuth tokens...');
    
    // Check if OAuth credentials exist
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error('Missing Google OAuth client credentials in environment variables');
      return NextResponse.json({ 
        valid: false, 
        error: 'Missing Google OAuth client credentials' 
      }, { status: 500 });
    }
    
    if (!process.env.GOOGLE_ACCESS_TOKEN || !process.env.GOOGLE_REFRESH_TOKEN) {
      console.error('Missing Google OAuth tokens in environment variables');
      return NextResponse.json({ 
        valid: false, 
        error: 'Missing Google OAuth tokens' 
      }, { status: 500 });
    }
    
    // Log token info (first few characters only for security)
    const accessToken = process.env.GOOGLE_ACCESS_TOKEN;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    console.log(`Access token available: ${!!accessToken} (starts with: ${accessToken?.substring(0, 5)}...)`);
    console.log(`Refresh token available: ${!!refreshToken} (starts with: ${refreshToken?.substring(0, 5)}...)`);
    
    // Initialize OAuth client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    
    // Set credentials
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    
    // Try to make a simple API call to validate the tokens
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    
    console.log('Making test API call to Google Drive...');
    const aboutResponse = await drive.about.get({
      fields: 'user,storageQuota'
    });
    
    if (!aboutResponse.data || !aboutResponse.data.user) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Failed to retrieve user info from Google Drive' 
      });
    }
    
    console.log('Google OAuth tokens are valid');
    
    // Return success with some basic info
    return NextResponse.json({
      valid: true,
      user: aboutResponse.data.user,
      storageQuota: aboutResponse.data.storageQuota,
      message: 'OAuth tokens are valid'
    });
  } catch (error) {
    console.error('Error testing Google OAuth tokens:', error);
    return NextResponse.json({ 
      valid: false, 
      error: `Token validation failed: ${(error as Error).message}` 
    }, { status: 401 });
  }
}
