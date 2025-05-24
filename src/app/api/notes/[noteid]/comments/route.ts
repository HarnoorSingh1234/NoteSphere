import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// GET comments for a specific note
export async function GET(
  request: Request,
  context: { params: Promise<{ noteid: string }> }
) {
  try {
    const params = await context.params;
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
    
    // Get comments with user info
    const comments = await prisma.comment.findMany({
      where: { noteId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            clerkId: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
    
    return NextResponse.json({ comments });
  } catch (error: unknown) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' }, 
      { status: 500 }
    );
  }
}

// Add a new comment to a note
export async function POST(
  request: Request,
  context: { params: Promise<{ noteid: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const params = await context.params;
    const noteId = params.noteid;
    
    // Check if note exists and is public
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
        { error: 'Cannot comment on private notes' },
        { status: 403 }
      );
    }
    
    const { content } = await request.json();
    
    // Validate content
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }
    
    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        noteId
      },
      include: {
        user: {
          select: {
            clerkId: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Comment added successfully',
      comment
    });
  } catch (error: unknown) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { error: 'Failed to add comment' }, 
      { status: 500 }
    );
  }
}