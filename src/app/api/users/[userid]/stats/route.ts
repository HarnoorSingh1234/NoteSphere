import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// GET user statistics
export async function GET(
  request: Request,
  context: { params: Promise<{ userid: string }> }
) {
  try {
    const { userId } = await auth();
    const params = await context.params;
    const requestedUserId = params.userid;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Users can only access their own stats (or admin can access any)
    if (userId !== requestedUserId) {
      return NextResponse.json(
        { error: 'Forbidden: Can only access your own stats' },
        { status: 403 }
      );
    }

    // Get user's notes count
    const totalNotes = await prisma.note.count({
      where: { authorClerkId: requestedUserId }
    });

    // Get total likes on user's notes
    const totalLikes = await prisma.like.count({
      where: {
        note: {
          authorClerkId: requestedUserId
        }
      }
    });

    // Get total comments on user's notes
    const totalComments = await prisma.comment.count({
      where: {
        note: {
          authorClerkId: requestedUserId
        }
      }
    });

    // Get additional stats
    const publishedNotes = await prisma.note.count({
      where: { 
        authorClerkId: requestedUserId,
        isPublic: true,
        isRejected: false
      }
    });

    const pendingNotes = await prisma.note.count({
      where: { 
        authorClerkId: requestedUserId,
        isPublic: false,
        isRejected: false
      }
    });

    const rejectedNotes = await prisma.note.count({
      where: { 
        authorClerkId: requestedUserId,
        isRejected: true
      }
    });

    // Get total downloads
    const totalDownloads = await prisma.note.aggregate({
      where: { authorClerkId: requestedUserId },
      _sum: {
        downloadCount: true
      }
    });

    return NextResponse.json({
      totalNotes,
      totalLikes,
      totalComments,
      publishedNotes,
      pendingNotes,
      rejectedNotes,
      totalDownloads: totalDownloads._sum.downloadCount || 0
    });
  } catch (error: unknown) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user statistics' },
      { status: 500 }
    );
  }
}
