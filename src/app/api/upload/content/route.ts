import { NextRequest, NextResponse } from "next/server";
import { google } from 'googleapis';
import { getCurrentUser } from "@/lib/auth";
import { Readable } from 'stream';

// Set larger body size limit for the upload route
export const config = {
  api: {
    bodyParser: false, // Disable built-in parser for streaming uploads
    responseLimit: false, // No response size limit
  },
};

const getDriveClient = () => {
  try {
    console.log('Initializing Google Drive client for content upload...');
    
    // Check if OAuth credentials exist
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error('Missing Google OAuth client credentials in environment variables');
      throw new Error('Missing Google OAuth client credentials');
    }
    
    if (!process.env.GOOGLE_ACCESS_TOKEN || !process.env.GOOGLE_REFRESH_TOKEN) {
      console.error('Missing Google OAuth tokens in environment variables');
      throw new Error('Missing Google OAuth tokens');
    }
    
    // Log all relevant environment variables for debugging (partial values for security)
    console.log({
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID?.substring(0, 8) + '...',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET?.substring(0, 3) + '...',
      REDIRECT_URI: process.env.REDIRECT_URI,
      GOOGLE_ACCESS_TOKEN: process.env.GOOGLE_ACCESS_TOKEN?.substring(0, 5) + '...',
      GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN?.substring(0, 5) + '...',
    });
    
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.REDIRECT_URI || 'http://localhost:3000/api/oauth2callback'
    );
    
    // Log token info (first few characters only for security)
    const accessToken = process.env.GOOGLE_ACCESS_TOKEN;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    console.log(`Access token available: ${!!accessToken} (starts with: ${accessToken?.substring(0, 5)}...)`);
    console.log(`Refresh token available: ${!!refreshToken} (starts with: ${refreshToken?.substring(0, 5)}...)`);
    
    // Set up credentials with explicit type declaration
    const credentials = {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer'
    };
    
    oauth2Client.setCredentials(credentials);
    
    // Verify token by getting user info - this will force a refresh if needed
    try {
      const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2'
      });
      oauth2.userinfo.get(); // This will validate the token
    } catch (tokenError) {
      console.error('Error validating OAuth token:', tokenError);
    }
    
    // Create and return drive client with OAuth client auth
    return google.drive({ version: 'v3', auth: oauth2Client });
  } catch (error) {
    console.error('Error initializing Google Drive client:', error);
    throw new Error('Failed to initialize Google Drive client: ' + (error as Error).message);
  }
};

/**
 * Parse form data from the request
 */
async function parseFormData(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const fileId = formData.get('fileId') as string;
  const mimeType = formData.get('mimeType') as string;
  
  if (!file || !fileId) {
    throw new Error('Missing required parameters: file and fileId');
  }
  
  return { file, fileId, mimeType };
}

/**
 * Convert a File to a Buffer
 */
async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * POST route to handle file content upload to Google Drive
 */
export async function POST(request: NextRequest) {
  try {
    console.log('Upload Content API called - handling file content upload');
    
    // Get current user
    const user = await getCurrentUser();
    
    if (!user) {
      console.log('Authentication required - no user found');
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    console.log(`User authenticated: ${user.id}`);
    
    // Parse form data from the request
    const { file, fileId, mimeType } = await parseFormData(request);
    console.log(`Received file: ${file.name} (${file.size} bytes)`);
    console.log(`For Google Drive file ID: ${fileId}`);
    
    // Get Drive client - this might throw if credentials are invalid
    let driveClient;
    try {
      driveClient = getDriveClient();
      console.log('Drive client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Drive client:', error);
      return NextResponse.json({ 
        error: `Authentication error: ${(error as Error).message}` 
      }, { status: 401 });
    }
    
    try {
      // Verify the file exists in Drive 
      console.log('Verifying file exists in Drive...');
      const fileCheck = await driveClient.files.get({
        fileId: fileId,
        fields: 'id,name,mimeType'
      });
      
      console.log(`File verified: ${fileCheck.data.name} (${fileCheck.data.mimeType})`);
    } catch (fileError) {
      console.error('File verification failed:', fileError);
      return NextResponse.json({ 
        error: `File not found or permission denied: ${(fileError as Error).message}` 
      }, { status: 404 });
    }
    
    // Convert file to buffer
    const buffer = await fileToBuffer(file);
    console.log(`File converted to buffer (${buffer.length} bytes)`);
    
    // Create a readable stream from the buffer
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null); // End of stream
    
    // Update the file content in Google Drive
    const media = {
      mimeType: mimeType || file.type,
      body: readable,
    };
    
    console.log('Uploading file content to Google Drive...');
    
    // Try to upload with more detailed error handling
    let result;
    try {
      result = await driveClient.files.update({
        fileId,
        media: media,
        fields: 'id,name,webViewLink,webContentLink',
      });
      
      console.log('Upload successful!');
      console.log(`Result: ${JSON.stringify(result.data)}`);
    } catch (uploadError) {
      console.error('Upload error details:', uploadError);
      
      // Try to get a more specific error message
      const errorMessage = (uploadError as any).message || 'Unknown error';
      const errorCode = (uploadError as any).code || 'UNKNOWN';
      
      return NextResponse.json({ 
        error: `Upload failed (${errorCode}): ${errorMessage}` 
      }, { status: 500 });
    }
    
    // Generate download URL
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    return NextResponse.json({
      success: true,
      fileId: result.data.id,
      fileName: result.data.name,
      downloadUrl,
      webViewLink: result.data.webViewLink,
      webContentLink: result.data.webContentLink,
    });
    
  } catch (error) {
    console.error("Upload content error:", error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message || "Failed to upload file content",
    }, { status: 500 });
  }
}
