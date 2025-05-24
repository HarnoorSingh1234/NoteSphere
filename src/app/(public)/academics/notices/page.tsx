'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  ExternalLink, 
  Heart, 
  MessageCircle, 
  Send,
  Calendar,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Notice {
  id: string;
  title: string;
  description: string;
  driveLink: string;
  createdAt: string;
  author: {
    firstName: string;
    lastName: string;
  };
  likes: Array<{
    id: string;
    userId: string;
    user: {
      firstName: string;
      lastName: string;
    };
  }>;
  comments: Array<{
    id: string;
    content: string;
    createdAt: string;
    user: {
      firstName: string;
      lastName: string;
    };
  }>;
  _count: {
    likes: number;
    comments: number;
  };
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
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

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch('/api/notices');
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

  const fetchNoticeDetails = async (noticeId: string) => {
    try {
      const response = await fetch(`/api/notices/${noticeId}`);
      if (!response.ok) throw new Error('Failed to fetch notice details');
      const data = await response.json();
      setSelectedNotice(data);
    } catch (error) {
      toast.error('Failed to fetch notice details');
      console.error(error);
    }
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

      // Update the notices list
      setNotices(prev => prev.map(notice => {
        if (notice.id === noticeId) {
          const userHasLiked = notice.likes.some(like => like.userId === user.id);
          const newLikesCount = userHasLiked 
            ? notice._count.likes - 1 
            : notice._count.likes + 1;
          
          return {
            ...notice,
            _count: { ...notice._count, likes: newLikesCount },
            likes: userHasLiked
              ? notice.likes.filter(like => like.userId !== user.id)
              : [...notice.likes, { 
                  id: 'temp', 
                  userId: user.id, 
                  user: { firstName: user.firstName || '', lastName: user.lastName || '' }
                }]
          };
        }
        return notice;
      }));

      // Update selected notice if it's the same one
      if (selectedNotice && selectedNotice.id === noticeId) {
        fetchNoticeDetails(noticeId);
      }
    } catch (error) {
      toast.error('Failed to toggle like');
      console.error(error);
    }
  };

  const submitComment = async (noticeId: string) => {
    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setSubmittingComment(true);
    try {
      const response = await fetch(`/api/notices/${noticeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment }),
      });

      if (!response.ok) throw new Error('Failed to submit comment');

      toast.success('Comment added successfully');
      setComment('');
      
      // Refresh notice details and notices list
      fetchNoticeDetails(noticeId);
      fetchNotices();
    } catch (error) {
      toast.error('Failed to submit comment');
      console.error(error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const isUserLiked = (notice: Notice) => {
    if (!user) return false;
    return notice.likes.some(like => like.userId === user.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#264143]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#264143] mb-2">Latest Notices</h1>
        <p className="text-gray-600">Stay updated with the latest releases and announcements</p>
      </div>

      {notices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <MessageCircle className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No notices available</p>
            <p className="text-gray-400 text-sm">Check back later for updates</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {notices.map((notice) => (
            <Card key={notice.id} className="border-[#264143] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-[#264143] mb-2">
                      {notice.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>By {notice.author.firstName} {notice.author.lastName}</span>
                      <span>•</span>                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(notice.createdAt)}
                      </span>
                    </div>
                  </div>
                  <Badge className="bg-[#E99F4C] text-[#264143]">
                    Latest Release
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-700 mb-4 leading-relaxed">{notice.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(notice.id)}
                      className={`transition-colors ${
                        isUserLiked(notice) 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-gray-500 hover:text-red-500'
                      }`}
                      disabled={!isLoaded}
                    >
                      <Heart 
                        className={`h-4 w-4 mr-1 ${isUserLiked(notice) ? 'fill-current' : ''}`}
                      />
                      {notice._count.likes}
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fetchNoticeDetails(notice.id)}
                          className="text-gray-500 hover:text-[#264143]"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {notice._count.comments}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-[#264143]">
                            {selectedNotice?.title}
                          </DialogTitle>
                        </DialogHeader>
                        
                        {selectedNotice && (
                          <div className="space-y-4">                            <div className="text-sm text-gray-500">
                              By {selectedNotice.author.firstName} {selectedNotice.author.lastName} • 
                              {formatDate(selectedNotice.createdAt)}
                            </div>
                            
                            <p className="text-gray-700">{selectedNotice.description}</p>
                            
                            <Button
                              onClick={() => window.open(selectedNotice.driveLink, '_blank')}
                              className="bg-[#DE5499] hover:bg-[#E66BA7] text-white w-full"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download / View File
                            </Button>
                            
                            <div className="border-t pt-4">
                              <h4 className="font-semibold text-[#264143] mb-3">
                                Comments ({selectedNotice.comments.length})
                              </h4>
                              
                              {user && (
                                <div className="flex gap-2 mb-4">
                                  <Textarea
                                    placeholder="Add a comment..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="flex-1"
                                    rows={3}
                                  />
                                  <Button
                                    onClick={() => submitComment(selectedNotice.id)}
                                    disabled={submittingComment || !comment.trim()}
                                    className="bg-[#DE5499] hover:bg-[#E66BA7] text-white"
                                  >
                                    <Send className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                              
                              {!user && (
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg text-center">
                                  <p className="text-gray-600 mb-2">Sign in to add comments</p>
                                  <Link href="/sign-in">
                                    <Button size="sm" className="bg-[#DE5499] hover:bg-[#E66BA7] text-white">
                                      Sign In
                                    </Button>
                                  </Link>
                                </div>
                              )}
                              
                              <div className="space-y-3 max-h-64 overflow-y-auto">
                                {selectedNotice.comments.length === 0 ? (
                                  <p className="text-gray-500 text-center py-4">No comments yet</p>
                                ) : (
                                  selectedNotice.comments.map((comment) => (
                                    <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                                      <div className="flex justify-between items-start mb-2">
                                        <span className="font-medium text-[#264143]">
                                          {comment.user.firstName} {comment.user.lastName}
                                        </span>                                        <span className="text-xs text-gray-500">
                                          {formatDate(comment.createdAt)}
                                        </span>
                                      </div>
                                      <p className="text-gray-700">{comment.content}</p>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <Button
                    onClick={() => window.open(notice.driveLink, '_blank')}
                    className="bg-[#E99F4C] hover:bg-[#F0A953] text-[#264143] font-medium"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View File
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}