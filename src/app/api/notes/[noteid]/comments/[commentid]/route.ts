import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// Get a specific comment
export async function GET(
  request: Request,
  context: { params: Promise<{ noteid: string, commentid: string }> }
) {
  try {
    const params = await context.params;
    const noteId = params.noteid;
    const commentId = params.commentid;
    
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        user: {
          select: {
            clerkId: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });
    
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }
    
    // Check if the comment belongs to the specified note
    if (comment.noteId !== noteId) {
      return NextResponse.json(
        { error: 'Comment does not belong to this note' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ comment });
  } catch (error: unknown) {
    console.error('Error fetching comment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comment' }, 
      { status: 500 }
    );
  }
}

// Delete a comment
export async function DELETE(
  request: Request,
  context: { params: Promise<{ noteid: string, commentid: string }> }
) {
  try {
    const params = await context.params;
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const noteId = params.noteid;
    const commentId = params.commentid;
    
    // Get the comment to check ownership
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        user: true,
      },
    });
    
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }
    
    // Check if the comment belongs to the note
    if (comment.noteId !== noteId) {
      return NextResponse.json(
        { error: 'Comment does not belong to this note' },
        { status: 400 }
      );
    }
    
    // Check if the user is the comment owner or an admin
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    
    const isAdmin = user?.role === 'ADMIN';
    const isOwner = comment.user.clerkId === userId;
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'You can only delete your own comments' },
        { status: 403 }
      );
    }
    
    // Delete the comment
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error: unknown) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' }, 
      { status: 500 }
    );
  }
}
