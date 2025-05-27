'use client';

import React from 'react';
import { 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Heart, 
  MessageCircle,
  Eye,
  EyeOff,
  Bell
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Notice {
  id: string;
  title: string;
  description: string;
  driveLink: string;
  driveFileId?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

interface NoticeCardProps {
  notice: Notice;
  onEdit: (notice: Notice) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (notice: Notice) => void;
  formatDate: (date: string) => string;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ 
  notice, 
  onEdit, 
  onDelete, 
  onTogglePublish,
  formatDate 
}) => {
  return (
    <div className="bg-white border-[0.2em] border-[#264143] rounded-[0.5em] shadow-[0.2em_0.2em_0_#7BB4B1] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#7BB4B1] transition-all duration-300 relative overflow-hidden">
      {/* Corner slice */}
      <div className="absolute bottom-0 left-0 w-[1em] h-[1em] bg-white border-r-[0.2em] border-t-[0.2em] border-[#264143] rounded-tr-[0.3em] z-10"></div>
      
      {/* Pattern background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:0.8em_0.8em] pointer-events-none"></div>
      
      <div className="relative z-[1]">
        {/* Header */}
        <div className="p-5 border-b-[0.15em] border-[#264143]/20 bg-[#EDDCD9]/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 flex-shrink-0 bg-white border-[0.15em] border-[#264143] rounded-[0.4em] flex items-center justify-center shadow-[0.1em_0.1em_0_#DE5499]">
                <Bell className="w-5 h-5 text-[#DE5499]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-[#264143] mr-1">{notice.title}</h3>
                  <span 
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border-[0.1em] ${
                      notice.isPublished 
                        ? "bg-[#7BB4B1]/20 text-[#264143] border-[#7BB4B1]" 
                        : "bg-[#E99F4C]/20 text-[#264143] border-[#E99F4C]"
                    }`}
                  >
                    {notice.isPublished ? (
                      <>
                        <Eye className="w-3 h-3" />
                        Published
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        Draft
                      </>
                    )}
                  </span>
                </div>
                <p className="text-sm text-[#264143]/80 mb-1">
                  By {notice.author.firstName} {notice.author.lastName}
                </p>
                <p className="text-xs text-[#264143]/70">
                  Created: {formatDate(notice.createdAt)}
                  {notice.updatedAt !== notice.createdAt && (
                    <span className="ml-2">
                      • Updated: {formatDate(notice.updatedAt)}
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <motion.button
                onClick={() => onTogglePublish(notice)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 bg-white border-[0.15em] ${notice.isPublished ? 'border-[#E99F4C]' : 'border-[#7BB4B1]'} rounded-[0.3em] hover:shadow-[0.1em_0.1em_0_rgba(0,0,0,0.1)] transition-all`}
                title={notice.isPublished ? "Unpublish" : "Publish"}
              >
                {notice.isPublished ? (
                  <EyeOff className="w-4 h-4 text-[#E99F4C]" />
                ) : (
                  <Eye className="w-4 h-4 text-[#7BB4B1]" />
                )}
              </motion.button>
              <motion.button
                onClick={() => onEdit(notice)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white border-[0.15em] border-[#264143] rounded-[0.3em] hover:shadow-[0.1em_0.1em_0_rgba(0,0,0,0.1)] transition-all"
                title="Edit Notice"
              >
                <Edit3 className="w-4 h-4 text-[#264143]" />
              </motion.button>
              <motion.button
                onClick={() => onDelete(notice.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white border-[0.15em] border-[#DE5499] rounded-[0.3em] hover:shadow-[0.1em_0.1em_0_rgba(0,0,0,0.1)] transition-all"
                title="Delete Notice"
              >
                <Trash2 className="w-4 h-4 text-[#DE5499]" />
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5">
          <p className="text-[#264143] mb-5 text-sm">{notice.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-[#264143]/70">
              <span className="flex items-center gap-1" title="Likes">
                <Heart className="w-4 h-4 text-[#DE5499]" />
                {notice._count.likes}
              </span>
              <span className="flex items-center gap-1" title="Comments">
                <MessageCircle className="w-4 h-4 text-[#7BB4B1]" />
                {notice._count.comments}
              </span>
            </div>
            
            <motion.a
              href={notice.driveLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              whileTap={{ y: 0 }}
              className="px-3 py-2 bg-white border-[0.15em] border-[#264143] text-[#264143] font-medium rounded-[0.3em] shadow-[0.1em_0.1em_0_#7BB4B1] hover:shadow-[0.15em_0.15em_0_#7BB4B1] transition-all duration-200 text-sm flex items-center gap-1"
            >
              <ExternalLink className="w-4 h-4" />
              View File
            </motion.a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeCard;