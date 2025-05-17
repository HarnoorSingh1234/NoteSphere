import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { isAdmin } from '@/lib/auth';

// GET all notes with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');
    const authorId = searchParams.get('authorId');
    const verified = searchParams.get('verified');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const skip = (page - 1) * limit;
    




    let whereClause: any = {};
    
    if (subjectId) {
      whereClause.subjectId = subjectId;
    }
    
    if (authorId) {
      whereClause.authorId = authorId;
    }
    
    if (verified !== null) {
      whereClause.verified = verified === 'true';
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
        },        author: {
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
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' }, 
      { status: 500 }
    );
  }
}

// Create a new note
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    let title: string;
    let description: string = '';
    let subjectId: string;
    let noteType: string;
    let fileUrl: string;
    let driveFileId: string;
    
    // Check content type to handle both JSON and FormData
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      console.log('Processing JSON request for note creation');
      // Handle JSON data
      const jsonData = await request.json();
      title = jsonData.title;
      description = jsonData.content || '';
      subjectId = jsonData.subjectId;
      noteType = jsonData.type || 'PDF';
      fileUrl = jsonData.fileUrl;
      driveFileId = jsonData.driveFileId;
    } else {
      console.log('Processing FormData request for note creation');
      // Use formData to handle file uploads
      const formData = await request.formData();
      
      // Extract note metadata from form
      title = formData.get('title') as string;
      description = formData.get('description') as string;
      subjectId = formData.get('subjectId') as string;
      noteType = formData.get('noteType') as string;
      fileUrl = formData.get('fileUrl') as string; // URL to stored file (from upload endpoint)
      driveFileId = formData.get('driveFileId') as string; // Google Drive file ID
    }
    
    // Validate required fields
    if (!title || !subjectId || !fileUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: title, subjectId, and fileUrl are required' },
        { status: 400 }
      );
    }
    
    // Check if subject exists
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        semester: {
          include: {
            year: true
          }
        }
      }
    });
    
    if (!subject) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      );
    }
    // Determine if note should be auto-verified (admins' notes are auto-verified)
    const isUserAdmin = await isAdmin();
    const autoVerified = isUserAdmin;
      // Log the data we're about to use to create the note
    console.log('Creating note with data:', {
      title,
      content: description || '',
      fileUrl,
      driveFileId,
      type: noteType || 'LECTURE',
      isPublic: autoVerified,
      subjectId,
      authorId: user.clerkId
    });
    
    // Create note
    const note = await prisma.note.create({
      data: {
        title,
        content: description || '',
        fileUrl,
        driveFileId, // Add Google Drive file ID
        type: (noteType as any) || 'LECTURE',
        isPublic: autoVerified,
        subjectId,
        authorClerkId: user.clerkId
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
        },        author: {
          select: {
            clerkId: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
      return NextResponse.json({
      success: true,
      message: autoVerified 
        ? 'Note created and published successfully' 
        : 'Note created successfully and pending verification',
      note
    });
  } catch (error: unknown) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}