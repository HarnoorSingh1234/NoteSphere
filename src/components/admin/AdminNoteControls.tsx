'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminNoteControlsProps {
  noteId: string;
}

export default function AdminNoteControls({ noteId }: AdminNoteControlsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setIsDeleting(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Note deleted successfully');
        setTimeout(() => {
          router.push('/admin/notes');
        }, 1500);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete note');
      }
    } catch (error: any) {
      console.error('Error deleting note:', error);
      setError(error.message || 'An error occurred while deleting the note');
      setConfirmDelete(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
  };

  return (
    <div className="mt-6 mb-8">
      <div className="bg-[#EDDCD9]/30 border-[0.15em] border-[#264143] rounded-[0.6em] p-5 relative">
        <div className="absolute top-[-0.6rem] left-[1rem] bg-[#DE5499] text-white px-3 py-1 text-xs font-bold rounded-[0.3rem] uppercase border-[0.1em] border-[#264143]">
          Admin Controls
        </div>

        {success ? (
          <div className="flex items-center justify-center p-4 bg-green-100/80 border border-green-300 rounded-md text-green-800">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            <p>{success}</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 bg-red-100/80 border border-red-300 rounded-md text-red-800 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <p>{error}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-[#264143] font-medium">
                {confirmDelete ? (
                  <span className="text-red-600 font-bold">Are you sure you want to delete this note? This action cannot be undone.</span>
                ) : (
                  <span>As an admin, you can delete this note if it violates site policies.</span>
                )}
              </div>

              <div className="flex gap-3">
                {confirmDelete && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={cancelDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-[0.4em] border-[0.1em] border-[#264143] font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`px-4 py-2 flex items-center gap-2 ${
                    confirmDelete
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  } rounded-[0.4em] border-[0.1em] border-[#264143] font-medium transition-colors`}
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting
                    ? 'Deleting...'
                    : confirmDelete
                    ? 'Confirm Delete'
                    : 'Delete Note'}
                </motion.button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
