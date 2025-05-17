import { NextRequest, NextResponse } from "next/server";
import { createResumableUploadSession, generateDownloadUrl } from "@/lib/google-drive";
import { getCurrentUser } from "@/lib/auth";

// Set larger body size limit for the upload route
export const config = {
  api: {
    bodyParser: false, // Disable built-in parser for streaming
    responseLimit: false, // No response size limit
  },
};

/**
 * POST route to create a resumable upload session for Google Drive
 */
export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called - creating resumable upload session');
    
    // Get current user
    const user = await getCurrentUser();
    
    if (!user) {
      console.log('Authentication required - no user found');
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    console.log(`User authenticated: ${user.id}`);
    
    // Parse the JSON data from the request
    const data = await request.json();
    
    if (!data.fileName || !data.mimeType) {
      return NextResponse.json({ 
        error: "File name and MIME type are required" 
      }, { status: 400 });
    }
    
    // Create a resumable upload session using service account
    const uploadResult = await createResumableUploadSession(
      user.id, // Pass user ID for file ownership tracking, not for auth
      {
        name: data.fileName,
        mimeType: data.mimeType
      }
    );
    
    // Generate download URL
    const downloadUrl = generateDownloadUrl(uploadResult.fileId);
    
    // Return the upload URL and file info to the client
    return NextResponse.json({
      success: true,
      uploadUrl: uploadResult.uploadUrl,
      fileId: uploadResult.fileId,
      downloadUrl,
      webViewLink: uploadResult.webViewLink,
      message: "Ready for file upload"
    });
  } catch (error) {
    console.error("Upload initialization error:", error);
    return NextResponse.json({
      error: "Failed to initialize upload",
      message: (error as Error).message
    }, { status: 500 });
  }
}