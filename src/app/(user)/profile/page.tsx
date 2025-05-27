'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import RejectedNotes from '@/components/user/RejectedNotes';
import { User, FileText, BookOpen, Award, Settings } from 'lucide-react';
import Link from 'next/link';

const UserProfilePage = () => {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalLikes: 0,
    totalComments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`/api/users/${user.id}/stats`);
          if (response.ok) {
            const data = await response.json();
            setStats(data);
          }
        } catch (error) {
          console.error('Failed to fetch user stats:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (isLoaded && user) {
      fetchUserStats();
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-[#4d61ff] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white p-8 border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_#DE5499] text-center">
          <h1 className="text-2xl font-bold text-[#264143] mb-4">Sign In Required</h1>
          <p className="mb-6 text-[#264143]/80">Please sign in to view your profile</p>
          <Link
            href="/sign-in"
            className="inline-flex items-center px-5 py-2.5 bg-[#4d61ff] text-white font-medium rounded-[0.4em] border-[0.15em] border-[#264143] hover:bg-[#3a4cd1] transition-all duration-200 shadow-[0.2em_0.2em_0_#264143]"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto bg-white py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Sidebar */}
        <div className="col-span-1">
          <div className="bg-white border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_#4d61ff] p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-[#4d61ff]/10 border-[0.15em] border-[#4d61ff] flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-[#4d61ff]" />
            </div>
            <h1 className="text-xl font-bold text-[#264143]">
              {user.fullName || `${user.firstName} ${user.lastName}`}
            </h1>
            <p className="text-[#264143]/80 mb-6">{user.primaryEmailAddress?.emailAddress}</p>
            
            <div className="flex flex-col gap-2">
              <Link
                href="/upload"
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-[#4d61ff] text-white font-medium rounded-[0.4em] border-[0.15em] border-[#264143] hover:bg-[#3a4cd1] transition-all duration-200 shadow-[0.1em_0.1em_0_#264143]"
              >
                <FileText className="w-4 h-4 mr-2" />
                Upload New Note
              </Link>
              
              <button
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-white text-[#264143] font-medium rounded-[0.4em] border-[0.15em] border-[#264143] hover:bg-[#EDDCD9] transition-all duration-200 shadow-[0.1em_0.1em_0_#264143]"
              >
                <Settings className="w-4 h-4 mr-2" />
                Profile Settings
              </button>
              
              <div className="border-t border-gray-200 my-4 pt-4">
                <SignOutButton>
                  <button className="w-full inline-flex items-center justify-center px-4 py-2 bg-[#F8F5F2] text-[#264143] font-medium rounded-[0.4em] border-[0.15em] border-[#264143] hover:bg-[#EDDCD9] transition-all duration-200">
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            </div>
          </div>
          
          {/* Stats Card */}
          <div className="bg-white border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_#E99F4C] p-6 mt-6">
            <h2 className="text-xl font-bold text-[#264143] mb-4">Your Stats</h2>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-[#F8F5F2] rounded-[0.4em]">
                <div className="text-xl font-bold text-[#4d61ff]">{stats.totalNotes}</div>
                <div className="text-xs text-[#264143]/80">Notes</div>
              </div>
              <div className="p-3 bg-[#F8F5F2] rounded-[0.4em]">
                <div className="text-xl font-bold text-[#DE5499]">{stats.totalLikes}</div>
                <div className="text-xs text-[#264143]/80">Likes</div>
              </div>
              <div className="p-3 bg-[#F8F5F2] rounded-[0.4em]">
                <div className="text-xl font-bold text-[#E99F4C]">{stats.totalComments}</div>
                <div className="text-xs text-[#264143]/80">Comments</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="col-span-1 md:col-span-2 space-y-6">
         
          
         
          {/* Achievements Section */}
          <div className="bg-white border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_#DE5499] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#264143]">Achievements</h2>
              <span className="text-sm text-[#264143]/60">Coming soon</span>
            </div>
            
            <div className="bg-[#F8F5F2] p-6 rounded-md text-center">
              <Award className="w-12 h-12 mx-auto text-[#264143]/30 mb-3" />
              <p className="text-[#264143]/70">
                Achievements and badges will be added soon to reward your contributions!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;