'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, 
  Save, 
  School, 
  Calendar, 
  Building2, 
  Shield, 
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  X,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Year {
  id: string;
  number: number;
}

interface Semester {
  id: string;
  number: number;
  yearId: string;
}

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

// Define constants for placeholder values
const NOT_SPECIFIED_VALUE = 'not-specified';

export default function ProfileEditPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [years, setYears] = useState<Year[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [filteredSemesters, setFilteredSemesters] = useState<Semester[]>([]);
  
  const [bio, setBio] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [selectedYearId, setSelectedYearId] = useState<string>(NOT_SPECIFIED_VALUE);
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>(NOT_SPECIFIED_VALUE);
  const [visibility, setVisibility] = useState<boolean>(true);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle year selection with placeholder value
  const handleYearChange = (value: string) => {
    setSelectedYearId(value);
    // Reset semester when changing year
    setSelectedSemesterId(NOT_SPECIFIED_VALUE);
  };

  // Handle semester selection with placeholder value
  const handleSemesterChange = (value: string) => {
    setSelectedSemesterId(value);
  };

  // Fetch profile data
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

        // Initialize form with existing data
        setBio(data.bio || '');
        setStudentId(data.studentId || '');
        setDepartment(data.department || '');
        setSelectedYearId(data.yearId || NOT_SPECIFIED_VALUE);
        setSelectedSemesterId(data.semesterId || NOT_SPECIFIED_VALUE);
        setVisibility(data.visibility);
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

  // Fetch years and semesters
  useEffect(() => {
    async function fetchYearsAndSemesters() {
      try {
        // Fetch years
        const yearsResponse = await fetch('/api/users/years');
        if (!yearsResponse.ok) {
          throw new Error('Failed to fetch years data');
        }
        const yearsData = await yearsResponse.json();
        setYears(yearsData);

        // Fetch all semesters
        const semestersResponse = await fetch('/api/users/semesters');
        if (!semestersResponse.ok) {
          throw new Error('Failed to fetch semesters data');
        }
        const semestersData = await semestersResponse.json();
        setSemesters(semestersData);
      } catch (err) {
        console.error('Error fetching educational data:', err);
        toast.error('Could not load educational data');
      }
    }

    fetchYearsAndSemesters();
  }, []);

  // Filter semesters based on selected year
  useEffect(() => {
    if (selectedYearId && selectedYearId !== NOT_SPECIFIED_VALUE) {
      setFilteredSemesters(semesters.filter(semester => semester.yearId === selectedYearId));
    } else {
      setFilteredSemesters([]);
    }
  }, [selectedYearId, semesters]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setSubmitting(true);
    
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bio,
          studentId: studentId || null,
          department: department || null,
          yearId: selectedYearId !== NOT_SPECIFIED_VALUE ? selectedYearId : null,
          semesterId: selectedSemesterId !== NOT_SPECIFIED_VALUE ? selectedSemesterId : null,
          visibility
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast.success('Profile updated successfully');
      router.push('/profile/details');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 border-4 border-t-[#7BB4B1] border-r-[#EDDCD9] border-b-[#E99F4C] border-l-[#DE5499] rounded-full animate-spin"></div>
          <p className="text-[#264143] font-medium">Loading profile data...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <p className="text-red-500 font-medium">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="bg-white border-[0.15em] border-[#264143] text-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#DE5499] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#DE5499]"
        >
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
          <Link href="/profile/details" className="mb-6 md:mb-8 inline-flex items-center text-[#264143] hover:text-[#7BB4B1] transition-all font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to Profile Details</span>
          </Link>
        </motion.div>
        
        {/* Profile Edit Form */}
        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.35em_0.35em_0_#E99F4C] overflow-hidden mb-8">
            <div className="bg-[#264143] px-6 md:px-8 py-5 md:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-white">Edit Profile</h1>
              <div className="flex items-center gap-3 sm:ml-auto">
                <Link href="/profile/details">
                  <Button 
                    type="button"
                    variant="outline"
                    className="bg-transparent border-[0.2em] border-white text-white hover:bg-white/10 hover:text-white text-sm sm:text-base px-2 sm:px-4 h-9 sm:h-10"
                  >
                    <X className="mr-1.5 h-4 w-4 sm:h-5 sm:w-5" />
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit"
                  disabled={submitting}
                  className="bg-[#E99F4C] border-[0.15em] sm:border-[0.2em] border-white shadow-[0.15em_0.15em_0_rgba(255,255,255,0.3)] hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_rgba(255,255,255,0.3)] hover:bg-[#d88f3d] transition-all text-sm sm:text-base px-3 sm:px-4 h-9 sm:h-10"
                >
                  {submitting ? (
                    <Loader2 className="mr-1.5 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  ) : (
                    <Save className="mr-1.5 h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                  {submitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6 md:space-y-8">
              {/* User basic info display */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-[#264143]/10">
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
                  <p className="mt-2 text-sm text-[#264143]/60 flex items-center">
                    <HelpCircle className="w-3.5 h-3.5 mr-1.5 inline-block text-[#E99F4C]" />
                    Profile photo is managed through account settings
                  </p>
                </div>
              </div>
              
              {/* Profile Visibility */}
              <motion.div 
                whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between bg-[#F9F5F2] p-5 rounded-[0.4em] border-[0.15em] border-[#264143]/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-[0.15em] border-[#264143]/25">
                    {visibility ? (
                      <Eye className="w-4.5 h-4.5 text-green-600" />
                    ) : (
                      <EyeOff className="w-4.5 h-4.5 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#264143]">Profile Visibility</h3>
                    <p className="text-sm text-[#264143]/70">
                      {visibility ? 'Your profile is visible to others' : 'Your profile is private'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#264143]/60">
                    {visibility ? 'Public' : 'Private'}
                  </span>
                  <Switch
                    id="visibility"
                    checked={visibility}
                    onCheckedChange={setVisibility}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
              </motion.div>
              
              <TooltipProvider>
                {/* Bio */}
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#7BB4B1]/15 rounded-full flex items-center justify-center border-[0.15em] border-[#7BB4B1]/25">
                      <User className="w-4.5 h-4.5 text-[#7BB4B1]" />
                    </div>
                    <Label htmlFor="bio" className="text-[#264143] font-semibold">
                      Bio
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-[#264143]/40 hover:text-[#7BB4B1]" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-white border-[0.15em] border-[#264143] text-[#264143] shadow-[0.2em_0.2em_0_#7BB4B1]">
                        Tell others about yourself
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Textarea 
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="h-32 resize-none border-[0.15em] border-[#264143]/30 rounded-[0.4em] focus:border-[#7BB4B1] focus:ring-[#7BB4B1]/30 text-[#264143]"
                  />
                </motion.div>

                {/* Student ID */}
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#DE5499]/15 rounded-full flex items-center justify-center border-[0.15em] border-[#DE5499]/25">
                      <Shield className="w-4.5 h-4.5 text-[#DE5499]" />
                    </div>
                    <Label htmlFor="studentId" className="text-[#264143] font-semibold">
                      Student ID
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-[#264143]/40 hover:text-[#DE5499]" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-white border-[0.15em] border-[#264143] text-[#264143] shadow-[0.2em_0.2em_0_#DE5499]">
                        Your student identification number
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input 
                    id="studentId"
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter your student ID"
                    className="border-[0.15em] border-[#264143]/30 rounded-[0.4em] focus:border-[#DE5499] focus:ring-[#DE5499]/30 text-[#264143]"
                  />
                </motion.div>
                
                {/* Department */}
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#E99F4C]/15 rounded-full flex items-center justify-center border-[0.15em] border-[#E99F4C]/25">
                      <Building2 className="w-4.5 h-4.5 text-[#E99F4C]" />
                    </div>
                    <Label htmlFor="department" className="text-[#264143] font-semibold">
                      Department
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-[#264143]/40 hover:text-[#E99F4C]" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-white border-[0.15em] border-[#264143] text-[#264143] shadow-[0.2em_0.2em_0_#E99F4C]">
                        Your academic department or major
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input 
                    id="department"
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Enter your department"
                    className="border-[0.15em] border-[#264143]/30 rounded-[0.4em] focus:border-[#E99F4C] focus:ring-[#E99F4C]/30 text-[#264143]"
                  />
                </motion.div>
              </TooltipProvider>
              
              {/* Year and Semester */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {/* Year */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#7BB4B1]/15 rounded-full flex items-center justify-center border-[0.15em] border-[#7BB4B1]/25">
                      <School className="w-4.5 h-4.5 text-[#7BB4B1]" />
                    </div>
                    <Label htmlFor="year" className="text-[#264143] font-semibold">
                      Academic Year
                    </Label>
                  </div>
                  <Select value={selectedYearId} onValueChange={handleYearChange}>
                    <SelectTrigger 
                      id="year" 
                      className="border-[0.15em] border-[#264143]/30 rounded-[0.4em] focus:border-[#7BB4B1] focus:ring-[#7BB4B1]/30 bg-white text-[#264143]"
                    >
                      <SelectValue placeholder="Select your year" />
                    </SelectTrigger>
                    <SelectContent className="border-[0.15em] border-[#264143]/30 rounded-[0.4em] bg-white">
                      <SelectItem value={NOT_SPECIFIED_VALUE} className="text-[#264143]/70">
                        Not specified
                      </SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year.id} value={year.id} className="text-[#264143]">
                          Year {year.number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Semester */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#DE5499]/15 rounded-full flex items-center justify-center border-[0.15em] border-[#DE5499]/25">
                      <Calendar className="w-4.5 h-4.5 text-[#DE5499]" />
                    </div>
                    <Label htmlFor="semester" className="text-[#264143] font-semibold">
                      Semester
                    </Label>
                  </div>
                  <Select 
                    value={selectedSemesterId} 
                    onValueChange={handleSemesterChange}
                    disabled={selectedYearId === NOT_SPECIFIED_VALUE || filteredSemesters.length === 0}
                  >
                    <SelectTrigger 
                      id="semester" 
                      className="border-[0.15em] border-[#264143]/30 rounded-[0.4em] focus:border-[#DE5499] focus:ring-[#DE5499]/30 bg-white text-[#264143] disabled:opacity-60"
                    >
                      <SelectValue placeholder={selectedYearId !== NOT_SPECIFIED_VALUE ? "Select your semester" : "Select a year first"} />
                    </SelectTrigger>
                    <SelectContent className="border-[0.15em] border-[#264143]/30 rounded-[0.4em] bg-white">
                      <SelectItem value={NOT_SPECIFIED_VALUE} className="text-[#264143]/70">
                        Not specified
                      </SelectItem>
                      {filteredSemesters.map((semester) => (
                        <SelectItem key={semester.id} value={semester.id} className="text-[#264143]">
                          Semester {semester.number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
              
              {/* Submit button for mobile */}
              <div className="md:hidden pt-4">
                <motion.div
                  whileHover={{ y: -3 }}
                  whileTap={{ y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Button 
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#7BB4B1] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#E99F4C] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#E99F4C] hover:bg-[#6ba3a0] transition-all font-bold"
                  >
                    {submitting ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-5 w-5" />
                    )}
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </motion.div>
              </div>
              
              <div className="text-sm text-center text-[#264143]/60 pt-4 border-t border-[#264143]/10 mt-4">
                <p>All fields are optional. You can update your profile at any time.</p>
              </div>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
}