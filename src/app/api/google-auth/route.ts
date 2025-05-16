import { NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/google-auth";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET route to generate Google OAuth authorization URL
 */
export async function GET() {
  try {
    // Get the current authenticated user
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Generate the OAuth2 authorization URL
    const authUrl = getAuthUrl();
    
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication URL' },
      { status: 500 }
    );
  }
}
