import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateDownloadUrl } from '@/lib/server/google-drive';
import { getCurrentUser } from '@/lib/auth';

// Handle file downloads from Google Drive
export async function GET(
  request: Request,
  { params }: { params: { noteid: string } }
) {  try {
    const noteId = params.noteid;
    
    // Check if note exists
    const note = await prisma.note.findUnique({
      where: { id: noteId }
    });
    
    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    // Check if note has a Google Drive file ID
    if (!note.driveFileId) {
      return NextResponse.json(
        { error: 'No Google Drive file associated with this note' },
        { status: 400 }
      );
    }
      // Get authenticated user (if any) - we could use this for analytics in the future
    const user = await getCurrentUser();
      // Increment download count
    try {
      await prisma.note.update({
        where: { id: noteId },
        data: {
          downloadCount: {
            increment: 1
          }
        }
      });
    } catch (countError) {
      // Continue even if download count update fails
      console.warn('Failed to update download count, but continuing with download:', countError);
    }
    
    // Handle download based on file source
    let downloadUrl;
      if (note.driveFileId) {
      // For Google Drive files, generate a direct download URL
      // Files are already shared publicly via the service account
      downloadUrl = await generateDownloadUrl(note.driveFileId);
    } else {
      // For regular files, use the stored URL
      downloadUrl = note.fileUrl;
    }

    // Redirect to the download URL
    return NextResponse.redirect(downloadUrl);
    
  } catch (error: unknown) {
    console.error('Error handling file download:', error);
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  }
}
