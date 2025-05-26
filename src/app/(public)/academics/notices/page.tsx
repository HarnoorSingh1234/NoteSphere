'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

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
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useUser();

  // Fetch notices on component mount
  useEffect(() => {
    fetchNotices();
  }, []);

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
      <div className="space-y-6">
        <PageHeader 
          title="Latest Notices" 
          description="Stay updated with the latest releases and announcements" 
        />
        <NoticeSkeleton count={3} />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Page Header Component */}
      <PageHeader 
        title="Latest Notices" 
        description="Stay updated with the latest releases and announcements" 
      />

      {notices.length === 0 ? (
        <NoNoticesFound />
      ) : (
        <NoticesList
          notices={notices}
          onRefresh={fetchNotices}
        />
      )}
    </div>
  );
}