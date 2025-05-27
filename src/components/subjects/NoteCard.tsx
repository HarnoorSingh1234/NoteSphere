'use client';

import React from 'react';
import { MessageCircle, Clock, User, FileText, Download, FileSymlink } from 'lucide-react';
import Link from 'next/link';
import LikeButton from './LikeButton';
import { NoteType } from '@prisma/client';
import { getNoteTypeDetails } from './utils';

export interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  fileUrl: string;
  driveFileId?: string;
  isPublic: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  authorClerkId: string;
  subjectId: string;
  likes: {
    userId: string;
  }[];
  comments: {
    id: string;
  }[];
  author: {
    firstName: string;
    lastName: string;
  };
}

interface NoteCardProps {
  note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const { color, bgColor } = getNoteTypeDetails(note.type);
  
  // Function to handle file download and increment download count
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (!note.id) {
        console.error('Note ID is missing');
        alert('Cannot download this file: Note ID is missing');
        return;
      }
      
      // If we have a Google Drive file ID, use the direct download URL
      if (note.driveFileId) {
        window.open(`/api/notes/${note.id}/download-file`, '_blank');
      } else if (note.fileUrl) {
        // Otherwise, use the stored file URL if available
        window.open(note.fileUrl, '_blank');
      } else {
        alert('Download URL not available for this file');
        console.error('Missing file URL or Drive file ID for download');
      }
    } catch (error) {
      console.error('Error handling download:', error);
      alert('Failed to download file. Please try again later.');
    }
  };
  return (
    <div className="bg-white border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_#E99F4C] p-4 hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#E99F4C] transition-all duration-200 w-fit h-full flex flex-col">
      {/* Card Header with Type Badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            style={{ backgroundColor: bgColor.replace('/', ' / '), borderColor: color }} 
            className="flex items-center justify-center w-12 h-12 rounded-lg border-[0.15em]"
          >
            <FileText style={{ color: color }} className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-[#264143] text-lg line-clamp-2">{note.title || 'Untitled Note'}</h3>
            <div className="flex items-center gap-2 text-sm text-[#264143]/80">
              <User className="w-3 h-3" />
              <span>
                {note.author ? 
                  `${note.author.firstName || ''} ${note.author.lastName || ''}`.trim() || 'Anonymous' 
                  : 'Anonymous'}
              </span>
            </div>
          </div>
        </div>
        <div 
          className="inline-flex items-center px-2 py-0.5 border-[0.15em] border-[#264143] rounded-full text-xs font-semibold" 
          style={{ backgroundColor: bgColor.replace('/', ' / ') }}
        >
          <span style={{ color: '#264143' }}>{note.type || 'OTHER'}</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between mt-2 text-sm text-[#264143]/80 bg-[#F8F5F2] p-2 rounded-md">
        <div className="flex items-center gap-3">
          <LikeButton
            noteId={note.id}
            initialLikes={note.likes?.length || 0}
          />
          <Link href={`/notes/${note.id}#comments`} passHref>
            <div className="flex items-center gap-1 hover:text-[#DE5499] transition-colors">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{note.comments?.length || 0}</span>
            </div>
          </Link>
          <div className="flex items-center gap-1 mr-2">
            <Download className="w-3.5 h-3.5" />
            <span>{note.downloadCount || 0}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Unknown date'}</span>
        </div>
      </div>
      
      {/* Action Buttons - Pushed to bottom with flex-grow */}
      <div className="mt-auto pt-4 flex flex-col gap-2">
        <Link 
          href={`/notes/${note.id}`}
          className="inline-flex text-[#264143] items-center justify-center w-full px-4 py-2 font-medium bg-white border-[0.15em] border-[#264143] rounded-[0.4em] shadow-[0.15em_0.15em_0_#DE5499] hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#DE5499] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#DE5499] transition-all duration-200"
        >
          <FileSymlink className="w-4 h-4 mr-2" />
          View Notes
        </Link>
        
        <button
          onClick={handleDownload}
          className="inline-flex text-white items-center justify-center w-full px-4 py-2 font-medium bg-[#4CAF50] border-[0.15em] border-[#264143] rounded-[0.4em] shadow-[0.15em_0.15em_0_#264143] hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#264143] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#264143] transition-all duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
