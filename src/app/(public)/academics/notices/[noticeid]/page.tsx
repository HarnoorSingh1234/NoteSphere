'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

import { fetchNoticeById, toggleNoticeLike, postComment } from '@/lib/notices/api'; // Adjust the import path as necessary

import NoticeHeader from '@/components/academics/notices/detail/NoticeHeader';
import DocumentPreview from '@/components/academics/notices/detail/DocumentViewer';
import CommentList from '@/components/academics/notices/detail/CommentList';
import LikeButton from '@/components/academics/notices/detail/LikeButton';
import CommentForm from '@/components/academics/notices/detail/CommentForm';
import Loading from './loading';
import NotFound from './not-found';

import { Comment, Notice } from '@/lib/notices/types';


export default function NoticeDetailPage() {
  const { noticeid } = useParams();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user, isLoaded } = useUser();
  
  // Fetch notice details
  useEffect(() => {
    const getNoticeDetails = async () => {
      setIsLoading(true);
      try {
        if (typeof noticeid !== 'string') return;
        const data = await fetchNoticeById(noticeid);
        setNotice(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load notice details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (noticeid) {
      getNoticeDetails();
    }
  }, [noticeid, toast]);

  const handleToggleLike = async () => {
    if (!notice || !user) return;

    const previousNotice = { ...notice };
    const isCurrentlyLiked = notice.likes.some(like => like.userId === user.id);
      
    // Optimistically update UI
    setNotice(prevState => {
      if (!prevState) return null;
      return {
        ...prevState,
        likes: isCurrentlyLiked 
          ? prevState.likes.filter(like => like.userId !== user.id)
          : [...prevState.likes, { userId: user.id }],
        _count: {
          ...(prevState._count ?? { comments: prevState.comments.length }),
          likes: (prevState._count?.likes ?? prevState.likes.length) + (isCurrentlyLiked ? -1 : 1)
        }
      };
    });

    try {
      if (typeof noticeid !== 'string') return;
      await toggleNoticeLike(noticeid);
    } catch (error) {
      // Revert to previous state on error
      setNotice(previousNotice);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const handleCommentSubmit = async (commentText: string) => {
    if (!commentText.trim() || !user || !notice) return;
    
    // Create optimistic comment
    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      content: commentText,
      createdAt: new Date().toISOString(),
      user: {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        clerkId: user.id
      }
    };
    
    // Update UI optimistically
    setNotice(prevNotice => {
      if (!prevNotice) return null;
      return {
        ...prevNotice,
        comments: [optimisticComment, ...prevNotice.comments],
        _count: {
          ...(prevNotice._count || { likes: prevNotice.likes.length }),
          comments: prevNotice.comments.length + 1
        }
      };
    });
    
    try {
      if (typeof noticeid !== 'string') return;
      const { comment: newComment } = await postComment(noticeid, commentText);
      
      // Update with actual comment from server
      setNotice(prevNotice => {
        if (!prevNotice) return null;
        return {
          ...prevNotice,
          comments: prevNotice.comments.map(c => 
            c.id === optimisticComment.id ? newComment : c
          ),
        };
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
      
      // Remove optimistic comment on error
      setNotice(prevNotice => {
        if (!prevNotice) return null;
        return {
          ...prevNotice,
          comments: prevNotice.comments.filter(c => c.id !== optimisticComment.id),
          _count: {
            ...(prevNotice._count || { likes: prevNotice.likes.length }),
            comments: Math.max(0, prevNotice.comments.length - 1)
          }
        };
      });
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!notice) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 pt-6 md:pt-10 pb-12 md:pb-16 px-4 md:px-6 relative">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:18px_18px] md:bg-[length:24px_24px] pointer-events-none"></div>
      
      {/* Decorative blobs */}
      <div className="absolute top-[10%] right-[5%] w-[15vw] max-w-[8rem] aspect-square bg-[#DE5499]/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute top-[30%] left-[8%] w-[18vw] max-w-[10rem] aspect-square bg-[#7BB4B1]/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute bottom-[15%] right-[10%] w-[20vw] max-w-[12rem] aspect-square bg-[#E99F4C]/10 rounded-full blur-xl pointer-events-none"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] overflow-hidden p-6 md:p-8 relative">
          {/* Corner slice */}
          <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
          
          <Link href="/academics/notices" className="block mb-6">
            <Button 
              variant="ghost" 
              className="p-0 h-auto text-[#264143]/70 hover:text-[#264143] hover:bg-transparent flex items-center gap-2 transition-all duration-200 hover:translate-x-[-0.2em]"
            >
              <ArrowLeft className="h-4 w-4" /> 
              <span>Back to Notices</span>
            </Button>
          </Link>
          
          {/* Notice header with title, author, date */}
          <NoticeHeader notice={notice} />
          
          {/* Document Preview */}
          <DocumentPreview driveLink={notice.driveLink} driveFileId={notice.driveFileId} />
          
          {/* Actions */}
          <div className="flex items-center gap-6 mb-8">
            <LikeButton message port closed before a response was received.Understand this error
/api/notes/process-rejected:1 
            
            
           Failed to load resource: the server responded with a status of 403 ()Understand this error
1684-0e7969553dc6805a.js:1 Error processing rejected notes: Error: Unauthorized, admin role required
    at F (page-4df3cd2e45d07609.js:1:17507)
    at async r (page-4df3cd2e45d07609.js:1:18006)
window.console.error @ 1684-0e7969553dc6805a.js:1Understand this error
/api/admin/make-admin:1 
            
            
           Failed to load resource: the server responded with a status of 500 ()Understand this error
1684-0e7969553dc6805a.js:1 Error: Failed to make user admin
    at o (page-8e245978a9f07d15.js:1:815)
window.console.error @ 1684-0e7969553dc6805a.js:1Understand this error
              isLiked={notice.likes.some(like => like.userId === user?.id)}
              likesCount={notice._count?.likes || notice.likes.length}
              onToggleLike={handleToggleLike}
              disabled={!user}
            />
            
            <div className="flex items-center gap-1.5 text-[#264143]/70">
              <div className="w-7 h-7 rounded-full bg-[#EDDCD9]/70 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <span className="text-sm font-medium">
                {notice._count?.comments ?? notice.comments.length} 
                {(notice._count?.comments ?? notice.comments.length) === 1 ? ' Comment' : ' Comments'}
              </span>
            </div>
          </div>

          <Separator className="mb-8 border-[#264143]/10" />

          {/* Comment Form */}
          <CommentForm 
            onSubmit={handleCommentSubmit}
            user={user}
            isUserLoaded={isLoaded}
          />

          {/* Comment List */}
          <CommentList 
            comments={notice.comments} 
            totalCount={notice._count?.comments || notice.comments.length} 
          />
        </div>
      </div>
    </div>
  );
}