'use client';

import React, { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

interface LikeButtonProps {
  noteId: string;
  initialLikes: number;
  isLiked?: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({ 
  noteId, 
  initialLikes = 0,
  isLiked = false
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(isLiked);
  const [isLoading, setIsLoading] = useState(false);
  const { userId, isSignedIn } = useAuth();
  
  // Sync likes count and liked state from server
  useEffect(() => {
    // Check if the current user has liked this note
    const checkIfLiked = async () => {
      if (!isSignedIn || !userId) {
        setLiked(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/notes/${noteId}/likes`);
        if (response.ok) {
          const data = await response.json();
          const userLiked = data.likes.some((like: any) => like.user?.clerkId === userId);
          setLiked(userLiked);
          // Update likes count to ensure it matches server state
          setLikes(data.count);
        }
      } catch (error) {
        console.error('Failed to check like status:', error);
      }
    };

    checkIfLiked();
  }, [noteId, userId, isSignedIn]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isSignedIn) {
      // Redirect to sign in if not authenticated
      window.location.href = '/sign-in?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    setIsLoading(true);

    try {
      // Optimistically update the UI immediately for better user experience
      const currentLiked = liked;
      const newLiked = !currentLiked;
      const likeDelta = newLiked ? 1 : -1;
      
      // Update locally first (optimistically)
      setLiked(newLiked);
      setLikes(prev => prev + likeDelta);
      
      // Then send request to server
      const response = await fetch(`/api/notes/${noteId}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Update with actual server data
        setLikes(data.count);
        setLiked(data.action === 'liked');
      } else {
        // If request fails, revert to previous state
        setLiked(currentLiked);
        setLikes(prev => prev - likeDelta);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Revert on error
      setLiked(liked);
      setLikes(initialLikes);
    } finally {
      setIsLoading(false);
    }
  };  return (
    <button 
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-1 border-[0.1em] px-2 py-1 md:px-3 md:py-1.5 rounded-[0.4em] ${
        liked 
          ? 'text-white bg-[#DE5499] border-[#DE5499] shadow-[0.05em_0.05em_0_#050505]' 
          : 'text-[#050505]/70 border-[#050505]/30 hover:bg-[#DE5499]  hover:text-[#DE5499] shadow-[0.05em_0.05em_0_#050505]/30 hover:shadow-[0.1em_0.1em_0_#DE5499]/30'
      } transition-all disabled:opacity-50 transform hover:-translate-y-[0.05em] active:translate-y-[0.025em]`}
    >
      <ThumbsUp className={`w-3 h-3 md:w-3.5 md:h-3.5 ${isLoading ? 'animate-pulse' : ''}`} />
      <span className="ml-1 text-xs md:text-sm font-medium">{likes}</span>
      <span className="sr-only">likes</span>
    </button>
  );
};

export default LikeButton;
