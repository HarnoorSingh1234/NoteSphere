import { google } from 'googleapis';

/**
 * Get a Google Drive client authenticated with OAuth2 tokens
 */
export const getGoogleDriveClient = async () => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    
    // Set up credentials stored in environment variables
    oauth2Client.setCredentials({
      access_token: process.env.GOOGLE_ACCESS_TOKEN,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
    
    // Create and return drive client
    return google.drive({ version: 'v3', auth: oauth2Client });
  } catch (error) {
    console.error('Error initializing Google Drive client:', error);
    throw new Error('Failed to initialize Google Drive client');
  }
};

/**
 * Check if Google Drive integration is available and tokens are working
 * @returns Promise<boolean> indicating if Google Drive is connected and working
 */
export const isGoogleAccountConnected = async (): Promise<boolean> => {
  // First check if tokens exist
  if (!process.env.GOOGLE_ACCESS_TOKEN || !process.env.GOOGLE_REFRESH_TOKEN) {
    return false;
  }
  
  try {
    // Try to make a simple API call to validate the tokens
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    
    oauth2Client.setCredentials({
      access_token: process.env.GOOGLE_ACCESS_TOKEN,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
    
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    
    // Make a simple API call that doesn't require specific permissions
    // Just fetching the about info with minimal fields
    await drive.about.get({
      fields: 'user'
    });
    
    return true;
  } catch (error) {
    console.error('Error validating Google OAuth tokens:', error);
    return false;
  }
};
