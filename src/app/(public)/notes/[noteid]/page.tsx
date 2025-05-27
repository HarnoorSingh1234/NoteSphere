'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FileSymlink, FileText, AlertTriangle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import NoteDetailsClient from '@/components/subjects/NoteDetailsClient';
import BackButton from '@/components/Backbutton';
import { fetchNotePageData } from '@/lib/note-actions';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotePage() {
  // Use the useParams hook to get the noteid from the URL
  const params = useParams();
  const noteid = params.noteid as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pageData, setPageData] = useState<{
    note: any;
    similarNotes: any[];
    styling: { color: string; bgColor: string };
  } | null>(null);

  useEffect(() => {
    async function loadNoteData() {
      try {
        setLoading(true);
        const data = await fetchNotePageData(noteid);
        setPageData(data);
      } catch (err) {
        console.error("Failed to load note:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    
    if (noteid) {
      loadNoteData();
    }
  }, [noteid]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto border-[0.25em] border-t-[#7BB4B1] border-r-[#EDDCD9] border-b-[#E99F4C] border-l-[#DE5499] rounded-full animate-spin"></div>
          <p className="mt-6 text-lg font-bold text-[#264143]">Loading note...</p>
        </motion.div>
      </div>
    );
  }
  
  if (error || !pageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 py-12 px-4">
        <div className="container mx-auto max-w-xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#DE5499] p-8 text-center relative"
          >
            {/* Corner slice */}
            <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
            
            <div className="w-16 h-16 mx-auto bg-[#DE5499]/20 border-[0.15em] border-[#DE5499] rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-[#DE5499]" />
            </div>
            <h2 className="text-2xl font-bold text-[#264143] mb-3">Note not found</h2>
            <p className="text-[#264143]/70 mb-6">The note you're looking for doesn't exist or has been removed.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-white border-[0.2em] border-[#264143] text-[#264143] font-bold rounded-[0.4em] shadow-[0.2em_0.2em_0_#7BB4B1] flex items-center justify-center gap-2 hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#7BB4B1] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#7BB4B1] transition-all duration-200"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              <Link 
                href="/"
                className="px-5 py-2.5 bg-[#7BB4B1] text-white font-bold rounded-[0.4em] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#264143] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#264143] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#264143] transition-all duration-200"
              >
                Return Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  const { note, similarNotes, styling } = pageData;
  const { color, bgColor } = styling;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 py-8 px-4">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:18px_18px] md:bg-[length:24px_24px] pointer-events-none"></div>
      
      {/* Decorative blobs */}
      <div className="absolute top-[15%] right-[5%] w-[15vw] max-w-[8rem] aspect-square bg-[#DE5499]/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute bottom-[25%] left-[8%] w-[18vw] max-w-[10rem] aspect-square bg-[#7BB4B1]/10 rounded-full blur-xl pointer-events-none"></div>
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <BackButton subjectName={note.subject?.name || 'Subject'} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <NoteDetailsClient note={note} color={color} bgColor={bgColor} />
        </motion.div>
        
        {/* Display tags if available */}
        {note.tags && note.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 bg-white border-[0.25em] border-[#264143] rounded-[0.6em] p-5 shadow-[0.3em_0.3em_0_#DE5499] relative overflow-hidden"
          >
            {/* Corner slice */}
            <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
            
            {/* Pattern background */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:0.8em_0.8em] pointer-events-none"></div>
            
            <div className="relative z-[1]">
              <h3 className="text-lg font-bold text-[#264143] mb-3 flex items-center">
                <div className="w-7 h-7 bg-[#DE5499]/20 border-[0.15em] border-[#264143] rounded-[0.3em] flex items-center justify-center mr-2 shadow-[0.1em_0.1em_0_#7BB4B1]">
                  <TagIcon className="w-3.5 h-3.5 text-[#264143]" />
                </div>
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {note.tags.map((tag: any) => (
                    <motion.span 
                      key={tag.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      className="px-3 py-1 bg-[#EDDCD9] text-[#264143] border-[0.1em] border-[#264143]/30 rounded-full text-sm font-medium hover:bg-[#E99F4C]/30 transition-colors cursor-pointer"
                    >
                      {tag.name}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      
        {/* Recommended Related Materials */}
        {note.subject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 bg-white border-[0.25em] border-[#264143] rounded-[0.6em] p-6 shadow-[0.3em_0.3em_0_#7BB4B1] relative overflow-hidden"
          >
            {/* Corner slice */}
            <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
            
            {/* Decorative corner */}
            <div className="absolute top-[-1em] right-[-1em] w-12 h-12 bg-[#EDDCD9] transform rotate-45 translate-x-6 -translate-y-6"></div>
            
            {/* Pattern background */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:0.8em_0.8em] pointer-events-none"></div>
            
            <div className="relative z-[1]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#7BB4B1]/20 border-[0.15em] border-[#264143] rounded-[0.4em] flex items-center justify-center shadow-[0.15em_0.15em_0_#E99F4C]">
                  <FileSymlink className="w-5 h-5 text-[#264143]" />
                </div>
                <h2 className="text-xl font-bold text-[#264143]">Related Resources</h2>
              </div>
              
              <p className="text-[#264143]/80 mb-5">
                Explore more study materials from {note.subject.name}
              </p>
              
              <Link
                href={`/academics/subjects/${note.subjectId}`}
                className="inline-flex items-center px-5 py-2.5 bg-white border-[0.2em] border-[#264143] text-[#264143] font-bold rounded-[0.4em] shadow-[0.2em_0.2em_0_#7BB4B1] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#7BB4B1] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#7BB4B1] transition-all duration-200"
              >
                <FileSymlink className="w-4 h-4 mr-2" />
                View All Subject Materials
              </Link>
            </div>
          </motion.div>
        )}
        
        {/* Similar Notes */}
        {similarNotes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 bg-white border-[0.25em] border-[#264143] rounded-[0.6em] p-6 shadow-[0.3em_0.3em_0_#E99F4C] relative overflow-hidden"
          >
            {/* Corner slice */}
            <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
            
            {/* Pattern background */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:0.8em_0.8em] pointer-events-none"></div>
            
            <div className="relative z-[1]">
              <h2 className="text-xl font-bold text-[#264143] mb-5 flex items-center">
                <div className="w-8 h-8 bg-[#E99F4C]/20 border-[0.15em] border-[#264143] rounded-[0.3em] flex items-center justify-center mr-2 shadow-[0.1em_0.1em_0_#DE5499]">
                  <FileText className="w-4 h-4 text-[#264143]" />
                </div>
                Similar Notes
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {similarNotes.map((similarNote, index) => (
                    <motion.div 
                      key={similarNote.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Link 
                        href={`/notes/${similarNote.id}`}
                        className="flex items-start p-3 bg-[#EDDCD9]/20 border-[0.1em] border-[#264143]/30 rounded-[0.4em] hover:bg-[#EDDCD9]/50 hover:border-[#264143]/50 hover:translate-y-[-0.2em] hover:shadow-[0.2em_0.2em_0_rgba(0,0,0,0.05)] transition-all duration-200"
                      >
                        <div className="bg-white p-2 rounded-[0.3em] border-[0.1em] border-[#264143]/20 shadow-[0.1em_0.1em_0_#DE5499] mr-3">
                          <FileSymlink className="w-5 h-5 text-[#DE5499]" />
                        </div>
                        <div>
                          <h3 className="font-medium text-[#264143] line-clamp-1">{similarNote.title}</h3>
                          <p className="text-xs text-[#264143]/70">
                            {similarNote.author.firstName} {similarNote.author.lastName} • {similarNote._count.likes} likes
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Tag icon component for tags section
const TagIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
    <path d="M7 7h.01"></path>
  </svg>
);