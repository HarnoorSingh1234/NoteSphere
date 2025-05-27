'use client';

import React, { useState } from 'react';
import { Plus, MessageCircle, AlertTriangle } from 'lucide-react';
import NoticeForm from './NoticeForm';
import NoticeCard from './NoticeCard';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Notice {
  id: string;
  title: string;
  description: string;
  driveLink: string;
  driveFileId?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

interface NoticeListProps {
  notices: Notice[];
  onRefresh: () => Promise<void>;
}

const NoticeList: React.FC<NoticeListProps> = ({ notices, onRefresh }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit' 
    });
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (noticeId: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;

    try {
      const response = await fetch(`/api/admin/notices/${noticeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete notice');

      toast.success('Notice deleted successfully');
      onRefresh();
    } catch (error) {
      toast.error('Failed to delete notice');
      console.error(error);
    }
  };

  const togglePublishStatus = async (notice: Notice) => {
    try {
      const response = await fetch(`/api/admin/notices/${notice.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublished: !notice.isPublished }),
      });

      if (!response.ok) throw new Error('Failed to update notice');

      toast.success(`Notice ${notice.isPublished ? 'unpublished' : 'published'} successfully`);
      onRefresh();
    } catch (error) {
      toast.error('Failed to update notice');
      console.error(error);
    }
  };
  
  const closeDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingNotice(null);
  };

  return (
    <>
      <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.35em_0.35em_0_#E99F4C] p-6 relative overflow-hidden">
        {/* Corner slice */}
        <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
        
        {/* Pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:0.8em_0.8em] pointer-events-none"></div>
        
        <div className="relative z-[1]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-bold text-[#264143] mb-1 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#264143]" />
                Notice List
              </h2>
              <p className="text-[#264143]/70">Manage all published and unpublished notices</p>
            </div>
            
            <motion.button
              onClick={() => setIsCreateDialogOpen(true)}
              whileHover={{ y: -4 }}
              whileTap={{ y: 0, scale: 0.98 }}
              className="px-5 py-2.5 bg-[#7BB4B1] text-white font-bold rounded-[0.4em] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#264143] hover:shadow-[0.25em_0.25em_0_#264143] transition-all duration-200 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Notice
            </motion.button>
          </div>

          <div className="space-y-6">
            {notices.length === 0 ? (
              <div className="bg-[#EDDCD9]/20 border-[0.15em] border-dashed border-[#264143]/20 rounded-[0.5em] p-8 text-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-16 h-16 mx-auto bg-[#E99F4C]/20 border-[0.15em] border-[#264143]/30 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8 text-[#E99F4C]" />
                  </div>
                  <p className="text-[#264143] font-medium mb-6">No notices created yet. Click on 'Create Notice' to add one.</p>
                  <motion.button
                    onClick={() => setIsCreateDialogOpen(true)}
                    whileHover={{ y: -4 }}
                    whileTap={{ y: 0, scale: 0.98 }}
                    className="px-5 py-2.5 bg-[#7BB4B1] text-white font-bold rounded-[0.4em] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#264143] hover:shadow-[0.25em_0.25em_0_#264143] transition-all duration-200 inline-flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Create Your First Notice
                  </motion.button>
                </motion.div>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {notices.map((notice, index) => (
                  <motion.div
                    key={notice.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <NoticeCard
                      notice={notice}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onTogglePublish={togglePublishStatus}
                      formatDate={formatDate}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Custom dialog implementation */}
      <AnimatePresence>
        {isCreateDialogOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 sm:p-8"
            onClick={closeDialog}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#DE5499] w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Corner slice */}
              <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
              
              <div className="relative z-[1]">
                <h2 className="text-xl font-bold text-[#264143] mb-6">
                  {editingNotice ? 'Edit Notice' : 'Create New Notice'}
                </h2>
                
                <NoticeForm 
                  editingNotice={editingNotice}
                  onClose={closeDialog}
                  onSuccess={() => {
                    onRefresh();
                    closeDialog();
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NoticeList;