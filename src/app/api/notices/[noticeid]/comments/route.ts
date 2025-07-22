import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { isAdmin } from '@/lib/auth';

// GET comments for a specific notice
export async function GET(
  request: Request,
  context: { params: Promise<{ noticeid: string }> }
) {
  try {
    const params = await context.params;
    const noticeId = params.noticeid;
    
    // Check if notice exists
    const notice = await prisma.notice.findUnique({
      where: { id: noticeId }
    });
    
    if (!notice) {
      return NextResponse.json(
        { error: 'Notice not found' },
        { status: 404 }
      );
    }
    
    // Get comments with user info
    const comments = await prisma.comment.findMany({
      where: { noticeId },
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

// Add a new comment to a notice
export async function POST(
  request: Request,
  context: { params: Promise<{ noticeid: string }> }
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
    const noticeId = params.noticeid;
    
    // Check if notice exists
    const notice = await prisma.notice.findUnique({
      where: { id: noticeId }
    });
    
    if (!notice) {
      return NextResponse.json(
        { error: 'Notice not found' },
        { status: 404 }
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
        noticeId
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

// Add PATCH and DELETE for individual comments
export async function PATCH(
  request: Request,
  context: { params: Promise<{ noticeid: string; commentid: string }> }
) {
  try {
    const params = await context.params;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const noticeId = params.noticeid;
    const commentId = params.commentid;
    // Get the comment to check ownership
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { user: true },
    });
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }
    if (comment.noticeId !== noticeId) {
      return NextResponse.json({ error: 'Comment does not belong to this notice' }, { status: 400 });
    }
    // Check if the user is the comment owner or an admin
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    const admin = user?.role === 'ADMIN';
    const isOwner = comment.user.clerkId === userId;
    if (!isOwner && !admin) {
      return NextResponse.json({ error: 'You can only edit your own comments' }, { status: 403 });
    }
    const { content } = await request.json();
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: { user: true },
    });
    return NextResponse.json({ success: true, message: 'Comment updated successfully', comment: updatedComment });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ noticeid: string; commentid: string }> }
) {
  try {
    const params = await context.params;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const noticeId = params.noticeid;
    const commentId = params.commentid;
    // Get the comment to check ownership
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { user: true },
    });
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }
    if (comment.noticeId !== noticeId) {
      return NextResponse.json({ error: 'Comment does not belong to this notice' }, { status: 400 });
    }
    // Check if the user is the comment owner or an admin
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    const admin = user?.role === 'ADMIN';
    const isOwner = comment.user.clerkId === userId;
    if (!isOwner && !admin) {
      return NextResponse.json({ error: 'You can only delete your own comments' }, { status: 403 });
    }
    await prisma.comment.delete({ where: { id: commentId } });
    return NextResponse.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
