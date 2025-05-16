import { NextRequest, NextResponse } from "next/server";
import { createResumableUploadSession } from "@/lib/google-drive";
import { getCurrentUser } from "@/lib/auth";
import { isGoogleAccountConnected } from "@/lib/google-auth";

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
    // Get current user
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    // Check if user has connected their Google account
    const googleConnected = await isGoogleAccountConnected(user.id);
    
    if (!googleConnected) {
      return NextResponse.json({ 
        error: "Google account not connected", 
        needsAuth: true 
      }, { status: 403 });
    }
    
    // Parse the JSON data from the request
    const data = await request.json();
    
    if (!data.fileName || !data.mimeType) {
      return NextResponse.json({ 
        error: "File name and MIME type are required" 
      }, { status: 400 });
    }
    
    // Create a resumable upload session
    const uploadUrl = await createResumableUploadSession(
      user.id,
      {
        name: data.fileName,
        mimeType: data.mimeType
      }
    );
    
    // Return the upload URL to the client
    return NextResponse.json({
      success: true,
      uploadUrl,
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