'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import NoticeList from '@/components/admin/notice/NoticeList';

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

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/notices');
      if (!response.ok) throw new Error('Failed to fetch notices');
      const data = await response.json();
      setNotices(data);
    } catch (error) {
      toast.error('Failed to fetch notices');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#050505]">Notices Management</h1>
        <p className="text-muted-foreground mt-2">Manage all notices for your institution here.</p>
      </div>
      <NoticeList 
        notices={notices} 
        onRefresh={fetchNotices} 
      />
    </div>
  );
}
