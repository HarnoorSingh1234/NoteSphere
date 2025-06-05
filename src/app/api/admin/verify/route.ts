import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { isAdmin } from '@/lib/auth';

// GET notes pending verification for admin review
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );    }
    
    // Verify admin status
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const skip = (page - 1) * limit;
    
    // Count total private notes (pending verification)
    const totalCount = await prisma.note.count({
      where: { isPublic: false }
    });
      // Get private notes (pending verification) with pagination
    const pendingNotes = await prisma.note.findMany({
      where: { isPublic: false },
      orderBy: { createdAt: 'asc' }, // Oldest first
      skip,
      take: limit,
      include: {
        subject: {
          include: {
            semester: {
              include: {
                year: true
              }
            }
          }
        },
        author: {
          select: {
            clerkId: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });
    
    return NextResponse.json({
      notes: pendingNotes,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        page,
        limit
      }
    });
  } catch (error: unknown) {
    console.error('Error fetching pending notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending notes' },
      { status: 500 }
    );
  }
}

// POST to verify or reject a note
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
    
    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json(
        { error: 'Action must be either "approve" or "reject"' },
        { status: 400 }
      );
    }
    
    // Check if note exists
    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: {
        author: true,
        subject: true
      }
    });
    
    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }
    
    // Process the verification action
    if (action === 'approve') {
      const updatedNote = await prisma.note.update({
        where: { id: noteId },
        data: { isPublic: true }
      });
      
      // TODO: Notify author of approval via email or in-app notification
      
      return NextResponse.json({
        success: true,
        message: 'Note approved successfully',
        note: updatedNote
      });    } else {
      // Reject the note (mark as rejected instead of deleting)
      const updatedNote = await prisma.note.update({
        where: { id: noteId },
        data: { 
          isRejected: true,
          rejectedAt: new Date()
        }
      });
      
      // TODO: Notify author of rejection via email or in-app notification
      
      return NextResponse.json({
        success: true,
        message: 'Note rejected successfully',
        note: updatedNote
      });
    }
  } catch (error: unknown) {
    console.error('Error processing verification:', error);
    return NextResponse.json(
      { error: 'Failed to process verification' },
      { status: 500 }
    );
  }
}