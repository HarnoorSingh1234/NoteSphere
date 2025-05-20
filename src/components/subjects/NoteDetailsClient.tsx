'use client';

import React from 'react';
import { ThumbsUp, Clock, User as UserIcon, Download, MessageCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Note as PrismaNote, User as PrismaUser, Subject as PrismaSubject, Semester as PrismaSemester, Year as PrismaYear, NoteType } from '@prisma/client';
import DownloadButton from '@/components/subjects/DownloadButton';

const LikeButton = dynamic(() => import('@/components/subjects/LikeButton'), { ssr: false });
const CommentSection = dynamic(() => import('@/components/subjects/CommentSection'), { ssr: false });

// Extended Note type with author, subject, and _count relationships
interface Note extends PrismaNote {
  author: PrismaUser;
  subject: PrismaSubject & {
    semester: PrismaSemester & {
      year: PrismaYear;
    };
  };
  _count?: {
    likes: number;
    comments: number;
  };
}

interface NoteDetailsProps {
  note: Note;
  color: string;
  bgColor: string;
}

export default function NoteDetails({ note, color, bgColor }: NoteDetailsProps) {
  return (
    <div className="container mx-auto py-6 md:py-8 px-3 md:px-4 max-w-4xl">
      <div className="bg-white border-[0.15em] border-[#050505] rounded-[0.6em] md:rounded-[0.8em] shadow-[0.2em_0.2em_0_#E99F4C] md:shadow-[0.4em_0.4em_0_#E99F4C] transition-all">
        {/* Header */}
        <div className="p-4 md:p-6 border-b-[0.15em] border-[#050505]">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 md:gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#050505] mb-2 break-words">{note.title}</h1>
              
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-[#050505]/70">                <div className="flex items-center gap-1">
                  <UserIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span>{note.author.firstName} {note.author.lastName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
              <div className="inline-flex items-center px-3 py-1 border-[0.15em] border-[#050505] rounded-full text-xs md:text-sm font-semibold self-start sm:self-auto" 
                 style={{ color, backgroundColor: bgColor }}>
              {note.type}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 md:p-6 border-b-[0.15em] border-[#050505]">
          {note.content ? (
            <div className="prose prose-sm md:prose-base max-w-none break-words">
              <p>{note.content}</p>
            </div>
          ) : (
            <div className="text-[#050505]/70 text-center py-4">No additional content for these notes.</div>
          )}
        </div>
          {/* Stats and Actions */}
        <div className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4 md:gap-6 text-[#050505]/70">
              <LikeButton
                noteId={note.id}
                initialLikes={note._count?.likes || 0}
              />
              <div className="flex items-center gap-2 border-[0.1em] px-2 py-1 rounded-[0.4em] border-[#050505]/30">
                <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="text-sm font-medium">{note.downloadCount}</span>
                <span className="sr-only">downloads</span>
              </div>
            </div>
            
            <div className="bg-[#F8F9FA] border-[0.1em] border-[#050505]/20 rounded-[0.4em] p-2 md:p-3">
              <div className="text-xs md:text-sm text-[#050505]/70 mb-1">
                <span className="font-medium">Subject:</span> <span className="font-semibold">{note.subject?.name} ({note.subject?.code})</span>
              </div>
              <div className="text-xs md:text-sm text-[#050505]/70">
                <span className="font-medium">Academic:</span> Year {note.subject?.semester?.year?.number}, Semester {note.subject?.semester?.number}
              </div>
            </div>
          </div>
            {/* Download Button */}
          <div className="flex justify-center sm:justify-start">
            <DownloadButton noteId={note.id} />
          </div>
        </div>      </div>
      
      {/* Comment Section */}
      <div className="mt-4 md:mt-8">
        <CommentSection noteId={note.id} />
      </div>
    </div>
  );
}
