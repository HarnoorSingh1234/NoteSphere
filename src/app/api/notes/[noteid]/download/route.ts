import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// Track note download
export async function POST(
  request: Request,
  context: { params: Promise<{ noteid: string }> }
) {
  try {
    const params = await context.params;
    const noteId = params.noteid;
    
    // Check if note exists and is verified
    const note = await prisma.note.findUnique({
      where: { id: noteId }
    });
    
    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }
      if (!note.isPublic) {
      return NextResponse.json(
        { error: 'Cannot download private notes' },
        { status: 403 }
      );
    }
    
    // Get authenticated user (if any)
    const { userId } = await auth();
      // Update download count on note
    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: {
        downloadCount: {
          increment: 1
        }
      }
    });
      return NextResponse.json({
      success: true,
      message: 'Download tracked successfully',
      downloadCount: updatedNote.downloadCount
    });
  } catch (error: unknown) {
    console.error('Error tracking download:', error);
    return NextResponse.json(
      { error: 'Failed to track download' },
      { status: 500 }
    );
  }
}