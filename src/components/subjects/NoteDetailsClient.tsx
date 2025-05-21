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
    <div>
      <div className="bg-white border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#DE5499] transition-all">
        {/* Header */}
        <div className="p-5 md:p-6 border-b-[0.15em] border-[#264143]">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#264143] mb-3 break-words">{note.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#264143]/80">
                <div className="flex items-center gap-2 bg-[#F8F5F2] px-3 py-1 rounded-full">
                  <UserIcon className="w-4 h-4" />
                  <span>{note.author.firstName} {note.author.lastName}</span>
                </div>
                <div className="flex items-center gap-2 bg-[#F8F5F2] px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div 
              className="inline-flex items-center px-4 py-2 border-[0.15em] border-[#264143] rounded-md text-sm font-semibold self-start" 
              style={{ backgroundColor: bgColor }}
            >
              <span style={{ color: '#264143' }}>{note.type}</span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 md:p-6 border-b-[0.15em] border-[#264143] bg-[#F8F5F2]/30">
          {note.content ? (
            <div className="prose prose-sm md:prose-base max-w-none break-words">
              <p className="text-[#326366]">{note.content}</p>
            </div>
          ) : (
            <div className="text-[#264143]/70 text-center py-6">No additional content for these notes.</div>
          )}
        </div>
          {/* Stats and Actions */}
        <div className="p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-6">
            <div className="flex items-center flex-wrap gap-4 md:gap-6">
              
                <LikeButton
                  noteId={note.id}
                  initialLikes={note._count?.likes || 0}
                />
              
              <div className="flex items-center gap-2 bg-[#F8F5F2] px-3 py-1.5 rounded-md border-[0.1em] border-[#264143]/20">
                <MessageCircle className="w-4 h-4 text-[#4d61ff]" />
                <span className="text-sm font-medium text-[#264143]">{note._count?.comments || 0} comments</span>
              </div>
              <div className="flex items-center gap-2 bg-[#F8F5F2] px-3 py-1.5 rounded-md border-[0.1em] border-[#264143]/20">
                <Download className="w-4 h-4 text-[#4CAF50]" />
                <span className="text-sm font-medium text-[#264143]">{note.downloadCount} downloads</span>
              </div>
            </div>
            
            <div className="bg-[#EDDCD9]/50 border-[0.15em] border-[#264143] rounded-md p-4 shadow-[0.1em_0.1em_0_#DE5499]">
              <div className="text-sm text-[#264143] mb-1">
                <span className="font-medium">Subject:</span> <span className="font-semibold">{note.subject?.name} ({note.subject?.code})</span>
              </div>
              <div className="text-sm text-[#264143]">
                <span className="font-medium">Academic:</span> Year {note.subject?.semester?.year?.number}, Semester {note.subject?.semester?.number}
              </div>
            </div>
          </div>
          
          {/* Download Button */}
          <div className="flex justify-center">
            <DownloadButton noteId={note.id} />
          </div>
        </div>
      </div>
      
      {/* Comment Section */}
      <div className="mt-6 md:mt-8 bg-white border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#4d61ff] p-5 md:p-6">
        <h2 className="text-xl font-bold text-[#264143] mb-4">Discussion</h2>
        <CommentSection noteId={note.id} />
      </div>
    </div>
  );
}
