'use server';

import { prisma } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

/**
 * Fetch a specific subject by ID with all its notes for admin view
 * This includes both public and non-public notes
 */
export async function fetchAdminSubject(subjectId: string) {
  try {
    // Ensure the user is an admin
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      throw new Error('Forbidden: Only admins can perform this action');
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
