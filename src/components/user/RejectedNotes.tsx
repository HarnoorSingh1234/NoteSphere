'use client';

import React, { useState, useEffect } from 'react';
import { XCircle, AlertTriangle, FileText, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { calculateRemainingHours } from '@/lib/note-rejection';

interface Note {
  id: string;
  title: string;
  type: string;
  rejectedAt: string;
  downloadCount: number;
  fileUrl: string;
  content: string;
}

interface RejectedNotesProps {
  userId: string;
}

const RejectedNoteCard = ({ note }: { note: Note }) => {
  const remainingHours = calculateRemainingHours(note.rejectedAt ? new Date(note.rejectedAt) : null);
  
  return (
    <div className="bg-white border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_#dc2626] p-4 hover:translate-y-[-0.1em] transition-all duration-200 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-red-500"></div>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 w-10 h-10 rounded-lg flex items-center justify-center border-[0.15em] border-red-200">
            <FileText className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-[#264143] line-clamp-1">{note.title}</h3>
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{note.type}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {remainingHours > 0 ? `${remainingHours}h remaining` : 'Deletion pending'}
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{note.content || 'No description provided.'}</p>
      
      <div className="flex items-center justify-between mt-4">
        <Link 
          href={`/notes/${note.id}`}
          className="text-[#4d61ff] text-sm hover:underline flex items-center"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          View Details
        </Link>
        
        <Link
          href={`/upload?resubmit=${note.id}`}
          className="inline-flex text-red-600 border border-red-600 items-center px-3 py-1 rounded-md text-sm font-medium hover:bg-red-50"
        >
          Resubmit
        </Link>
      </div>
    </div>
  );
};

export default function RejectedNotes({ userId }: RejectedNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRejectedNotes = async () => {
      try {
        setLoading(true);
        // Fetch rejected notes for the current user
        const response = await fetch(`/api/notes?authorId=${userId}&isRejected=true`);
        
        if (!response.ok) {
          throw new Error('Failed to load rejected notes');
        }
        
        const data = await response.json();
        
        if (Array.isArray(data.notes)) {
          setNotes(data.notes);
        } else {
          console.error('Unexpected API response format:', data);
          throw new Error('Unexpected API response format');
        }
      } catch (err: any) {
        console.error('Error fetching rejected notes:', err);
        setError(err.message || 'Failed to load your rejected notes');
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchRejectedNotes();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_#E99F4C] p-6">
        <h2 className="text-xl font-bold text-[#264143] mb-4">Rejected Notes</h2>
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_#E99F4C] p-6">
        <h2 className="text-xl font-bold text-[#264143] mb-4">Rejected Notes</h2>
        <div className="bg-red-50 p-4 rounded-md text-red-800 flex items-start gap-3">
          <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error loading rejected notes</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return null; // Don't show the section if there are no rejected notes
  }

  return (
    <div className="bg-white border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_#E99F4C] p-6">
      <h2 className="text-xl font-bold text-[#264143] mb-4">Rejected Notes</h2>
      
      <div className="p-4 bg-red-50 border-[0.15em] border-red-200 rounded-md mb-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[#264143] font-medium">You have {notes.length} rejected {notes.length === 1 ? 'note' : 'notes'}</p>
          <p className="text-sm text-[#264143]/80">Rejected notes are kept for 48 hours before being permanently deleted. You can review and resubmit them.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {notes.map((note) => (
          <RejectedNoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}
