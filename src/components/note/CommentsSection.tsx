"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar' 
import { Textarea } from '@/components/ui/textarea'
import { SendHorizontal } from 'lucide-react'
import { Comment as CommentType } from '@/types'

interface CommentsSectionProps {
  noteId: string
  initialComments: {
    id: string
    content: string
    createdAt: Date
    userId: string
    noteId: string
    parentId: string | null
    user: {
      clerkId: string
      firstName: string
      lastName: string
      email: string
    }
  }[]
}

export default function CommentsSection({ noteId, initialComments }: CommentsSectionProps) {
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.trim()) return
    
    // In a real app, we would make an API call to save the comment
    // For now, we'll just simulate it
    const fakeComment = {
      id: `temp-${Date.now()}`,
      content: newComment,
      createdAt: new Date(),
      userId: 'current-user', // This would come from authentication
      noteId,
      parentId: null,
      user: {
        clerkId: 'current-user',
        firstName: 'Current',
        lastName: 'User',
        email: 'user@example.com'
      }
    }
    
    setComments([...comments, fakeComment])
    setNewComment('')
  }
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Comments ({comments.length})</h2>
      
      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <p className="text-zinc-500 text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="flex gap-3 p-3 rounded-lg border">
              <Avatar>
                <AvatarFallback>{comment.user.firstName[0]}{comment.user.lastName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{comment.user.firstName} {comment.user.lastName}</span>
                  <span className="text-xs text-zinc-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-1">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea 
          placeholder="Add a comment..." 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
