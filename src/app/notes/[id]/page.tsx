import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { FileText, ThumbsUp, MessageCircle, Clock, User, Download } from 'lucide-react';
import DownloadButton from '@/components/subjects/DownloadButton';
import { NoteType } from '@prisma/client';

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
        return { color: '#050505', bgColor: '#050505/10' };
    }
  };
  
  const { color, bgColor } = getNoteTypeDetails(note.type);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white border-[0.15em] border-[#050505] rounded-[0.8em] shadow-[0.4em_0.4em_0_#E99F4C]">
        {/* Header */}
        <div className="p-6 border-b-[0.15em] border-[#050505]">
          <div className="flex flex-wrap gap-4 items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#050505] mb-2">{note.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#050505]/70">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{note.author.firstName} {note.author.lastName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="inline-flex items-center px-3 py-1 border-[0.15em] border-[#050505] rounded-full text-sm font-semibold" 
                 style={{ color, backgroundColor: bgColor }}>
              {note.type}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 border-b-[0.15em] border-[#050505]">
          {note.content ? (
            <div className="prose max-w-none">
              <p>{note.content}</p>
            </div>
          ) : (
            <div className="text-[#050505]/70">No additional content for these notes.</div>
          )}
        </div>
        
        {/* Stats and Actions */}
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div className="flex items-center gap-6 text-[#050505]/70">
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-5 h-5" />
                <span>{note._count.likes}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span>{note._count.comments}</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span>{note.downloadCount}</span>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-[#050505]/70 mb-1">
                Subject: <span className="font-semibold">{note.subject.name} ({note.subject.code})</span>
              </div>
              <div className="text-sm text-[#050505]/70">
                Year {note.subject.semester.year.number}, Semester {note.subject.semester.number}
              </div>
            </div>
          </div>
            {/* Download Button */}
          <div>
            <DownloadButton noteId={note.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
