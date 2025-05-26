import { Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate } from '@/lib/date-utils';
import { getInitials } from '@/lib/notices/utils';

import { Comment, Notice } from '@/lib/notices/types';

interface NoticeHeaderProps {
  notice: Notice;
}

export default function NoticeHeader({ notice }: NoticeHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl md:text-3xl font-bold text-[#264143]">{notice.title}</h1>
        
        <a href={notice.driveLink} target="_blank" rel="noopener noreferrer">
          <Button 
            size="sm" 
            className="bg-[#7BB4B1] border-[0.15em] border-[#264143] shadow-[0.15em_0.15em_0_#E99F4C] hover:translate-y-[-0.1em] hover:translate-x-[-0.05em] hover:shadow-[0.2em_0.2em_0_#E99F4C] hover:bg-[#6ba3a0] transition-all duration-200"
          >
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
        </a>
      </div>
      
      <div className="flex items-center justify-between text-sm text-[#264143]/70 mb-6">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border-[0.1em] border-[#264143]/20 shadow-[0.1em_0.1em_0_#E99F4C]/20">
            {notice.author.image && <AvatarImage src={notice.author.image} />}
            <AvatarFallback className="bg-[#EDDCD9]">{getInitials(notice.author.firstName, notice.author.lastName)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">
            {notice.author.firstName} {notice.author.lastName}
          </span>
        </div>
        
        <div className="flex items-center gap-2 bg-[#EDDCD9]/30 py-1 px-3 rounded-full">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(notice.createdAt)}</span>
        </div>
      </div>
      
      <p className="text-[#264143]/80 mb-8 text-lg">{notice.description}</p>
    </div>
  );
}