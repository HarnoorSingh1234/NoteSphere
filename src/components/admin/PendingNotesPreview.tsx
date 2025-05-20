'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, CheckCircle, XCircle, Loader2, ExternalLink, ArrowRight } from "lucide-react";
import { Note } from '@/types/index';

export default function PendingNotesPreview() {
  const [pendingNotes, setPendingNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingNoteId, setProcessingNoteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingNotes = async () => {
      try {
        setLoading(true);
        // Fetch only the most recent 5 pending notes
        const response = await fetch('/api/admin/notes?isPublic=false&isRejected=false&limit=5');
        
        if (!response.ok) {
          throw new Error('Failed to fetch pending notes');
        }
        
        const data = await response.json();
        if (Array.isArray(data.notes)) {
          setPendingNotes(data.notes);        } else {
          throw new Error('Unexpected API response format');
        }
      } catch (err: any) {
        console.error('Error fetching pending notes:', err);
        setError(err.message || 'Failed to load pending notes');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingNotes();
  }, []);

  const handleVerification = async (noteId: string, action: 'approve' | 'reject') => {
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
        throw new Error(`Failed to ${action} note`);
      }
      
      // Update the local state after verification
      setPendingNotes(current => current.filter(note => note.id !== noteId));
    } catch (err: any) {
      console.error(`Error ${action}ing note:`, err);
    } finally {
      setProcessingNoteId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[0.6em] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#E99F4C] p-6 space-y-3 h-full">
        <h3 className="text-xl font-bold text-[#264143]">Pending Notes</h3>
        <div className="flex justify-center items-center py-12">
          <div className="w-10 h-10 border-4 border-[#E99F4C] rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-[0.6em] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#E99F4C] p-6 space-y-3 h-full">
        <h3 className="text-xl font-bold text-[#264143]">Pending Notes</h3>
        <div className="text-center text-red-500 py-6">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-[#E99F4C] text-white rounded-lg hover:bg-[#d78e3d] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[0.6em] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#E99F4C] p-6 space-y-3 h-full">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-[#264143]">Notes Awaiting Approval</h3>
        <Link 
          href="/admin/notes/pending" 
          className="text-sm text-[#E99F4C] hover:text-[#d78e3d] flex items-center"
        >
          View All <ArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </div>
      
      {pendingNotes.length === 0 ? (
        <div className="text-center text-[#264143]/70 py-8">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
          <p>No pending notes to review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingNotes.map((note) => (
            <div key={note.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between">
                <div className="flex items-start gap-3">
                  <FileText className="text-[#E99F4C] w-5 h-5 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#264143] line-clamp-1">{note.title}</h4>
                    <p className="text-xs text-[#264143]/70">
                      By {note.author.firstName} {note.author.lastName} • {note.type}
                    </p>
                  </div>
                </div>
                <Link href={`/notes/${note.id}`} target="_blank" className="text-[#4d61ff] hover:text-[#3a4cd1]">
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="mt-3 flex justify-end space-x-2">
                <button
                  onClick={() => handleVerification(note.id, 'approve')}
                  disabled={processingNoteId === note.id}
                  className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium ${
                    processingNoteId === note.id
                      ? 'bg-green-100 text-green-700 cursor-wait'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {processingNoteId === note.id ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  )}
                  Approve
                </button>
                <button
                  onClick={() => handleVerification(note.id, 'reject')}
                  disabled={processingNoteId === note.id}
                  className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium ${
                    processingNoteId === note.id
                      ? 'bg-red-100 text-red-700 cursor-wait'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {processingNoteId === note.id ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          href="/admin/notes/pending"
          className="block w-full py-2 px-4 bg-[#264143] text-white text-center font-medium rounded-lg hover:bg-[#1a2e30] transition"
        >
          Review All Pending Notes
        </Link>
      </div>
    </div>
  )
}