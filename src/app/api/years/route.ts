import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET all years
export async function GET() {
  try {
    const years = await prisma.year.findMany({
      orderBy: { number: 'asc' },
      include: {
        _count: {
          select: { semesters: true }
        }
      }
    });
    
    return NextResponse.json({ years });
  } catch (error) {
    console.error('Error fetching years:', error);
    return NextResponse.json(
      { error: 'Failed to fetch years' }, 
      { status: 500 }
    );
  }
}

// Create a new year
export async function POST(request: Request) {
  try {
    const { number } = await request.json();
    
    if (!number || typeof number !== 'number') {
      return NextResponse.json(
        { error: 'Year number is required and must be a number' },
        { status: 400 }
      );
    }
    
    // Check if year already exists since we have a unique constraint
    const existingYear = await prisma.year.findUnique({
      where: { number }
    });
    
    if (existingYear) {
      return NextResponse.json(
        { error: 'A year with this number already exists' },
        { status: 409 }
      );
    }
    
    // Create the year
    const year = await prisma.year.create({
      data: { number }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: `Year ${number} created successfully`,
      year 
    });  } catch (error: unknown) {
    console.error('Error creating year:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') { // Prisma unique constraint violation code
      return NextResponse.json(
        { error: 'A year with this number already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create year' },
      { status: 500 }
    );
  }
}