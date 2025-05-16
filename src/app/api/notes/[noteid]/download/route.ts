import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// Track note download
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = params.id;
    
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
    
    if (!note.verified) {
      return NextResponse.json(
        { error: 'Cannot download unverified notes' },
        { status: 403 }
      );
    }
    
    // Get authenticated user (if any)
    const { userId } = await auth();
    
    // Create download record (anonymous if not logged in)
    let download;
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { clerkId: userId }
      });
      
      if (user) {
        download = await prisma.download.create({
          data: {
            noteId,
            userId: user.id
          }
        });
      } else {
        download = await prisma.download.create({
          data: {
            noteId
          }
        });
      }
    } else {
      download = await prisma.download.create({
        data: {
          noteId
        }
      });
    }
    
    // Update download count on note
    await prisma.note.update({
      where: { id: noteId },
      data: {
        downloadCount: {
          increment: 1
        }
      }
    });
    
    // Get updated download count
    const downloadCount = await prisma.download.count({
      where: { noteId }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Download tracked successfully',
      downloadCount
    });
  } catch (error: unknown) {
    console.error('Error tracking download:', error);
    return NextResponse.json(
      { error: 'Failed to track download' },
      { status: 500 }
    );
  }
}