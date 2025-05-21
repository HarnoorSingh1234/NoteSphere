'use client';

import React from 'react';
import { FileText, Clock, User, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { NoteType } from '@prisma/client';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Import with dynamic for client-side rendering
const AdminLikeButton = dynamic(() => import('@/components/admin/AdminLikeButton'), { ssr: false });
const AdminCommentSection = dynamic(() => import('@/components/admin/AdminCommentSection'), { ssr: false });

// Define the shape of the note prop
interface NoteWithRelations {
  id: string;
  title: string;
  content?: string | null;
  type: NoteType;
  fileUrl: string;
  driveFileId?: string | null;
  isPublic: boolean;
  isApproved?: boolean | null;
  isRejected?: boolean | null;
  rejectedAt?: Date | null;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
  authorClerkId: string;
  subjectId: string;
  author: {
    firstName: string;
    lastName: string;
  };
  subject: {
    id: string;
    name: string;
    code: string;
    semesterId: string;
    semester: {
      id: string;
      name: string;
      yearId: string;
      year: {
        id: string;
        name: string;
      };
    };
  };
  _count: {
    likes: number;
    comments: number;
  };
}

interface AdminNoteClientProps {
  note: NoteWithRelations;
}

export default function AdminNoteClient({ note }: AdminNoteClientProps) {
  // Function to determine note icon and color based on type
  const getNoteTypeDetails = (type: NoteType) => {
    switch (type) {
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
  
  const typeDetails = getNoteTypeDetails(note.type);
  
  const approvalStatus = note.isApproved 
    ? { label: 'Approved', color: 'text-green-600', bg: 'bg-green-100', icon: <CheckCircle className="w-4 h-4" /> } 
    : note.isRejected 
      ? { label: 'Rejected', color: 'text-red-600', bg: 'bg-red-100', icon: <XCircle className="w-4 h-4" /> } 
      : { label: 'Pending Review', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: <AlertCircle className="w-4 h-4" /> };
  
  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-[#050505]/70">
          <Link 
            href="/admin/dashboard" 
            className="hover:text-[#DE5499]"
          >
            Admin
          </Link>
          <span className="mx-2">›</span>
          <Link 
            href={`/admin/notes`}
            className="hover:text-[#DE5499]"
          >
            Notes
          </Link>
          <span className="mx-2">›</span>
          <span className="font-medium text-[#050505]">{note.title}</span>
        </div>
      </div>
      
      {/* Note Header */}
      <div className="bg-white border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#DE5499] p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-[#264143] mb-4 md:mb-0">{note.title}</h1>
          
          <div className={`${approvalStatus.bg} ${approvalStatus.color} flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-current`}>
            {approvalStatus.icon}
            {approvalStatus.label}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full bg-[${typeDetails.bgColor}] flex items-center justify-center border border-[${typeDetails.color}]`}>
              <FileText className={`w-4 h-4 text-[${typeDetails.color}]`} />
            </div>
            <div>
              <p className="text-sm text-[#050505]/70">Type</p>
              <p className="font-medium text-[#264143]">{note.type}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#4d61ff]/10 flex items-center justify-center border border-[#4d61ff]">
              <User className="w-4 h-4 text-[#4d61ff]" />
            </div>
            <div>
              <p className="text-sm text-[#050505]/70">Author</p>
              <p className="font-medium text-[#264143]">{note.author.firstName} {note.author.lastName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#DE5499]/10 flex items-center justify-center border border-[#DE5499]">
              <Clock className="w-4 h-4 text-[#DE5499]" />
            </div>
            <div>
              <p className="text-sm text-[#050505]/70">Uploaded</p>
              <p className="font-medium text-[#264143]">{new Date(note.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E99F4C]/10 flex items-center justify-center border border-[#E99F4C]">
              <Download className="w-4 h-4 text-[#E99F4C]" />
            </div>
            <div>
              <p className="text-sm text-[#050505]/70">Downloads</p>
              <p className="font-medium text-[#264143]">{note.downloadCount}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Note Content */}
      <div className="bg-white border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#4d61ff] p-6 mb-8">
        <h2 className="text-xl font-bold text-[#264143] mb-4">Note Details</h2>
        
        <div className="mb-6">
          <h3 className="font-medium text-[#264143] mb-2">Subject</h3>
          <div className="flex flex-wrap gap-2">
            <div className="bg-[#264143]/10 px-3 py-1.5 rounded-[0.3em] text-sm font-medium text-[#264143] border border-[#264143]/20">
              {note.subject?.name || 'Unknown Subject'}
            </div>
            <div className="bg-[#264143]/5 px-3 py-1.5 rounded-[0.3em] text-sm font-medium text-[#264143]/80 border border-[#264143]/10">
              {note.subject?.code || 'No code'}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium text-[#264143] mb-2">Academic Context</h3>
          <div className="flex flex-wrap gap-2">
            <div className="bg-[#DE5499]/10 px-3 py-1.5 rounded-[0.3em] text-sm font-medium text-[#DE5499] border border-[#DE5499]/20">
              {note.subject?.semester?.year?.name || 'Unknown Year'}
            </div>
            <div className="bg-[#E99F4C]/10 px-3 py-1.5 rounded-[0.3em] text-sm font-medium text-[#E99F4C] border border-[#E99F4C]/20">
              {note.subject?.semester?.name || 'Unknown Semester'}
            </div>
          </div>
        </div>
        
        {note.content && (
          <div className="mb-6">
            <h3 className="font-medium text-[#264143] mb-2">Description</h3>
            <div className="bg-[#050505]/5 p-4 rounded-[0.4em] text-[#050505]/90 whitespace-pre-wrap">
              {note.content}
            </div>
          </div>
        )}
        
        <div>
          <h3 className="font-medium text-[#264143] mb-2">File</h3>
          <a 
            href={note.fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-[#4d61ff]/5 rounded-[0.4em] border border-[#4d61ff]/20 text-[#4d61ff] font-medium hover:bg-[#4d61ff]/10 transition-colors"
          >
            <FileText className="w-5 h-5" />
            View Document
          </a>
        </div>
      </div>
      
      {/* User Engagement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#E99F4C] p-6">
          <h2 className="text-xl font-bold text-[#264143] mb-4">User Engagement</h2>
          <AdminLikeButton noteId={note.id} initialLikes={note._count.likes} />
        </div>
      </div>
      
      {/* Comments Section */}
      <AdminCommentSection noteId={note.id} />
    </div>
  );
}
