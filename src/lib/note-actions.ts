'use server';

import { notFound } from 'next/navigation';
import { getPublicNoteById, getSimilarNotes, getNoteTypeDetails } from '@/services/noteService';

/**
 * Fetches a note and related data by ID
 * Server action to handle fetching note details from the server
 */
export async function fetchNotePageData(noteId: string) {
  if (!noteId) notFound();
  
  // Fetch note with related data using the service
  const note = await getPublicNoteById(noteId);

  if (!note) {
    notFound();
  }
  
  // Fetch similar notes from the same subject (limited to 3)
  const similarNotes = await getSimilarNotes(note.subjectId, note.id);
  
  // Get styling based on note type
  const { color, bgColor } = getNoteTypeDetails(note.type);
  
  return {
    note,
    similarNotes,
    styling: { color, bgColor }
  };
}

/**
 * Increments the view count for a note
 */
export async function incrementNoteViews(noteId: string) {
  try {
    const response = await fetch(`/api/notes/${noteId}/views`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      console.error('Failed to increment note views');
    }
    
    return response.ok;
  } catch (error) {
    console.error('Error incrementing note views:', error);
    return false;
  }
}
