import { NextRequest, NextResponse } from "next/server";
import { google } from 'googleapis';
import { getCurrentUser } from "@/lib/auth";
import { Readable } from 'stream';

/**
 * This endpoint handles direct file uploads to Google Drive
 * It's used as a fallback when the standard upload doesn't work
 */
export async function POST(request: NextRequest) {
  try {
    console.log('Direct upload API called');
    
    // First authenticate the user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required'
      }, { status: 401 });
    }
    
    // Parse form data
    const data = await request.formData();
    
    // Get file from form data
    const file = data.get('file') as File | null;
    const fileId = data.get('fileId') as string;
    const fileName = data.get('fileName') as string || (file?.name || 'file');
    const mimeType = data.get('mimeType') as string || (file?.type || 'application/octet-stream');
    
    if (!file) {
      return NextResponse.json({ 
        error: 'No file provided'
      }, { status: 400 });
    }
    
    if (!fileId) {
      return NextResponse.json({ 
        error: 'No fileId provided'
      }, { status: 400 });
    }
    
    console.log(`Processing file: ${fileName} (${file.size} bytes, ${mimeType})`);
    console.log(`Target Google Drive file ID: ${fileId}`);
      // Create OAuth client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    
    // Set refresh token and get a fresh access token
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
    
    // Refresh token to get a fresh access token
    try {
      await oauth2Client.refreshAccessToken();
    } catch (refreshError) {
      console.error('Failed to refresh access token:', refreshError);
      return NextResponse.json({ 
        error: 'Authorization failed. Could not refresh access token.' 
      }, { status: 401 });
    }
    
    // Create Drive client
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    
    // Convert file to buffer and then to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Create a readable stream from the buffer
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null); // End of stream
      console.log(`Uploading file to Drive via server (size: ${buffer.length} bytes)`);
    
    // Update the file in Google Drive
    const response = await drive.files.update({
      fileId: fileId,
      media: {
        mimeType: mimeType,
        body: readable,
      },
      fields: 'id,name,webViewLink,webContentLink',
    });
    
    console.log('Server-side upload completed successfully');
    
    // Return success response
    return NextResponse.json({
      success: true,
      fileId: response.data.id,
      name: response.data.name,
      webViewLink: response.data.webViewLink,
      webContentLink: response.data.webContentLink,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${response.data.id}`,
    });
    
  } catch (error) {
    console.error('Direct upload error:', error);
    return NextResponse.json({
      error: `Upload failed: ${(error as Error).message}`,
    }, { status: 500 });
  }
}
