'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Image from 'next/image';

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
  const [selectedYearId, setSelectedYearId] = useState<string>('');
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>('');
  const [visibility, setVisibility] = useState<boolean>(true);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setSelectedYearId(data.yearId || '');
        setSelectedSemesterId(data.semesterId || '');
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
    if (selectedYearId) {
      setFilteredSemesters(semesters.filter(semester => semester.yearId === selectedYearId));
      
      // Clear selected semester if changing year
      if (selectedSemesterId && semesters.some(s => s.id === selectedSemesterId && s.yearId !== selectedYearId)) {
        setSelectedSemesterId('');
      }
    } else {
      setFilteredSemesters([]);
      setSelectedSemesterId('');
    }
  }, [selectedYearId, semesters, selectedSemesterId]);

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
          yearId: selectedYearId || null,
          semesterId: selectedSemesterId || null,
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#7BB4B1]" />
          <p className="text-[#264143] font-medium">Loading profile data...</p>
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
        <Link href="/profile/details" className="mb-8 inline-flex items-center text-[#264143] hover:text-[#7BB4B1] transition-all">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Back to Profile Details</span>
        </Link>
        
        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white border-[0.35em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] overflow-hidden mb-8">
            <div className="bg-[#264143] px-8 py-6 flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold text-white">Edit Profile</h1>
              <div className="flex items-center gap-3">
                <Link href="/profile/details">
                  <Button 
                    type="button"
                    variant="outline"
                    className="bg-transparent border-[0.2em] border-white text-white hover:bg-white/10 hover:text-white"
                  >
                    <X className="mr-2 h-5 w-5" />
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit"
                  disabled={submitting}
                  className="bg-[#E99F4C] border-[0.2em] border-white shadow-[0.2em_0.2em_0_rgba(255,255,255,0.3)] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_rgba(255,255,255,0.3)] hover:bg-[#d88f3d] transition-all"
                >
                  {submitting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-5 w-5" />
                  )}
                  {submitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* User basic info display */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 pb-6 border-b border-[#264143]/10">
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
                  <p className="mt-2 text-sm text-[#264143]/60">
                    Profile photo is managed through your account settings
                  </p>
                </div>
              </div>
              
              {/* Profile Visibility */}
              <div className="flex items-center justify-between bg-[#F9F5F2] p-5 rounded-[0.4em]">
                <div className="flex items-center gap-3">
                  {visibility ? (
                    <Eye className="w-5 h-5 text-green-600" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-amber-600" />
                  )}
                  <div>
                    <h3 className="font-semibold text-[#264143]">Profile Visibility</h3>
                    <p className="text-sm text-[#264143]/70">
                      {visibility ? 'Your profile is visible to others' : 'Your profile is private'}
                    </p>
                  </div>
                </div>
                <Switch
                  id="visibility"
                  checked={visibility}
                  onCheckedChange={setVisibility}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>
              
              {/* Bio */}
              <div className="space-y-3">
                <Label htmlFor="bio" className="text-[#264143] font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Bio
                </Label>
                <Textarea 
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="h-32 resize-none border-[0.15em] border-[#264143]/30 rounded-[0.4em] focus:border-[#7BB4B1] focus:ring-[#7BB4B1]/30"
                />
              </div>

              {/* Student ID */}
              <div className="space-y-3">
                <Label htmlFor="studentId" className="text-[#264143] font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Student ID
                </Label>
                <Input 
                  id="studentId"
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Enter your student ID"
                  className="border-[0.15em] border-[#264143]/30 rounded-[0.4em] focus:border-[#7BB4B1] focus:ring-[#7BB4B1]/30"
                />
              </div>
              
              {/* Department */}
              <div className="space-y-3">
                <Label htmlFor="department" className="text-[#264143] font-semibold flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Department
                </Label>
                <Input 
                  id="department"
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Enter your department"
                  className="border-[0.15em] border-[#264143]/30 rounded-[0.4em] focus:border-[#7BB4B1] focus:ring-[#7BB4B1]/30"
                />
              </div>
              
              {/* Year and Semester */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Year */}
                <div className="space-y-3">
                  <Label htmlFor="year" className="text-[#264143] font-semibold flex items-center gap-2">
                    <School className="w-5 h-5" />
                    Academic Year
                  </Label>
                  <Select value={selectedYearId} onValueChange={setSelectedYearId}>
                    <SelectTrigger id="year" className="border-[0.15em] border-[#264143]/30 rounded-[0.4em] focus:border-[#7BB4B1] focus:ring-[#7BB4B1]/30">
                      <SelectValue placeholder="Select your year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Not specified</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year.id} value={year.id}>
                          Year {year.number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Semester */}
                <div className="space-y-3">
                  <Label htmlFor="semester" className="text-[#264143] font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Semester
                  </Label>
                  <Select 
                    value={selectedSemesterId} 
                    onValueChange={setSelectedSemesterId}
                    disabled={!selectedYearId || filteredSemesters.length === 0}
                  >
                    <SelectTrigger id="semester" className="border-[0.15em] border-[#264143]/30 rounded-[0.4em] focus:border-[#7BB4B1] focus:ring-[#7BB4B1]/30">
                      <SelectValue placeholder={selectedYearId ? "Select your semester" : "Select a year first"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Not specified</SelectItem>
                      {filteredSemesters.map((semester) => (
                        <SelectItem key={semester.id} value={semester.id}>
                          Semester {semester.number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Submit button for mobile */}
              <div className="md:hidden pt-4">
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
              </div>
              
              <div className="text-sm text-center text-[#264143]/60 pt-4">
                <p>All fields are optional. You can update your profile at any time.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
