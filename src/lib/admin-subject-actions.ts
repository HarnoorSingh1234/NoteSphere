'use server';

import { prisma } from '@/lib/db';
import { auth, User } from '@clerk/nextjs/server';

/**
 * Fetch a specific subject by ID with all its notes for admin view
 * This includes both public and non-public notes
 */
export async function fetchAdminSubject(subjectId: string) {
  try {
 
    const { userId } = await auth();
    if (!userId) {
      throw new Error('Unauthorized: Authentication required');
    }
    // Fetch the user to check if they are an admin
    const userRecord = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true }
    });
    if (!userRecord || userRecord.role !== 'ADMIN') {
      throw new Error('Forbidden: Admin access required');  
    }
 
  
    
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
      throw new Error('Subject not found');
    }
    
    return subject;
  } catch (error) {
    console.error('Error fetching subject for admin:', error);
    throw new Error('Failed to fetch subject');
  }
}
