'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Filter, Eye, DownloadCloud, ThumbsUp, MessageCircle, Book } from 'lucide-react';
import { Subject, Note } from '@/types';
import { getNoteTypeDetails, formatDate, formatAuthorName } from '@/components/subjects/utils';
import NoteCard from '@/components/subjects/NoteCard';
import { Note as NoteCardNote } from '@/components/subjects/types';
import SubjectNotesList from '@/components/admin/SubjectNotesList';
import { motion } from 'framer-motion';

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

  // Define color mappings for note types
  const noteTypeColors = {
    PDF: '#ff3e00',
    PPT: '#E99F4C',
    LECTURE: '#7BB4B1',
    HANDWRITTEN: '#DE5499',
    default: '#264143'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto border-[0.25em] border-t-[#7BB4B1] border-r-[#EDDCD9] border-b-[#E99F4C] border-l-[#DE5499] rounded-full animate-spin"></div>
          <p className="mt-6 text-xl font-medium text-[#264143]">Loading subject notes...</p>
        </div>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 flex items-center justify-center p-8">
        <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] overflow-hidden p-8 text-center max-w-md relative">
          {/* Corner slice */}
          <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
          
          <div className="w-20 h-20 mx-auto flex items-center justify-center bg-[#DE5499]/10 border-[0.2em] border-[#DE5499] rounded-full mb-4">
            <FileText className="w-10 h-10 text-[#DE5499]" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-[#264143]">Failed to Load Subject</h2>
          <p className="mt-3 text-[#264143]/70">{error || 'Subject not found'}</p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => fetchSubjectWithNotes()}
              className="px-5 py-2.5 bg-[#7BB4B1] text-white border-[0.2em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#E99F4C] font-bold hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#E99F4C] transition-all duration-200"
            >
              Try Again
            </button>
            <Link
              href="/admin/notes"
              className="px-5 py-2.5 bg-white text-[#264143] border-[0.2em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#E99F4C] font-bold hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#E99F4C] transition-all duration-200"
            >
              Back to Notes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 pt-8 md:pt-10 pb-12 md:pb-16 px-4 md:px-6 relative">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:18px_18px] md:bg-[length:24px_24px] pointer-events-none"></div>
      
      {/* Decorative blobs */}
      <div className="absolute top-[10%] right-[5%] w-[15vw] max-w-[8rem] aspect-square bg-[#DE5499]/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[8%] w-[18vw] max-w-[10rem] aspect-square bg-[#7BB4B1]/10 rounded-full blur-xl pointer-events-none"></div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Subject Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-[#264143]/70 mb-3 font-medium">
              <Link href="/admin/notes" className="hover:text-[#7BB4B1] transition-colors">
                Notes
              </Link>
              <span>/</span>
              <Link 
                href={`/admin/years/${subject.semester?.year?.id}`}
                className="hover:text-[#7BB4B1] transition-colors"
              >
                Year {subject.semester?.year?.number}
              </Link>
              <span>/</span>
              <Link 
                href={`/admin/semesters/${subject.semester?.id}`}
                className="hover:text-[#7BB4B1] transition-colors"
              >
                Semester {subject.semester?.number}
              </Link>
              <span>/</span>
              <span className="text-[#7BB4B1]">{subject.name}</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-14 h-14 bg-[#7BB4B1]/20 border-[0.2em] border-[#264143] rounded-[0.5em] shadow-[0.2em_0.2em_0_#E99F4C] transition-all duration-200 hover:rotate-[-5deg] hover:scale-105 flex-shrink-0">
                  <Book className="w-7 h-7 text-[#264143]" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-[#264143]">
                    {subject.name} <span className="text-[#7BB4B1]">({subject.code})</span>
                  </h1>
                  <p className="text-[#264143]/70 mt-1">
                    Year {subject.semester?.year?.number}, Semester {subject.semester?.number}
                  </p>
                </div>
              </div>
              
              <Link
                href="/admin/notes"
                className="px-5 py-2.5 bg-[#264143] text-white border-[0.2em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#E99F4C] font-bold flex items-center gap-2 hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#E99F4C] transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>All Notes</span>
              </Link>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Filters */}
          <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] p-5 mb-6 shadow-[0.3em_0.3em_0_#7BB4B1] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#EDDCD9] transform rotate-45 translate-x-8 -translate-y-8"></div>
            
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-[#264143]/10 rounded-full">
                  <Filter className="w-4 h-4 text-[#264143]" />
                </div>
                <span className="font-bold text-[#264143]">Filters:</span>
              </div>
              
              {/* Visibility Filter */}
              <div className="flex flex-wrap gap-2 z-10">
                <button
                  onClick={() => setVisibilityFilter('all')}
                  className={`px-4 py-2 text-sm border-[0.15em] rounded-[0.3em] transition-all duration-200 ${
                    visibilityFilter === 'all'
                      ? 'bg-[#7BB4B1] text-white border-[#264143] shadow-[0.15em_0.15em_0_#264143]'
                      : 'border-[#264143]/20 text-[#264143] hover:border-[#264143] hover:shadow-[0.1em_0.1em_0_#E99F4C]'
                  }`}
                >
                  All Notes
                </button>
                <button
                  onClick={() => setVisibilityFilter('public')}
                  className={`px-4 py-2 text-sm border-[0.15em] rounded-[0.3em] transition-all duration-200 ${
                    visibilityFilter === 'public'
                      ? 'bg-[#7BB4B1] text-white border-[#264143] shadow-[0.15em_0.15em_0_#264143]'
                      : 'border-[#264143]/20 text-[#264143] hover:border-[#264143] hover:shadow-[0.1em_0.1em_0_#E99F4C]'
                  }`}
                >
                  Public Only
                </button>
                <button
                  onClick={() => setVisibilityFilter('private')}
                  className={`px-4 py-2 text-sm border-[0.15em] rounded-[0.3em] transition-all duration-200 ${
                    visibilityFilter === 'private'
                      ? 'bg-[#E99F4C] text-white border-[#264143] shadow-[0.15em_0.15em_0_#264143]'
                      : 'border-[#264143]/20 text-[#264143] hover:border-[#264143] hover:shadow-[0.1em_0.1em_0_#E99F4C]'
                  }`}
                >
                  Pending Only
                </button>
              </div>
              
              {/* Type Filter */}
              <div className="flex flex-wrap gap-2 ml-auto z-10">
                <button
                  onClick={() => setTypeFilter('all')}
                  className={`px-4 py-2 text-sm border-[0.15em] rounded-[0.3em] transition-all duration-200 ${
                    typeFilter === 'all'
                      ? 'bg-[#264143] text-white border-[#264143] shadow-[0.15em_0.15em_0_#7BB4B1]'
                      : 'border-[#264143]/20 text-[#264143] hover:border-[#264143] hover:shadow-[0.1em_0.1em_0_#7BB4B1]'
                  }`}
                >
                  All Types
                </button>
                <button
                  onClick={() => setTypeFilter('PDF')}
                  className={`px-4 py-2 text-sm border-[0.15em] rounded-[0.3em] transition-all duration-200 ${
                    typeFilter === 'PDF'
                      ? 'bg-[#ff3e00] text-white border-[#264143] shadow-[0.15em_0.15em_0_#7BB4B1]'
                      : 'border-[#264143]/20 text-[#264143] hover:border-[#264143] hover:shadow-[0.1em_0.1em_0_#7BB4B1]'
                  }`}
                >
                  PDF
                </button>
                <button
                  onClick={() => setTypeFilter('PPT')}
                  className={`px-4 py-2 text-sm border-[0.15em] rounded-[0.3em] transition-all duration-200 ${
                    typeFilter === 'PPT'
                      ? 'bg-[#E99F4C] text-white border-[#264143] shadow-[0.15em_0.15em_0_#7BB4B1]'
                      : 'border-[#264143]/20 text-[#264143] hover:border-[#264143] hover:shadow-[0.1em_0.1em_0_#7BB4B1]'
                  }`}
                >
                  PPT
                </button>
                <button
                  onClick={() => setTypeFilter('LECTURE')}
                  className={`px-4 py-2 text-sm border-[0.15em] rounded-[0.3em] transition-all duration-200 ${
                    typeFilter === 'LECTURE'
                      ? 'bg-[#7BB4B1] text-white border-[#264143] shadow-[0.15em_0.15em_0_#E99F4C]'
                      : 'border-[#264143]/20 text-[#264143] hover:border-[#264143] hover:shadow-[0.1em_0.1em_0_#7BB4B1]'
                  }`}
                >
                  Lecture
                </button>
                <button
                  onClick={() => setTypeFilter('HANDWRITTEN')}
                  className={`px-4 py-2 text-sm border-[0.15em] rounded-[0.3em] transition-all duration-200 ${
                    typeFilter === 'HANDWRITTEN'
                      ? 'bg-[#DE5499] text-white border-[#264143] shadow-[0.15em_0.15em_0_#7BB4B1]'
                      : 'border-[#264143]/20 text-[#264143] hover:border-[#264143] hover:shadow-[0.1em_0.1em_0_#7BB4B1]'
                  }`}
                >
                  Handwritten
                </button>
              </div>
            </div>
            
            {/* Corner slice */}
            <div className="absolute bottom-0 left-0 w-[1.2em] h-[1.2em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Notes List */}
          {filteredNotes.length > 0 ? (
            <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#E99F4C] overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:0.8em_0.8em] pointer-events-none"></div>
              
              <SubjectNotesList 
                notes={filteredNotes.map(note => ({
                  id: note.id,
                  title: note.title,
                  type: note.type,
                  fileUrl: note.fileUrl || '',
                  isPublic: note.isPublic,
                  isRejected: note.isRejected,
                  downloadCount: note.downloadCount,
                  createdAt: typeof note.createdAt === 'string' ? note.createdAt : 
                            note.createdAt instanceof Date ? note.createdAt.toISOString() : 
                            String(note.createdAt),
                  updatedAt: typeof note.updatedAt === 'string' ? note.updatedAt : 
                            note.updatedAt instanceof Date ? note.updatedAt.toISOString() : 
                            String(note.updatedAt),
                  authorName: note.author ? `${note.author.firstName} ${note.author.lastName}` : 'Unknown',
                  author: note.author,
                  _count: {
                    likes: note.likes?.length || 0,
                    comments: note.comments?.length || 0
                  }
                }))}
                subjectId={subjectId as string}
                subjectName={subject.name}
                onNoteDeleted={fetchSubjectWithNotes}
              />
              
              {/* Corner slice */}
              <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
            </div>
          ) : (
            <div className="bg-white border-[0.25em] border-dashed border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#7BB4B1] text-center p-12 relative">
              {/* Pattern background */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(235,225,220,0.4)_25%,transparent_25%,transparent_50%,rgba(235,225,220,0.4)_50%,rgba(235,225,220,0.4)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] pointer-events-none opacity-30"></div>
              
              <div className="w-20 h-20 mx-auto flex items-center justify-center bg-[#EDDCD9] border-[0.2em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#E99F4C] mb-4 transform rotate-[-5deg] hover:rotate-[5deg] transition-all duration-300">
                <FileText className="w-10 h-10 text-[#264143]" />
              </div>
              <h3 className="text-2xl font-bold text-[#264143] mb-3">No Notes Found</h3>
              <p className="text-[#264143]/70 mb-6 max-w-md mx-auto">
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
                  className="px-5 py-2.5 bg-[#7BB4B1] text-white border-[0.2em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#E99F4C] font-bold hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#E99F4C] transition-all duration-200"
                >
                  Clear Filters
                </button>
              ) : (
                <Link
                  href="/admin/notes"
                  className="px-5 py-2.5 bg-[#7BB4B1] text-white border-[0.2em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#E99F4C] font-bold hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#E99F4C] transition-all duration-200"
                >
                  Back to All Notes
                </Link>
              )}
              
              {/* Corner slice */}
              <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSubjectNotesPage;