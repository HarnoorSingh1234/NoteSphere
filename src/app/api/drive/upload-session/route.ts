import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createResumableUploadSession } from '@/lib/server/google-drive';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json(
        { message: 'Unauthorized' }, 
        { status: 401 }
      );
    }
    
    const userId = user.id;

    // Get metadata from request body
    const metadata = await request.json();
    
    if (!metadata.name || !metadata.mimeType) {
      return NextResponse.json(
        { message: 'File name and MIME type are required' }, 
        { status: 400 }
      );
    }
    
    // Call server-side function
    const result = await createResumableUploadSession(
      userId,
      {
        name: metadata.name,
        mimeType: metadata.mimeType
      }
    );
    
    // Return success response
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating upload session:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to create upload session' },
      { status: 500 }
    );
  }
}
