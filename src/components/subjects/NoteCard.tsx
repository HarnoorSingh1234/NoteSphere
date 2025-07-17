'use client';

import React from 'react';
import { MessageCircle, FileText, Download, Clock, User, FileSymlink, Tag } from 'lucide-react';
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
  tags?: string[];
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
  subjectName?: string; // Added for subject name display
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
    <div className="bg-white/95 backdrop-blur-sm border-[0.15em] border-[#264143] rounded-[0.8em] shadow-[0.2em_0.2em_0_#E99F4C] p-4 hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#E99F4C] transition-all duration-200 h-full flex flex-col">
      {/* Card Header with Type Badge */}
      <Link 
          href={`/notes/${note.id}`}
          
        >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div 
              style={{ backgroundColor: bgColor.replace('/', ' / '), borderColor: color }} 
              className="flex items-center justify-center w-10 h-10 rounded-lg border-[0.15em] flex-shrink-0"
            >
              <FileText style={{ color: color }} className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-[#264143] text-base line-clamp-2 leading-tight mb-2">
                {note.title || 'Untitled Note'}
              </h3>
              {note.subjectId && (
                <div className="text-xs text-[#264143]/70 break-words max-w-full mb-1">
                  {/* If you have subject name, use it here instead of subjectId */}
                  Subject: <span className="whitespace-pre-line break-words line-clamp-2">{note.subjectName || note.subjectId}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-sm text-[#264143]/80">
                <User className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">
                  {note.author ? 
                    `${note.author.firstName || ''} ${note.author.lastName || ''}`.trim() || 'Anonymous' 
                    : 'Anonymous'}
                </span>
              </div>
            </div>
          </div>
          <div 
            className="inline-flex items-center px-3 py-1 border-[0.15em] border-[#264143] rounded-full text-sm font-semibold flex-shrink-0" 
            style={{ backgroundColor: bgColor.replace('/', ' / ') }}
          >
            <span style={{ color: '#264143' }} className="text-sm">
              {note.type?.slice(0, 3) || 'OTH'}
            </span>
          </div>      
        </div> 
      </Link>      
      {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="mb-3">
            
              <div className="flex flex-wrap gap-1">
                {note.tags.map((tag, index) => (
                  <span
                    key={`tag-${index}-${tag}`}
                    className="px-2 py-1 text-xs font-medium bg-[#EDDCD9] text-[#264143] border-[0.1em] border-[#264143]/20 rounded-full hover:bg-[#E99F4C]/30 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

      {/* Stats Row */}
      <div className="flex items-center justify-between text-xs text-[#264143]/80 bg-[#F8F5F2] p-2 rounded-lg mb-3">
        <div className="flex items-center gap-3">
          <LikeButton
            noteId={note.id}
            initialLikes={note.likes?.length || 0}
          />
          <Link href={`/notes/${note.id}#comments`} passHref>
            <div className="flex items-center gap-1 hover:text-[#DE5499] transition-colors">
              <MessageCircle className="w-3 h-3" />
              <span>{note.comments?.length || 0}</span>
            </div>
          </Link>
          <div className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            <span>{note.downloadCount || 0}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span className="text-xs">{note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Unknown'}</span>
        </div>
      </div>
      
      {/* Action Buttons - Pushed to bottom */}
      <div className="mt-auto flex flex-col gap-2">
        <Link 
          href={`/notes/${note.id}`}
          className="inline-flex text-[#264143] items-center justify-center w-full px-3 py-2 text-xs font-medium bg-white border-[0.15em] border-[#264143] rounded-[0.5em] shadow-[0.15em_0.15em_0_#DE5499] hover:translate-y-[-0.05em] hover:shadow-[0.2em_0.2em_0_#DE5499] active:translate-y-[0.02em] active:shadow-[0.1em_0.1em_0_#DE5499] transition-all duration-200"
        >
          <FileSymlink className="w-3 h-3 mr-1" />
          View
        </Link>
        
        <button
          onClick={handleDownload}
          className="inline-flex text-white items-center justify-center w-full px-3 py-2 text-xs font-medium bg-[#4CAF50] border-[0.15em] border-[#264143] rounded-[0.5em] shadow-[0.15em_0.15em_0_#264143] hover:translate-y-[-0.05em] hover:shadow-[0.2em_0.2em_0_#264143] active:translate-y-[0.02em] active:shadow-[0.1em_0.1em_0_#264143] transition-all duration-200"
        >
          <Download className="w-3 h-3 mr-1" />
          Download
        </button>
      </div>
    </div>
  );
};

export default NoteCard;