'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import NoticeList from '@/components/admin/notice/NoticeList';
import { motion } from 'framer-motion';
import { Bell, RefreshCw } from 'lucide-react';

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

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/notices');
      if (!response.ok) throw new Error('Failed to fetch notices');
      const data = await response.json();
      setNotices(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notices';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto border-[0.25em] border-t-[#7BB4B1] border-r-[#EDDCD9] border-b-[#E99F4C] border-l-[#DE5499] rounded-full animate-spin"></div>
              <p className="mt-6 text-lg font-bold text-[#264143]">Loading notices...</p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#DE5499] p-8 text-center max-w-md relative overflow-hidden"
            >
              {/* Corner slice */}
              <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
              
              {/* Pattern background */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:0.8em_0.8em] pointer-events-none"></div>
              
              <div className="relative z-[1]">
                <div className="w-16 h-16 mx-auto flex items-center justify-center bg-[#DE5499]/20 border-[0.2em] border-[#DE5499] rounded-full mb-4">
                  <Bell className="w-8 h-8 text-[#DE5499]" />
                </div>
                <h3 className="text-xl font-bold text-[#264143] mb-2">Unable to Load Notices</h3>
                <p className="text-[#264143]/70 mb-6">{error}</p>
                <button
                  onClick={fetchNotices}
                  className="px-5 py-2.5 bg-white border-[0.2em] border-[#264143] rounded-[0.5em] shadow-[0.2em_0.2em_0_#7BB4B1] text-[#264143] font-bold flex items-center justify-center mx-auto hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#7BB4B1] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#7BB4B1] transition-all duration-200"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Try Again
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 py-8 px-4">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:18px_18px] md:bg-[length:24px_24px] pointer-events-none"></div>
      
      {/* Decorative blobs */}
      <div className="absolute top-[15%] right-[5%] w-[15vw] max-w-[8rem] aspect-square bg-[#DE5499]/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute bottom-[25%] left-[8%] w-[18vw] max-w-[10rem] aspect-square bg-[#7BB4B1]/10 rounded-full blur-xl pointer-events-none"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#7BB4B1] p-6 md:p-8 mb-8 relative"
        >
          {/* Corner slice */}
          <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-[#7BB4B1]/20 border-[0.15em] border-[#264143] rounded-[0.4em] shadow-[0.15em_0.15em_0_#DE5499]">
              <Bell className="w-6 h-6 text-[#264143]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#264143] mb-1">Notices Management</h1>
              <p className="text-[#264143]/70">
                Manage all notices for your institution here
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <NoticeList 
            notices={notices} 
            onRefresh={fetchNotices} 
          />
        </motion.div>
      </div>
    </div>
  );
}