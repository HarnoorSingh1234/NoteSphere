import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// GET likes for a specific note
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = params.id;
    
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
    
    // Get likes with user info
    const likes = await prisma.like.findMany({
      where: { noteId },
      include: {
        user: {
          select: {
            clerkId: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
    
    // Get total count
    const count = await prisma.like.count({
      where: { noteId }
    });
    
    return NextResponse.json({ 
      likes,
      count 
    });
  } catch (error: unknown) {
    console.error('Error fetching likes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch likes' }, 
      { status: 500 }
    );
  }
}

// Add or remove like on a note (toggle)
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const noteId = params.id;
    
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
    
    // Check if user already liked this note
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_noteId: {
          userId,
          noteId
        }
      }
    });
    
    let action;
    if (existingLike) {
      // Unlike if already liked
      await prisma.like.delete({
        where: {
          userId_noteId: {
            userId,
            noteId
          }
        }
      });
      action = 'unliked';
    } else {
      // Like if not already liked
      await prisma.like.create({
        data: {
          userId,
          noteId
        }
      });
      action = 'liked';
    }
    
    // Get updated like count
    const count = await prisma.like.count({
      where: { noteId }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: `Note ${action} successfully`,
      action,
      count
    });
  } catch (error: unknown) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to process like action' }, 
      { status: 500 }
    );
  }
}