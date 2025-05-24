'use server';

import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

/**
 * Fetch a note by ID with all related data for admin view
 */
export async function getAdminNoteById(noteId: string) {
  try {
    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: {
        author: true,
        subject: {
          include: {
            semester: {
              include: {
                year: true,
              },
            },
          },
        },
        _count: {
          select: { 
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!note) {
      notFound();
    }
    
    // Add missing name property to semester and year
    const noteWithNames = {
      ...note,
      subject: {
        ...note.subject,
        semester: {
          ...note.subject.semester,
          name: `Semester ${note.subject.semester.number}`, // Add name property
          year: {
            ...note.subject.semester.year,
            name: `Year ${note.subject.semester.year.number}` // Add name property
          }
        }
      }
    };

    return noteWithNames;
  } catch (error) {
    console.error('Error fetching admin note:', error);
    throw new Error('Failed to fetch note');
  }
}
