'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Pencil, 
  School, 
  BookOpen, 
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
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#7BB4B1]" />
          <p className="text-[#264143] font-medium">Loading profile details...</p>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 pt-10 md:pt-16 pb-16 md:pb-24 px-4 md:px-6 relative">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:18px_18px] md:bg-[length:24px_24px] pointer-events-none"></div>
      
      <div className="container mx-auto max-w-3xl relative z-10">
        {/* Back button */}
        <Link href="/profile" className="mb-8 inline-flex items-center text-[#264143] hover:text-[#7BB4B1] transition-all">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Back to Profile</span>
        </Link>
        
        {/* Profile header */}
        <div className="bg-white border-[0.35em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] overflow-hidden mb-8">
          <div className="bg-[#264143] px-8 py-6 flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Profile Details</h1>
            <Link href="/profile/details/edit">
              <Button 
                className="bg-[#E99F4C] border-[0.2em] border-white shadow-[0.2em_0.2em_0_rgba(255,255,255,0.3)] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_rgba(255,255,255,0.3)] hover:bg-[#d88f3d] transition-all"
              >
                <Pencil className="mr-2 h-5 w-5" />
                Edit Profile
              </Button>
            </Link>
          </div>

          {/* User basic info */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-[#7BB4B1]/20 border-[0.2em] border-[#264143] overflow-hidden flex-shrink-0">
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
                <h2 className="text-2xl font-bold text-[#264143]">
                  {user?.fullName}
                </h2>
                <p className="text-[#264143]/70">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
                <div className="flex items-center mt-2 text-sm">
                  <div className={`flex items-center ${profileData?.visibility ? 'text-green-600' : 'text-amber-600'}`}>
                    {profileData?.visibility ? (
                      <>
                        <Eye className="w-4 h-4 mr-1" />
                        <span>Public Profile</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 mr-1" />
                        <span>Private Profile</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Profile details */}
            <div className="space-y-6">
              {/* Bio */}
              <div className="bg-[#F9F5F2] p-5 rounded-[0.4em] border-l-[0.3em] border-[#7BB4B1]">
                <div className="flex items-center mb-2">
                  <User className="w-5 h-5 text-[#264143] mr-2" />
                  <h3 className="font-semibold text-[#264143]">Bio</h3>
                </div>
                <p className="text-[#264143]/80">
                  {profileData?.bio || (
                    <span className="italic text-[#264143]/50">No bio added yet.</span>
                  )}
                </p>
              </div>
              
              {/* Academic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Student ID */}
                <div className="bg-[#F9F5F2] p-5 rounded-[0.4em] border-l-[0.3em] border-[#DE5499]">
                  <div className="flex items-center mb-2">
                    <Shield className="w-5 h-5 text-[#264143] mr-2" />
                    <h3 className="font-semibold text-[#264143]">Student ID</h3>
                  </div>
                  <p className="text-[#264143]/80">
                    {profileData?.studentId || (
                      <span className="italic text-[#264143]/50">Not specified</span>
                    )}
                  </p>
                </div>
                
                {/* Department */}
                <div className="bg-[#F9F5F2] p-5 rounded-[0.4em] border-l-[0.3em] border-[#E99F4C]">
                  <div className="flex items-center mb-2">
                    <Building2 className="w-5 h-5 text-[#264143] mr-2" />
                    <h3 className="font-semibold text-[#264143]">Department</h3>
                  </div>
                  <p className="text-[#264143]/80">
                    {profileData?.department || (
                      <span className="italic text-[#264143]/50">Not specified</span>
                    )}
                  </p>
                </div>
                
                {/* Year */}
                <div className="bg-[#F9F5F2] p-5 rounded-[0.4em] border-l-[0.3em] border-[#7BB4B1]">
                  <div className="flex items-center mb-2">
                    <School className="w-5 h-5 text-[#264143] mr-2" />
                    <h3 className="font-semibold text-[#264143]">Year</h3>
                  </div>
                  <p className="text-[#264143]/80">
                    {profileData?.yearNumber ? (
                      `Year ${profileData.yearNumber}`
                    ) : (
                      <span className="italic text-[#264143]/50">Not specified</span>
                    )}
                  </p>
                </div>
                
                {/* Semester */}
                <div className="bg-[#F9F5F2] p-5 rounded-[0.4em] border-l-[0.3em] border-[#DE5499]">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 text-[#264143] mr-2" />
                    <h3 className="font-semibold text-[#264143]">Semester</h3>
                  </div>
                  <p className="text-[#264143]/80">
                    {profileData?.semesterNumber ? (
                      `Semester ${profileData.semesterNumber}`
                    ) : (
                      <span className="italic text-[#264143]/50">Not specified</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Profile created info */}
              <div className="mt-10 text-sm text-center text-[#264143]/60">
                Profile created: {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'Unknown'}
                {profileData?.updatedAt && profileData?.createdAt !== profileData?.updatedAt && (
                  <> • Last updated: {new Date(profileData.updatedAt).toLocaleDateString()}</>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}