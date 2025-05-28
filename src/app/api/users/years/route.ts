import { NextResponse } from 'next/server';
import { prisma as db } from '@/lib/db';

// GET all years in a simplified format for dropdowns
export async function GET() {
  try {
    const years = await db.year.findMany({
      orderBy: { number: 'asc' },
      include: {
        _count: {
          select: { semesters: true }
        }
      }
    });
    
    return NextResponse.json(years);
  } catch (error) {
    console.error("[YEARS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
