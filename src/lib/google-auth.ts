import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '@/lib/db';

// Initialize OAuth2 client with credentials
export const getOAuth2Client = (): OAuth2Client => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000/api/oauth2callback'
      : `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth2callback`
  );
};

// Generate OAuth2 authorization URL with proper scopes
export const getAuthUrl = (): string => {
  const oauth2Client = getOAuth2Client();
  const scopes = [
    'https://www.googleapis.com/auth/drive.file', // Access to files created or opened by the app
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline', // To get refresh token
    scope: scopes,
    prompt: 'consent', // Force getting refresh token
  });
};

/**
 * Get an authenticated Google Drive client for a specific user
 * Use OAuth2 if user has connected their account, fallback to service account
 */
export const getGoogleDriveClient = async (userId: string) => {
  try {
    // Check if user has OAuth tokens stored
    const userAuth = await prisma.userAuth.findUnique({
      where: { clerkId: userId }
    });
    
    // If user has OAuth tokens
    if (userAuth?.googleAccessToken) {
      const oauth2Client = getOAuth2Client();
      
      // Set credentials
      oauth2Client.setCredentials({
        access_token: userAuth.googleAccessToken,
        refresh_token: userAuth.googleRefreshToken || undefined,
        expiry_date: userAuth.googleTokenExpiry ? userAuth.googleTokenExpiry.getTime() : undefined
      });
      
      // Check if token needs refreshing
      if (userAuth.googleTokenExpiry && new Date() > userAuth.googleTokenExpiry) {
        // Refresh the token
        const { credentials } = await oauth2Client.refreshAccessToken();
        
        // Update tokens in database
        await prisma.userAuth.update({
          where: { clerkId: userId },
          data: {
            googleAccessToken: credentials.access_token,
            googleRefreshToken: credentials.refresh_token || userAuth.googleRefreshToken,
            googleTokenExpiry: credentials.expiry_date ? new Date(credentials.expiry_date) : null
          }
        });
        
        // Update client with new credentials
        oauth2Client.setCredentials(credentials);
      }
      
      // Create and return drive client with OAuth2 authentication
      return google.drive({ version: 'v3', auth: oauth2Client });
    }
    
    // Fallback to service account if user hasn't connected Google account
    const client = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/drive']
    });
    
    return google.drive({ version: 'v3', auth: client });
  } catch (error) {
    console.error('Error initializing Google Drive client:', error);
    throw new Error('Failed to initialize Google Drive client');
  }
};

/**
 * Check if a user has connected their Google account
 */
export const isGoogleAccountConnected = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const userAuth = await prisma.userAuth.findUnique({
      where: { clerkId: userId }
    });
    
    return !!userAuth?.googleAccessToken;
  } catch (error) {
    console.error('Error checking Google account connection:', error);
    return false;
  }
};
