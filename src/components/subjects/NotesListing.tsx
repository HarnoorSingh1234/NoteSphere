'use client';

import React from 'react';
import { ThumbsUp, MessageCircle, Clock, User, FileText, Download, FileSymlink } from 'lucide-react';
import Link from 'next/link';
import { NoteType } from '@prisma/client';

interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  fileUrl: string;
  driveFileId?: string; // Add driveFileId field
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

interface NotesListingProps {
  notes: Note[];
  subjectName: string;
}

// Note card component for displaying notes
const NoteCard: React.FC<{ note: Note }> = ({ note }) => {
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
      
      // Skip download tracking as it's causing errors
      // We'll proceed directly to the file download
      
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
        <div className="flex items-center gap-3">          <div style={{ backgroundColor: bgColor.replace('/', ' / '), borderColor: color }} 
               className="flex items-center justify-center w-10 h-10 rounded-lg border-[0.1em]">
            <FileText style={{ color: color }} className="w-5 h-5" />
          </div><div>
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
        </div>        <div className="inline-flex items-center px-2 py-0.5 border-[0.1em] border-[#050505] rounded-full text-xs font-semibold" 
             style={{ color, backgroundColor: bgColor.replace('/', ' / ') }}>
          {note.type || 'OTHER'}
        </div>
      </div>
        <div className="flex items-center justify-between mt-4 text-sm text-[#050505]/70">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />
            <span>{note.likes?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            <span>{note.comments?.length || 0}</span>
          </div>
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

const EmptyNotesState: React.FC<{ type: string }> = ({ type }) => {
  const messages = {
    all: {
      title: "No notes available yet",
      description: "Be the first to upload study materials for this subject!"
    },
    pdf: {
      title: "No PDF notes available",
      description: "Upload PDF notes to help your peers!"
    },
    lecture: {
      title: "No lecture notes available",
      description: "Share your lecture notes with the community!"
    },
    handwritten: {
      title: "No handwritten notes available",
      description: "Upload your handwritten notes to help others!"
    },
    ppt: {
      title: "No presentations available",
      description: "Share your presentations with classmates!"
    }
  };

  const message = messages[type as keyof typeof messages] || messages.all;

  return (
    <div className="p-8 bg-white border-[0.15em] border-dashed border-[#050505] rounded-[0.6em] text-center">
      <FileText className="w-12 h-12 mx-auto text-[#050505]/40 mb-2" />
      <h3 className="text-lg font-bold text-[#050505] mb-1">{message.title}</h3>
      <p className="text-[#050505]/70">{message.description}</p>
    </div>
  );
};

const NotesListing: React.FC<NotesListingProps> = ({ notes = [], subjectName = 'this subject' }) => {
  const [activeTab, setActiveTab] = React.useState('all');
  
  // Make sure notes is an array to avoid errors
  const safeNotes = Array.isArray(notes) ? notes : [];
  
  const filteredNotes = React.useMemo(() => {
    if (activeTab === 'all') return safeNotes;
    return safeNotes.filter(note => note?.type?.toLowerCase() === activeTab.toLowerCase());
  }, [safeNotes, activeTab]);

  return (
    <div className="bg-white border-[0.15em] border-[#050505] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] overflow-hidden">
      <div className="p-6 border-b-[0.15em] border-[#050505]">
        <h2 className="text-2xl font-bold text-[#050505]">Study Materials</h2>
        <p className="text-[#050505]/70">Notes, lectures, and resources for {subjectName}</p>
      </div>
      
      <div className="p-6">
        <div className="border-[0.15em] border-[#050505] rounded-[0.4em] shadow-[0.1em_0.1em_0_#050505] bg-[#EDDCD9]/30 p-1 mb-6 grid grid-cols-4 overflow-hidden">
          {['all', 'pdf', 'lecture', 'handwritten', 'ppt'].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 transition-all rounded-[0.3em] ${
                activeTab === tab 
                  ? 'bg-white text-[#050505] font-bold shadow-[0.1em_0.1em_0_#050505]' 
                  : 'text-[#050505]/70 hover:bg-white/50'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="space-y-4">
          {filteredNotes && filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))
          ) : (
            <EmptyNotesState type={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesListing;
export { NoteCard };