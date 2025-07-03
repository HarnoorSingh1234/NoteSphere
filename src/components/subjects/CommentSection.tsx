'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { Send, Edit, Trash2, Check, X } from 'lucide-react';
import Link from 'next/link';
import { formatTimeAgo } from '@/lib/date-utils';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    clerkId: string;
    role?: string;
  };
}

interface CommentSectionProps {
  noteId: string;
  className?: string;
}

export default function CommentSection({ noteId, className = '' }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);
  const { userId, isSignedIn } = useAuth();
  const { user } = useUser();
  
  const fetchComments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/notes/${noteId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch comments');
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setError('Failed to load comments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (noteId) {
      fetchComments();
    }
  }, [noteId]);
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      window.location.href = '/sign-in?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/notes/${noteId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prevComments => [data.comment, ...prevComments]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      const response = await fetch(`/api/notes/${noteId}/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const startEditingComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus();
      }
    }, 10);
  };

  const cancelEditingComment = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) return;
    
    setIsEditing(true);
    
    try {
      const response = await fetch(`/api/notes/${noteId}/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editContent }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prevComments => 
          prevComments.map(comment => 
            comment.id === commentId ? data.comment : comment
          )
        );
        setEditingCommentId(null);
        setEditContent('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update comment');
      }
    } catch (error) {
      console.error('Failed to update comment:', error);
      alert('Failed to update comment. Please try again.');
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className={`bg-white rounded-[0.6em] border-[0.15em] border-[#264143] p-5 ${className}`} id="comments">
      <h3 className="font-bold text-lg md:text-xl text-[#264143] mb-4">Comments</h3>
      
      {isSignedIn ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 text-sm md:text-base border-[0.15em] border-[#264143] rounded-[0.4em] text-black focus:outline-none focus:ring-1 focus:ring-[#4d61ff] focus:border-[#4d61ff] shadow-[0.1em_0.1em_0_#264143] bg-[#F8F5F2]"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="inline-flex items-center justify-center px-4 py-3 font-medium bg-[#4d61ff] text-white border-[0.15em] border-[#264143] rounded-[0.4em] shadow-[0.1em_0.1em_0_#264143] hover:translate-y-[-0.1em] hover:shadow-[0.2em_0.2em_0_#264143] transition-all duration-200 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-[0.1em_0.1em_0_#264143]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 border-[0.15em] border-[#264143] border-dashed rounded-[0.4em] bg-[#F8F5F2] text-center">
          <p className="text-[#264143] mb-2">You need to sign in to join the discussion</p>
          <Link
            href={`/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`}
            className="inline-block px-4 py-2 bg-[#DE5499] text-white font-medium rounded-[0.3em] border-[0.1em] border-[#264143] hover:bg-[#c64a86] transition-colors"
          >
            Sign in to comment
          </Link>
        </div>
      )}{isLoading ? (
        <div className="flex justify-center py-4 md:py-6">
          <div className="w-8 h-8 md:w-10 md:h-10 border-3 md:border-4 border-[#4d61ff] rounded-full border-t-transparent animate-spin"></div>
        </div>      ) : comments.length > 0 ? (
        <ul className="space-y-3 md:space-y-5">
          {comments.map((comment) => (
            <li key={comment.id} className="border-[0.1em] border-[#050505]/20 rounded-[0.4em] p-3 md:p-4 bg-[#F8F9FA] last:mb-0">
              <div className="flex items-center justify-between gap-1 mb-3">
                <div className="flex items-center gap-2">
                  {/* Use a generic avatar with initials if we don't have a Clerk user object */}
                  <div className="w-8 h-8 rounded-full bg-[#4d61ff]/10 border border-[#4d61ff]/20 flex items-center justify-center text-[#4d61ff] font-medium text-xs">
                    {comment.user?.firstName?.[0]}{comment.user?.lastName?.[0]}
                  </div>
                  <div className="font-bold text-sm md:text-base text-[#050505]">
                    {comment.user?.firstName} {comment.user?.lastName}
                    {comment.user?.role === 'ADMIN' && (
                      <span className="ml-2 px-1.5 py-0.5 text-[10px] font-medium bg-[#DE5499] text-white rounded">Admin</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-[#050505]/50">
                    {formatTimeAgo(comment.createdAt)}
                  </div>
                  
                  {isSignedIn && (userId === comment.user.clerkId || user?.publicMetadata?.role === 'admin') && (
                    <div className="flex gap-1">
                      {userId === comment.user.clerkId && (
                        <button 
                          onClick={() => startEditingComment(comment)}
                          className="p-1 text-[#4d61ff] hover:text-[#264143] transition-colors"
                          aria-label="Edit comment"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-1 text-[#DE5499] hover:text-[#c64a86] transition-colors"
                        aria-label="Delete comment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {editingCommentId === comment.id ? (
                <div className="flex gap-2">
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border-[0.1em] border-[#264143] rounded-[0.3em] focus:outline-none focus:ring-1 focus:border-[#4d61ff]"
                  />
                  <button
                    onClick={() => handleUpdateComment(comment.id)}
                    disabled={isEditing || !editContent.trim()}
                    className="p-2 bg-[#4d61ff] text-white rounded-[0.3em] hover:bg-[#3d4ecc] disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={cancelEditingComment}
                    className="p-2 bg-[#DE5499] text-white rounded-[0.3em] hover:bg-[#c64a86]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-sm md:text-base text-[#050505]/80 break-words">{comment.content}</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-6 md:py-8 text-center border-[0.1em] border-dashed border-[#050505]/30 rounded-[0.4em] bg-[#F8F9FA]">
          <p className="text-sm md:text-base text-[#050505]/70 font-medium">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
}
