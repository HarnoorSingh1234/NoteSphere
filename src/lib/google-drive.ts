/**
 * Google Drive API integration for file operations using OAuth client
 */
import { google, drive_v3 } from 'googleapis';
import { prisma } from './db';

// Configure OAuth client
const getDriveClient = async (): Promise<drive_v3.Drive> => {
  try {
    console.log('Initializing Google Drive client...');
      // Check if OAuth credentials exist
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error('Missing Google OAuth client credentials in environment variables');
      throw new Error('Missing Google OAuth client credentials');
    }
    
    if (!process.env.GOOGLE_REFRESH_TOKEN) {
      console.error('Missing Google OAuth refresh token in environment variables');
      throw new Error('Missing Google OAuth refresh token');
    }
    
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    
    // Log refresh token info (first few characters only for security)
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    console.log(`Refresh token available: ${!!refreshToken} (starts with: ${refreshToken?.substring(0, 5)}...)`);
    
    // Set up credentials with just the refresh token
    // The OAuth client will automatically refresh the access token when needed
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });
    
    // Force refresh to ensure we have a valid access token
    try {
      await oauth2Client.refreshAccessToken();
      console.log('Access token refreshed successfully');
    } catch (refreshError) {
      console.error('Failed to refresh access token:', refreshError);
      throw new Error('Failed to refresh access token');
    }
    
    // Create and return drive client with OAuth client auth
    return google.drive({ version: 'v3', auth: oauth2Client });
  } catch (error) {
    console.error('Error initializing Google Drive client:', error);
    throw new Error('Failed to initialize Google Drive client');
  }
};

// Helper function to get application's folder ID or create one if it doesn't exist
const getOrCreateAppFolder = async (): Promise<string> => {
  const driveClient = await getDriveClient();
  const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME || 'NoteSphere Files';
  
  try {
    // Check if the folder already exists
    const response = await driveClient.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      spaces: 'drive',
      fields: 'files(id, name)'
    });
    
    // If folder exists, return its ID
    if (response.data.files && response.data.files.length > 0) {
      return response.data.files[0].id!;
    }
    
    // Create new folder if it doesn't exist
    const folderResponse = await driveClient.files.create({
      requestBody: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id'
    });
    
    if (!folderResponse.data.id) {
      throw new Error('Failed to create application folder in Google Drive');
    }
    
    return folderResponse.data.id;
  } catch (error) {
    console.error('Error getting or creating app folder:', error);
    throw new Error('Failed to initialize storage folder');
  }
};

/**
 * Create a Google Drive resumable upload session
 * @param userId User ID for tracking file ownership (not used for auth)
 * @param metadata File metadata (name, mimeType, etc)
 * @returns Object containing resumable upload URL and file metadata
 */
export async function createResumableUploadSession(
  userId: string,
  metadata: { name: string; mimeType: string }
): Promise<{
  uploadUrl: string;
  fileId: string;
  webViewLink?: string;
  webContentLink?: string;
}> {
  try {
    console.log(`Creating resumable upload session for file: ${metadata.name} (${metadata.mimeType})`);
      // Get Drive client using OAuth
    const driveClient = await getDriveClient();
    console.log('Drive client initialized successfully');
    
    // Get application folder ID
    console.log('Retrieving application folder...');
    const folderId = await getOrCreateAppFolder();
    console.log(`Application folder ID: ${folderId}`);
    
    // Create the file first to get an ID
    console.log('Creating file in Google Drive...');
    const fileResponse = await driveClient.files.create({
      requestBody: {
        name: metadata.name,
        mimeType: metadata.mimeType,
        parents: [folderId], // Place in application folder
        // Add user ID as a property to track ownership
        properties: {
          userId: userId
        }
      },
      fields: 'id,name,webViewLink,webContentLink',
    });

    if (!fileResponse.data.id) {
      throw new Error('Failed to create file in Google Drive');
    }
    
    // Make the file publicly accessible for anyone with the link
    await driveClient.permissions.create({
      fileId: fileResponse.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });    // Return the file details for direct client-side upload
    return {
      // Just return the file ID - the client will handle the upload directly
      uploadUrl: `https://www.googleapis.com/upload/drive/v3/files/${fileResponse.data.id}?uploadType=media`,
      fileId: fileResponse.data.id!,
      webViewLink: fileResponse.data.webViewLink || undefined,
      webContentLink: fileResponse.data.webContentLink || undefined,
    };
  } catch (error) {
    console.error('Error creating resumable upload session:', error);
    throw new Error('Failed to initialize Google Drive upload');
  }
}

/**
 * Get a Google Drive file by ID
 * @param userId User ID (not used for authentication)
 * @param fileId Google Drive file ID
 * @returns File metadata including download URL
 */
export async function getGoogleDriveFile(
  userId: string,
  fileId: string
): Promise<{
  id: string;
  name: string;
  webViewLink?: string;
  webContentLink?: string;
  mimeType: string;
}> {
  try {    // Get Drive client with OAuth
    const driveClient = await getDriveClient();
    
    // Get file metadata
    const response = await driveClient.files.get({
      fileId,
      fields: 'id,name,webViewLink,webContentLink,mimeType',
    });
    
    if (!response.data.id) {
      throw new Error('File not found in Google Drive');
    }
    
    return {
      id: response.data.id,
      name: response.data.name || 'Unnamed File',
      webViewLink: response.data.webViewLink || undefined,
      webContentLink: response.data.webContentLink || undefined,
      mimeType: response.data.mimeType || 'application/octet-stream',
    };
  } catch (error) {
    console.error('Error getting Google Drive file:', error);
    throw new Error('Failed to retrieve file from Google Drive');
  }
}

/**
 * Generate a direct download URL for a Google Drive file
 * @param fileId Google Drive file ID
 * @returns Direct download URL
 */
export function generateDownloadUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}