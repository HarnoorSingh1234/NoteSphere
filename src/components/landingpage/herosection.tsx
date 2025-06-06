"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, BookOpen, NotebookPen, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { CanvasBackground } from './canvasbackground';
import { useUser } from '@clerk/nextjs';

// Define interface for user profile data
interface UserProfileData {
  id: string;
  yearId: string | null;
  semesterId: string | null;
  yearNumber: number | null;
  semesterNumber: number | null;
}

export default function HeroSection() {
  // Track if the component is mounted to prevent hydration issues
  const [isMounted, setIsMounted] = useState(false);
  // Get the user and isLoaded state from Clerk
  const { user, isLoaded } = useUser();  // State for user profile data
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  // Extract year/semester data from Clerk metadata when user is loaded
  useEffect(() => {
    if (isLoaded && user) {
      const metadata = user.publicMetadata;
      
      // Extract year/semester data from Clerk's public metadata
      const yearId = metadata.yearId as string || null;
      const semesterId = metadata.semesterId as string || null;
      const yearNumber = metadata.yearNumber as number || null;
      const semesterNumber = metadata.semesterNumber as number || null;
      
      // Set profile data from metadata
      setProfileData({
        id: user.id,
        yearId,
        semesterId,
        yearNumber,
        semesterNumber
      });
      
      setLoadingProfile(false);
    } else if (isLoaded && !user) {
      // Clear profile data if no user
      setProfileData(null);
      setLoadingProfile(false);
    }
  }, [isLoaded, user]);

  return (
    <div className="relative w-full min-h-[80vh] overflow-hidden bg-[#EDDCD9] border-b-[0.35em] border-[#264143] group">
      {/* Pattern grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:1em_1em] pointer-events-none opacity-30 transition-opacity duration-300 ease-in-out z-[1] group-hover:opacity-50" />
      
      {/* Overlay dots */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:2em_2em] bg-[-1em_-1em] pointer-events-none opacity-10 transition-opacity duration-300 ease-in-out z-[1] group-hover:opacity-30" />
        {/* Canvas container */}
      <div className="absolute inset-0 z-0 opacity-30">
        {isMounted && <CanvasBackground />}
      </div>
      
      {/* Hero content */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 w-full min-h-[80vh] flex items-center"
      >
        <div className="container mx-auto px-4 py-12 relative">          
          {/* Decorative elements matching navbar - made smaller to accommodate animation */}
          <div className="absolute top-[10%] left-[5%] w-[1.8em] h-[1.8em] bg-[#DE5499] border-[0.12em] border-[#264143] rounded-[0.25em] rotate-12 shadow-[0.15em_0.15em_0_#E99F4C] transition-transform duration-300 ease-in-out group-hover:rotate-6 group-hover:scale-110" />
          <div className="absolute bottom-[15%] right-[8%] w-[2.5em] h-[2.5em] bg-[#E99F4C] border-[0.12em] border-[#264143] rounded-[0.25em] rotate-45 shadow-[0.15em_0.15em_0_#DE5499] transition-transform duration-300 ease-in-out group-hover:rotate-[55deg] group-hover:scale-110" />
          
          <div className="max-w-4xl mx-auto lg:mx-0">
            <div className="flex flex-col space-y-8">
              {/* Logo-style heading */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center mb-4"
              >                
                <div className="flex items-center justify-center w-[2.5rem] h-[2.5rem] bg-white border-[0.15em] border-[#264143] rounded-[0.3em] shadow-[0.15em_0.15em_0_#E99F4C] mr-3 transition-all duration-200 ease-in-out transform hover:rotate-[-5deg] hover:scale-105">
                  <BookOpen className="w-[1.5rem] h-[1.5rem] text-[#264143]" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white border-[0.3em] border-[#264143] rounded-[0.5em] p-5 shadow-[0.4em_0.4em_0_#E99F4C] transition-all duration-300 ease-in-out hover:translate-y-[-0.2em] hover:shadow-[0.6em_0.6em_0_#E99F4C] max-w-[85%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[75%] mx-auto lg:mx-0"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#264143]">
                  {user ? (
                    <>Welcome back, <span className="text-[#DE5499]">{user.firstName || 'Friend'}</span></>
                  ) : (
                    <>Capture Ideas, <span className="text-[#DE5499]">Organize Thoughts</span></>
                  )}
                </h1>
                
                <p className="max-w-[550px] text-base sm:text-lg md:text-xl mb-5 text-[#264143]">
                  {user ? (
                    <>Your notes are waiting for you. Continue capturing and organizing your thoughts in one beautiful space.</>
                  ) : (
                    <>NoteSphere helps you collect, organize, and connect your ideas in one beautiful space.
                    Take notes that matter, discover connections, and never lose track of your thoughts again.</>
                  )}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  {!isLoaded ? (
                    // Loading state - show placeholder button
                    <div className="inline-flex items-center justify-center px-5 py-2 text-[#264143] font-bold bg-[#EDDCD9] border-[0.2em] border-[#264143] rounded-[0.4em] shadow-[0.25em_0.25em_0_#DE5499] animate-pulse">
                      Loading...
                    </div>
                  ) : user ? (
                    // User is logged in - show buttons based on profile data
                    <>
                      {/* Go To Academics button always shown for logged in users */}
                      <Link 
                        href="/academics"
                        className="inline-flex items-center justify-center px-5 py-2 text-white font-bold bg-[#DE5499] border-[0.2em] border-[#264143] rounded-[0.4em] shadow-[0.25em_0.25em_0_#E99F4C] hover:translate-x-[-0.1em] hover:translate-y-[-0.1em] hover:bg-[#E66BA7] hover:shadow-[0.35em_0.35em_0_#E99F4C] active:translate-x-[0.1em] active:translate-y-[0.1em] active:shadow-[0.15em_0.15em_0_#E99F4C] transition-all duration-200"
                      >
                        Go To Academics <NotebookPen className="ml-2 h-4 w-4" />
                      </Link>
                      
                      {/* Direct link to user's semester if available */}
                      {profileData?.yearId && profileData?.semesterId && (
                        <Link 
                          href={`/academics/years/${profileData.yearId}/semesters/${profileData.semesterId}`}
                          className="inline-flex items-center justify-center px-5 py-2 text-[#264143] font-bold bg-[#E99F4C] border-[0.2em] border-[#264143] rounded-[0.4em] shadow-[0.25em_0.25em_0_#DE5499] hover:translate-x-[-0.1em] hover:translate-y-[-0.1em] hover:shadow-[0.35em_0.35em_0_#DE5499] active:translate-x-[0.1em] active:translate-y-[0.1em] active:shadow-[0.15em_0.15em_0_#DE5499] transition-all duration-200"
                        >
                          {loadingProfile ? (
                            "Loading..."
                          ) : (
                            <>
                              Go to Year {profileData.yearNumber}, Semester {profileData.semesterNumber} <Calendar className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Link>
                      )}
                    </>
                  ) : (
                    // User is not logged in - show Get Started and Sign Up buttons
                    <>
                      <Link 
                        href="/academics"
                        className="inline-flex items-center justify-center px-5 py-2 text-[#264143] font-bold bg-[#E99F4C] border-[0.2em] border-[#264143] rounded-[0.4em] shadow-[0.25em_0.25em_0_#DE5499] hover:translate-x-[-0.1em] hover:translate-y-[-0.1em] hover:shadow-[0.35em_0.35em_0_#DE5499] active:translate-x-[0.1em] active:translate-y-[0.1em] active:shadow-[0.15em_0.15em_0_#DE5499] transition-all duration-200"
                      >
                        Get Started <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                      
                      <Link
                        href="/sign-up"
                        className="inline-flex items-center justify-center px-5 py-2 text-white font-bold bg-[#DE5499] border-[0.2em] border-[#264143] rounded-[0.4em] shadow-[0.25em_0.25em_0_#E99F4C] hover:translate-x-[-0.1em] hover:translate-y-[-0.1em] hover:bg-[#E66BA7] hover:shadow-[0.35em_0.35em_0_#E99F4C] active:translate-x-[0.1em] active:translate-y-[0.1em] active:shadow-[0.15em_0.15em_0_#E99F4C] transition-all duration-200"
                      >
                        Sign Up <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Floating decorative elements */}
          <motion.div 
            initial={{ x: -20, y: 20, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute left-[15%] bottom-[20%] hidden lg:block"
          >
            
          </motion.div>
          
          <motion.div 
            initial={{ x: 20, y: -20, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="absolute right-[12%] top-[25%] hidden lg:block"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-white border-[0.15em] border-[#264143] rounded-md shadow-[0.2em_0.2em_0_#DE5499] rotate-12 transition-all duration-300 ease-in-out hover:rotate-0">
              <Sparkles className="w-5 h-5 text-[#E99F4C]" />
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Corner slice to match navbar */}
      <div className="absolute bottom-0 left-0 w-[2.5em] h-[2.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.8em] z-[3]" />
    </div>
  );
}
