'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ArrowLeft, Info, Shield, Users } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const { isSignedIn } = useUser();
  const yearid = params.yearid as string;
  const semid = params.semid as string;
  const subid = params.subid as string;
  
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [googleAuthUrl, setGoogleAuthUrl] = useState<string | null>(null);
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };
  
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
      <div className="relative w-full min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 py-12">
        {/* Background patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:18px_18px] md:bg-[length:24px_24px] pointer-events-none"></div>
        
        <div className="flex flex-col items-center justify-center min-h-[60vh] relative z-10">
          <div className="w-20 h-20 mx-auto border-[0.25em] border-t-[#7BB4B1] border-r-[#EDDCD9] border-b-[#E99F4C] border-l-[#DE5499] rounded-full animate-spin"></div>
          <p className="mt-6 text-xl font-medium text-[#264143]">Loading subject details...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="relative w-full min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 py-12">
        {/* Background patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:18px_18px] md:bg-[length:24px_24px] pointer-events-none"></div>
        
        <div className="flex flex-col items-center justify-center min-h-[60vh] relative z-10">
          <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#DE5499] p-8 max-w-md w-full relative">
            {/* Corner slice */}
            <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
            
            <h2 className="text-2xl font-bold text-[#264143] mb-4">Oops! Something went wrong</h2>
            <p className="text-[#264143]/80 mb-6">{error}</p>
            <button 
              onClick={() => router.back()}
              className="inline-flex items-center justify-center px-5 py-2.5 text-[#264143] font-bold bg-white border-[0.25em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#DE5499] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#DE5499] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#DE5499] transition-all duration-200"
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
      <div className="relative w-full min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 py-12">
        {/* Background patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:18px_18px] md:bg-[length:24px_24px] pointer-events-none"></div>
        
        <div className="flex flex-col items-center justify-center min-h-[60vh] relative z-10">
          <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] p-8 max-w-md w-full relative">
            {/* Corner slice */}
            <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
            
            <h2 className="text-2xl font-bold text-[#264143] mb-4">Subject Not Found</h2>
            <p className="text-[#264143]/80 mb-6">We couldn't find the subject you're looking for.</p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center px-5 py-2.5 text-[#264143] font-bold bg-white border-[0.25em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#E99F4C] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#E99F4C] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#E99F4C] transition-all duration-200"
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
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 py-12">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:18px_18px] md:bg-[length:24px_24px] pointer-events-none"></div>
      
      {/* Accent blobs */}
      <div className="absolute top-[10%] right-[5%] w-[15vw] max-w-[8rem] aspect-square bg-[#DE5499]/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute bottom-[15%] left-[8%] w-[18vw] max-w-[10rem] aspect-square bg-[#7BB4B1]/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute top-[40%] left-[15%] w-[12vw] max-w-[7rem] aspect-square bg-[#E99F4C]/10 rounded-full blur-xl pointer-events-none"></div>
      
      <div className="container mx-auto relative z-10 max-w-6xl px-4">
        {/* Subject Header Component */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={0}
        >
          <SubjectHeader 
            subjectName={subject.name}
            subjectCode={subject.code}
            yearid={yearid}
            semid={semid}
          />
        </motion.div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notes listing */}
          <motion.div 
            className="lg:col-span-2"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={1}
          >
            <NotesListing 
              notes={subject.notes || []} 
              subjectName={subject.name}
            />
          </motion.div>
          
          {/* Sidebar */}
          <motion.div 
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={2}
          >
            {/* Upload Card */}
            <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#DE5499] p-6 relative overflow-hidden">
              {/* Corner slice */}
              <div className="absolute bottom-0 left-0 w-[1.2em] h-[1.2em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
              
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#EDDCD9] transform rotate-45 translate-x-8 -translate-y-8"></div>
              
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
                  className="w-full px-5 py-3 text-white font-bold bg-[#DE5499] border-[0.25em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#264143] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#264143] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#264143] transition-all duration-200"
                >
                  Sign in to Upload Notes
                </button>
              )}
            </div>
            
            {/* Subject Info Card */}
            <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#7BB4B1] p-6 relative">
              {/* Corner slice */}
              <div className="absolute bottom-0 left-0 w-[1.2em] h-[1.2em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
              
              <h3 className="text-xl font-bold text-[#264143] mb-4">About This Subject</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-[#7BB4B1]/10 border-[0.15em] border-[#264143] rounded-[0.3em] shadow-[0.1em_0.1em_0_#E99F4C] shrink-0">
                    <Info className="w-4 h-4 text-[#264143]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#264143]">Course Code</h4>
                    <p className="text-[#264143]/70">{subject.code}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-[#E99F4C]/10 border-[0.15em] border-[#264143] rounded-[0.3em] shadow-[0.1em_0.1em_0_#7BB4B1] shrink-0">
                    <Shield className="w-4 h-4 text-[#264143]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#264143]">Resource Count</h4>
                    <p className="text-[#264143]/70">{subject.notes?.length || 0} study materials</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-[#DE5499]/10 border-[0.15em] border-[#264143] rounded-[0.3em] shadow-[0.1em_0.1em_0_#E99F4C] shrink-0">
                    <Users className="w-4 h-4 text-[#264143]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#264143]">Contributors</h4>
                    <p className="text-[#264143]/70">
                      {new Set(subject.notes?.map(note => note.authorClerkId) || []).size} people have shared notes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}