import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// GET user's recent notes
export async function GET(
  request: Request,
  context: { params: Promise<{ userid: string }> }
) {
  try {
    const { userId } = await auth();
    const params = await context.params;
    const requestedUserId = params.userid;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Users can only access their own notes (or admin can access any)
    if (userId !== requestedUserId) {
      return NextResponse.json(
        { error: 'Forbidden: Can only access your own notes' },
        { status: 403 }
      );
    }

    // Get user's recent notes
    const recentNotes = await prisma.note.findMany({
      where: { authorClerkId: requestedUserId },
      orderBy: { createdAt: 'desc' },
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
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    return NextResponse.json({ notes: recentNotes });
  } catch (error: unknown) {
    console.error('Error fetching user notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user notes' },
      { status: 500 }
    );
  }
}
