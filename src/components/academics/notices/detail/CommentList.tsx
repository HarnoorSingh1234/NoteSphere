import { MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDate } from '@/lib/date-utils';
import { getInitials } from '@/lib/notices/utils';


export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    clerkId: string;
  };
}

export interface Notice {
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
  likes: { userId: string }[];
  _count?: {
    likes: number;
    comments: number;
  };
  comments: Comment[];
}

interface CommentListProps {
  comments: Comment[];
  totalCount: number;
}

export default function CommentList({ comments, totalCount }: CommentListProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-6 text-[#264143]">
        Comments ({totalCount})
      </h3>
      
      {comments.length === 0 ? (
        <div className="text-center py-8 text-[#264143]/70">
          <div className="mx-auto h-16 w-16 rounded-full bg-[#EDDCD9]/50 flex items-center justify-center mb-3">
            <MessageCircle className="h-8 w-8 text-[#264143]/40" />
          </div>
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">              <Avatar className="h-10 w-10 bg-[#EDDCD9]">
                <AvatarFallback className="text-[#264143]/70 font-medium">                  {getInitials(comment.user.firstName, comment.user.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-[#EDDCD9]/20 p-4 rounded-[0.3em] border-[0.1em] border-[#264143]/10">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1">
                    <p className="font-medium text-[#264143]">
                      {comment.user.firstName} {comment.user.lastName}
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
  );
}