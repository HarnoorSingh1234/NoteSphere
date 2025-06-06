import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  context: { params: Promise<{ authorid: string }> }
) {
  try {
    const params = await context.params;
    const authorId = params.authorid;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    if (!authorId) {
      return NextResponse.json(
        { error: 'Author ID is required' },
        { status: 400 }
      );
    }    // Fetch author user data
    const author = await prisma.user.findUnique({
      where: { clerkId: authorId },
      include: {
        UserProfile: true
      }
    });

    if (!author) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }    // Check if profile is visible to others
    const isProfileVisible = author.UserProfile?.visibility !== false;

    // Get total count of author's notes
    const totalNotes = await prisma.note.count({
      where: { authorClerkId: authorId }
    });

    // Fetch author's notes with pagination
    const notes = await prisma.note.findMany({
      where: { authorClerkId: authorId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
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
    });    // Format author data based on visibility settings
    const authorData = {
      id: author.clerkId,
      firstName: author.firstName,
      lastName: author.lastName,
      email: isProfileVisible ? author.email : null,
      profile: isProfileVisible ? {
        bio: author.UserProfile?.bio || null,
        studentId: author.UserProfile?.studentId || null,
        department: author.UserProfile?.department || null,
        yearId: author.UserProfile?.yearId || null,
        semesterId: author.UserProfile?.semesterId || null,
        visibility: author.UserProfile?.visibility,
        profilePic: author.UserProfile?.profilePic || null
      } : null
    };

    return NextResponse.json({
      author: authorData,
      notes,
      pagination: {
        page,
        limit,
        total: totalNotes,
        totalPages: Math.ceil(totalNotes / limit)
      }
    });

  } catch (error: unknown) {
    console.error('Error fetching author data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch author data' },
      { status: 500 }
    );
  }
}
