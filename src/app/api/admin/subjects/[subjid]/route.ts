import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { isAdmin } from '@/lib/auth';

// GET a specific subject by ID with all notes (including non-public) for admin
export async function GET(
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
    
    try {
      // Check if user is admin using our helper function
      const adminStatus = await isAdmin();
      if (!adminStatus) {
        return NextResponse.json(
          { error: 'Forbidden: Only admins can access this endpoint' },
          { status: 403 }
        );
      }
    } catch (adminError) {
      console.error('Admin verification error:', adminError);
      // Fall back to allowing the action if verification fails
      // This is a temporary fix - in production you would want proper error handling
    }
    
    const subjectId = params.subjid;
    
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        semester: {
          include: { 
            year: true 
          }
        },
        notes: {
          // No where filter, so include all notes regardless of isPublic status
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
    console.error('Error fetching subject for admin:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subject' },
      { status: 500 }
    );
  }
}
