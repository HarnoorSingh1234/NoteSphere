import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

/**
 * GET - Retrieve dashboard statistics for admin
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
   
    // Total notes count
    const totalNotes = await prisma.note.count();
    
    // Approved (public) notes
    const approvedNotes = await prisma.note.count({
      where: { isPublic: true }
    });
    
    // Pending notes count
    const pendingNotes = await prisma.note.count({
      where: { 
        isPublic: false,
        isRejected: false
      }
    });
    
    // Total users count
    const totalUsers = await prisma.user.count();
    
    // Mock active users count (in a real app, this would come from Clerk or a session store)
    const activeUsers = Math.floor(totalUsers * 0.3); // Mock 30% of users as active
    
    return NextResponse.json({
      totalNotes,
      approvedNotes,
      pendingNotes,
      totalUsers,
      activeUsers
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}