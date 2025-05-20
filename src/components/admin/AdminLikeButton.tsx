'use client';

import React, { useState } from 'react';
import { ThumbsUp } from 'lucide-react';

interface AdminLikeButtonProps {
  noteId: string;
  initialLikes: number;
  readOnly?: boolean;
}

const AdminLikeButton: React.FC<AdminLikeButtonProps> = ({ 
  noteId, 
  initialLikes = 0,
  readOnly = true 
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  // For admin, this is mostly read-only unless they want to check functionality
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (readOnly) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/notes/${noteId}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(data.count);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLike}
      disabled={isLoading || readOnly}
      className={`flex items-center ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
    >
      <ThumbsUp className={`w-4 h-4 mr-1 ${isLoading ? 'animate-pulse' : ''}`} />
      <span>{likes}</span>
      <span className="sr-only">likes</span>
    </button>
  );
};

export default AdminLikeButton;
