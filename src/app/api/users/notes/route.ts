import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

/**
 * API route to get a user's own notes
 * Accessible by authenticated users to see their own notes
 */
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Optional filters
    const isPublic = searchParams.get('isPublic');
    const isRejected = searchParams.get('isRejected');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const skip = (page - 1) * limit;
    
    // Build where clause for filtering
    let whereClause: any = {
      authorClerkId: userId // Only show the user's own notes
    };
    
    if (isPublic !== null) {
      whereClause.isPublic = isPublic === 'true';
    }
    
    if (isRejected !== null) {
      whereClause.isRejected = isRejected === 'true';
    }
    
    // Fetch notes with related data
    const notes = await prisma.note.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
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

    // Get total count for pagination
    const totalCount = await prisma.note.count({
      where: whereClause
    });
    
    return NextResponse.json({
      notes,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        page,
        limit
      }
    });
  } catch (error: unknown) {
    console.error('Error fetching user notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}
