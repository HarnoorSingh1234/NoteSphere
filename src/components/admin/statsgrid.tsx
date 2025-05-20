'use client';

import { useEffect, useState } from 'react';
import StatsCard from "./statscard";
import { FileText, CheckCircle, Users, Clock, UserCheck } from "lucide-react";
import { useOrganization, useAuth } from '@clerk/nextjs';

interface StatsData {
  totalNotes: number;
  approvedNotes: number;
  pendingNotes: number;
  totalUsers: number;
  activeUsers: number;
}

export default function StatsGrid() {
  const [stats, setStats] = useState<StatsData>({
    totalNotes: 0,
    approvedNotes: 0,
    pendingNotes: 0,
    totalUsers: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const { organization } = useOrganization();
  const { getToken } = useAuth();
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch notes stats
        const response = await fetch('/api/admin/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(prevStats => ({
            ...prevStats,
            totalNotes: data.totalNotes || 0,
            approvedNotes: data.approvedNotes || 0,
            pendingNotes: data.pendingNotes || 0,
            totalUsers: data.totalUsers || 0,
            activeUsers: data.activeUsers || 0
          }));
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard 
        title="Total Notes" 
        value={loading ? "..." : stats.totalNotes.toString()} 
        description={`${stats.approvedNotes} approved`} 
        icon={FileText} 
      />
      <StatsCard 
        title="Pending Notes" 
        value={loading ? "..." : stats.pendingNotes.toString()}
        description="Awaiting approval" 
        icon={CheckCircle} 
      />
      <StatsCard 
        title="Total Users" 
        value={loading ? "..." : stats.totalUsers.toString()} 
        description={`${stats.activeUsers} active now`} 
        icon={Users} 
      />
      <StatsCard 
        title="Active Users" 
        value={loading ? "..." : stats.activeUsers.toString()} 
        description="Currently online" 
        icon={UserCheck} 
      />
    </div>
  );
}