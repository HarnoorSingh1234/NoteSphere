'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import NotesListing from '@/components/subjects/NotesListing';
import { Note } from '@/components/subjects/types';
import { Mail, MapPin, Calendar, GraduationCap, FileText, Download, Users, ChevronLeft, ChevronRight, User } from 'lucide-react';

interface AuthorData {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  profile: {
    bio: string | null;
    studentId: string | null;
    department: string | null;
    yearId: string | null;
    semesterId: string | null;
    visibility: boolean;
    profilePic: string | null;
  } | null;
}

interface AuthorPageData {
  author: AuthorData;
  notes: Note[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AuthorPage() {
  const params = useParams();
  const authorId = params.authorid as string;

  const [data, setData] = useState<AuthorPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAuthorData = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/author/${authorId}?page=${page}&limit=12`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch author data');
      }
      
      const result = await response.json();
      setData(result);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthorData();
  }, [authorId]);

  const handlePageChange = (page: number) => {
    fetchAuthorData(page);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] p-6 text-center">
          <p className="text-red-600 mb-4 font-medium">Error: {error}</p>
          <button 
            onClick={() => fetchAuthorData()}
            className="inline-flex text-white items-center justify-center px-6 py-3 font-medium bg-[#DE5499] border-[0.15em] border-[#264143] rounded-[0.4em] shadow-[0.15em_0.15em_0_#264143] hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#264143] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#264143] transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] p-6 text-center">
          <p className="text-[#264143] font-medium">Author not found</p>
        </div>
      </div>
    );
  }

  const { author, notes, pagination } = data;
  const authorName = `${author.firstName} ${author.lastName}`.trim();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Author Profile Section */}
      <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] overflow-hidden relative mb-8">
        {/* Corner slice */}
        <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
        
        {/* Pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:0.8em_0.8em] pointer-events-none"></div>
        
        <div className="p-6 border-b-[0.25em] border-[#264143] bg-white relative z-10">
          <h1 className="text-2xl font-bold text-[#264143]">Author Profile</h1>
          <p className="text-[#264143]/80">View notes and details for this contributor</p>
        </div>
        
        <div className="p-6 relative z-10">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-[#F8F5F2] border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_#E99F4C] flex items-center justify-center">
                {author.profile?.profilePic ? (
                  <img 
                    src={author.profile.profilePic} 
                    alt={authorName}
                    className="w-full h-full object-cover rounded-[0.4em]"
                  />
                ) : (
                  <User className="w-12 h-12 text-[#264143]/60" />
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-[#264143] mb-3">{authorName}</h2>
              
              <div className="flex flex-wrap gap-4 text-sm text-[#264143]/80 mb-4">
                {author.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{author.email}</span>
                  </div>
                )}
                {author.profile?.department && (
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>{author.profile.department}</span>
                  </div>
                )}
                {author.profile?.studentId && (
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>ID: {author.profile.studentId}</span>
                  </div>
                )}
              </div>
              
              {author.profile?.bio && (
                <div className="mb-4 p-4 bg-[#F8F5F2] border-[0.15em] border-[#264143] rounded-[0.4em]">
                  <p className="text-sm text-[#264143]">{author.profile.bio}</p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#DE5499] border-[0.15em] border-[#264143] rounded-full text-sm font-semibold text-white shadow-[0.1em_0.1em_0_#264143]">
                  <FileText className="w-4 h-4" />
                  {pagination.total} Notes Published
                </div>
                {author.profile?.yearId && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#7BB4B1] border-[0.15em] border-[#264143] rounded-full text-sm font-semibold text-white shadow-[0.1em_0.1em_0_#264143]">
                    <Calendar className="w-4 h-4" />
                    Year {author.profile.yearId}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="mb-6">
        {notes.length > 0 ? (
          <>
            <NotesListing 
              notes={notes} 
              subjectName={`${authorName}'s Collection`}
              columnCount={3}
            />
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`inline-flex items-center gap-2 px-4 py-2 font-medium border-[0.15em] border-[#264143] rounded-[0.4em] transition-all duration-200 ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-[#264143] shadow-[0.15em_0.15em_0_#E99F4C] hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#E99F4C] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#E99F4C]'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="px-4 py-2 bg-[#F8F5F2] border-[0.15em] border-[#264143] rounded-[0.4em] text-sm font-medium text-[#264143]">
                  Page {currentPage} of {pagination.totalPages}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className={`inline-flex items-center gap-2 px-4 py-2 font-medium border-[0.15em] border-[#264143] rounded-[0.4em] transition-all duration-200 ${
                    currentPage === pagination.totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-[#264143] shadow-[0.15em_0.15em_0_#E99F4C] hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#E99F4C] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#E99F4C]'
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] overflow-hidden relative">
            {/* Corner slice */}
            <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
            
            {/* Pattern background */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:0.8em_0.8em] pointer-events-none"></div>
            
            <div className="p-8 text-center relative z-10">
              <div className="w-16 h-16 bg-[#F8F5F2] border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_#E99F4C] flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-[#264143]/60" />
              </div>
              <h3 className="text-xl font-bold text-[#264143] mb-2">No notes yet</h3>
              <p className="text-[#264143]/70">This author hasn't uploaded any notes yet. Check back later!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}