/**
 * Google Drive API integration for file operations
 */
import { google, drive_v3 } from 'googleapis';
import { getOAuth2Client } from './google-auth';
import { prisma } from './db';

/**
 * Create a Google Drive resumable upload session
 * @param userId User ID for authentication
 * @param metadata File metadata (name, mimeType, etc)
 * @returns Resumable upload URL
 */
export async function createResumableUploadSession(
  userId: string,
  metadata: { name: string; mimeType: string }
): Promise<string> {
  try {
    // Get Drive client with user's auth
    const driveClient = await getGoogleDriveClientForUser(userId);
    
    // Create a resumable upload session
    const response = await driveClient.files.create({
      requestBody: {
        name: metadata.name,
        mimeType: metadata.mimeType,
      },
      media: {
        mimeType: metadata.mimeType,
      },
      fields: 'id,name,webViewLink',
      supportsAllDrives: false,
    }, {
      // Use resumable upload
      onUploadProgress: () => {},
    });

    // Get the resumable upload URL from response headers
    const location = response.config?.headers?.['X-Guploader-UploadID'];
    
    if (!location) {
      throw new Error('Failed to get resumable upload URL');
    }
    
    return location;
  } catch (error) {
    console.error('Error creating resumable upload session:', error);
    throw new Error('Failed to initialize Google Drive upload');
  }
}

/**
 * Get Google Drive client with user's OAuth credentials
 */
async function getGoogleDriveClientForUser(userId: string): Promise<drive_v3.Drive> {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  try {
    const userAuth = await prisma.userAuth.findUnique({
      where: { clerkId: userId }
    });
    
    if (!userAuth?.googleAccessToken) {
      throw new Error('User has not connected their Google account');
    }
    
    const oauth2Client = getOAuth2Client();
    
    // Set credentials
    oauth2Client.setCredentials({
      access_token: userAuth.googleAccessToken,
      refresh_token: userAuth.googleRefreshToken || undefined,
      expiry_date: userAuth.googleTokenExpiry ? userAuth.googleTokenExpiry.getTime() : undefined
    });
    
    // Check if token needs refreshing
    if (userAuth.googleTokenExpiry && new Date() > userAuth.googleTokenExpiry) {
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
    
    // Create and return drive client
    return google.drive({ version: 'v3', auth: oauth2Client });
  } catch (error) {
    console.error('Error getting Google Drive client:', error);
    throw error;
  }
}