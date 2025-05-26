'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Calendar, Filter, X } from 'lucide-react';

import PageHeader from '@/components/academics/PageHeader';
import NoticesList from '@/components/academics/notices/NoticesList';
import NoticeSkeleton from '@/components/academics/notices/NoticeSkeleton';
import NoNoticesFound from '@/components/academics/notices/NoNoticesFound';
import { Notice as PrismaNotice } from '@prisma/client';

// Use a type that matches the NoticesList component's expectations
interface Notice extends PrismaNotice {
  author: {
    firstName: string;
    lastName: string;
  };
  likes: { userId: string }[];
  comments: {
    id: string;
    content: string;
    createdAt: string;
    user: {
      firstName: string;
      lastName: string;
    };
  }[];
  _count: {
    likes: number;
    comments: number;
  };
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState(false);
  const { user, isLoaded } = useUser();

  // Fetch notices on component mount
  useEffect(() => {
    fetchNotices();
  }, []);

  // Filter notices when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredNotices(notices);
      setFilterActive(false);
    } else {
      const filtered = notices.filter(notice => 
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        notice.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotices(filtered);
      setFilterActive(true);
    }
  }, [searchTerm, notices]);

  // Function to fetch all notices
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notices');
      if (!response.ok) throw new Error('Failed to fetch notices');
      const data = await response.json();

      // Ensure data has the correct shape with all required fields
      const formattedNotices = data.map((notice: any) => ({
        ...notice,
        likes: notice.likes || [],
        comments: notice.comments || [],
        _count: notice._count || { likes: 0, comments: 0 },
        createdAt: notice.createdAt.toString(), // Ensure createdAt is a string
        updatedAt: notice.updatedAt.toString(), // Ensure updatedAt is a string
      }));

      setNotices(formattedNotices);
      setFilteredNotices(formattedNotices);
    } catch (error) {
      toast.error('Failed to fetch notices');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 pt-6 md:pt-10 pb-12 md:pb-16 px-4 md:px-6 relative">
        {/* Background patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:18px_18px] md:bg-[length:24px_24px] pointer-events-none"></div>
        
        {/* Decorative blobs */}
        <div className="absolute top-[10%] right-[5%] w-[15vw] max-w-[8rem] aspect-square bg-[#DE5499]/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute top-[30%] left-[8%] w-[18vw] max-w-[10rem] aspect-square bg-[#7BB4B1]/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute bottom-[15%] right-[10%] w-[20vw] max-w-[12rem] aspect-square bg-[#E99F4C]/10 rounded-full blur-xl pointer-events-none"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex items-center mb-6 md:mb-8 gap-4">
            <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white border-[0.25em] border-[#264143] rounded-[0.5em] shadow-[0.25em_0.25em_0_#E99F4C]">
              <Bell className="w-6 h-6 md:w-7 md:h-7 text-[#7BB4B1]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#264143]">Latest Notices</h1>
          </div>
          
          <div className="mb-8 md:mb-10">
            <p className="text-[#264143]/80 text-lg mb-6 max-w-3xl">
              Stay updated with the latest announcements, events, and important notifications from your institution.
            </p>
            
            {/* Search input placeholder */}
            <div className="bg-white h-14 rounded-lg border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#E99F4C] animate-pulse"></div>
          </div>
          
          <NoticeSkeleton count={3} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 pt-6 md:pt-10 pb-12 md:pb-16 px-4 md:px-6 relative">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:18px_18px] md:bg-[length:24px_24px] pointer-events-none"></div>
      
      {/* Decorative blobs */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-[10%] right-[5%] w-[15vw] max-w-[8rem] aspect-square bg-[#DE5499]/10 rounded-full blur-xl pointer-events-none"
      ></motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="absolute top-[30%] left-[8%] w-[18vw] max-w-[10rem] aspect-square bg-[#7BB4B1]/10 rounded-full blur-xl pointer-events-none"
      ></motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.4 }}
        className="absolute bottom-[15%] right-[10%] w-[20vw] max-w-[12rem] aspect-square bg-[#E99F4C]/10 rounded-full blur-xl pointer-events-none"
      ></motion.div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center mb-6 md:mb-8 gap-4"
        >
          <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white border-[0.25em] border-[#264143] rounded-[0.5em] shadow-[0.25em_0.25em_0_#E99F4C] transition-all duration-200 hover:rotate-[-5deg] hover:scale-105">
            <Bell className="w-6 h-6 md:w-7 md:h-7 text-[#7BB4B1]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#264143]">Latest Notices</h1>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 md:mb-10"
        >
          <p className="text-[#264143]/80 text-lg mb-6 max-w-3xl">
            Stay updated with the latest announcements, events, and important notifications from your institution.
          </p>
          
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 px-5 pl-12 bg-white border-[0.2em] border-[#264143] rounded-lg shadow-[0.2em_0.2em_0_#E99F4C] text-[#264143] focus:outline-none focus:shadow-[0.3em_0.3em_0_#E99F4C] focus:translate-y-[-0.1em] focus:translate-x-[-0.1em] transition-all duration-200"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#264143]/60">
              <Search size={18} />
            </div>
            {searchTerm && (
              <button 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#264143]/60 hover:text-[#264143] transition-colors"
                onClick={() => setSearchTerm('')}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Filter indicators when search is active */}
        {filterActive && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-[#7BB4B1]" />
              <span className="text-[#264143] font-medium">
                Filtered results: {filteredNotices.length} {filteredNotices.length === 1 ? 'notice' : 'notices'}
              </span>
              <button 
                onClick={() => setSearchTerm('')}
                className="ml-2 flex items-center gap-1 px-2 py-1 bg-[#EDDCD9] text-[#264143] text-sm rounded-md hover:bg-[#E99F4C]/20 transition-colors"
              >
                <X size={14} /> Clear
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Notices list */}
        <AnimatePresence mode="wait">
          {filteredNotices.length === 0 ? (
            <motion.div
              key="no-notices"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <NoNoticesFound searchTerm={searchTerm} />
            </motion.div>
          ) : (
            <motion.div
              key="notices"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <NoticesList
                notices={filteredNotices}
                onRefresh={fetchNotices}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Back to top button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex justify-center mt-10"
        >
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center justify-center gap-2 py-2 px-4 bg-white text-sm text-[#264143] border-[0.15em] border-[#264143] rounded-md shadow-[0.15em_0.15em_0_#E99F4C] hover:translate-y-[-0.1em] transition-all duration-200"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 3.5L7.5 11.5M7.5 3.5L3.5 7.5M7.5 3.5L11.5 7.5" stroke="#264143" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to top
          </button>
        </motion.div>
      </div>
    </div>
  );
}