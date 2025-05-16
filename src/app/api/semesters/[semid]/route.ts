import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { isAdmin } from '@/lib/auth';

// GET a specific semester by ID
export async function GET(
  request: Request,
  { params }: { params: { semid: string } }
) {
  try {
    const semesterId = params.semid;
    
    const semester = await prisma.semester.findUnique({
      where: { id: semesterId },
      include: {
        year: true,
        subjects: {
          orderBy: { name: 'asc' }
        },
        _count: {
          select: { subjects: true }
        }
      }
    });
    
    if (!semester) {
      return NextResponse.json(
        { error: 'Semester not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ semester });
  } catch (error: unknown) {
    console.error('Error fetching semester:', error);
    return NextResponse.json(
      { error: 'Failed to fetch semester' },
      { status: 500 }
    );
  }
}

// Update a semester
export async function PUT(
  request: Request,
  { params }: { params: { semid: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user is admin using our helper function
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins can update semesters' },
        { status: 403 }
      );
    }
    
    const semesterId = params.semid;
    const { number, yearId } = await request.json();
    
    // Validate input
    if (!number && !yearId) {
      return NextResponse.json(
        { error: 'At least one field to update is required' },
        { status: 400 }
      );
    }

    if (number !== undefined && (typeof number !== 'number' || number <= 0)) {
      return NextResponse.json(
        { error: 'Semester number must be a positive number' },
        { status: 400 }
      );
    }

    if (yearId !== undefined && typeof yearId !== 'string') {
      return NextResponse.json(
        { error: 'Year ID must be a string' },
        { status: 400 }
      );
    }
    
    // Check if semester exists
    const existingSemester = await prisma.semester.findUnique({
      where: { id: semesterId }
    });
    
    if (!existingSemester) {
      return NextResponse.json(
        { error: 'Semester not found' },
        { status: 404 }
      );
    }

    // If yearId provided, check if year exists
    if (yearId) {
      const year = await prisma.year.findUnique({
        where: { id: yearId }
      });
      
      if (!year) {
        return NextResponse.json(
          { error: 'Year not found' },
          { status: 404 }
        );
      }
    }
    
    // Check for duplicate semester in the same year
    if (number || yearId) {
      const duplicateCheck = await prisma.semester.findUnique({
        where: {
          number_yearId: {
            number: number || existingSemester.number,
            yearId: yearId || existingSemester.yearId
          }
        }
      });
      
      if (duplicateCheck && duplicateCheck.id !== semesterId) {
        return NextResponse.json(
          { error: 'A semester with this number already exists for this year' },
          { status: 409 }
        );
      }
    }
    
    // Update semester
    const updatedSemester = await prisma.semester.update({
      where: { id: semesterId },
      data: {
        ...(number !== undefined && { number }),
        ...(yearId !== undefined && { yearId })
      },
      include: {
        year: true
      }
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Semester updated successfully',
      semester: updatedSemester
    });
  } catch (error: unknown) {
    console.error('Error updating semester:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A semester with this number already exists for this year' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update semester' },
      { status: 500 }
    );
  }
}

// Delete a semester
export async function DELETE(
  request: Request,
  { params }: { params: { semid: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user is admin using our helper function
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins can delete semesters' },
        { status: 403 }
      );
    }
    
    const semesterId = params.semid;
    
    // Check if semester has associated subjects
    const semesterWithSubjects = await prisma.semester.findUnique({
      where: { id: semesterId },
      include: {
        _count: { select: { subjects: true } }
      }
    });
    
    if (!semesterWithSubjects) {
      return NextResponse.json(
        { error: 'Semester not found' },
        { status: 404 }
      );
    }
    
    if (semesterWithSubjects._count.subjects > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete semester with associated subjects',
          message: 'Please delete all subjects in this semester first' 
        },
        { status: 400 }
      );
    }
    
    // Delete semester
    await prisma.semester.delete({
      where: { id: semesterId }
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Semester deleted successfully'
    });
  } catch (error: unknown) {
    console.error('Error deleting semester:', error);
    return NextResponse.json(
      { error: 'Failed to delete semester' },
      { status: 500 }
    );
  }
}