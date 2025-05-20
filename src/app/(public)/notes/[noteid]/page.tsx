import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { NoteType } from '@prisma/client';
import NoteDetailsClient from '@/components/subjects/NoteDetailsClient';

// Fetch note data
export async function generateMetadata({ params }: { params: { id: string } }) {
  const note = await prisma.note.findUnique({
    where: { id: params.id },
    include: {
      author: true,
      subject: true,
    },
  });

  if (!note) {
    return { title: 'Note not found' };
  }

  return {
    title: `${note.title} | NoteSphere`,
    description: note.content || `${note.type} notes for ${note.subject.name}`,
  };
}

export default async function NotePage({ params }: { params: { id: string } }) {
  // Fetch note with related data
  const note = await prisma.note.findUnique({
    where: { id: params.id },
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
    notFound();  }

  // Function to determine note icon and color based on type
  const getNoteTypeDetails = (type: NoteType) => {
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
        return { color: '#050505', bgColor: '#050505/10' };
    }
  };
  
  const { color, bgColor } = getNoteTypeDetails(note.type);
  
  // Add the authorId property to match the Note type expected by NoteDetailsClient
  const noteWithAuthorId = {
    ...note,
    authorId: note.author?.clerkId || '' // Use author's clerk ID if available, otherwise empty string
  };
  
  return <NoteDetailsClient note={noteWithAuthorId} color={color} bgColor={bgColor} />;
}
