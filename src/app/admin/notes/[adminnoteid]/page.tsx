import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { NoteType } from '@prisma/client';
import AdminNoteClient from '@/components/admin/AdminNoteClient';

export default async function AdminNotePage({ params }: { params: { adminnoteid: string } }) {
  // Fetch note with related data
  const note = await prisma.note.findUnique({
    where: { id: params.adminnoteid },
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
  
  // Add missing name property to semester
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
    // Pass the data to a client component
  return <AdminNoteClient note={noteWithNames} />;

}
