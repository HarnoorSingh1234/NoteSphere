'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { NoteType } from '@prisma/client';
import { ChevronLeft, FileSymlink } from 'lucide-react';
import NoteDetailsClient from './NoteDetailsClient';

// Define types for props
interface NoteClientPageProps {
  note: any;  // Note with authorId
  similarNotes: any[];
  color: string;
  bgColor: string;
}

export default function NoteClientPage({ note, similarNotes, color, bgColor }: NoteClientPageProps) {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-[#F8F5F2] py-6 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center text-[#264143] hover:text-[#DE5499] transition-colors font-medium"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            <span>Back to {note.subject?.name || 'Subject'}</span>
          </button>
        </div>
        
        <NoteDetailsClient note={note} color={color} bgColor={bgColor} />
        
        {/* Display tags if available */}
        {note.tags && note.tags.length > 0 && (
          <div className="mt-6 bg-white border-[0.15em] border-[#264143] rounded-[0.6em] p-5 shadow-[0.2em_0.2em_0_#DE5499]">
            <h3 className="text-lg font-bold text-[#264143] mb-3">Tags</h3>            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag: string, index: number) => (
                <span 
                  key={`tag-${index}-${tag}`} 
                  className="px-3 py-1 bg-[#EDDCD9] text-[#264143] rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      
      {/* Recommended Related Materials */}
      {note.subject && (
        <div className="mt-8 bg-white border-[0.15em] border-[#264143] rounded-[0.6em] p-6 shadow-[0.3em_0.3em_0_#4CAF50]">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#4CAF50]/10 p-2 rounded-full">
              <FileSymlink className="w-5 h-5 text-[#4CAF50]" />
            </div>
            <h2 className="text-xl font-bold text-[#264143]">Related Resources</h2>
          </div>
          <p className="text-[#264143]/80 mb-5">
            Explore more study materials from {note.subject.name}
          </p>
          <Link
            href={`/academics/subjects/${note.subjectId}`}
            className="inline-flex items-center px-5 py-2.5 bg-[#F8F5F2] text-[#264143] font-medium rounded-[0.4em] border-[0.15em] border-[#264143] hover:bg-[#EDDCD9] hover:translate-y-[-0.1em] transition-all duration-200 shadow-[0.1em_0.1em_0_#264143] hover:shadow-[0.2em_0.2em_0_#264143]"
          >
            <FileSymlink className="w-4 h-4 mr-2" />
            View All Subject Materials
          </Link>
        </div>
      )}
      
      {/* Similar Notes */}
      {similarNotes.length > 0 && (
        <div className="mt-8 bg-white border-[0.15em] border-[#264143] rounded-[0.6em] p-6 shadow-[0.3em_0.3em_0_#4d61ff]">
          <h2 className="text-xl font-bold text-[#264143] mb-5">Similar Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {similarNotes.map((similarNote) => (
              <Link 
                key={similarNote.id}
                href={`/notes/${similarNote.id}`}
                className="flex items-start p-3 bg-[#F8F5F2] rounded-lg hover:bg-[#EDDCD9]/50 transition-colors"
              >
                <div className="bg-white p-2 rounded-md shadow-md mr-3">
                  <FileSymlink className="w-5 h-5 text-[#DE5499]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#264143] line-clamp-1">{similarNote.title}</h3>
                  <p className="text-xs text-[#264143]/70">
                    {similarNote.author.firstName} {similarNote.author.lastName} • {similarNote._count.likes} likes
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
