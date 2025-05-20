import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { isAdmin } from '@/lib/auth';

// GET a specific subject by ID
export async function GET(
  request: Request,
  { params }: { params: { subjid: string } }
) {
  try {
    const subjectId = params.subjid;
    
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        semester: {
          include: { 
            year: true 
          }
        },        notes: {
          where: { isPublic: true }, // Only include public/verified notes
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
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
        },
        _count: {
          select: { notes: true }
        }
      }
    });
    
    if (!subject) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ subject });
  } catch (error: unknown) {
    console.error('Error fetching subject:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subject' },
      { status: 500 }
    );
  }
}

// Update a subject
export async function PUT(
  request: Request,
  { params }: { params: { subjid: string } }
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
        { error: 'Forbidden: Only admins can update subjects' },
        { status: 403 }
      );
    }
    
    const subjectId = params.subjid;
    const { name, code, semesterId } = await request.json();
    
    // Validate input
    if (!name && !code && !semesterId) {
      return NextResponse.json(
        { error: 'At least one field to update is required' },
        { status: 400 }
      );
    }

    if (name !== undefined && typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Subject name must be a string' },
        { status: 400 }
      );
    }

    if (code !== undefined && typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Subject code must be a string' },
        { status: 400 }
      );
    }

    if (semesterId !== undefined && typeof semesterId !== 'string') {
      return NextResponse.json(
        { error: 'Semester ID must be a string' },
        { status: 400 }
      );
    }
    
    // Check if subject exists
    const existingSubject = await prisma.subject.findUnique({
      where: { id: subjectId }
    });
    
    if (!existingSubject) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      );
    }

    // If semesterId provided, check if semester exists
    if (semesterId) {
      const semester = await prisma.semester.findUnique({
        where: { id: semesterId }
      });
      
      if (!semester) {
        return NextResponse.json(
          { error: 'Semester not found' },
          { status: 404 }
        );
      }
    }
    
    // Check for duplicate subject code in the same semester
    if ((code || semesterId) && (code !== existingSubject.code || semesterId !== existingSubject.semesterId)) {
      const duplicateCheck = await prisma.subject.findUnique({
        where: {
          code_semesterId: {
            code: code || existingSubject.code,
            semesterId: semesterId || existingSubject.semesterId
          }
        }
      });
      
      if (duplicateCheck && duplicateCheck.id !== subjectId) {
        return NextResponse.json(
          { error: 'A subject with this code already exists for this semester' },
          { status: 409 }
        );
      }
    }
    
    // Update subject
    const updatedSubject = await prisma.subject.update({
      where: { id: subjectId },
      data: {
        ...(name !== undefined && { name }),
        ...(code !== undefined && { code }),
        ...(semesterId !== undefined && { semesterId })
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
      message: 'Subject updated successfully',
      subject: updatedSubject
    });
  } catch (error: unknown) {
    console.error('Error updating subject:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A subject with this code already exists for this semester' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update subject' },
      { status: 500 }
    );
  }
}

// Delete a subject
export async function DELETE(
  request: Request,
  { params }: { params: { subjid: string } }
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
        { error: 'Forbidden: Only admins can delete subjects' },
        { status: 403 }
      );
    }
    
    const subjectId = params.subjid;
    
    // Check if subject has associated notes
    const subjectWithNotes = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        _count: { select: { notes: true } }
      }
    });
    
    if (!subjectWithNotes) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      );
    }
    
    if (subjectWithNotes._count.notes > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete subject with associated notes',
          message: 'Please delete all notes in this subject first' 
        },
        { status: 400 }
      );
    }
    
    // Delete subject
    await prisma.subject.delete({
      where: { id: subjectId }
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error: unknown) {
    console.error('Error deleting subject:', error);
    return NextResponse.json(
      { error: 'Failed to delete subject' },
      { status: 500 }
    );
  }
}