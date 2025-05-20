'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Note } from '@/types/index';
import AdminNoteCard from '@/components/admin/AdminNoteCard';


const PendingNotesPage = () => {
  const [pendingNotes, setPendingNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [processingNoteId, setProcessingNoteId] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    fetchPendingNotes();
  }, []);
  const fetchPendingNotes = async () => {
    try {
      setLoading(true);
      // Use the admin notes API with proper filters for pending notes
      // Pending notes are those where isPublic=false AND isRejected=false
      const response = await fetch(`/api/admin/notes?isPublic=false&isRejected=false`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch pending notes');
      }
      
      const data = await response.json();
      if (Array.isArray(data.notes)) {
        setPendingNotes(data.notes);
        // Always set to 1 page since we're not using pagination
        setTotalPages(1);
      } else {
        console.error('Unexpected API response format:', data);
        throw new Error('Unexpected API response format');
      }
    } catch (err: any) {
      console.error('Error fetching pending notes:', err);
      setError(err.message || 'Failed to load pending notes');
    } finally {
      setLoading(false);
    }
  };

  const handleNoteVerification = async (noteId: string, action: 'approve' | 'reject') => {
    try {
      setProcessingNoteId(noteId);
      
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteId,
          action,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${action} note`);
      }
      
      // Refresh the list of pending notes
      fetchPendingNotes();
      
      // Show a success message
      alert(`Note ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
    } catch (err: any) {
      console.error(`Error ${action}ing note:`, err);
      alert(err.message || `Failed to ${action} note`);
    } finally {
      setProcessingNoteId(null);
    }
  };
  // Page change handler removed as we're not using pagination anymore

  if (loading && pendingNotes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-t-[#4d61ff] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-[#050505]">Loading pending notes...</p>
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
          <h2 className="mt-4 text-xl font-bold text-[#050505]">Failed to Load Pending Notes</h2>
          <p className="mt-2 text-[#050505]/70">{error}</p>
          <button
            onClick={() => fetchPendingNotes()}
            className="mt-4 px-4 py-2 bg-[#4d61ff] text-white font-medium rounded-lg hover:bg-[#3a4cd1] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#050505] mb-2">Pending Notes Verification</h1>
          <p className="text-[#050505]/70">
            Review and approve or reject notes that are waiting for verification
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link
            href="/admin/notes"
            className="px-5 py-2.5 bg-[#050505] text-white font-bold rounded-lg flex items-center gap-2 hover:bg-[#333333] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>All Notes</span>
          </Link>
        </div>
      </div>
        <div className="bg-white border-[0.15em] border-[#050505] rounded-[0.6em] shadow-[0.4em_0.4em_0_#ff3e00] overflow-hidden">
        {pendingNotes.length > 0 ? (
          <>
            <div className="p-4 grid grid-cols-1 gap-4">
              {pendingNotes.map((note) => (
                <AdminNoteCard 
                  key={note.id} 
                  note={note} 
                  onApprove={(noteId: string) => handleNoteVerification(noteId, 'approve')}
                  onReject={(noteId: string) => handleNoteVerification(noteId, 'reject')}
                  showActions={true}
                  isProcessing={processingNoteId === note.id}
                />
              ))}
            </div>
              {/* No pagination needed as we're showing all notes at once */}
          </>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto flex items-center justify-center bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-[#050505] mb-2">No Pending Notes</h3>
            <p className="text-[#050505]/70 mb-6 max-w-md mx-auto">
              All submitted notes have been verified. Check back later for new submissions.
            </p>
            <Link
              href="/admin/notes"
              className="px-4 py-2 bg-[#4d61ff] text-white font-medium rounded-lg hover:bg-[#3a4cd1] transition-colors"
            >
              View All Notes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingNotesPage;
