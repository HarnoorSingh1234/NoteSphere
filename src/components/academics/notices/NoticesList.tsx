'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
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

import { Notice } from './types';

interface NoticesListProps {
  notices: Notice[];
  onRefresh: () => Promise<void>;
}

export default function NoticesList({ notices, onRefresh }: NoticesListProps) {
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

      // Update the notices list with optimistic UI update
      onRefresh();
      
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
      onRefresh();
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

  if (notices.length === 0) {
    return (
      <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.5em] shadow-[0.4em_0.4em_0_#E99F4C] overflow-hidden p-8 flex flex-col items-center justify-center h-64">
        <MessageCircle className="h-16 w-16 text-[#7BB4B1] mb-4" />
        <p className="text-[#264143] text-lg font-medium">No notices available</p>
        <p className="text-[#264143]/60 text-sm">Check back later for updates</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {notices.map((notice) => (
        <div key={notice.id} className="bg-white border-[0.25em] border-[#264143] rounded-[0.5em] shadow-[0.35em_0.35em_0_#E99F4C] overflow-hidden hover:translate-y-[-0.2em] hover:shadow-[0.4em_0.4em_0_#E99F4C] transition-all duration-300 relative">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#264143] mb-2">
                  {notice.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-[#264143]/70">
                  <span>By {notice.author.firstName} {notice.author.lastName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(notice.createdAt)}
                  </span>
                </div>
              </div>
              <div className="bg-[#7BB4B1] text-white font-medium text-sm py-1 px-3 rounded-md shadow-[0.1em_0.1em_0_#264143]">
                Latest Release
              </div>
            </div>
          
            <p className="text-[#264143]/80 my-4 leading-relaxed">{notice.description}</p>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleLike(notice.id)}
                  className={`flex items-center gap-2 py-1.5 px-3 rounded-md transition-colors ${
                    isUserLiked(notice) 
                      ? 'bg-[#EDDCD9] text-[#DE5499]' 
                      : 'hover:bg-[#EDDCD9]/50 text-[#264143]/70'
                  }`}
                  disabled={!isLoaded}
                >
                  <Heart 
                    className={`h-4 w-4 ${isUserLiked(notice) ? 'fill-current' : ''}`}
                  />
                  <span className="text-sm font-medium">{notice._count.likes}</span>
                </button>
                
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
                      <div className="space-y-4">
                        <div className="text-sm text-gray-500">
                          By {selectedNotice.author.firstName} {selectedNotice.author.lastName} • {" "}
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
                                    </span>
                                    <span className="text-xs text-gray-500">
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
          </div>
        </div>
      ))}
    </div>
  );
}
