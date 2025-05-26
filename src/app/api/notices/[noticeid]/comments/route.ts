import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

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
