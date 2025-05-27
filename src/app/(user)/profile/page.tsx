'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { User, FileText, BookOpen, Award, Settings, LogOut, ChevronRight, Heart, MessageCircle, ThumbsUp, CheckCircle, Clock, XCircle, Download, Book } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isPublic: boolean;
  isRejected: boolean;
  subject: {
    name: string;
    semester: {
      number: number;
      year: {
        number: number;
      };
    };
  };
  _count: {
    likes: number;
    comments: number;
  };
}

interface Activity {
  type: 'like' | 'comment';
  id: string;
  createdAt: string;
  content: string;
  note: {
    id: string;
    title: string;
  };
}

const UserProfilePage = () => {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalLikes: 0,
    totalComments: 0,
    publishedNotes: 0,
    pendingNotes: 0,
    rejectedNotes: 0,
    totalDownloads: 0
  });
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        try {
          // Fetch user stats
          const statsResponse = await fetch(`/api/users/${user.id}/stats`);
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            setStats(statsData);
          }

          // Fetch recent notes
          const notesResponse = await fetch(`/api/users/${user.id}/notes?limit=3`);
          if (notesResponse.ok) {
            const notesData = await notesResponse.json();
            setRecentNotes(notesData.notes);
          }

          // Fetch recent activity
          const activityResponse = await fetch(`/api/users/${user.id}/activity?limit=3`);
          if (activityResponse.ok) {
            const activityData = await activityResponse.json();
            setRecentActivity(activityData.activities);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (isLoaded && user) {
      fetchUserData();
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto border-[0.25em] border-t-[#7BB4B1] border-r-[#EDDCD9] border-b-[#E99F4C] border-l-[#DE5499] rounded-full animate-spin"></div>
          <p className="mt-6 text-lg font-bold text-[#264143]">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#DE5499] p-8 text-center relative overflow-hidden"
          >
            {/* Corner slice */}
            <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
            
            {/* Pattern background */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:0.8em_0.8em] pointer-events-none"></div>
            
            <div className="relative z-[1]">
              <div className="w-16 h-16 mx-auto bg-[#DE5499]/20 border-[0.15em] border-[#DE5499] rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-[#DE5499]" />
              </div>
              <h1 className="text-2xl font-bold text-[#264143] mb-4">Sign In Required</h1>
              <p className="mb-6 text-[#264143]/70">Please sign in to view your profile</p>
              <Link
                href="/sign-in"
                className="inline-flex items-center px-5 py-2.5 bg-white border-[0.2em] border-[#264143] text-[#264143] font-bold rounded-[0.4em] shadow-[0.2em_0.2em_0_#7BB4B1] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#7BB4B1] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#7BB4B1] transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 py-8">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:18px_18px] md:bg-[length:24px_24px] pointer-events-none"></div>
      
      {/* Decorative blobs */}
      <div className="absolute top-[10%] right-[5%] w-[15vw] max-w-[8rem] aspect-square bg-[#DE5499]/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[8%] w-[18vw] max-w-[10rem] aspect-square bg-[#7BB4B1]/10 rounded-full blur-xl pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="col-span-1 md:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#7BB4B1] p-6 text-center relative overflow-hidden"
            >
              {/* Corner slice */}
              <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
              
              {/* Pattern background */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:0.8em_0.8em] pointer-events-none"></div>
              
              <div className="relative z-[1]">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  className="w-24 h-24 rounded-full bg-[#7BB4B1]/20 border-[0.2em] border-[#264143] flex items-center justify-center mx-auto mb-5 shadow-[0.2em_0.2em_0_#E99F4C]"
                >
                  <User className="w-12 h-12 text-[#264143]" />
                </motion.div>
                <h1 className="text-2xl font-bold text-[#264143] mb-1">
                  {user.fullName || `${user.firstName} ${user.lastName}`}
                </h1>
                <p className="text-[#264143]/70 mb-6">{user.primaryEmailAddress?.emailAddress}</p>
                
                <div className="flex flex-col gap-3">
                  <Link
                    href="/upload"
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-[#7BB4B1] text-white font-bold rounded-[0.4em] border-[0.15em] border-[#264143] hover:translate-y-[-0.1em] hover:shadow-[0.2em_0.2em_0_#264143] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#264143] transition-all duration-200"
                  >
                    <motion.div 
                      whileHover={{ rotate: 15 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <FileText className="w-5 h-5 mr-2" />
                    </motion.div>
                    Upload New Note
                  </Link>
                  <Link
                    href="/my-uploads">
                    <button
                      className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-white text-[#264143] font-bold rounded-[0.4em] border-[0.15em] border-[#264143] hover:bg-[#EDDCD9]/40 hover:translate-y-[-0.1em] hover:shadow-[0.2em_0.2em_0_#DE5499] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#DE5499] transition-all duration-200"
                    >
                      <motion.div 
                        whileHover={{ rotate: 45 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Book className="w-5 h-5 mr-2" />
                      </motion.div>
                      My  uploads
                    </button>
                  </Link>
                  <div className="border-t-[0.15em] border-[#264143]/10 my-4 pt-4">
                    <SignOutButton>
                      <button className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-white text-[#264143] font-bold rounded-[0.4em] border-[0.15em] border-[#264143] hover:bg-[#DE5499]/10 hover:translate-y-[-0.1em] hover:shadow-[0.2em_0.2em_0_#E99F4C] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#E99F4C] transition-all duration-200">
                        <LogOut className="w-5 h-5 mr-2" />
                        Sign Out
                      </button>
                    </SignOutButton>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Stats Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#E99F4C] p-6 mt-6 relative overflow-hidden"
            >
              {/* Corner slice */}
              <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
              
              {/* Pattern background */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:0.8em_0.8em] pointer-events-none"></div>
              
              <div className="relative z-[1]">
                <h2 className="text-xl font-bold text-[#264143] mb-5 flex items-center">
                  <div className="w-8 h-8 bg-[#E99F4C]/20 border-[0.15em] border-[#264143] rounded-[0.3em] flex items-center justify-center mr-2 shadow-[0.1em_0.1em_0_#DE5499]">
                    <ChartIcon className="w-4 h-4 text-[#264143]" />
                  </div>
                  Your Stats
                </h2>
                  <div className="grid grid-cols-3 gap-3">
                  <StatsCard 
                    value={stats.totalNotes} 
                    label="Notes" 
                    icon={<FileText className="w-4 h-4 text-[#7BB4B1]" />}
                    color="#7BB4B1"
                  />
                  <StatsCard 
                    value={stats.totalLikes} 
                    label="Likes" 
                    icon={<Heart className="w-4 h-4 text-[#DE5499]" />}
                    color="#DE5499"
                  />
                  <StatsCard 
                    value={stats.totalComments} 
                    label="Comments" 
                    icon={<MessageCircle className="w-4 h-4 text-[#E99F4C]" />}
                    color="#E99F4C"
                  />
                </div>
                
                {/* Additional Stats Row */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <StatsCard 
                    value={stats.publishedNotes} 
                    label="Published" 
                    icon={<CheckCircle className="w-4 h-4 text-[#7BB4B1]" />}
                    color="#7BB4B1"
                  />
                  <StatsCard 
                    value={stats.pendingNotes} 
                    label="Pending" 
                    icon={<Clock className="w-4 h-4 text-[#E99F4C]" />}
                    color="#E99F4C"
                  />
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Main Content */}
          <div className="col-span-1 md:col-span-3 space-y-6">
            {/* Recent Activity Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#7BB4B1] p-6 relative overflow-hidden"
            >
              {/* Corner slice */}
              <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
              
              {/* Decorative corner */}
              <div className="absolute top-[-1em] right-[-1em] w-12 h-12 bg-[#EDDCD9] transform rotate-45 translate-x-6 -translate-y-6"></div>
              
              {/* Pattern background */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:0.8em_0.8em] pointer-events-none"></div>
              
              <div className="relative z-[1]">
                <h2 className="text-xl font-bold text-[#264143] mb-5 flex items-center">
                  <div className="w-8 h-8 bg-[#7BB4B1]/20 border-[0.15em] border-[#264143] rounded-[0.3em] flex items-center justify-center mr-2 shadow-[0.1em_0.1em_0_#DE5499]">
                    <BookOpen className="w-4 h-4 text-[#264143]" />
                  </div>
                  Recent Notes
                </h2>
                  <div className="space-y-4 mb-4">
                  {loading ? (
                    // Loading skeleton
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="p-4 bg-[#F9F5F2] border-[0.15em] border-[#264143]/20 rounded-[0.4em]">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="h-4 bg-[#264143]/20 rounded mb-2 w-3/4"></div>
                              <div className="h-3 bg-[#264143]/10 rounded w-1/2"></div>
                            </div>
                            <div className="h-6 bg-[#264143]/20 rounded w-16"></div>
                          </div>
                          <div className="flex gap-4">
                            <div className="h-3 bg-[#264143]/10 rounded w-12"></div>
                            <div className="h-3 bg-[#264143]/10 rounded w-12"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : recentNotes.length > 0 ? (
                    recentNotes.map((note) => (
                      <RecentNoteCard 
                        key={note.id}
                        id={note.id}
                        title={note.title}
                        date={note.createdAt}
                        status={note.isRejected ? 'rejected' : note.isPublic ? 'approved' : 'pending'}
                        likes={note._count.likes}
                        comments={note._count.comments}
                        subject={note.subject}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-[#264143]/30 mx-auto mb-3" />
                      <p className="text-[#264143]/70">No notes uploaded yet</p>
                      <Link
                        href="/upload"
                        className="inline-flex items-center mt-3 px-4 py-2 bg-[#7BB4B1] text-white font-medium rounded-[0.3em] border-[0.1em] border-[#264143] shadow-[0.1em_0.1em_0_#264143] hover:translate-y-[-0.05em] hover:shadow-[0.15em_0.15em_0_#264143] transition-all duration-200 text-sm"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Upload First Note
                      </Link>
                    </div>
                  )}
                </div>
                  <div className="text-center">
                  <Link
                    href="/my-uploads"
                    className="inline-flex items-center px-4 py-2 bg-white border-[0.15em] border-[#264143] text-[#264143] font-bold rounded-[0.3em] shadow-[0.15em_0.15em_0_#7BB4B1] hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#7BB4B1] active:translate-y-[0.05em] active:shadow-[0.05em_0.05em_0_#7BB4B1] transition-all duration-200"
                  >
                    View All Notes
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
            
            {/* Achievements Section */}

{/* in future maybe? */}


            {/* <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#DE5499] p-6 relative overflow-hidden"
            >
             
              <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
              
             
              <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:0.8em_0.8em] pointer-events-none"></div>
              
              <div className="relative z-[1]">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-[#264143] flex items-center">
                    <div className="w-8 h-8 bg-[#DE5499]/20 border-[0.15em] border-[#264143] rounded-[0.3em] flex items-center justify-center mr-2 shadow-[0.1em_0.1em_0_#E99F4C]">
                      <Award className="w-4 h-4 text-[#264143]" />
                    </div>
                    Achievements
                  </h2>
                  <span className="text-sm font-bold px-3 py-1 bg-[#EDDCD9]/40 text-[#264143]/60 rounded-full border-[0.1em] border-[#264143]/20">Coming soon</span>
                </div>
                
                <div className="bg-[#EDDCD9]/20 border-[0.15em] border-dashed border-[#264143]/20 rounded-[0.4em] p-6 text-center">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  >
                    <Award className="w-16 h-16 mx-auto text-[#E99F4C]/40 mb-4" />
                  </motion.div>
                  <p className="text-[#264143]/70 max-w-md mx-auto">
                    Achievements and badges will be added soon to reward your contributions! Complete tasks like uploading notes, receiving likes, and helping others to earn special badges.
                  </p>
                  
                  <div className="mt-6 grid grid-cols-5 gap-3">
                    {['Contributor', 'Popular', 'Helper', 'Expert', 'Champion'].map((badge, i) => (
                      <div key={i} className="opacity-40">
                        <div className="w-12 h-12 mx-auto bg-[#F9F5F2] border-[0.1em] border-[#264143]/20 rounded-full flex items-center justify-center">
                          <div className="w-8 h-8 bg-[#EDDCD9] rounded-full"></div>
                        </div>
                        <p className="mt-2 text-xs text-[#264143]/50">{badge}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
             */}




            {/* Notifications and Updates */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#7BB4B1] p-6 relative overflow-hidden"
            >
              {/* Corner slice */}
              <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
              
              {/* Pattern background */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:0.8em_0.8em] pointer-events-none"></div>
              
              <div className="relative z-[1]">
                <h2 className="text-xl font-bold text-[#264143] mb-5 flex items-center">
                  <div className="w-8 h-8 bg-[#7BB4B1]/20 border-[0.15em] border-[#264143] rounded-[0.3em] flex items-center justify-center mr-2 shadow-[0.1em_0.1em_0_#DE5499]">
                    <ThumbsUp className="w-4 h-4 text-[#264143]" />
                  </div>
                  Latest Activity
                </h2>
                  <div className="space-y-4">
                  {loading ? (
                    // Loading skeleton
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center gap-3 p-3 bg-[#F9F5F2] border-[0.1em] border-[#264143]/10 rounded-[0.3em]">
                          <div className="w-8 h-8 bg-[#264143]/20 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-[#264143]/20 rounded mb-1 w-3/4"></div>
                            <div className="h-3 bg-[#264143]/10 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (                      <ActivityItem
                        key={`${activity.type}-${activity.id}`}
                        text={activity.content}
                        time={activity.createdAt}
                        icon={activity.type === 'like' ? 
                          <Heart className="w-4 h-4 text-[#DE5499]" /> : 
                          <MessageCircle className="w-4 h-4 text-[#E99F4C]" />
                        }
                        color={activity.type === 'like' ? "#DE5499" : "#E99F4C"}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <ThumbsUp className="w-12 h-12 text-[#264143]/30 mx-auto mb-3" />
                      <p className="text-[#264143]/70">No recent activity</p>
                      <p className="text-[#264143]/50 text-sm">Activity will appear when others interact with your notes</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Chart icon component for stats
const ChartIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 3v18h18"></path>
    <path d="M18 17V9"></path>
    <path d="M13 17V5"></path>
    <path d="M8 17v-3"></path>
  </svg>
);

// Stats Card component
const StatsCard = ({ value, label, icon, color }: { value: number, label: string, icon: React.ReactNode, color: string }) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.03 }}
    className="p-3 bg-[#EDDCD9]/20 border-[0.1em] border-[#264143]/20 rounded-[0.4em] text-center"
  >
    <div className="w-8 h-8 mx-auto bg-white/80 border-[0.1em] border-[#264143]/40 rounded-full flex items-center justify-center mb-1 shadow-[0.1em_0.1em_0_rgba(0,0,0,0.1)]">
      {icon}
    </div>
    <div className="text-xl font-bold" style={{ color }}>
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {value}
      </motion.span>
    </div>
    <div className="text-xs text-[#264143]/80 font-medium">{label}</div>
  </motion.div>
);

// Recent Note Card component
const RecentNoteCard = ({ 
  id,
  title, 
  date, 
  status, 
  likes, 
  comments,
  subject 
}: { 
  id: string;
  title: string; 
  date: string; 
  status: 'pending' | 'approved' | 'rejected'; 
  likes: number; 
  comments: number;
  subject?: {
    name: string;
    semester: {
      number: number;
      year: {
        number: number;
      };
    };
  };
}) => {
  const statusColors = {
    pending: { bg: 'bg-[#E99F4C]/20', text: 'text-[#264143]', border: 'border-[#E99F4C]' },
    approved: { bg: 'bg-[#7BB4B1]/20', text: 'text-[#264143]', border: 'border-[#7BB4B1]' },
    rejected: { bg: 'bg-[#DE5499]/20', text: 'text-[#264143]', border: 'border-[#DE5499]' }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return `${Math.floor(diffInHours / 168)} weeks ago`;
  };
  
  return (
    <motion.div 
      whileHover={{ x: 5 }}
      className="p-4 bg-white border-[0.15em] border-[#264143]/20 rounded-[0.4em] hover:border-[#264143]/60 transition-all duration-200 shadow-[0.1em_0.1em_0_rgba(0,0,0,0.05)] hover:shadow-[0.2em_0.2em_0_rgba(0,0,0,0.1)]"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <Link href={`/notes/${id}`} className="hover:text-[#7BB4B1] transition-colors">
            <h3 className="font-bold text-[#264143] line-clamp-1">{title}</h3>
          </Link>
          {subject && (
            <p className="text-xs text-[#264143]/60 mt-1">
              {subject.name} • Year {subject.semester.year.number}, Sem {subject.semester.number}
            </p>
          )}
          <p className="text-xs text-[#264143]/60">{formatDate(date)}</p>
        </div>
        <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status].bg} ${statusColors[status].text} border-[0.1em] ${statusColors[status].border}`}>
          {status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
          {status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
          {status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-[#264143]/60">
        <div className="flex items-center">
          <Heart className="w-3.5 h-3.5 mr-1 text-[#DE5499]" />
          {likes}
        </div>
        <div className="flex items-center">
          <MessageCircle className="w-3.5 h-3.5 mr-1 text-[#E99F4C]" />
          {comments}
        </div>
      </div>
    </motion.div>
  );
};

// Activity Item component
const ActivityItem = ({ text, time, icon, color }: { text: string, time: string, icon: React.ReactNode, color: string }) => (
  <motion.div 
    whileHover={{ x: 5 }}
    className="flex items-center gap-3 p-3 bg-white border-[0.1em] border-[#264143]/10 rounded-[0.3em] hover:border-[#264143]/30 transition-all duration-200"
  >
    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20`, borderColor: color }}>
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-[#264143] font-medium text-sm">{text}</p>
      <p className="text-xs text-[#264143]/60">{time}</p>
    </div>
  </motion.div>
);

export default UserProfilePage;