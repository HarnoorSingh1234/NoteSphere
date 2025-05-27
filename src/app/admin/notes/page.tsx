'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Year } from '@/types';
import ProtectRoute from "@/app/(auth)/protected/ProtectRoute";
import StatsCards from '@/components/admin/StatsCards';
import ActionButtons from '@/components/admin/ActionButtons';
import AcademicStructure from '@/components/admin/AcademicStructure';
import { fetchAdminAcademicStructure, fetchAdminNotesStats } from '@/lib/admin-notes-actions';
import { motion, AnimatePresence } from 'framer-motion';

const AdminNotesPage = () => {
  const [years, setYears] = useState<Year[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Use server actions to fetch data
        const [academicStructure, notesStats] = await Promise.all([
          fetchAdminAcademicStructure(),
          fetchAdminNotesStats()
        ]);
        
        setYears(academicStructure);
        setStats(notesStats);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load academic data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto border-[0.25em] border-t-[#7BB4B1] border-r-[#EDDCD9] border-b-[#E99F4C] border-l-[#DE5499] rounded-full animate-spin"></div>
          <p className="mt-6 text-lg font-bold text-[#264143]">Loading academic structure...</p>
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
            <AlertCircle className="w-8 h-8 text-[#DE5499]" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-[#264143]">Failed to Load Data</h2>
          <p className="mt-2 text-[#264143]/70">{error}</p>
          <button
            onClick={() => window.location.reload()}
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
    <ProtectRoute allowedRoles={['ADMIN']}>
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
            className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#7BB4B1] p-6 md:p-8 mb-8 relative"
          >
            {/* Corner slice */}
            <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#264143] mb-2">All Notes (Admin View)</h1>
                <p className="text-[#264143]/70">
                  Browse all notes across academic years, semesters, and subjects
                </p>
              </div>
              
              <ActionButtons stats={{pending: stats.pending, rejected: stats.rejected}} />
            </div>
          </motion.div>
          
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StatsCards stats={stats} />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] relative overflow-hidden"
          >
            {/* Pattern background */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:0.8em_0.8em] pointer-events-none"></div>
            
            {/* Decorative corner */}
            <div className="absolute top-[-1em] right-[-1em] w-12 h-12 bg-[#EDDCD9] transform rotate-45 translate-x-6 -translate-y-6"></div>
            
            {/* Corner slice */}
            <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
            
            <div className="relative z-[1]">
              <AcademicStructure years={years} />
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectRoute>
  );
};

export default AdminNotesPage;