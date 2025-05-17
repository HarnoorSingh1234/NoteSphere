import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { google } from 'googleapis';
import { Readable } from 'stream';

/**
 * A test endpoint to verify that Google Drive uploads are working correctly.
 * This creates a small test file in Google Drive using the service account credentials.
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate the user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check for OAuth credentials
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
      return NextResponse.json({ error: 'Missing OAuth configuration' }, { status: 500 });
    }

    // Create OAuth client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    // Set refresh token
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    // Refresh the access token
    try {
      const tokenResponse = await oauth2Client.refreshAccessToken();
      console.log('Access token refreshed successfully for test upload');
    } catch (refreshError) {
      console.error('Failed to refresh access token:', refreshError);
      return NextResponse.json({ 
        error: 'Failed to refresh access token',
        details: refreshError instanceof Error ? refreshError.message : String(refreshError)
      }, { status: 401 });
    }

    // Create Drive client
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // Create a small test file
    const testContent = 'This is a test file created to verify Google Drive upload functionality.';
    const testBuffer = Buffer.from(testContent);
    
    // Create a readable stream from the buffer
    const readable = new Readable();
    readable.push(testBuffer);
    readable.push(null); // End of stream

    // First, create the file placeholder
    const fileMetadata = {
      name: 'test-upload.txt',
      mimeType: 'text/plain',
    };

    const fileResponse = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id',
    });

    if (!fileResponse.data.id) {
      return NextResponse.json({ error: 'Failed to create file' }, { status: 500 });
    }

    const fileId = fileResponse.data.id;

    // Then update it with content
    const updateResponse = await drive.files.update({
      fileId: fileId,
      media: {
        mimeType: 'text/plain',
        body: readable,
      },
      fields: 'id,name,webViewLink,webContentLink',
    });

    // Make the file publicly accessible
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Test file uploaded successfully',
      fileId: fileId,
      name: updateResponse.data.name,
      webViewLink: updateResponse.data.webViewLink,
      webContentLink: updateResponse.data.webContentLink,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
    });
  } catch (error) {
    console.error('Test upload error:', error);
    return NextResponse.json({
      error: 'Test upload failed',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
