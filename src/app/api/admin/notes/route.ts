import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';


// GET all notes (including non-public) for admin users
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
      // Skip admin verification - handled in frontend
    // This allows the API to be accessed if the user is logged in
      const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');
    const authorId = searchParams.get('authorId');
    const isPublic = searchParams.get('isPublic'); // Optional filter for public/private status
    const isRejected = searchParams.get('isRejected'); // Optional filter for rejected status
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const skip = (page - 1) * limit;
    
    // Build where clause for filtering
    let whereClause: any = {};
    
    if (subjectId) {
      whereClause.subjectId = subjectId;
    }
    
    if (authorId) {
      whereClause.authorClerkId = authorId;
    }
    
    if (isPublic !== null) {
      whereClause.isPublic = isPublic === 'true';
    }
    
    if (isRejected !== null) {
      whereClause.isRejected = isRejected === 'true';
    }
    
    // Get total count for pagination
    const totalCount = await prisma.note.count({
      where: whereClause
    });
    
    // Fetch notes with pagination
    const notes = await prisma.note.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
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
      notes,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        page,
        limit
      }
    });
  } catch (error: unknown) {
    console.error('Error fetching notes for admin:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' }, 
      { status: 500 }
    );
  }
}
