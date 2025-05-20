'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Filter, Eye, DownloadCloud, ThumbsUp, MessageCircle } from 'lucide-react';
import { Subject, Note } from '@/types';
import { getNoteTypeDetails, formatDate, formatAuthorName } from '@/components/subjects/utils';
import NoteCard from '@/components/subjects/NoteCard';
import { Note as NoteCardNote } from '@/components/subjects/types';

// Helper function to convert Note to NoteCardNote
const convertToNoteCardType = (note: Note): NoteCardNote => {
  return {
    ...note,
    createdAt: note.createdAt instanceof Date ? note.createdAt.toISOString() : note.createdAt,
    updatedAt: note.updatedAt instanceof Date ? note.updatedAt.toISOString() : note.updatedAt
  };
};

const AdminSubjectNotesPage = () => {
  const params = useParams();
  const subjectId = params.subjectid;
  const router = useRouter();
  
  const [subject, setSubject] = useState<Subject | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'private'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    if (subjectId) {
      fetchSubjectWithNotes();
    }
  }, [subjectId]);

  const fetchSubjectWithNotes = async () => {
    try {
      setLoading(true);
      
      // Use the admin endpoint to get all notes for this subject
      const response = await fetch(`/api/admin/subjects/${subjectId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch subject data');
      }
      
      const data = await response.json();
      setSubject(data.subject);
      setNotes(data.subject.notes || []);
    } catch (err: any) {
      console.error('Error fetching subject data:', err);
      setError(err.message || 'Failed to load subject data');
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = React.useMemo(() => {
    let filtered = [...notes];
    
    // Apply visibility filter
    if (visibilityFilter === 'public') {
      filtered = filtered.filter(note => note.isPublic);
    } else if (visibilityFilter === 'private') {
      filtered = filtered.filter(note => !note.isPublic);
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(note => 
        note.type && note.type.toLowerCase() === typeFilter.toLowerCase()
      );
    }
    
    return filtered;
  }, [notes, visibilityFilter, typeFilter]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-t-[#4d61ff] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-[#050505]">Loading subject data...</p>
        </div>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto flex items-center justify-center bg-red-100 rounded-full">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-[#050505]">Failed to Load Subject</h2>
          <p className="mt-2 text-[#050505]/70">{error || 'Subject not found'}</p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => fetchSubjectWithNotes()}
              className="px-4 py-2 bg-[#4d61ff] text-white font-medium rounded-lg hover:bg-[#3a4cd1] transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/admin/notes"
              className="px-4 py-2 bg-white border border-gray-300 text-[#050505] font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Notes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Subject Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[#050505]/70 mb-2">
          <Link href="/admin/notes" className="hover:text-[#050505] transition-colors">
            Notes
          </Link>
          <span>/</span>
          <Link 
            href={`/admin/years/${subject.semester?.year?.id}`}
            className="hover:text-[#050505] transition-colors"
          >
            Year {subject.semester?.year?.number}
          </Link>
          <span>/</span>
          <Link 
            href={`/admin/semesters/${subject.semester?.id}`}
            className="hover:text-[#050505] transition-colors"
          >
            Semester {subject.semester?.number}
          </Link>
          <span>/</span>
          <span className="text-[#050505] font-medium">{subject.name}</span>
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#050505] mb-2">
              {subject.name} ({subject.code})
            </h1>
            <p className="text-[#050505]/70">
              Year {subject.semester?.year?.number}, Semester {subject.semester?.number}
            </p>
          </div>
          
          <Link
            href="/admin/notes"
            className="px-5 py-2.5 bg-[#050505] text-white font-bold rounded-lg flex items-center gap-2 hover:bg-[#333333] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>All Notes</span>
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white border-[0.15em] border-[#050505] rounded-[0.6em] p-4 mb-6 shadow-[0.2em_0.2em_0_#050505]">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#050505]/70" />
            <span className="font-medium text-[#050505]">Filters:</span>
          </div>
          
          {/* Visibility Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setVisibilityFilter('all')}
              className={`px-3 py-1.5 text-sm rounded-lg border ${
                visibilityFilter === 'all'
                  ? 'bg-[#4d61ff] text-white border-[#4d61ff]'
                  : 'border-gray-300 text-[#050505] hover:bg-gray-50'
              }`}
            >
              All Notes
            </button>
            <button
              onClick={() => setVisibilityFilter('public')}
              className={`px-3 py-1.5 text-sm rounded-lg border ${
                visibilityFilter === 'public'
                  ? 'bg-green-500 text-white border-green-500'
                  : 'border-gray-300 text-[#050505] hover:bg-gray-50'
              }`}
            >
              Public Only
            </button>
            <button
              onClick={() => setVisibilityFilter('private')}
              className={`px-3 py-1.5 text-sm rounded-lg border ${
                visibilityFilter === 'private'
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'border-gray-300 text-[#050505] hover:bg-gray-50'
              }`}
            >
              Pending Only
            </button>
          </div>
          
          {/* Type Filter */}
          <div className="flex flex-wrap gap-2 ml-auto">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 text-sm rounded-lg border ${
                typeFilter === 'all'
                  ? 'bg-[#050505] text-white border-[#050505]'
                  : 'border-gray-300 text-[#050505] hover:bg-gray-50'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('PDF')}
              className={`px-3 py-1.5 text-sm rounded-lg border ${
                typeFilter === 'PDF'
                  ? 'bg-[#ff3e00] text-white border-[#ff3e00]'
                  : 'border-gray-300 text-[#050505] hover:bg-gray-50'
              }`}
            >
              PDF
            </button>
            <button
              onClick={() => setTypeFilter('PPT')}
              className={`px-3 py-1.5 text-sm rounded-lg border ${
                typeFilter === 'PPT'
                  ? 'bg-[#E99F4C] text-white border-[#E99F4C]'
                  : 'border-gray-300 text-[#050505] hover:bg-gray-50'
              }`}
            >
              PPT
            </button>
            <button
              onClick={() => setTypeFilter('LECTURE')}
              className={`px-3 py-1.5 text-sm rounded-lg border ${
                typeFilter === 'LECTURE'
                  ? 'bg-[#4d61ff] text-white border-[#4d61ff]'
                  : 'border-gray-300 text-[#050505] hover:bg-gray-50'
              }`}
            >
              Lecture
            </button>
            <button
              onClick={() => setTypeFilter('HANDWRITTEN')}
              className={`px-3 py-1.5 text-sm rounded-lg border ${
                typeFilter === 'HANDWRITTEN'
                  ? 'bg-[#DE5499] text-white border-[#DE5499]'
                  : 'border-gray-300 text-[#050505] hover:bg-gray-50'
              }`}
            >
              Handwritten
            </button>
          </div>
        </div>
      </div>
      
      {/* Notes List */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div 
              key={note.id}
              className={`relative ${!note.isPublic ? 'border-2 border-amber-500 rounded-[0.8em]' : ''}`}
            >
              {!note.isPublic && (
                <div className="absolute top-2 right-2 z-10 bg-amber-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                  Pending
                </div>
              )}
              <NoteCard note={convertToNoteCardType(note)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border-[0.15em] border-dashed border-[#050505] rounded-[0.6em] text-center p-12">
          <FileText className="w-16 h-16 mx-auto text-[#050505]/40 mb-4" />
          <h3 className="text-xl font-bold text-[#050505] mb-2">No Notes Found</h3>
          <p className="text-[#050505]/70 mb-6 max-w-md mx-auto">
            {visibilityFilter !== 'all' || typeFilter !== 'all'
              ? 'No notes match your current filters. Try adjusting your filter settings.'
              : 'There are no notes yet for this subject.'}
          </p>
          {visibilityFilter !== 'all' || typeFilter !== 'all' ? (
            <button
              onClick={() => {
                setVisibilityFilter('all');
                setTypeFilter('all');
              }}
              className="px-4 py-2 bg-[#4d61ff] text-white font-medium rounded-lg hover:bg-[#3a4cd1] transition-colors"
            >
              Clear Filters
            </button>
          ) : (
            <Link
              href="/admin/notes"
              className="px-4 py-2 bg-[#4d61ff] text-white font-medium rounded-lg hover:bg-[#3a4cd1] transition-colors"
            >
              Back to All Notes
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminSubjectNotesPage;
