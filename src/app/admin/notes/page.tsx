'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';
import { Year } from '@/types/index';
import ProtectRoute from "@/app/(auth)/protected/ProtectRoute";
import StatsCards from '@/components/admin/StatsCards';
import ActionButtons from '@/components/admin/ActionButtons';
import AcademicStructure from '@/components/admin/AcademicStructure';



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
    const fetchAcademicStructure = async () => {
      try {
        setLoading(true);
        
        // Fetch years with semesters, subjects, and notes
        const yearsResponse = await fetch('/api/years?include=all');
        
        if (!yearsResponse.ok) {
          throw new Error('Failed to fetch academic years');
        }
        
        const { years: yearsData } = await yearsResponse.json();
        setYears(yearsData);
        
        // Fetch notes stats
        const statsResponse = await fetch('/api/admin/notes/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load academic data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAcademicStructure();
  }, []);
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-t-[#4d61ff] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-[#050505]">Loading academic structure...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto flex items-center justify-center bg-red-100 rounded-full">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-[#050505]">Failed to Load Data</h2>
          <p className="mt-2 text-[#050505]/70">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#4d61ff] text-white font-medium rounded-lg hover:bg-[#3a4cd1] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectRoute allowedRoles={['ADMIN']}>
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#050505] mb-2">All Notes (Admin View)</h1>
            <p className="text-[#050505]/70">
              Browse all notes across academic years, semesters, and subjects
            </p>
          </div>
          
          <ActionButtons stats={{pending: stats.pending, rejected: stats.rejected}} />
        </div>
        
        {/* Stats Cards */}
        <StatsCards stats={stats} />
        
        <div className="bg-white border-[0.15em] border-[#050505] rounded-[0.6em] shadow-[0.4em_0.4em_0_#4d61ff]">
          <AcademicStructure years={years} />
        </div>
      </div>
    </ProtectRoute>
  );
};

export default AdminNotesPage;
