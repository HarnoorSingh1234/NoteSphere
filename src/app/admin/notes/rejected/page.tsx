'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, XCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { Note } from '@/types/index';
import AdminNoteCard from '@/components/admin/AdminNoteCard';
import { calculateRemainingHours } from '@/lib/note-rejection';

const RejectedNotesPage = () => {
  const [rejectedNotes, setRejectedNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingNoteId, setProcessingNoteId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchRejectedNotes();
  }, []);

  const fetchRejectedNotes = async () => {
    try {
      setLoading(true);
      // Use the admin notes API with proper filters for rejected notes
      const response = await fetch(`/api/admin/notes?isRejected=true`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch rejected notes');
      }
      
      const data = await response.json();
      if (Array.isArray(data.notes)) {
        setRejectedNotes(data.notes);
      } else {
        console.error('Unexpected API response format:', data);
        throw new Error('Unexpected API response format');
      }
    } catch (err: any) {
      console.error('Error fetching rejected notes:', err);
      setError(err.message || 'Failed to load rejected notes');
    } finally {
      setLoading(false);
    }
  };
  const handleUnrejectNote = async (noteId: string, action: 'restore' | 'publish') => {
    try {
      setProcessingNoteId(noteId);
      
      const response = await fetch('/api/admin/unreject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noteId, action }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process note');
      }
      
      // Remove the note from the list on successful unreject
      setRejectedNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      
      // Show success notification (you can implement this later)
      // For now we'll just log
      console.log(`Note ${action === 'restore' ? 'restored to pending' : 'published'} successfully`);
      
    } catch (err: any) {
      console.error(`Error ${action === 'restore' ? 'restoring' : 'publishing'} note:`, err);
      alert(err.message || `Failed to ${action} note`);
    } finally {
      setProcessingNoteId(null);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center bg-white justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-t-[#dc2626] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-[#264143]">Loading rejected notes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto flex items-center justify-center bg-red-100 rounded-full">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-[#264143]">Failed to Load Rejected Notes</h2>
          <p className="mt-2 text-[#264143]/70">{error}</p>
          <button
            onClick={() => fetchRejectedNotes()}
            className="mt-4 px-4 py-2 bg-[#DE5499] text-white font-medium rounded-[0.4em] border-[0.15em] border-[#264143] shadow-[0.1em_0.1em_0_#264143] hover:shadow-[0.2em_0.2em_0_#264143] hover:translate-y-[-0.1em] transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container bg-white mx-auto p-4 md:p-8">      
    <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#264143] mb-2">Rejected Notes</h1>
          <p className="text-[#264143]/70">
            Notes that have been rejected and pending deletion
          </p>
        </div>
        
        <div className="flex hover:text-pink-500 gap-3">
          <Link
            href="/admin/notes"
            className="px-5 py-2.5 bg-[#F8F5F2] hover:text-pink-500 text-[#264143] font-medium rounded-[0.4em] border-[0.15em] border-[#264143] hover:bg-[#EDDCD9] hover:translate-y-[-0.1em] transition-all duration-200 shadow-[0.1em_0.1em_0_#264143] hover:shadow-[0.2em_0.2em_0_#264143] flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className=''>All Notes</span>
          </Link>
        </div>
      </div>
        <div className="bg-white border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#dc2626] overflow-hidden">
        {rejectedNotes.length > 0 ? (
          <>            <div className="p-6 border-b border-[#264143]/20 bg-red-50">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#264143] font-medium">Rejected notes are automatically deleted after 48 hours</p>
                  <p className="text-[#264143]/70 text-sm">After rejection, notes are kept for 48 hours before permanent deletion. The author can see rejected notes and re-submit if needed.</p>
                </div>
              </div>
            </div>            <div className="p-4 grid grid-cols-1 gap-4">
              {rejectedNotes.map((note) => {
                const remainingHours = note.rejectedAt ? calculateRemainingHours(note.rejectedAt) : 48;
                const isProcessing = processingNoteId === note.id;
                return (
                  <div key={note.id} className="relative">
                    <AdminNoteCard 
                      note={note} 
                      showUnrejectActions={true}
                      onUnreject={handleUnrejectNote}
                      isProcessing={isProcessing}
                      showActions={true}
                    />
                    <div className="absolute top-3 right-3 bg-[#DE5499] text-white text-xs font-bold px-2 py-1 rounded-full">
                      {remainingHours > 0 ? `${remainingHours}h remaining` : 'Deletion pending'}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto flex items-center justify-center bg-[#F8F5F2] rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-[#4CAF50]" />
            </div>
            <h3 className="text-xl font-bold text-[#264143] mb-2">No Rejected Notes</h3>
            <p className="text-[#264143]/70 mb-6 max-w-md mx-auto">
              There are no rejected notes at the moment. Rejected notes will appear here for 48 hours before they're permanently deleted.
            </p>
            <Link
              href="/admin/notes"
              className="px-5 py-2.5 bg-[#F8F5F2] text-[#264143] font-medium rounded-[0.4em] border-[0.15em] border-[#264143] hover:bg-[#EDDCD9] hover:translate-y-[-0.1em] transition-all duration-200 shadow-[0.1em_0.1em_0_#264143] hover:shadow-[0.2em_0.2em_0_#264143]"
            >
              View All Notes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RejectedNotesPage;