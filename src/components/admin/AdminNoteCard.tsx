'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, MessageCircle, Download, ExternalLink, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Note } from '@/types/index';
import AdminLikeButton from './AdminLikeButton';
import { formatDate, getNoteTypeDetails, truncateText, formatAuthorName } from './utils';
import { motion } from 'framer-motion';

interface AdminNoteCardProps {
  note: Note;
  onApprove?: (noteId: string) => void;
  onReject?: (noteId: string) => void;
  onUnreject?: (noteId: string, action: 'restore' | 'publish') => void;
  showActions?: boolean;
  isProcessing?: boolean;
  showUnrejectActions?: boolean;
}

const AdminNoteCard: React.FC<AdminNoteCardProps> = ({ 
  note, 
  onApprove, 
  onReject,
  onUnreject,
  showActions = false,
  isProcessing = false,
  showUnrejectActions = false
}) => {
 
  
  // Determine status display with our playful design colors
  const getStatusDisplay = () => {
    if (note.isPublic) {
      return {
        label: 'Approved',
        icon: <CheckCircle className="w-4 h-4 mr-1" />,
        bgColor: 'bg-[#7BB4B1]/20',
        borderColor: 'border-[#7BB4B1]',
        textColor: 'text-[#264143]'
      };
    } else if (note.isRejected) {
      return {
        label: 'Rejected',
        icon: <XCircle className="w-4 h-4 mr-1" />,
        bgColor: 'bg-[#DE5499]/20',
        borderColor: 'border-[#DE5499]',
        textColor: 'text-[#264143]'
      };
    } else {
      return {
        label: 'Pending',
        icon: <AlertCircle className="w-4 h-4 mr-1" />,
        bgColor: 'bg-[#E99F4C]/20',
        borderColor: 'border-[#E99F4C]',
        textColor: 'text-[#264143]'
      };
    }
  };

  const status = getStatusDisplay();
  
  return (
    <div className="bg-white border-[0.2em] border-[#264143] rounded-[0.5em] shadow-[0.25em_0.25em_0_#7BB4B1] hover:translate-y-[-0.15em] hover:shadow-[0.35em_0.35em_0_#7BB4B1] transition-all duration-300 relative">
      {/* Corner slice */}
      <div className="absolute bottom-0 left-0 w-[1em] h-[1em] bg-white border-r-[0.2em] border-t-[0.2em] border-[#264143] rounded-tr-[0.3em] z-10"></div>
      
      <div className="p-5 relative z-[1]">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-[0.3em] bg-[#EDDCD9]/50 border-[0.15em] border-[#264143] shadow-[0.15em_0.15em_0_#E99F4C]">
            <FileText className="w-6 h-6 text-[#264143]" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg text-[#264143] mb-1.5">{note.title}</h3>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-[#264143]/80">{formatAuthorName(note.author)}</span>
                  
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#EDDCD9]/40 text-[#264143] border-[0.1em] border-[#264143]/20">
                    {note.type}
                  </span>
                  
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor} border-[0.1em] ${status.borderColor}`}>
                    {status.icon}
                    {status.label}
                  </span>
                </div>
                
                <p className="text-[#264143]/80 text-sm mb-3 leading-relaxed">
                  {truncateText(note.content, 120)}
                </p>
                
                <div className="text-xs text-[#264143]/70 flex flex-wrap items-center gap-4">
                  <AdminLikeButton
                    noteId={note.id}
                    initialLikes={note._count?.likes ?? note.likes?.length ?? 0}
                  />
                  <Link href={`/admin/notes/${note.id}#comments`} passHref>
                    <div className="flex items-center">
                      <MessageCircle className="w-3.5 h-3.5 mr-1" />
                      {(note._count?.comments ?? note.comments?.length ?? 0)} comments
                    </div>
                  </Link>
                  <span className="flex items-center">
                    <Download className="w-3.5 h-3.5 mr-1" />
                    {note.downloadCount} downloads
                  </span>
                  <span>
                    Posted {formatDate(note.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showActions && (
        <div className="border-t-[0.15em] border-[#264143]/20 bg-[#EDDCD9]/10 px-5 py-3 flex flex-wrap justify-between gap-3">
          <div className="flex gap-3">
            <Link 
              href={`/admin/notes/${note.id}`}
              className="inline-flex items-center text-sm font-medium text-[#264143] hover:text-[#7BB4B1] transition-colors"
            >
              Details
            </Link>
            <Link 
              href={`/notes/${note.id}`} 
              target="_blank"
              className="inline-flex items-center text-sm font-medium text-[#264143] hover:text-[#7BB4B1] transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Preview
            </Link>
          </div>
          
          {!note.isPublic && !note.isRejected && (
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onApprove && onApprove(note.id)}
                disabled={isProcessing}
                className={`inline-flex items-center px-3 py-1.5 rounded-[0.3em] text-xs font-bold ${
                  isProcessing
                    ? 'bg-[#7BB4B1]/30 text-[#264143] border-[0.1em] border-[#7BB4B1] cursor-wait'
                    : 'bg-white border-[0.1em] border-[#264143] text-[#264143] shadow-[0.1em_0.1em_0_#7BB4B1] hover:translate-y-[-0.05em] hover:shadow-[0.15em_0.15em_0_#7BB4B1] active:translate-y-[0.05em] active:shadow-[0.05em_0.05em_0_#7BB4B1]'
                } transition-all duration-200`}
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                Approve
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onReject && onReject(note.id)}
                disabled={isProcessing}
                className={`inline-flex items-center px-3 py-1.5 rounded-[0.3em] text-xs font-bold ${
                  isProcessing
                    ? 'bg-[#DE5499]/30 text-[#264143] border-[0.1em] border-[#DE5499] cursor-wait'
                    : 'bg-white border-[0.1em] border-[#264143] text-[#264143] shadow-[0.1em_0.1em_0_#DE5499] hover:translate-y-[-0.05em] hover:shadow-[0.15em_0.15em_0_#DE5499] active:translate-y-[0.05em] active:shadow-[0.05em_0.05em_0_#DE5499]'
                } transition-all duration-200`}
              >
                <XCircle className="w-3.5 h-3.5 mr-1" />
                Reject
              </motion.button>
            </div>
          )}
          
          {/* Unreject actions for rejected notes */}
          {showUnrejectActions && note.isRejected && onUnreject && (
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onUnreject(note.id, 'restore')}
                disabled={isProcessing}
                className={`inline-flex items-center px-3 py-1.5 rounded-[0.3em] text-xs font-bold ${
                  isProcessing
                    ? 'bg-[#E99F4C]/30 text-[#264143] border-[0.1em] border-[#E99F4C] cursor-wait'
                    : 'bg-white border-[0.1em] border-[#264143] text-[#264143] shadow-[0.1em_0.1em_0_#E99F4C] hover:translate-y-[-0.05em] hover:shadow-[0.15em_0.15em_0_#E99F4C] active:translate-y-[0.05em] active:shadow-[0.05em_0.05em_0_#E99F4C]'
                } transition-all duration-200`}
              >
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                Restore to Pending
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onUnreject(note.id, 'publish')}
                disabled={isProcessing}
                className={`inline-flex items-center px-3 py-1.5 rounded-[0.3em] text-xs font-bold ${
                  isProcessing
                    ? 'bg-[#7BB4B1]/30 text-[#264143] border-[0.1em] border-[#7BB4B1] cursor-wait'
                    : 'bg-white border-[0.1em] border-[#264143] text-[#264143] shadow-[0.1em_0.1em_0_#7BB4B1] hover:translate-y-[-0.05em] hover:shadow-[0.15em_0.15em_0_#7BB4B1] active:translate-y-[0.05em] active:shadow-[0.05em_0.05em_0_#7BB4B1]'
                } transition-all duration-200`}
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                Publish Now
              </motion.button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminNoteCard;