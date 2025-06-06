'use client';

import React from 'react';
import { ThumbsUp, Clock, User as UserIcon, Download, MessageCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Note as PrismaNote, User as PrismaUser, Subject as PrismaSubject, Semester as PrismaSemester, Year as PrismaYear, NoteType } from '@prisma/client';
import DownloadButton from '@/components/subjects/DownloadButton';
import ShareButton from '@/components/subjects/ShareButton';
import DocumentViewer from '@/components/notes/DocumentViewer';
import { motion } from 'framer-motion';
import AdminControlsWrapper from '@/components/admin/AdminControlsWrapper';

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
      <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#DE5499] transition-all relative overflow-hidden">
        {/* Pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:0.8em_0.8em] pointer-events-none"></div>
        
        {/* Corner slice */}
        <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
        
        {/* Decorative corner */}
        <div className="absolute top-[-1em] right-[-1em] w-12 h-12 bg-[#EDDCD9] transform rotate-45 translate-x-6 -translate-y-6"></div>
        
        <div className="relative z-[1]">
          {/* Header */}
          <div className="p-5 md:p-6 border-b-[0.15em] border-[#264143]">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#264143] mb-3 break-words">{note.title}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-[#264143]">
                  <Link href={`/author/${note.author.clerkId}`} className="block">
                    <div className="flex items-center gap-2 bg-[#EDDCD9]/40 px-3 py-1 rounded-full border-[0.1em] border-[#264143]/20 hover:bg-[#EDDCD9]/60 transition-colors">
                      <UserIcon className="w-4 h-4" />
                      <span className="font-medium hover:underline">
                        {note.author.firstName} {note.author.lastName}
                      </span>
                    </div>
                  </Link>
                  
                  <div className="flex items-center gap-2 bg-[#EDDCD9]/40 px-3 py-1 rounded-full border-[0.1em] border-[#264143]/20">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-4 py-2 border-[0.15em] border-[#264143] rounded-[0.4em] text-sm font-bold self-start shadow-[0.2em_0.2em_0_rgba(0,0,0,0.1)]" 
                style={{ backgroundColor: bgColor }}
              >
                <span style={{ color: '#264143' }}>{note.type}</span>
              </motion.div>
            </div>
          </div>
          
          {/* Content */}
          {note.content && (
            <div className="p-5 md:p-6 border-b-[0.15em] border-[#264143]/60 bg-[#EDDCD9]/10">
              <div className="prose prose-sm md:prose-base max-w-none break-words">
                <p className="text-[#264143] leading-relaxed">{note.content}</p>
              </div>
            </div>
          )}
          
          {/* Document Viewer for all document types */}
          {(note.fileUrl || note.driveFileId) && (
            <div className="px-5 md:px-6 py-6 border-b-[0.15em] border-[#264143]/60 bg-[#EDDCD9]/10">
              <h3 className="text-lg font-bold text-[#264143] mb-4 flex items-center">
                <div className="w-7 h-7 bg-[#DE5499]/20 border-[0.15em] border-[#264143] rounded-[0.3em] flex items-center justify-center mr-2 shadow-[0.1em_0.1em_0_#7BB4B1]">
                  <DocumentIcon className="w-3.5 h-3.5 text-[#264143]" />
                </div>
                Document Preview
              </h3>
              <div className="border-[0.15em] border-[#264143]/40 rounded-[0.4em] overflow-hidden shadow-[0.2em_0.2em_0_rgba(0,0,0,0.05)]">
                <DocumentViewer 
                  fileUrl={note.fileUrl} 
                  driveFileId={note.driveFileId} 
                  title={note.title}
                  type={note.type}
                />
              </div>
            </div>
          )}
          
          {/* Stats and Actions */}
          <div className="p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-6">
              <div className="flex items-center flex-wrap gap-4 md:gap-6">
                <LikeButton
                  noteId={note.id}
                  initialLikes={note._count?.likes || 0}
                />
                
                <div className="flex items-center gap-2 bg-[#EDDCD9]/30 px-3 py-1.5 rounded-[0.3em] border-[0.1em] border-[#264143]/20">
                  <MessageCircle className="w-4 h-4 text-[#E99F4C]" />
                  <span className="text-sm font-medium text-[#264143]">{note._count?.comments || 0} comments</span>
                </div>
                <div className="flex items-center gap-2 bg-[#EDDCD9]/30 px-3 py-1.5 rounded-[0.3em] border-[0.1em] border-[#264143]/20">
                  <Download className="w-4 h-4 text-[#7BB4B1]" />
                  <span className="text-sm font-medium text-[#264143]">{note.downloadCount} downloads</span>
                </div>
              </div>
                <div className="bg-[#EDDCD9]/30 border-[0.15em] border-[#264143] rounded-[0.4em] p-4 shadow-[0.2em_0.2em_0_#7BB4B1]">
                <div className="text-sm text-[#264143] mb-1">
                  <span className="font-medium">Subject:</span> <span className="font-semibold">{note.subject?.name} ({note.subject?.code})</span>
                </div>
                <div className="text-sm text-[#264143] mb-2">
                  <span className="font-medium">Academic:</span> Year {note.subject?.semester?.year?.number}, Semester {note.subject?.semester?.number}
                </div>
                
                {note.tags && note.tags.length > 0 && (
                  <div>
                    <div className="text-xs text-[#264143]/70 mb-1">Tags:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {note.tags.map((tag: string, index: number) => (
                        <span
                          key={`tag-${index}-${tag}`}
                          className="px-2 py-0.5 text-xs font-medium bg-[#EDDCD9] text-[#264143] border-[0.1em] border-[#264143]/20 rounded-full hover:bg-[#E99F4C]/30 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
              {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <motion.div 
                className="flex-1"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <DownloadButton noteId={note.id} />
              </motion.div>
              
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <ShareButton noteId={note.id} noteTitle={note.title} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
        {/* Admin Controls */}
      <AdminControlsWrapper noteId={note.id} />
      
      {/* Comment Section */}
      <div className="mt-6 md:mt-8 bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] p-5 md:p-6 relative overflow-hidden">
        {/* Pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:0.8em_0.8em] pointer-events-none"></div>
        
        {/* Corner slice */}
        <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
        
        <div className="relative z-[1]">
          <h2 className="text-xl font-bold text-[#264143] mb-5 flex items-center">
            <div className="w-8 h-8 bg-[#E99F4C]/20 border-[0.15em] border-[#264143] rounded-[0.3em] flex items-center justify-center mr-2 shadow-[0.1em_0.1em_0_#DE5499]">
              <MessageCircle className="w-4 h-4 text-[#264143]" />
            </div>
            Discussion
          </h2>
          <CommentSection noteId={note.id} />
        </div>
      </div>
    </div>
  );
}

// Document icon component
const DocumentIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
  </svg>
);