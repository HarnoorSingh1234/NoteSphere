'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, CheckCircle, XCircle, RefreshCw, Clock } from 'lucide-react';
import { Note } from '@/types/index';
import AdminNoteCard from '@/components/admin/AdminNoteCard';
import { motion, AnimatePresence } from 'framer-motion';

const PendingNotesPage = () => {
  const [pendingNotes, setPendingNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      
      // Show a success message - we'll replace this with a toast notification in the future
      const message = action === 'approve' ? 'Note approved successfully!' : 'Note rejected successfully';
      alert(message);
    } catch (err: any) {
      console.error(`Error ${action}ing note:`, err);
      alert(err.message || `Failed to ${action} note`);
    } finally {
      setProcessingNoteId(null);
    }
  };

  if (loading && pendingNotes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto border-[0.25em] border-t-[#7BB4B1] border-r-[#EDDCD9] border-b-[#E99F4C] border-l-[#DE5499] rounded-full animate-spin"></div>
          <p className="mt-6 text-lg font-bold text-[#264143]">Loading pending notes...</p>
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
          <h2 className="mt-4 text-xl font-bold text-[#264143]">Failed to Load Pending Notes</h2>
          <p className="mt-2 text-[#264143]/70">{error}</p>
          <button
            onClick={() => fetchPendingNotes()}
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
      <div className="absolute top-[10%] right-[5%] w-[15vw] max-w-[8rem] aspect-square bg-[#DE5499]/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[8%] w-[18vw] max-w-[10rem] aspect-square bg-[#7BB4B1]/10 rounded-full blur-xl pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] p-6 md:p-8 mb-8 relative"
        >
          {/* Corner slice */}
          <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-[#E99F4C]/20 border-[0.15em] border-[#264143] rounded-[0.4em] shadow-[0.15em_0.15em_0_#DE5499]">
                <Clock className="w-5 h-5 text-[#264143]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#264143] mb-1">Pending Notes</h1>
                <p className="text-[#264143]/70">
                  Review and approve or reject notes that are waiting for verification
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
            {pendingNotes.length > 0 ? (
              <div className="p-6">
                <AnimatePresence mode="popLayout">
                  {pendingNotes.map((note, index) => (
                    <motion.div 
                      key={note.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="mb-5 last:mb-0"
                    >
                      <AdminNoteCard 
                        note={note} 
                        onApprove={(noteId: string) => handleNoteVerification(noteId, 'approve')}
                        onReject={(noteId: string) => handleNoteVerification(noteId, 'reject')}
                        showActions={true}
                        isProcessing={processingNoteId === note.id}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
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
                  <h3 className="text-xl font-bold text-[#264143] mb-2">No Pending Notes</h3>
                  <p className="text-[#264143]/70 mb-6 max-w-md mx-auto">
                    All submitted notes have been verified. Check back later for new submissions.
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

export default PendingNotesPage;