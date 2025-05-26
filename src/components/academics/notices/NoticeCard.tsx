'use client';

import Link from 'next/link';
import { Calendar, Heart, MessageCircle, ChevronRight } from 'lucide-react';
import { Notice } from '@prisma/client';
import { useState } from 'react';

interface ExtendedNotice extends Notice {
  likes: { userId: string }[];
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
  isLoaded: boolean;
}

export default function NoticeCard({ notice, isUserLiked, onLike, formatDate, isLoaded }: NoticeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking like button
    onLike();
  };

  return (
    <div 
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/academics/notices/${notice.id}`} className="block">
        <div className="bg-white border-[0.2em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#E99F4C] overflow-hidden group-hover:translate-y-[-0.15em] group-hover:translate-x-[-0.05em] group-hover:shadow-[0.25em_0.25em_0_#E99F4C] transition-all duration-300 relative">
          {/* Pattern background - simplified for smaller card */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:0.6em_0.6em] bg-[-0.3em_-0.3em] pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
          
          <div className="p-3.5 relative z-10">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-[#264143] text-base line-clamp-1 flex-1">
                {notice.title}
              </h3>
              
              {/* Badge with smaller size */}
              <div className="bg-[#7BB4B1]/10 text-[#7BB4B1] text-xs py-0.5 px-1.5 rounded flex-shrink-0">
                <span className="relative top-px">New</span>
              </div>
            </div>
            
            <p className="text-[#264143]/80 text-xs mb-2.5 line-clamp-1">
              {notice.description}
            </p>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center flex-wrap gap-2 text-[#264143]/60">
                <span className="truncate">{notice.author.firstName} {notice.author.lastName}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(notice.createdAt.toString())}
                </span>
              </div>
              
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1 transition-all duration-200 ${
                    isUserLiked ? 'text-[#DE5499]' : 'text-[#264143]/60'
                  }`}
                  disabled={!isLoaded}
                >
                  <Heart 
                    className={`h-3.5 w-3.5 ${isUserLiked ? 'fill-[#DE5499]' : ''}`}
                  />
                  <span>{notice._count.likes}</span>
                </button>
                
                <div className="flex items-center gap-1 text-[#264143]/60">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>{notice._count.comments}</span>
                </div>
                
                <div className={`flex items-center text-[#7BB4B1] transition-all duration-300 ${
                  isHovered ? 'translate-x-0.5' : ''
                }`}>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Corner slice - smaller for compact card */}
          <div className="absolute bottom-0 left-0 w-3.5 h-3.5 bg-white border-r-[0.12em] border-t-[0.12em] border-[#264143] rounded-tr-[0.25em] z-10"></div>
        </div>
      </Link>
    </div>
  );
}