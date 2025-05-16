import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { isAdmin } from '@/lib/auth';

// GET a specific note by ID
export async function GET(
  request: Request,
  { params }: { params: { noteid: string } }
) {
  try {
    const noteId = params.noteid;
    
    const note = await prisma.note.findUnique({
      where: { id: noteId },
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
        comments: {
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
        },
        likes: {
          include: {
            user: {
              select: {
                clerkId: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        tags: true,
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });
    
    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }
      // Check if authenticated user has liked this note
    let userLiked = false;
    
    const { userId } = await auth();
    if (userId) {
      const like = await prisma.like.findFirst({
        where: {
          userId: userId,
          noteId: note.id
        }
      });
      
      userLiked = !!like;
    }
    
    // Increment download count (we're just tracking views here)
    await prisma.note.update({
      where: { id: noteId },
      data: {
        downloadCount: {
          increment: 1
        }
      }
    });
    
    return NextResponse.json({ 
      note,
      userLiked
    });
  } catch (error: unknown) {
    console.error('Error fetching note:', error);
    return NextResponse.json(
      { error: 'Failed to fetch note' },
      { status: 500 }
    );
  }
}

// Update a note
export async function PUT(
  request: Request,
  { params }: { params: { noteid: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const noteId = params.noteid;
      // Get the existing note
    const existingNote = await prisma.note.findUnique({
      where: { id: noteId },
      include: {
        author: true,
        tags: true
      }
    });
    
    if (!existingNote) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }
    
    // Check authorization (admin or note author)
    const isAuthor = userId === existingNote.authorClerkId;
    const adminStatus = await isAdmin();
    
    if (!isAuthor && !adminStatus) {
      return NextResponse.json(
        { error: 'You do not have permission to update this note' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const { title, content, subjectId, type, tags } = await request.json();
    
    // Validate fields
    if (title !== undefined && (!title || typeof title !== 'string')) {
      return NextResponse.json(
        { error: 'Title must be a non-empty string' },
        { status: 400 }
      );
    }
    
    if (subjectId !== undefined) {
      // Check if subject exists
      const subject = await prisma.subject.findUnique({
        where: { id: subjectId }
      });
      
      if (!subject) {
        return NextResponse.json(
          { error: 'Subject not found' },
          { status: 404 }
        );
      }
    }
    
    // Process tags if provided
    let tagUpdateOperation = {};
    if (tags && Array.isArray(tags)) {
      // Create a list of tag objects for connect or create
      const tagData = tags.map((tagName: string) => ({
        where: { name: tagName },
        create: { name: tagName }
      }));
        tagUpdateOperation = {
        tags: {
          disconnect: existingNote.tags.map((tag: { id: string }) => ({ id: tag.id })), // Remove existing tags
          connectOrCreate: tagData // Add new tags
        }
      };
    }
    
    // Update note
    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(subjectId !== undefined && { subjectId }),
        ...(type !== undefined && { type }),
        ...tagUpdateOperation
      },
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
        tags: true
      }
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Note updated successfully',
      note: updatedNote
    });
  } catch (error: unknown) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    );
  }
}

// Delete a note
export async function DELETE(
  request: Request,
  { params }: { params: { noteid: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const noteId = params.noteid;
    
    // Get the existing note
    const existingNote = await prisma.note.findUnique({
      where: { id: noteId }
    });
    
    if (!existingNote) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }
    
    // Check authorization (admin or note author)
    const isAuthor = userId === existingNote.authorClerkId;
    const adminStatus = await isAdmin();
    
    if (!isAuthor && !adminStatus) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this note' },
        { status: 403 }
      );
    }
    
    // Delete note (cascade will handle related records)
    await prisma.note.delete({
      where: { id: noteId }
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error: unknown) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}