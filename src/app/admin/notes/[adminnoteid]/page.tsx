import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { FileText, Clock, User, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { NoteType } from '@prisma/client';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const AdminLikeButton = dynamic(() => import('@/components/admin/AdminLikeButton'), { ssr: false });
const AdminCommentSection = dynamic(() => import('@/components/admin/AdminCommentSection'), { ssr: false });

// Fetch note data
export async function generateMetadata({ params }: { params: { id: string } }) {
  const note = await prisma.note.findUnique({
    where: { id: params.id },
    include: {
      author: true,
      subject: true,
    },
  });

  if (!note) {
    return { title: 'Note not found' };
  }

  return {
    title: `Admin: ${note.title} | NoteSphere`,
    description: `Admin view for ${note.title}`,
  };
}

export default async function AdminNotePage({ params }: { params: { id: string } }) {
  // Fetch note with related data
  const note = await prisma.note.findUnique({
    where: { id: params.id },
    include: {
      author: true,
      subject: {
        include: {
          semester: {
            include: {
              year: true,
            },
          },
        },
      },
      _count: {
        select: { 
          likes: true,
          comments: true,
        },
      },
    },
  });

  if (!note) {
    notFound();
  }

  // Function to determine note icon and color based on type
  const getNoteTypeDetails = (type: NoteType) => {
    switch(type) {
      case 'PDF':
        return { color: '#ff3e00', bgColor: '#ff3e00/10' };
      case 'PPT':
        return { color: '#E99F4C', bgColor: '#E99F4C/10' };
      case 'LECTURE':
        return { color: '#4d61ff', bgColor: '#4d61ff/10' };
      case 'HANDWRITTEN':
        return { color: '#DE5499', bgColor: '#DE5499/10' };
      default:
        return { color: '#050505', bgColor: '#050505/10' };
    }
  };
  
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
  
  const { color, bgColor } = getNoteTypeDetails(note.type);
  const status = getStatusDisplay();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-4">
        <Link 
          href="/admin/notes" 
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Notes List
        </Link>
      </div>
    
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{note.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{note.author.firstName} {note.author.lastName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
                <div 
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}
                >
                  {status.icon}
                  {status.label}
                </div>
              </div>
            </div>
            
            <div 
              className="inline-flex items-center px-3 py-1 border border-gray-200 rounded-full text-sm font-semibold"
              style={{ color, backgroundColor: bgColor }}
            >
              {note.type}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 border-b border-gray-200">
          {note.content ? (
            <div className="prose max-w-none">
              <p>{note.content}</p>
            </div>
          ) : (
            <div className="text-gray-500">No additional content for these notes.</div>
          )}
        </div>
        
        {/* Stats and Actions */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div className="flex items-center gap-6 text-gray-600">
              <AdminLikeButton
                noteId={note.id}
                initialLikes={note._count.likes}
              />
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span>{note.downloadCount}</span>
                <span className="sr-only">downloads</span>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600 mb-1">
                Subject: <span className="font-semibold">{note.subject.name} ({note.subject.code})</span>
              </div>
              <div className="text-sm text-gray-600">
                Year {note.subject.semester.year.number}, Semester {note.subject.semester.number}
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="mt-6 flex gap-4">
            <a 
              href={note.fileUrl || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Original
            </a>
            <Link
              href={`/notes/${note.id}`}
              target="_blank"
              className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300"
            >
              <FileText className="w-4 h-4 mr-2" />
              View Public Page
            </Link>
          </div>
        </div>
      </div>
      
      {/* Comment Section */}
      <div className="mt-8">
        <AdminCommentSection noteId={note.id} />
      </div>
    </div>
  );
}
