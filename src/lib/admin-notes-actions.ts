'use server';

import { prisma } from '@/lib/db';
import { Year, Semester, Subject, Note } from '@/types';

/**
 * Fetch all academic years with their semesters, subjects, and notes for admin view
 */
export async function fetchAdminAcademicStructure(): Promise<Year[]> {
  try {
    const years = await prisma.year.findMany({
      orderBy: {
        number: 'asc',
      },
      include: {
        semesters: {
          orderBy: {
            number: 'asc',
          },
          include: {
            subjects: {
              orderBy: {
                name: 'asc',
              },
              include: {
                notes: {
                  include: {
                    author: true,
                    _count: {
                      select: {
                        likes: true,
                        comments: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    
    // Create a clean array that matches Year[] structure
    const result: Year[] = [];
    
    for (const year of years) {
      // Create a new Year object
      const newYear: Year = {
        id: year.id,
        number: year.number,
        semesters: []
      };
      
      // Add semesters to the year
      for (const semester of year.semesters) {
        // Create a new Semester object
        const newSemester: Semester = {
          id: semester.id,
          number: semester.number,
          yearId: semester.yearId,
          year: newYear, // Set the parent reference
          subjects: []
        };
        
        // Add subjects to the semester
        for (const subject of semester.subjects) {          // Create a new Subject object
          const newSubject: Subject = {
            id: subject.id,
            name: subject.name,
            code: subject.code,
            semesterId: subject.semesterId,
            semester: newSemester, // Set the parent reference
            notes: subject.notes.map(note => {              // Convert Prisma Note data structure to our TypeScript Note type
              // Type assertion to handle the discrepancy between authorClerkId in Prisma and authorId in TypeScript
              const noteWithFixedProps = {
                id: note.id,
                title: note.title,
                content: note.content,
                type: note.type as string,
                fileUrl: note.fileUrl,
                driveFileId: note.driveFileId || undefined,
                downloadCount: note.downloadCount,
                isPublic: note.isPublic,
                isRejected: note.isRejected,
                rejectedAt: note.rejectedAt || undefined,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt,
                authorId: note.authorClerkId, // Map authorClerkId to authorId
                subjectId: note.subjectId,
                author: {
                  firstName: note.author.firstName,
                  lastName: note.author.lastName,
                  email: note.author.email
                },
                subject: undefined, // Will be set later to avoid circular reference
                likes: [],
                comments: [],
                tags: [],
                _count: note._count
              };
              
              return noteWithFixedProps as unknown as Note;
            })
          };
          
          newSemester.subjects.push(newSubject);
        }
        
        newYear.semesters.push(newSemester);
      }
      
      result.push(newYear);
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching admin academic structure:', error);
    throw new Error('Failed to fetch academic structure');
  }
}

/**
 * Fetch stats about notes for admin dashboard
 */
export async function fetchAdminNotesStats() {
  try {
    // Get total notes count
    const total = await prisma.note.count();
    
    // Get approved notes count (public)
    const approved = await prisma.note.count({
      where: {
        isPublic: true,
      },
    });

    // Get pending notes count (not public and not rejected)
    const pending = await prisma.note.count({
      where: {
        isPublic: false,
        isRejected: false,
      },
    });

    // Get rejected notes count
    const rejected = await prisma.note.count({
      where: {
        isRejected: true,      },
    });
    
    return {
      total,
      approved,
      pending,
      rejected,
    };
  } catch (error) {
    console.error('Error fetching admin notes stats:', error);
    throw new Error('Failed to fetch notes stats');
  }
}

/**
 * Delete a note by ID
 */
export async function deleteNote(noteId: string) {
  try {
    // First check if the note exists
    const note = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!note) {
      throw new Error('Note not found');
    }

    // Delete all related records first
    await prisma.$transaction([
      // Delete likes
      prisma.like.deleteMany({
        where: { noteId },
      }),
      // Delete comments
      prisma.comment.deleteMany({
        where: { noteId },
      }),
      // Delete note
      prisma.note.delete({
        where: { id: noteId },
      }),
    ]);

    return { success: true, message: 'Note deleted successfully' };
  } catch (error) {
    console.error('Error deleting note:', error);
    throw new Error('Failed to delete note');
  }
}
