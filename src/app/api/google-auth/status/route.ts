import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { isGoogleAccountConnected, getAuthUrl } from "@/lib/google-auth";

/**
 * GET route to check Google Drive connection status
 */
export async function GET() {
  try {
    // Get the current authenticated user
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ 
        connected: false, 
        error: 'Authentication required' 
      }, { status: 401 });
    }
    
    // Check if the user has connected their Google account
    const isConnected = await isGoogleAccountConnected(user.id);
    
    if (isConnected) {
      return NextResponse.json({ 
        connected: true 
      });
    }
    
    // Generate auth URL if not connected
    const authUrl = getAuthUrl();
    
    return NextResponse.json({ 
      connected: false, 
      authUrl 
    });
  } catch (error) {
    console.error('Error checking Google auth status:', error);
    return NextResponse.json(
      { 
        connected: false, 
        error: 'Failed to check Google Drive connection' 
      },
      { status: 500 }
    );
  }
}
