'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { formatTimeAgo } from '@/lib/date-utils';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    clerkId: string;
  };
}

interface AdminCommentSectionProps {
  noteId: string;
  className?: string;
  readOnly?: boolean;
}

export default function AdminCommentSection({ noteId, className = '', readOnly = false }: AdminCommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useAuth();

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/notes/${noteId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
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
    if (!newComment.trim() || readOnly) return;
    
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

  const deleteComment = async (commentId: string) => {
    if (readOnly) return;
    
    try {
      const response = await fetch(`/api/notes/${noteId}/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted comment from the list
        setComments(comments.filter(comment => comment.id !== commentId));
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-5 ${className}`}>
      <h3 className="text-lg font-semibold text-[#050505] flex items-center mb-4">
        <MessageSquare className="w-5 h-5 mr-2" />
        Comments ({comments.length})
      </h3>
      
      {!readOnly && (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add an admin comment..."
              disabled={isSubmitting}
              className="flex-1 px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-6">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : comments.length > 0 ? (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="border-b border-gray-100 pb-3 last:border-b-0">
              <div className="flex items-center justify-between">
                <div className="font-medium text-[#050505]">
                  {comment.user.firstName} {comment.user.lastName}
                </div>
                <div className="text-xs text-[#050505]/50">
                  {formatTimeAgo(comment.createdAt)}
                </div>
              </div>
              <p className="mt-1 text-[#050505]/70">{comment.content}</p>
              
              {!readOnly && comment.user.clerkId === userId && (
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="mt-2 text-xs text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-6 text-center text-[#050505]/70">
          No comments yet.
        </div>
      )}
    </div>
  );
}
