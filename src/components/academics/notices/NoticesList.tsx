'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import NoticeCard from './NoticeCard';
import { Notice as PrismaNotice } from '@prisma/client';

interface Notice extends PrismaNotice {
  likes: { userId: string }[];
  author: {
    firstName: string;
    lastName: string;
  };
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

interface NoticesListProps {
  notices: Notice[];
  onRefresh: () => Promise<void>;
}

export default function NoticesList({ notices, onRefresh }: NoticesListProps) {
  const { user, isLoaded } = useUser();

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit' 
    });
  };

  const toggleLike = async (noticeId: string) => {
    if (!user) {
      toast.error('Please sign in to like notices');
      return;
    }

    try {
      const response = await fetch(`/api/notices/${noticeId}/like`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to toggle like');
      onRefresh();
    } catch (error) {
      toast.error('Failed to toggle like');
      console.error(error);
    }
  };

  const isUserLiked = (notice: Notice) => {
    if (!user) return false;
    return notice.likes.some(like => like.userId === user.id);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
    >
      {notices.map((notice, index) => (
        <motion.div key={notice.id} variants={item} custom={index}>
          <NoticeCard
            notice={notice}
            isUserLiked={isUserLiked(notice)}
            onLike={() => toggleLike(notice.id)}
            formatDate={formatDate}
            isLoaded={isLoaded}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}