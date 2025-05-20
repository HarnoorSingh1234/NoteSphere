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
    <div className="bg-white border-[0.15em] border-[#050505] rounded-[0.6em] shadow-[0.2em_0.2em_0_#050505] p-4 hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#050505] transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div style={{ backgroundColor: bgColor.replace('/', ' / '), borderColor: color }} 
               className="flex items-center justify-center w-10 h-10 rounded-lg border-[0.1em]">
            <FileText style={{ color: color }} className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-[#050505]">{note.title || 'Untitled Note'}</h3>
            <div className="flex items-center gap-2 text-sm text-[#050505]/70">
              <User className="w-3 h-3" />
              <span>
                {note.author ? 
                  `${note.author.firstName || ''} ${note.author.lastName || ''}`.trim() || 'Anonymous' 
                  : 'Anonymous'}
              </span>
            </div>
          </div>
        </div>
        <div className="inline-flex items-center px-2 py-0.5 border-[0.1em] border-[#050505] rounded-full text-xs font-semibold" 
             style={{ color, backgroundColor: bgColor.replace('/', ' / ') }}>
          {note.type || 'OTHER'}
        </div>
      </div>
        <div className="flex items-center justify-between mt-4 text-sm text-[#050505]/70">
        <div className="flex items-center gap-4">
          <LikeButton
            noteId={note.id}
            initialLikes={note.likes?.length || 0}
          />
          <Link href={`/notes/${note.id}#comments`} passHref>
            <div className="flex items-center gap-1 hover:text-[#4d61ff] transition-colors">
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
          <span>{note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Unknown date'}</span>
        </div>
      </div>
      
      <div className="mt-4 flex flex-col gap-2">
        <Link 
          href={`/notes/${note.id}`}
          className="inline-flex items-center justify-center w-full px-4 py-2 font-bold bg-white border-[0.15em] border-[#050505] rounded-[0.4em] shadow-[0.15em_0.15em_0_#DE5499] hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#DE5499] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#DE5499] transition-all duration-200"
        >
          <FileSymlink className="w-4 h-4 mr-2" />
          View Notes
        </Link>
        
        <button
          onClick={handleDownload}
          className="inline-flex items-center justify-center w-full px-4 py-2 font-bold bg-white border-[0.15em] border-[#050505] rounded-[0.4em] shadow-[0.15em_0.15em_0_#4d61ff] hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#4d61ff] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#4d61ff] transition-all duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
