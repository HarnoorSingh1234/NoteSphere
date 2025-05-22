'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ArrowLeft, Info, Shield, Users } from 'lucide-react';

// Import custom components
import SubjectHeader from '@/components/subjects/SubjectHeader';
import NotesListing from '@/components/subjects/NotesListing';
import UploadNoteDialog from '@/components/subjects/UploadNoteDialog';
import { NoteType } from '@prisma/client';

interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  fileUrl: string;
  isPublic: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  authorClerkId: string;
  subjectId: string;
  likes: {
    userId: string;
  }[];
  comments: {
    id: string;
  }[];
  author: {
    firstName: string;
    lastName: string;
  };
}

interface Subject {
  id: string;
  name: string;
  code: string;
  semesterId: string;
  notes: Note[];
}

export default function SubjectPage() {
  // Use the useParams hook to access route parameters
  const params = useParams();
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const yearid = params.yearid as string;
  const semid = params.semid as string;
  const subid = params.subid as string;
  
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [googleAuthUrl, setGoogleAuthUrl] = useState<string | null>(null);
  
  // Fetch subject and its notes
  useEffect(() => {
    const fetchSubject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/subjects/${subid}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch subject: ${response.statusText}`);
        }
        
        const data = await response.json();
        setSubject(data.subject);
      } catch (err) {
        console.error('Error fetching subject:', err);
        setError(err instanceof Error ? err.message : 'Failed to load subject');
      } finally {
        setLoading(false);
      }
    };
    
    if (subid) {
      fetchSubject();
    }
  }, [subid]);
  
  // Loading state
  if (loading) {
    return (
      <div className="relative w-full min-h-screen bg-[#EDDCD9] py-12">
        {/* Pattern grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:1em_1em] pointer-events-none opacity-30 z-[1]" />
        
        {/* Overlay dots */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:2em_2em] bg-[-1em_-1em] pointer-events-none opacity-10 z-[1]" />
        
        <div className="flex flex-col items-center justify-center min-h-[60vh] relative z-10">
          <div className="w-14 h-14 border-4 border-[#DE5499] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-6 text-lg font-bold text-[#050505]">Loading subject details...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="relative w-full min-h-screen bg-[#EDDCD9] py-12">
        {/* Pattern grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:1em_1em] pointer-events-none opacity-30 z-[1]" />
        
        {/* Overlay dots */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:2em_2em] bg-[-1em_-1em] pointer-events-none opacity-10 z-[1]" />
        
        <div className="flex flex-col items-center justify-center min-h-[60vh] relative z-10">
          <div className="bg-white border-[0.15em] border-[#050505] rounded-[0.6em] shadow-[0.4em_0.4em_0_#ff3e00] p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-[#050505] mb-4">Oops! Something went wrong</h2>
            <p className="text-[#050505]/80 mb-6">{error}</p>
            <button 
              onClick={() => router.back()}
              className="inline-flex items-center justify-center px-5 py-2 text-[#050505] font-bold bg-white border-[0.2em] border-[#050505] rounded-[0.4em] shadow-[0.2em_0.2em_0_#ff3e00] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#ff3e00] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#ff3e00] transition-all duration-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Subject not found state
  if (!subject) {
    return (
      <div className="relative w-full min-h-screen bg-[#EDDCD9] py-12">
        {/* Pattern grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:1em_1em] pointer-events-none opacity-30 z-[1]" />
        
        {/* Overlay dots */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:2em_2em] bg-[-1em_-1em] pointer-events-none opacity-10 z-[1]" />
        
        <div className="flex flex-col items-center justify-center min-h-[60vh] relative z-10">
          <div className="bg-white border-[0.15em] border-[#050505] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-[#050505] mb-4">Subject Not Found</h2>
            <p className="text-[#050505]/80 mb-6">We couldn't find the subject you're looking for.</p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center px-5 py-2 text-[#050505] font-bold bg-white border-[0.2em] border-[#050505] rounded-[0.4em] shadow-[0.2em_0.2em_0_#E99F4C] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#E99F4C] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#E99F4C] transition-all duration-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full min-h-screen bg-[#EDDCD9] py-12">
      {/* Pattern grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:1em_1em] pointer-events-none opacity-30 z-[1]" />
      
      {/* Overlay dots */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:2em_2em] bg-[-1em_-1em] pointer-events-none opacity-10 z-[1]" />
      
      {/* Accent blobs */}
      <div className="absolute top-[10%] right-[5%] w-[12rem] h-[12rem] bg-[#DE5499]/10 rounded-full blur-2xl pointer-events-none z-[1]"></div>
      <div className="absolute bottom-[15%] left-[10%] w-[15rem] h-[15rem] bg-[#E99F4C]/10 rounded-full blur-2xl pointer-events-none z-[1]"></div>
      
      <div className="container mx-auto relative z-10 max-w-6xl px-4">
        {/* Subject Header Component */}
        <SubjectHeader 
          subjectName={subject.name}
          subjectCode={subject.code}
          yearid={yearid}
          semid={semid}
        />
        
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notes listing */}
          <div className="lg:col-span-2">
            <NotesListing 
              notes={subject.notes || []} 
              subjectName={subject.name}
            />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upload Card */}              <div className="bg-white border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#DE5499] p-6">
              <h3 className="text-xl font-bold text-[#264143] mb-2">Share Your Knowledge</h3>
              <p className="text-[#264143]/70 mb-5">Help your peers by sharing your notes and materials for {subject.name}!</p>
              
              {isSignedIn ? (
                /* Upload Notes Button that opens dialog if user is signed in */
                <UploadNoteDialog 
                  subjectId={subject.id} 
                  googleAuthUrl={googleAuthUrl} 
                  setGoogleAuthUrl={setGoogleAuthUrl} 
                />
              ) : (
                /* Sign in to upload if user is not signed in */
                <button
                  onClick={() => router.push(`/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`)}
                  className="w-full px-5 py-3 text-white font-bold bg-[#DE5499] border-[0.15em] border-[#050505] rounded-[0.4em] shadow-[0.2em_0.2em_0_#050505] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#050505] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#050505] transition-all duration-200"
                >
                  Sign in to Upload Notes
                </button>
              )}
            </div>
            
            {/* Subject Info Card */}
            <div className="bg-white border-[0.15em] border-[#050505] rounded-[0.6em] shadow-[0.3em_0.3em_0_#4d61ff] p-6">
              <h3 className="text-xl font-bold text-[#050505] mb-4">About This Subject</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-[#4d61ff]/10 border-[0.1em] border-[#4d61ff] rounded-full shrink-0">
                    <Info className="w-4 h-4 text-[#4d61ff]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#050505]">Course Code</h4>
                    <p className="text-[#050505]/70">{subject.code}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-[#E99F4C]/10 border-[0.1em] border-[#E99F4C] rounded-full shrink-0">
                    <Shield className="w-4 h-4 text-[#E99F4C]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#050505]">Resource Count</h4>
                    <p className="text-[#050505]/70">{subject.notes?.length || 0} study materials</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-[#DE5499]/10 border-[0.1em] border-[#DE5499] rounded-full shrink-0">
                    <Users className="w-4 h-4 text-[#DE5499]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#050505]">Contributors</h4>
                    <p className="text-[#050505]/70">
                      {new Set(subject.notes?.map(note => note.authorClerkId) || []).size} people have shared notes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Corner slice */}
      <div className="absolute bottom-0 left-0 w-[2.5em] h-[2.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#050505] rounded-tr-[0.8em] z-[3]" />
    </div>
  );
}