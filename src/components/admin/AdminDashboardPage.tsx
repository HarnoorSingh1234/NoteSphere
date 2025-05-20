'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PopularSubjects from "./popularsubjects";
import QuickActions from "./quickactions";
import PendingNotesPreview from "./PendingNotesPreview";
import StatsGrid from "./statsgrid";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminStats() {
      try {
        const response = await fetch('/api/admin/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded && user) {
      fetchAdminStats();
    }
  }, [isLoaded, user]);
  
  return (
    <div className="flex flex-col bg-[#F8F5F2] min-h-screen">
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="grid gap-8">
          <div className="bg-white rounded-[0.6em] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#E99F4C] p-6">
            <h2 className="text-3xl font-bold text-[#264143]">
              Welcome back, {user?.firstName || 'Admin'}!
            </h2>
            <p className="text-[#264143]/70 mt-2">
              Manage your academic structure and review content on NoteSphere
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-32 bg-white rounded-[0.6em] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#DE5499]">
              <div className="w-10 h-10 border-4 border-[#E99F4C] rounded-full border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <>              <div className="bg-transparent">
                <StatsGrid />
              </div>
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                <PendingNotesPreview />
                <PopularSubjects />
              </div>
            </>
          )}          <div className="bg-white rounded-[0.6em] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#4CAF50] p-6">
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
}