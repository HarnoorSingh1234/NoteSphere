'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Heart, MessageCircle, Calendar, ArrowLeft, File, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { formatDate } from '@/lib/date-utils';
import Link from 'next/link';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    firstName: string;
    lastName: string;
    image: string | null;
  };
}

interface Notice {
  id: string;
  title: string;
  description: string;
  driveLink: string;
  driveFileId: string | null;
  createdAt: string;
  author: {
    firstName: string;
    lastName: string;
    image: string | null;
  };
  isLiked: boolean;
  _count: {
    likes: number;
    comments: number;
  };
  comments: Comment[];
}

export default function NoticeDetailPage() {  const { noticeid } = useParams();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, isLoaded } = useUser();

  // Fetch notice details
  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await fetch(`/api/notices/${noticeid}`);
        if (!res.ok) throw new Error('Failed to fetch notice');
        const data = await res.json();
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
      fetchNotice();
    }
  }, [noticeid, toast]);
  // Using the imported formatDate function from date-utils

  const toggleLike = async () => {
    if (!notice || !user) return;

    // Optimistically update UI
    const previousNotice = { ...notice };
    setNotice(prevState => {
      if (!prevState) return null;
      return {
        ...prevState,
        isLiked: !prevState.isLiked,
        _count: {
          ...prevState._count,
          likes: prevState.isLiked 
            ? prevState._count.likes - 1 
            : prevState._count.likes + 1
        }
      };
    });

    try {
      const res = await fetch(`/api/notices/${noticeid}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to update like');
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

  const submitComment = async () => {
    if (!comment.trim() || !user) return;
    
    setIsSubmitting(true);
      // Create optimistic comment
    const optimisticComment = {
      id: `temp-${Date.now()}`,
      content: comment,
      createdAt: new Date().toISOString(),
      author: {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        image: user.imageUrl || null
      }
    };
    
    // Update UI optimistically
    setNotice(prevNotice => {
      if (!prevNotice) return null;
      return {
        ...prevNotice,
        comments: [optimisticComment, ...prevNotice.comments],
        _count: {
          ...prevNotice._count,
          comments: prevNotice._count.comments + 1
        }
      };
    });
    
    setComment('');
    
    try {
      const res = await fetch(`/api/notices/${noticeid}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: comment }),
      });

      if (!res.ok) throw new Error('Failed to post comment');
      
      // Refresh comments to get server-generated ID
      const data = await res.json();
      
      // Update with actual comment from server
      setNotice(prevNotice => {
        if (!prevNotice) return null;
        return {
          ...prevNotice,
          comments: prevNotice.comments.map(c => 
            c.id === optimisticComment.id ? data.comment : c
          )
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
            ...prevNotice._count,
            comments: prevNotice._count.comments - 1
          }
        };
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full mt-2" />
        </div>
        <Skeleton className="h-[60vh] w-full" />
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Notice not found</h2>
        <p className="mb-6">The notice you're looking for doesn't exist or has been removed.</p>
        <Link href="/academics/notices">
          <Button variant="default">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Notices
          </Button>
        </Link>
      </div>
    );
  }

  // Extract file ID from Drive link if driveFileId is not provided
  const fileId = notice.driveFileId || extractFileIdFromDriveLink(notice.driveLink);

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/academics/notices">
          <Button variant="ghost" className="mb-4 p-0 h-auto text-[#264143]/70 hover:text-[#264143] hover:bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Notices
          </Button>
        </Link>
        
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#264143]">{notice.title}</h1>
          
          <div className="flex items-center gap-2">
            <a href={notice.driveLink} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="flex items-center">
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </a>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-[#264143]/70 mb-6">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              {notice.author.image && <AvatarImage src={notice.author.image} />}
              <AvatarFallback>{getInitials(notice.author.firstName, notice.author.lastName)}</AvatarFallback>
            </Avatar>
            <span>
              {notice.author.firstName} {notice.author.lastName}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(notice.createdAt)}</span>
          </div>
        </div>
        
        <p className="text-[#264143]/80 mb-8">{notice.description}</p>

        <Card className="mb-8 overflow-hidden border border-gray-200">
          <CardHeader className="bg-[#EDDCD9]/30 py-3 px-4">
            <div className="flex items-center">
              <File className="mr-2 h-5 w-5 text-[#264143]/70" />
              <h3 className="font-medium">Attached Document</h3>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {fileId ? (
              <div className="aspect-[16/9] w-full">
                <iframe 
                  src={`https://drive.google.com/file/d/${fileId}/preview`}
                  className="w-full h-full border-0"
                  allow="autoplay"
                  title="Document Preview"
                ></iframe>
              </div>
            ) : (
              <div className="p-4 text-center text-[#264143]/70">
                <p>Preview not available. <a href={notice.driveLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Open document in Google Drive</a></p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center gap-6 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLike}
            disabled={!user}
            className={`flex items-center gap-1.5 ${notice.isLiked ? 'text-[#DE5499]' : 'text-[#264143]/70'}`}
          >
            <Heart className={`h-4 w-4 ${notice.isLiked ? 'fill-current' : ''}`} />
            {notice._count.likes} {notice._count.likes === 1 ? 'Like' : 'Likes'}
          </Button>

          <div className="flex items-center gap-1.5 text-[#264143]/70">
            <MessageCircle className="h-4 w-4" />
            {notice._count.comments} {notice._count.comments === 1 ? 'Comment' : 'Comments'}
          </div>
        </div>

        <Separator className="mb-8" />

        {user ? (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-[#264143]">Leave a comment</h3>
            <div className="flex gap-4">              <Avatar className="h-10 w-10">
                {user.imageUrl && <AvatarImage src={user.imageUrl} />}
                <AvatarFallback>{getInitials(user.firstName || '', user.lastName || '')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your comment..."
                  className="mb-3 resize-none"
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={submitComment}
                    disabled={!comment.trim() || isSubmitting}
                  >
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#EDDCD9]/30 p-4 rounded-md mb-8 text-center">
            <p className="mb-3">Sign in to like and comment on this notice.</p>
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          </div>
        )}

        <div>
          <h3 className="text-lg font-medium mb-6 text-[#264143]">
            Comments ({notice._count.comments})
          </h3>
          
          {notice.comments.length === 0 ? (
            <div className="text-center py-8 text-[#264143]/70">
              <MessageCircle className="mx-auto h-12 w-12 mb-3 opacity-30" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {notice.comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    {comment.author.image && <AvatarImage src={comment.author.image} />}
                    <AvatarFallback>
                      {getInitials(comment.author.firstName, comment.author.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-slate-50 p-4 rounded-md">
                      <div className="flex justify-between mb-2">
                        <p className="font-medium text-[#264143]">
                          {comment.author.firstName} {comment.author.lastName}
                        </p>
                        <span className="text-xs text-[#264143]/60">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-[#264143]/80">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getInitials(firstName: string, lastName: string): string {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
}

function extractFileIdFromDriveLink(driveLink: string): string | null {
  // Extract file ID from Google Drive link patterns
  const patterns = [
    /\/file\/d\/([^\/]+)/, // https://drive.google.com/file/d/FILE_ID/view
    /id=([^&]+)/,         // https://drive.google.com/open?id=FILE_ID
    /\/d\/([^\/]+)/       // https://docs.google.com/document/d/FILE_ID/edit
  ];

  for (const pattern of patterns) {
    const match = driveLink.match(pattern);
    if (match && match[1]) return match[1];
  }
  
  return null;
}