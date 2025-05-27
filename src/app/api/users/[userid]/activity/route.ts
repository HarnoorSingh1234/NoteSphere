import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// GET user's recent activity (likes, comments, etc.)
export async function GET(
  request: Request,
  context: { params: Promise<{ userid: string }> }
) {
  try {
    const { userId } = await auth();
    const params = await context.params;
    const requestedUserId = params.userid;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Users can only access their own activity (or admin can access any)
    if (userId !== requestedUserId) {
      return NextResponse.json(
        { error: 'Forbidden: Can only access your own activity' },
        { status: 403 }
      );
    }

    // Get recent likes on user's notes
    const recentLikes = await prisma.like.findMany({
      where: {
        note: {
          authorClerkId: requestedUserId
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        note: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    // Get recent comments on user's notes
    const recentComments = await prisma.comment.findMany({
      where: {
        note: {
          authorClerkId: requestedUserId
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        note: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });    // Combine and sort activities by timestamp
    const activities = [
      ...recentLikes.map(like => ({
        type: 'like',
        id: like.id,
        createdAt: like.createdAt,
        user: like.user,
        note: like.note,
        content: `${like.user.firstName} ${like.user.lastName} liked your note "${like.note?.title || 'Unknown Note'}"`
      })),
      ...recentComments.map(comment => ({
        type: 'comment',
        id: comment.id,
        createdAt: comment.createdAt,
        user: comment.user,
        note: comment.note,
        content: `${comment.user.firstName} ${comment.user.lastName} commented on your note "${comment.note?.title || 'Unknown Note'}"`
      }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
     .slice(0, limit);

    return NextResponse.json({ activities });
  } catch (error: unknown) {
    console.error('Error fetching user activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user activity' },
      { status: 500 }
    );
  }
}
