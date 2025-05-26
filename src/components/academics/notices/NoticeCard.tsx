'use client';

import { Heart, MessageCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Notice } from '@prisma/client';

// Extended Notice type with relations and counts
interface ExtendedNotice extends Notice {
  author: {
    firstName: string;
    lastName: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

interface NoticeCardProps {
  notice: ExtendedNotice;
  isUserLiked: boolean;
  onLike: () => void;
  formatDate: (date: string) => string;
}

export default function NoticeCard({ notice, isUserLiked, onLike, formatDate }: NoticeCardProps) {
  return (
    <Link href={`/academics/notices/${notice.id}`}>
      <Card className="overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-1">
        <CardHeader className="pb-3 bg-[#EDDCD9]/30">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[#264143] line-clamp-2 mb-1">
                {notice.title}
              </h3>              
              <p className="text-sm text-[#264143]/70">
                By {notice.author.firstName} {notice.author.lastName}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#264143]/70">
              <Calendar className="w-4 h-4" />
              {formatDate(notice.createdAt.toString())}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <p className="text-[#264143]/80 mb-4 text-sm line-clamp-2">{notice.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onLike();
                }}
                className={`flex items-center gap-1.5 ${isUserLiked ? 'text-[#DE5499]' : 'text-[#264143]/70'}`}
              >
                <Heart className={`h-4 w-4 ${isUserLiked ? 'fill-current' : ''}`} />
                {notice._count.likes}
              </Button>

              <div className="flex items-center gap-1.5 text-[#264143]/70">
                <MessageCircle className="h-4 w-4" />
                {notice._count.comments}
              </div>
            </div>

            <Badge 
              className="font-normal text-xs bg-[#4d61ff]/10 text-[#4d61ff] hover:bg-[#4d61ff]/20"
            >
              View details
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
