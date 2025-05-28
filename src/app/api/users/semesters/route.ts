import { NextResponse } from 'next/server';
import { prisma as db } from '@/lib/db';

// GET all semesters in a simplified format for dropdowns
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const yearId = searchParams.get('yearId');
    
    const whereClause = yearId ? { yearId } : {};
    
    const semesters = await db.semester.findMany({
      where: whereClause,
      orderBy: { 
        number: 'asc' 
      },
      include: {
        year: {
          select: { number: true }
        }
      }
    });
    
    return NextResponse.json(semesters);
  } catch (error) {
    console.error("[SEMESTERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
