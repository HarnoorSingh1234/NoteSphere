'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, MessageCircle, Download, ExternalLink, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Note } from '@/types/index';
import AdminLikeButton from './AdminLikeButton';
import { formatDate, getNoteTypeDetails, truncateText, formatAuthorName } from './utils';

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
  const { color, bgColor } = getNoteTypeDetails(note.type);
  
  // Determine status display
  const getStatusDisplay = () => {
    if (note.isPublic) {
      return {
        label: 'Approved',
        icon: <CheckCircle className="w-4 h-4 mr-1" />,
        bgColor: 'bg-green-100',
        textColor: 'text-green-800'
      };
    } else if (note.isRejected) {
      return {
        label: 'Rejected',
        icon: <XCircle className="w-4 h-4 mr-1" />,
        bgColor: 'bg-red-100',
        textColor: 'text-red-800'
      };
    } else {
      return {
        label: 'Pending',
        icon: <AlertCircle className="w-4 h-4 mr-1" />,
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800'
      };
    }
  };

  const status = getStatusDisplay();
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div 
            style={{ backgroundColor: bgColor, borderColor: color }} 
            className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg border"
          >
            <FileText style={{ color }} className="w-6 h-6" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg text-[#050505] mb-1">{note.title}</h3>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-[#050505]/70">{formatAuthorName(note.author)}</span>
                  <span 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: bgColor, color: color }}
                  >
                    {note.type}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}>
                    {status.icon}
                    {status.label}
                  </span>
                </div>
                
                <p className="text-[#050505]/70 text-sm mb-3">
                  {truncateText(note.content, 120)}
                </p>                <div className="text-xs text-[#050505]/60 flex items-center gap-4">
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
        <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 flex justify-between">
          <div className="flex gap-3">
            <Link 
              href={`/admin/notes/${note.id}`}
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Details
            </Link>
            <Link 
              href={`/notes/${note.id}`} 
              target="_blank"
              className="inline-flex items-center text-sm font-medium text-[#4d61ff] hover:text-[#3a4cd1]"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Preview
            </Link>
          </div>
            {!note.isPublic && !note.isRejected && (
            <div className="flex gap-2">
              <button
                onClick={() => onApprove && onApprove(note.id)}
                disabled={isProcessing}
                className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium ${
                  isProcessing
                    ? 'bg-green-100 text-green-700 cursor-wait'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                Approve
              </button>
              <button
                onClick={() => onReject && onReject(note.id)}
                disabled={isProcessing}
                className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium ${
                  isProcessing
                    ? 'bg-red-100 text-red-700 cursor-wait'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                <XCircle className="w-3.5 h-3.5 mr-1" />
                Reject
              </button>
            </div>
          )}
          
          {/* Unreject actions for rejected notes */}
          {showUnrejectActions && note.isRejected && onUnreject && (
            <div className="flex gap-2">
              <button
                onClick={() => onUnreject(note.id, 'restore')}
                disabled={isProcessing}
                className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium ${
                  isProcessing
                    ? 'bg-yellow-100 text-yellow-700 cursor-wait'
                    : 'bg-yellow-500 text-white hover:bg-yellow-600'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                Restore to Pending
              </button>
              <button
                onClick={() => onUnreject(note.id, 'publish')}
                disabled={isProcessing}
                className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium ${
                  isProcessing
                    ? 'bg-green-100 text-green-700 cursor-wait'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                Publish Now
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminNoteCard;