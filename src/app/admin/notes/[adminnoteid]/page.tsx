'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AdminNoteClient from '@/components/admin/AdminNoteClient';
import { getAdminNoteById } from '@/lib/admin-note-actions';

export default function AdminNotePage() {
  const params = useParams();
  const noteId = params.adminnoteid as string;
  
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    async function loadNoteData() {
      try {
        setLoading(true);
        const noteData = await getAdminNoteById(noteId);
        setNote(noteData);
      } catch (err) {
        console.error("Failed to load note:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    
    if (noteId) {
      loadNoteData();
    }
  }, [noteId]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#264143]"></div>
      </div>
    );
  }
  
  if (error || !note) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h2 className="text-2xl font-bold text-[#264143]">Note not found</h2>
        <p className="text-[#264143]/70">The note you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }
    
  // Pass the data to the client component
  return <div className='bg-white'><AdminNoteClient note={note} /></div>;

}
