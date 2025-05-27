import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { isAdmin } from '@/lib/auth';

// GET all subjects (with optional filter by semesterId or yearId)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const semesterId = searchParams.get('semesterId');
    const yearId = searchParams.get('yearId');
    
    let whereClause = {};
    
    if (semesterId) {
      whereClause = { semesterId };
    } else if (yearId) {
      whereClause = {
        semester: {
          yearId
        }
      };
    }
    
    const subjects = await prisma.subject.findMany({
      where: whereClause,
      orderBy: [
        { semester: { number: 'asc' } },
        { name: 'asc' }
      ],
      include: {
        semester: {
          include: {
            year: true
          }
        },
        _count: {
          select: { notes: true }
        }
      }
    });
    
    return NextResponse.json({ subjects });
  } catch (error: unknown) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subjects' }, 
      { status: 500 }
    );
  }
}

// Create a new subject
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
 
    const { name, code, semesterId } = await request.json();
    
    // Validate input
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Subject name is required and must be a string' },
        { status: 400 }
      );
    }

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Subject code is required and must be a string' },
        { status: 400 }
      );
    }

    if (!semesterId || typeof semesterId !== 'string') {
      return NextResponse.json(
        { error: 'Semester ID is required' },
        { status: 400 }
      );
    }
    
    // Check if semester exists
    const semester = await prisma.semester.findUnique({
      where: { id: semesterId },
      include: { year: true }
    });
    
    if (!semester) {
      return NextResponse.json(
        { error: 'Semester not found' },
        { status: 404 }
      );
    }
    
    // Check if subject code already exists in this semester
    const existingSubject = await prisma.subject.findUnique({
      where: {
        code_semesterId: {
          code,
          semesterId
        }
      }
    });
    
    if (existingSubject) {
      return NextResponse.json(
        { error: 'A subject with this code already exists for this semester' },
        { status: 409 }
      );
    }
    
    // Create subject
    const subject = await prisma.subject.create({
      data: { 
        name,
        code,
        semesterId
      },
      include: {
        semester: {
          include: {
            year: true
          }
        }
      }
    });
    
    return NextResponse.json({ 
      success: true,
      message: `Subject '${name}' (${code}) created successfully for Year ${semester.year.number}, Semester ${semester.number}`,
      subject
    });
    
  } catch (error: unknown) {
    console.error('Error creating subject:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A subject with this code already exists for this semester' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create subject' },
      { status: 500 }
    );
  }
}