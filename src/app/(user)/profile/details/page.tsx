'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Pencil, 
  School, 
  Calendar, 
  Building2, 
  Shield, 
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface UserProfileData {
  id: string;
  clerkId: string;
  bio: string | null;
  studentId: string | null;
  department: string | null;
  yearId: string | null;
  semesterId: string | null;
  visibility: boolean;
  profilePic: string | null;
  createdAt: string;
  updatedAt: string;
  yearNumber?: number;
  semesterNumber?: number;
}

export default function ProfileDetailsPage() {
  const { user, isLoaded } = useUser();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfileData() {
      if (!user) return;
      
      try {
        const response = await fetch(`/api/users/profile`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Could not load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded && user) {
      fetchProfileData();
    }
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 border-4 border-t-[#7BB4B1] border-r-[#EDDCD9] border-b-[#E99F4C] border-l-[#DE5499] rounded-full animate-spin"></div>
          <p className="text-[#264143] font-medium">Loading profile details...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 py-10 md:py-16 px-4 md:px-6 relative">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:18px_18px] md:bg-[length:24px_24px] pointer-events-none"></div>
      
      <div className="container mx-auto max-w-3xl relative z-10">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/profile" className="mb-8 inline-flex items-center text-[#264143] hover:text-[#7BB4B1] transition-all font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to Profile</span>
          </Link>
        </motion.div>
        
        {/* Profile header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.35em_0.35em_0_#E99F4C] overflow-hidden mb-8"
        >
          <div className="bg-[#264143] px-6 md:px-8 py-5 md:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Profile Details</h1>
            <Link href="/profile/details/edit">
              <Button 
                className="bg-[#E99F4C] border-[0.2em] border-white shadow-[0.2em_0.2em_0_rgba(255,255,255,0.3)] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_rgba(255,255,255,0.3)] hover:bg-[#d88f3d] transition-all text-sm sm:text-base whitespace-nowrap"
              >
                <Pencil className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Edit Profile
              </Button>
            </Link>
          </div>

          {/* User basic info */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#7BB4B1]/20 border-[0.2em] border-[#264143] overflow-hidden flex-shrink-0 shadow-[0.2em_0.2em_0_#E99F4C]">
                {user?.imageUrl ? (
                  <Image 
                    src={user.imageUrl} 
                    alt={user.fullName || 'User'} 
                    width={96} 
                    height={96}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-[#DE5499]/20 flex items-center justify-center text-[#264143] text-2xl font-bold">
                    {(user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-[#264143]">
                  {user?.fullName}
                </h2>
                <p className="text-[#264143]/70">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
                <div className="flex items-center mt-3 text-sm">
                  <div className={`flex items-center px-2.5 py-1 rounded-full ${profileData?.visibility ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                    {profileData?.visibility ? (
                      <>
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        <span className="font-medium">Public Profile</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 mr-1.5" />
                        <span className="font-medium">Private Profile</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Profile details */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Bio */}
              <div className="bg-[#F9F5F2] p-5 rounded-[0.4em] border-l-[0.3em] border-[#7BB4B1] transition-all hover:shadow-md">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-[#7BB4B1]/20 rounded-full flex items-center justify-center mr-3">
                    <User className="w-4.5 h-4.5 text-[#7BB4B1]" />
                  </div>
                  <h3 className="font-semibold text-[#264143]">Bio</h3>
                </div>
                <p className="text-[#264143]/80 pl-11">
                  {profileData?.bio || (
                    <span className="italic text-[#264143]/50">No bio added yet.</span>
                  )}
                </p>
              </div>
              
              {/* Academic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Student ID */}
                <div className="bg-[#F9F5F2] p-5 rounded-[0.4em] border-l-[0.3em] border-[#DE5499] transition-all hover:shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-[#DE5499]/20 rounded-full flex items-center justify-center mr-3">
                      <Shield className="w-4.5 h-4.5 text-[#DE5499]" />
                    </div>
                    <h3 className="font-semibold text-[#264143]">Student ID</h3>
                  </div>
                  <p className="text-[#264143]/80 pl-11">
                    {profileData?.studentId || (
                      <span className="italic text-[#264143]/50">Not specified</span>
                    )}
                  </p>
                </div>
                
                {/* Department */}
                <div className="bg-[#F9F5F2] p-5 rounded-[0.4em] border-l-[0.3em] border-[#E99F4C] transition-all hover:shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-[#E99F4C]/20 rounded-full flex items-center justify-center mr-3">
                      <Building2 className="w-4.5 h-4.5 text-[#E99F4C]" />
                    </div>
                    <h3 className="font-semibold text-[#264143]">Department</h3>
                  </div>
                  <p className="text-[#264143]/80 pl-11">
                    {profileData?.department || (
                      <span className="italic text-[#264143]/50">Not specified</span>
                    )}
                  </p>
                </div>
                
                {/* Year */}
                <div className="bg-[#F9F5F2] p-5 rounded-[0.4em] border-l-[0.3em] border-[#7BB4B1] transition-all hover:shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-[#7BB4B1]/20 rounded-full flex items-center justify-center mr-3">
                      <School className="w-4.5 h-4.5 text-[#7BB4B1]" />
                    </div>
                    <h3 className="font-semibold text-[#264143]">Year</h3>
                  </div>
                  <p className="text-[#264143]/80 pl-11">
                    {profileData?.yearNumber ? (
                      `Year ${profileData.yearNumber}`
                    ) : (
                      <span className="italic text-[#264143]/50">Not specified</span>
                    )}
                  </p>
                </div>
                
                {/* Semester */}
                <div className="bg-[#F9F5F2] p-5 rounded-[0.4em] border-l-[0.3em] border-[#DE5499] transition-all hover:shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-[#DE5499]/20 rounded-full flex items-center justify-center mr-3">
                      <Calendar className="w-4.5 h-4.5 text-[#DE5499]" />
                    </div>
                    <h3 className="font-semibold text-[#264143]">Semester</h3>
                  </div>
                  <p className="text-[#264143]/80 pl-11">
                    {profileData?.semesterNumber ? (
                      `Semester ${profileData.semesterNumber}`
                    ) : (
                      <span className="italic text-[#264143]/50">Not specified</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Profile created info */}
              <div className="mt-10 text-sm text-center text-[#264143]/60 pt-2 border-t border-[#264143]/10">
                Profile created: {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'Unknown'}
                {profileData?.updatedAt && profileData?.createdAt !== profileData?.updatedAt && (
                  <> • Last updated: {new Date(profileData.updatedAt).toLocaleDateString()}</>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Mobile edit button for easier access */}
        <div className="fixed bottom-6 right-6 md:hidden z-20">
          <Link href="/profile/details/edit">
            <Button 
              className="rounded-full w-14 h-14 bg-[#7BB4B1] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#E99F4C] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#E99F4C] transition-all flex items-center justify-center"
              aria-label="Edit profile"
            >
              <Pencil className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}