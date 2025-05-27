'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, XCircle, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { Note } from '@/types/index';
import AdminNoteCard from '@/components/admin/AdminNoteCard';
import { calculateRemainingHours } from '@/lib/note-rejection';
import { motion, AnimatePresence } from 'framer-motion';

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
      
      // Show success notification
      alert(`Note ${action === 'restore' ? 'restored to pending' : 'published'} successfully`);
      
    } catch (err: any) {
      console.error(`Error ${action === 'restore' ? 'restoring' : 'publishing'} note:`, err);
      alert(err.message || `Failed to ${action} note`);
    } finally {
      setProcessingNoteId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto border-[0.25em] border-t-[#DE5499] border-r-[#EDDCD9] border-b-[#7BB4B1] border-l-[#E99F4C] rounded-full animate-spin"></div>
          <p className="mt-6 text-lg font-bold text-[#264143]">Loading rejected notes...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md p-8 bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#DE5499] relative"
        >
          {/* Corner slice */}
          <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
          
          <div className="w-16 h-16 mx-auto flex items-center justify-center bg-[#DE5499]/20 border-[0.2em] border-[#DE5499] rounded-full">
            <XCircle className="w-8 h-8 text-[#DE5499]" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-[#264143]">Failed to Load Rejected Notes</h2>
          <p className="mt-2 text-[#264143]/70">{error}</p>
          <button
            onClick={() => fetchRejectedNotes()}
            className="mt-6 px-5 py-2.5 bg-white border-[0.2em] border-[#264143] rounded-[0.5em] shadow-[0.2em_0.2em_0_#7BB4B1] text-[#264143] font-bold flex items-center justify-center mx-auto hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#7BB4B1] transition-all duration-200"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 py-8">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:18px_18px] md:bg-[length:24px_24px] pointer-events-none"></div>
      
      {/* Decorative blobs */}
      <div className="absolute top-[15%] right-[8%] w-[15vw] max-w-[8rem] aspect-square bg-[#DE5499]/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute bottom-[25%] left-[5%] w-[18vw] max-w-[10rem] aspect-square bg-[#7BB4B1]/10 rounded-full blur-xl pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#DE5499] p-6 md:p-8 mb-8 relative"
        >
          {/* Corner slice */}
          <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-[#DE5499]/20 border-[0.15em] border-[#264143] rounded-[0.4em] shadow-[0.15em_0.15em_0_#E99F4C]">
                <XCircle className="w-5 h-5 text-[#DE5499]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#264143] mb-1">Rejected Notes</h1>
                <p className="text-[#264143]/70">
                  Notes that have been rejected and pending deletion
                </p>
              </div>
            </div>
            
            <Link
              href="/admin/notes"
              className="px-4 py-2.5 bg-white border-[0.2em] border-[#264143] text-[#264143] font-bold rounded-[0.4em] shadow-[0.2em_0.2em_0_#7BB4B1] flex items-center gap-2 hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#7BB4B1] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#7BB4B1] transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>All Notes</span>
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#DE5499] relative overflow-hidden"
        >
          {/* Pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:0.8em_0.8em] pointer-events-none"></div>
          
          {/* Decorative corner */}
          <div className="absolute top-[-1em] right-[-1em] w-12 h-12 bg-[#EDDCD9] transform rotate-45 translate-x-6 -translate-y-6"></div>
          
          {/* Corner slice */}
          <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
          
          <div className="relative z-[1]">
            {rejectedNotes.length > 0 ? (
              <>
                <div className="p-6 border-b-[0.15em] border-[#264143]/20 bg-[#DE5499]/10">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#DE5499]/20 border-[0.15em] border-[#264143] rounded-[0.4em] shadow-[0.15em_0.15em_0_#E99F4C] flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-[#DE5499]" />
                    </div>
                    <div>
                      <p className="text-[#264143] font-bold text-lg mb-1">Rejected notes are automatically deleted after 48 hours</p>
                      <p className="text-[#264143]/70">After rejection, notes are kept for 48 hours before permanent deletion. The author can see rejected notes and re-submit if needed.</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 grid grid-cols-1 gap-6">
                  <AnimatePresence mode="popLayout">
                    {rejectedNotes.map((note, index) => {
                      const remainingHours = note.rejectedAt ? calculateRemainingHours(note.rejectedAt) : 48;
                      const isProcessing = processingNoteId === note.id;
                      
                      return (
                        <motion.div 
                          key={note.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="relative"
                        >
                          <AdminNoteCard 
                            note={note} 
                            showUnrejectActions={true}
                            onUnreject={handleUnrejectNote}
                            isProcessing={isProcessing}
                            showActions={true}
                          />
                          
                          <div className="absolute top-4 right-4 bg-white border-[0.1em] border-[#264143] text-[#264143] text-xs font-bold px-3 py-1 rounded-[0.3em] shadow-[0.1em_0.1em_0_#DE5499] transform rotate-2 z-20">
                            <motion.div
                              initial={{ scale: 1 }}
                              animate={{ scale: remainingHours < 12 ? [1, 1.1, 1] : 1 }}
                              transition={{ 
                                repeat: remainingHours < 12 ? Infinity : 0, 
                                duration: 2,
                                repeatDelay: 3
                              }}
                            >
                              {remainingHours > 0 ? `${remainingHours}h remaining` : 'Deletion pending'}
                            </motion.div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25 
                  }}
                >
                  <div className="w-20 h-20 mx-auto flex items-center justify-center bg-[#7BB4B1]/20 border-[0.2em] border-[#7BB4B1] rounded-full mb-4 shadow-[0.2em_0.2em_0_#E99F4C]">
                    <CheckCircle className="w-10 h-10 text-[#7BB4B1]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#264143] mb-2">No Rejected Notes</h3>
                  <p className="text-[#264143]/70 mb-6 max-w-md mx-auto">
                    There are no rejected notes at the moment. Rejected notes will appear here for 48 hours before they're permanently deleted.
                  </p>
                  <Link
                    href="/admin/notes"
                    className="px-5 py-2.5 bg-white border-[0.2em] border-[#264143] text-[#264143] font-bold rounded-[0.4em] shadow-[0.2em_0.2em_0_#7BB4B1] inline-flex items-center gap-2 hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#7BB4B1] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#7BB4B1] transition-all duration-200"
                  >
                    View All Notes
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RejectedNotesPage;