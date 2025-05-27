import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { isAdmin } from '@/lib/auth';

// GET all semesters (with optional filter by yearId)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const yearId = searchParams.get('yearId');
    
    const whereClause = yearId ? { yearId } : {};
    
    const semesters = await prisma.semester.findMany({
      where: whereClause,
      orderBy: { 
        number: 'asc' 
      },
      include: {
        year: true,
        _count: {
          select: { subjects: true }
        }
      }
    });
    
    return NextResponse.json({ semesters });
  } catch (error: unknown) {
    console.error('Error fetching semesters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch semesters' }, 
      { status: 500 }
    );
  }
}

// Create a new semester
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
   

    const { number, yearId } = await request.json();
    
    // Validate input
    if (!number || typeof number !== 'number') {
      return NextResponse.json(
        { error: 'Semester number is required and must be a number' },
        { status: 400 }
      );
    }

    if (!yearId || typeof yearId !== 'string') {
      return NextResponse.json(
        { error: 'Year ID is required' },
        { status: 400 }
      );
    }
    
    // Check if year exists
    const year = await prisma.year.findUnique({
      where: { id: yearId }
    });
    
    if (!year) {
      return NextResponse.json(
        { error: 'Year not found' },
        { status: 404 }
      );
    }
    
    // Check if semester already exists for this year
    const existingSemester = await prisma.semester.findUnique({
      where: {
        number_yearId: {
          number,
          yearId
        }
      }
    });
    
    if (existingSemester) {
      return NextResponse.json(
        { error: 'A semester with this number already exists for this year' },
        { status: 409 }
      );
    }
    
    // Create semester
    const semester = await prisma.semester.create({
      data: { 
        number,
        yearId
      },
      include: {
        year: true
      }
    });
    
    return NextResponse.json({ 
      success: true,
      message: `Semester ${number} for Year ${year.number} created successfully`,
      semester
    });
  } catch (error: unknown) {
    console.error('Error creating semester:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A semester with this number already exists for this year' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create semester' },
      { status: 500 }
    );
  }
}