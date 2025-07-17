'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { DocumentViewer } from '@/components/notes';
import { Notice, User, Comment as PrismaComment } from '@prisma/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heart, MessageCircle, Calendar, Send, Edit, Trash2, Check, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

// Enhanced Notice type with the related data
interface ExtendedComment extends PrismaComment {
  user: {
    firstName: string;
    lastName: string;
  };
}

interface ExtendedNotice extends Notice {
  author: {
    firstName: string;
    lastName: string;
  };
  comments?: ExtendedComment[];
  _count?: {
    likes: number;
    comments: number;
  };
}

interface NoticeDetailsProps {
  notice: ExtendedNotice;
  formatDate: (date: string) => string;
  isUserLiked: boolean;
  onLike: () => void;
  onRefresh: () => Promise<void>;
}

export default function NoticeDetails({ 
  notice, 
  formatDate, 
  isUserLiked, 
  onLike, 
  onRefresh 
}: NoticeDetailsProps) {
  const { user } = useUser();
  const [comment, setComment] = React.useState('');
  const [submittingComment, setSubmittingComment] = React.useState(false);
  const [editingCommentId, setEditingCommentId] = React.useState<string | null>(null);
  const [editContent, setEditContent] = React.useState('');
  const [deletingCommentId, setDeletingCommentId] = React.useState<string | null>(null);

  // Helper to check admin
  const isAdmin = user?.publicMetadata?.role === 'ADMIN' || user?.publicMetadata?.role === 'admin';

  const submitComment = async () => {
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
      const response = await fetch(`/api/notices/${notice.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: comment }),
      });
      if (!response.ok) throw new Error('Failed to submit comment');
      toast.success('Comment added successfully');
      setComment('');
      onRefresh();
    } catch (error) {
      toast.error('Failed to submit comment');
      console.error(error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const startEdit = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditContent(content);
  };
  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };
  const saveEdit = async (commentId: string) => {
    if (!editContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    try {
      const res = await fetch(`/api/notices/${notice.id}/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update comment');
      toast.success('Comment updated');
      setEditingCommentId(null);
      setEditContent('');
      onRefresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  };
  const deleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    setDeletingCommentId(commentId);
    try {
      const res = await fetch(`/api/notices/${notice.id}/comments/${commentId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete comment');
      toast.success('Comment deleted');
      onRefresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeletingCommentId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <Card className="mb-6">
        <CardHeader className="pb-3 bg-[#EDDCD9]/30">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#264143] mb-2">
                {notice.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-[#264143]/70">
                <span>By {notice.author.firstName} {notice.author.lastName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />a
                  {formatDate(notice.createdAt.toString())}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <p className="text-[#264143]/80 mb-6">{notice.description}</p>

          {/* File Preview */}
          {(notice.driveLink || notice.driveFileId) && (
            <div className="mb-6">
              <DocumentViewer 
                fileUrl={notice.driveLink} 
                driveFileId={notice.driveFileId || undefined}
                title="Notice Document"
                className="w-full"
              />
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onLike}
                className={`flex items-center gap-1.5 ${isUserLiked ? 'text-[#DE5499]' : 'text-[#264143]/70'}`}
              >
                <Heart className={`h-4 w-4 ${isUserLiked ? 'fill-current' : ''}`} />
                {notice._count?.likes || 0}
              </Button>

              <div className="flex items-center gap-1.5 text-[#264143]/70">
                <MessageCircle className="h-4 w-4" />
                {notice._count?.comments || 0}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-[#264143]">
            Comments ({notice.comments?.length || 0})
          </h2>
        </CardHeader>

        <CardContent>
          {user && (
            <div className="flex gap-2 mb-6">
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1"
                rows={3}
              />
              <Button
                onClick={submitComment}
                disabled={submittingComment || !comment.trim()}
                className="bg-[#DE5499] hover:bg-[#E66BA7] text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="space-y-4">
            {notice.comments?.map((comment: ExtendedComment) => {
              const canEditOrDelete = user && (isAdmin || user.id === comment.userId || user.id === comment.user?.clerkId);
              return (
                <div key={comment.id} className="bg-[#EDDCD9]/30 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-[#264143]">
                      {comment.user.firstName} {comment.user.lastName}
                    </span>
                    <span className="text-xs text-[#264143]/70">
                      {formatDate(comment.createdAt.toString())}
                    </span>
                  </div>
                  {editingCommentId === comment.id ? (
                    <div className="flex gap-2 items-center">
                      <Textarea
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        className="flex-1"
                        rows={2}
                      />
                      <Button size="icon" onClick={() => saveEdit(comment.id)} disabled={!editContent.trim()}><Check /></Button>
                      <Button size="icon" variant="destructive" onClick={cancelEdit}><X /></Button>
                    </div>
                  ) : (
                    <p className="text-[#264143]/80">{comment.content}</p>
                  )}
                  {canEditOrDelete && editingCommentId !== comment.id && (
                    <div className="flex gap-2 mt-2">
                      <Button size="icon" variant="ghost" onClick={() => startEdit(comment.id, comment.content)}><Edit className="w-4 h-4" /></Button>
                      <Button size="icon" variant="destructive" onClick={() => deleteComment(comment.id)} disabled={deletingCommentId === comment.id}>
                        {deletingCommentId === comment.id ? '...' : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}

            {notice.comments?.length === 0 && (
              <p className="text-center text-[#264143]/70 py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
