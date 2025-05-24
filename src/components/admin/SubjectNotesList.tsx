'use client';

import React, { useState } from 'react';
import {
  Trash2,
  ExternalLink,
  Download,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { deleteNote } from '@/lib/admin-notes-actions';
import { toast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

// Type for a note with all the information we need
interface NoteWithDetails {
  id: string;
  title: string;
  type: string;
  fileUrl: string;
  isPublic: boolean;  // Changed from isVerified to isPublic as per schema
  isRejected: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  authorName?: string;
  author?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  _count?: {
    likes: number;
    comments: number;
  };
}

interface SubjectNotesListProps {
  notes: NoteWithDetails[];
  subjectId: string;
  subjectName: string;
  onNoteDeleted?: () => void;
}

export default function SubjectNotesList({ notes, subjectId, subjectName, onNoteDeleted }: SubjectNotesListProps) {
  const [deletingNote, setDeletingNote] = useState<string | null>(null);
  const [filteredNotes, setFilteredNotes] = useState<NoteWithDetails[]>(notes);
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');

  // Function to handle note deletion
  const handleDeleteNote = async (noteId: string) => {
    try {
      setDeletingNote(noteId);
      await deleteNote(noteId);
      
      // Remove the note from the filtered list
      setFilteredNotes(prev => prev.filter(note => note.id !== noteId));
      
      // Notify parent that a note was deleted (for refreshing the list)
      if (onNoteDeleted) {
        onNoteDeleted();
      }
      
      toast({
        title: "Success",
        description: "Note was deleted successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to delete note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingNote(null);
    }
  };

  // Function to filter notes
  const filterNotes = (filterType: 'all' | 'verified' | 'pending' | 'rejected') => {
    setFilter(filterType);
    
    if (filterType === 'all') {
      setFilteredNotes(notes);
      return;
    }
      const filtered = notes.filter(note => {
      if (filterType === 'verified') return note.isPublic && !note.isRejected;
      if (filterType === 'pending') return !note.isPublic && !note.isRejected;
      if (filterType === 'rejected') return note.isRejected;
      return true;
    });
    
    setFilteredNotes(filtered);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#264143]">
          Notes for {subjectName}
        </h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => filterNotes('all')}
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              filter === 'all' 
                ? 'bg-[#264143] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => filterNotes('verified')}
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              filter === 'verified' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Verified
          </button>
          <button
            onClick={() => filterNotes('pending')}
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              filter === 'pending' 
                ? 'bg-amber-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => filterNotes('rejected')}
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              filter === 'rejected' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No notes found in this category</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredNotes.map((note) => (
            <div 
              key={note.id} 
              className="bg-white border-[0.15em] border-[#264143] rounded-[0.6em] p-4 shadow-[0.2em_0.2em_0] shadow-gray-200 hover:shadow-[0.3em_0.3em_0] transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-[#EDDCD9]">
                      <FileText className="w-5 h-5 text-[#264143]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#264143]">{note.title}</h3>
                      {note.isPublic && !note.isRejected && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" /> Verified
                      </Badge>
                    )}
                    
                    {!note.isPublic && !note.isRejected && (
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                        <AlertCircle className="w-3 h-3 mr-1" /> Pending
                      </Badge>
                    )}
                    
                    {note.isRejected && (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                        <XCircle className="w-3 h-3 mr-1" /> Rejected
                      </Badge>
                    )}
                    
                    <Badge variant="outline" className="bg-[#EDDCD9]/50 text-[#264143]">
                      {note.type}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    <p>Uploaded {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })} by {note.authorName || 'Unknown'}</p>
                    <p className="mt-1 flex items-center gap-3">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" /> {note.downloadCount} views
                      </span>
                      <span className="flex items-center">
                        <span className="i-heart mr-1" /> {note._count?.likes || 0} likes
                      </span>
                      <span className="flex items-center">
                        <span className="i-comment mr-1" /> {note._count?.comments || 0} comments
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Link 
                    href={`/admin/notes/${note.id}`}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                  
                  <a 
                    href={note.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-full transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button 
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                        disabled={deletingNote === note.id}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will permanently delete the note "{note.title}" and all associated data including likes and comments.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          {deletingNote === note.id ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
