'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { getInitials } from '@/lib/notices/utils';
import { UserResource } from '@clerk/types';

interface CommentFormProps {
  onSubmit: (comment: string) => Promise<void>;
  user: UserResource | null | undefined;
  isUserLoaded: boolean;
}

export default function CommentForm({ onSubmit, user, isUserLoaded }: CommentFormProps) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim() || !user) return;
    
    setIsSubmitting(true);
    await onSubmit(comment);
    setComment('');
    setIsSubmitting(false);
  };

  if (!isUserLoaded) {
    return <div className="h-10 animate-pulse bg-gray-100 rounded mb-8"></div>;
  }

  if (!user) {
    return (
      <div className="bg-[#EDDCD9]/30 border-[0.15em] border-[#264143]/10 p-5 rounded-[0.4em] mb-8 text-center">
        <p className="mb-4">Sign in to like and comment on this notice.</p>
        <Link href="/sign-in">
          <Button className="bg-[#7BB4B1] border-[0.15em] border-[#264143] shadow-[0.15em_0.15em_0_#E99F4C] hover:translate-y-[-0.1em] hover:shadow-[0.2em_0.2em_0_#E99F4C] hover:bg-[#6ba3a0] transition-all duration-200">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-4 text-[#264143]">Leave a comment</h3>
      <div className="flex gap-4">        <Avatar className="h-10 w-10 bg-[#EDDCD9]">
          <AvatarFallback className="text-[#264143]/70 font-medium">
            {getInitials(user.firstName || '', user.lastName || '')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment..."
            className="mb-3 resize-none border-[0.15em] border-[#264143]/20 rounded-[0.3em] focus:border-[#264143] focus:shadow-[0.15em_0.15em_0_#E99F4C] focus:ring-0 transition-all duration-200"
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit}
              disabled={!comment.trim() || isSubmitting}
              className="bg-[#7BB4B1] border-[0.15em] border-[#264143] shadow-[0.15em_0.15em_0_#E99F4C] hover:translate-y-[-0.1em] hover:shadow-[0.2em_0.2em_0_#E99F4C] hover:bg-[#6ba3a0] transition-all duration-200"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}