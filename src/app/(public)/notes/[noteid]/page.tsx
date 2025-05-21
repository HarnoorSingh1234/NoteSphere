import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { NoteType } from '@prisma/client';
import { FileSymlink } from 'lucide-react';
import Link from 'next/link';
import NoteDetailsClient from '@/components/subjects/NoteDetailsClient';
import BackButton from '@/components/Backbutton'; // We'll create this component

// Correct type definition for the page props
interface PageProps {
  params: {
    noteid: string;
  };
  searchParams?: Record<string, string | string[] | undefined>;
}
export default async function NotePage({
  params,
  searchParams,
}: {
  params: { noteid: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  if (!params.noteid) notFound();
  // Fetch note with related data
  const note = await prisma.note.findUnique({
    where: { 
      id: params.noteid,
      isPublic: true,    // Ensure note is public
      isRejected: false, // Ensure note is not rejected
    },
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
      tags: true,
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
        return { color: '#264143', bgColor: '#F8F5F2' };
    }
  };
  
  // Fetch similar notes from the same subject (limited to 3)
  const similarNotes = await prisma.note.findMany({
    where: {
      subjectId: note.subjectId,
      id: { not: note.id },
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
    take: 3,
  });
  
  const { color, bgColor } = getNoteTypeDetails(note.type);
  
  // Add the authorId property to match the Note type expected by NoteDetailsClient
  const noteWithAuthorId = {
    ...note,
    authorId: note.author?.clerkId || '' // Use author's clerk ID if available, otherwise empty string
  };
  
  return (
    <div className="min-h-screen bg-[#F8F5F2] py-6 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-6">
          <BackButton subjectName={note.subject?.name || 'Subject'} />
        </div>
        
        <NoteDetailsClient note={noteWithAuthorId} color={color} bgColor={bgColor} />
        
        {/* Display tags if available */}
        {note.tags && note.tags.length > 0 && (
          <div className="mt-6 bg-white border-[0.15em] border-[#264143] rounded-[0.6em] p-5 shadow-[0.2em_0.2em_0_#DE5499]">
            <h3 className="text-lg font-bold text-[#264143] mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag: any) => (
                <span 
                  key={tag.id} 
                  className="px-3 py-1 bg-[#EDDCD9] text-[#264143] rounded-full text-sm font-medium"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      
        {/* Rest of your component... */}
        {/* Recommended Related Materials */}
        {note.subject && (
          <div className="mt-8 bg-white border-[0.15em] border-[#264143] rounded-[0.6em] p-6 shadow-[0.3em_0.3em_0_#4CAF50]">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#4CAF50]/10 p-2 rounded-full">
                <FileSymlink className="w-5 h-5 text-[#4CAF50]" />
              </div>
              <h2 className="text-xl font-bold text-[#264143]">Related Resources</h2>
            </div>
            <p className="text-[#264143]/80 mb-5">
              Explore more study materials from {note.subject.name}
            </p>
            <Link
              href={`/academics/subjects/${note.subjectId}`}
              className="inline-flex items-center px-5 py-2.5 bg-[#F8F5F2] text-[#264143] font-medium rounded-[0.4em] border-[0.15em] border-[#264143] hover:bg-[#EDDCD9] hover:translate-y-[-0.1em] transition-all duration-200 shadow-[0.1em_0.1em_0_#264143] hover:shadow-[0.2em_0.2em_0_#264143]"
            >
              <FileSymlink className="w-4 h-4 mr-2" />
              View All Subject Materials
            </Link>
          </div>
        )}
        
        {/* Similar Notes */}
        {similarNotes.length > 0 && (
          <div className="mt-8 bg-white border-[0.15em] border-[#264143] rounded-[0.6em] p-6 shadow-[0.3em_0.3em_0_#4d61ff]">
            <h2 className="text-xl font-bold text-[#264143] mb-5">Similar Notes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {similarNotes.map((similarNote) => (
                <Link 
                  key={similarNote.id}
                  href={`/notes/${similarNote.id}`}
                  className="flex items-start p-3 bg-[#F8F5F2] rounded-lg hover:bg-[#EDDCD9]/50 transition-colors"
                >
                  <div className="bg-white p-2 rounded-md shadow-md mr-3">
                    <FileSymlink className="w-5 h-5 text-[#DE5499]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#264143] line-clamp-1">{similarNote.title}</h3>
                    <p className="text-xs text-[#264143]/70">
                      {similarNote.author.firstName} {similarNote.author.lastName} • {similarNote._count.likes} likes
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}