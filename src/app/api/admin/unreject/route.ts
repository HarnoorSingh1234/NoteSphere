import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { isAdmin } from '@/lib/auth';

// POST to unreject a previously rejected note
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Verify admin status
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }
    
    const { noteId, action } = await request.json();
    
    // Validate input
    if (!noteId || typeof noteId !== 'string') {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      );
    }
    
    if (!['restore', 'publish'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "restore" or "publish"' },
        { status: 400 }
      );
    }
    
    // Check if note exists and is rejected
    const note = await prisma.note.findUnique({
      where: { 
        id: noteId,
        isRejected: true
      },
      include: {
        author: true,
        subject: true
      }
    });
    
    if (!note) {
      return NextResponse.json(
        { error: 'Rejected note not found' },
        { status: 404 }
      );
    }
    
    // Process the unreject action
    if (action === 'restore') {
      // Restore to pending state
      const updatedNote = await prisma.note.update({
        where: { id: noteId },
        data: { 
          isRejected: false,
          rejectedAt: null
        }
      });
      
      return NextResponse.json({
        success: true,
        message: 'Note restored to pending state',
        note: updatedNote
      });
    } else if (action === 'publish') {
      // Publish directly
      const updatedNote = await prisma.note.update({
        where: { id: noteId },
        data: { 
          isRejected: false,
          isPublic: true,
          rejectedAt: null
        }
      });
      
      return NextResponse.json({
        success: true,
        message: 'Note approved and published',
        note: updatedNote
      });
    }
  } catch (error: unknown) {
    console.error('Error processing unreject action:', error);
    return NextResponse.json(
      { error: 'Failed to process unreject action' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods to prevent 405 errors
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
