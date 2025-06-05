import { prisma } from '@/lib/db';
import { NoteType } from '@prisma/client';

/**
 * Get a public note by ID with related data
 */
export async function getPublicNoteById(noteId: string) {
  const note = await prisma.note.findUnique({
    where: { 
      id: noteId,
      isPublic: true,
      isRejected: false,
    },
    include: {      author: true,
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
    return null;
  }

  // Add the authorId property to match the Note type expected by NoteDetailsClient
  return {
    ...note,
    authorId: note.author?.clerkId || '' // Use author's clerk ID if available, otherwise empty string
  };
}

/**
 * Get similar notes from the same subject
 */
export async function getSimilarNotes(subjectId: string, currentNoteId: string, limit: number = 3) {
  return prisma.note.findMany({
    where: {
      subjectId,
      id: { not: currentNoteId },
      isPublic: true,
      isRejected: false,
    },
    include: {
      author: true,
      _count: {
        select: { likes: true, comments: true }
      }
    },
    orderBy: { downloadCount: 'desc' },
    take: limit,
  });
}

/**
 * Get style details based on note type
 */
export function getNoteTypeDetails(type: NoteType) {
  switch(type) {
    case 'PDF':
      return { color: '#ff3e00', bgColor: '#ff3e00/10' };
    case 'PPT':
      return { color: '#E99F4C', bgColor: '#E99F4C/10' };
    case 'LECTURE':
      return { color: '#4d61ff', bgColor: '#4d61ff/10' };
    case 'HANDWRITTEN':
      return { color: '#DE5499', bgColor: '#DE5499/10' };
    default:
      return { color: '#264143', bgColor: '#F8F5F2' };
  }
}
