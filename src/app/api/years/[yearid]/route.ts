import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Get a specific year by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const yearId = params.id;
    
    const year = await prisma.year.findUnique({
      where: { id: yearId },
      include: {
        semesters: {
          orderBy: { number: 'asc' }
        },
        _count: {
          select: { semesters: true }
        }
      }
    });
    
    if (!year) {
      return NextResponse.json(
        { error: 'Year not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ year });
  } catch (error) {
    console.error('Error fetching year:', error);
    return NextResponse.json(
      { error: 'Failed to fetch year' },
      { status: 500 }
    );
  }
}

// Update a year
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const yearId = params.id;
    const { number } = await request.json();
    
    if (!number || typeof number !== 'number') {
      return NextResponse.json(
        { error: 'Year number is required and must be a number' },
        { status: 400 }
      );
    }
    
    // Check if another year with this number exists
    const existingYear = await prisma.year.findFirst({
      where: { 
        number,
        id: { not: yearId }
      }
    });
    
    if (existingYear) {
      return NextResponse.json(
        { error: 'Another year with this number already exists' },
        { status: 409 }
      );
    }
    
    // Update the year
    const updatedYear = await prisma.year.update({
      where: { id: yearId },
      data: { number }
    });
    
    return NextResponse.json({ 
      success: true,
      message: `Year updated to ${number} successfully`,
      year: updatedYear
    });
  } catch (error) {
    console.error('Error updating year:', error);
    return NextResponse.json(
      { error: 'Failed to update year' },
      { status: 500 }
    );
  }
}

// Delete a year
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const yearId = params.id;
    
    // Check if year has associated semesters
    const yearWithSemesters = await prisma.year.findUnique({
      where: { id: yearId },
      include: {
        _count: { select: { semesters: true } }
      }
    });
    
    if (!yearWithSemesters) {
      return NextResponse.json(
        { error: 'Year not found' },
        { status: 404 }
      );
    }
    
    if (yearWithSemesters._count.semesters > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete year with associated semesters',
          message: 'Please delete all semesters in this year first' 
        },
        { status: 400 }
      );
    }
    
    // Delete the year
    await prisma.year.delete({
      where: { id: yearId }
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Year deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting year:', error);
    return NextResponse.json(
      { error: 'Failed to delete year' },
      { status: 500 }
    );
  }
}