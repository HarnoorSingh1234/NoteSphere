import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { google } from 'googleapis';

/**
 * GET route - generates OAuth authorization URL for Google Drive access
 * This will be used by administrators to set up the application-wide Google Drive access
 */
export async function GET() {  try {    // Get the current authenticated user
    const user = await getCurrentUser();
    
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    
    // Generate auth URL with appropriate scopes for application-wide file management
    const scopes = [
      'https://www.googleapis.com/auth/drive.file',      // Create/modify files in user-created folders
      'https://www.googleapis.com/auth/drive.metadata',  // View and manage metadata of files
    ];
    
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent', // Force getting refresh token
      include_granted_scopes: true // Include previously granted scopes
    });
    
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    );
  }
}
