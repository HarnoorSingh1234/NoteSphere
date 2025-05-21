import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from "@/lib/auth";
import { getGoogleDriveFile, deleteFileFromDrive } from '@/lib/server/google-drive';

/**
 * GET - Retrieve file info
 */
export async function GET(request: NextRequest) {
    try {
    // Get authenticated user
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get fileId from query params
    const fileId = request.nextUrl.searchParams.get('fileId');
    
    if (!fileId) {
      return NextResponse.json(
        { message: 'File ID is required' }, 
        { status: 400 }
      );
    }
      // Call server-side function
    const fileInfo = await getGoogleDriveFile(user.id, fileId);
    
    // Return file info
    return NextResponse.json(fileInfo);
  } catch (error) {
    console.error('Error getting file info:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to retrieve file information' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete a file
 */
export async function DELETE(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json(
        { message: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Get fileId from body
    const { fileId } = await request.json();
    
    if (!fileId) {
      return NextResponse.json(
        { message: 'File ID is required' }, 
        { status: 400 }
      );
    }
    
    // Call server-side function
    const success = await deleteFileFromDrive(fileId);
    
    // Return success response
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to delete file' },
      { status: 500 }
    );
  }
}
