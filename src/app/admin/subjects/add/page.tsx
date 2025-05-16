"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Semester {
  id: string;
  number: number;
  year: {
    id: string;
    number: number;
  };
}

export default function AddSubject() {
  const router = useRouter();
  
  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [semesterId, setSemesterId] = useState<string>('');
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchSemesters() {
      try {
        setLoading(true);
        const res = await fetch('/api/semesters');
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch semesters');
        }
        
        setSemesters(data.semesters || []);
        if (data.semesters && data.semesters.length > 0) {
          setSemesterId(data.semesters[0].id);
        }
      } catch (err: unknown) {
        console.error('Error fetching semesters:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch semesters');
      } finally {
        setLoading(false);
      }
    }
    
    fetchSemesters();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!semesterId) {
      setError('Please select a semester');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          code,
          semesterId,
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to create subject');
      }
      
      router.push('/admin/subjects');
    } catch (err: unknown) {
      console.error('Error creating subject:', err);
      setError(err instanceof Error ? err.message : 'Failed to create subject');
      setSubmitting(false);
    }
  };
  
  return (
    <div className="relative min-h-screen bg-[#F8F5F2] py-8">
      {/* Pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:1em_1em] pointer-events-none opacity-30 z-[1]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:2em_2em] bg-[-1em_-1em] pointer-events-none opacity-10 z-[1]"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header with Back Link */}
          <div className="bg-white rounded-[0.6em] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#4CAF50] p-6 mb-8">
            <Link 
              href="/admin/subjects" 
              className="inline-flex items-center text-[#264143] hover:text-[#4CAF50] mb-4 transition-all duration-200 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M19 12H5M12 19l-7-7 7-7"></path>
              </svg>
              <span>Back to Subjects</span>
            </Link>
            <h1 className="text-3xl font-bold text-[#264143]">Add New Subject</h1>
          </div>
          
          {/* Error Alert */}
          {error && (
            <div className="bg-white border-[0.15em] border-red-500 rounded-[0.5em] shadow-[0.2em_0.2em_0_#DE5499] p-4 mb-6">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mr-3">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" x2="12" y1="8" y2="12"></line>
                  <line x1="12" x2="12.01" y1="16" y2="16"></line>
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}
          
          {/* Form Card */}
          <div className="bg-white border-[0.2em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#E99F4C] overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:0.5em_0.5em] pointer-events-none"></div>
            <div className="absolute bottom-[-1.5em] right-[6em] w-[2.5em] h-[2.5em] bg-[#4CAF50] border-[0.15em] border-[#264143] rounded-[0.3em] rotate-12 z-0"></div>
            <div className="absolute top-[-1em] left-[3em] w-[1.8em] h-[1.8em] bg-[#DE5499] border-[0.15em] border-[#264143] rounded-[0.3em] rotate-45 z-0"></div>
            <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.2em] border-t-[0.2em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
            
            {/* Form Content */}
            <div className="relative z-1 p-8">
              {loading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="w-16 h-16 border-4 border-[#E99F4C] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[#264143] font-bold mb-2" htmlFor="semesterId">
                      Semester <span className="text-red-500">*</span>
                    </label>
                    {semesters.length === 0 ? (
                      <div className="p-5 bg-[#EDDCD9] rounded-[0.5em] border-[0.1em] border-[#264143]/20">
                        <p className="text-[#264143] font-medium">No semesters available. Please create a semester first.</p>
                        <Link 
                          href="/admin/semesters/add" 
                          className="inline-flex items-center bg-white mt-3 px-4 py-2 rounded-[0.3em] text-[#264143] border-[0.1em] border-[#264143] font-bold shadow-[0.1em_0.1em_0_#E99F4C] hover:translate-y-[-0.1em] hover:shadow-[0.2em_0.2em_0_#E99F4C] transition-all duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <path d="M12 5v14M5 12h14"></path>
                          </svg>
                          <span>Create Semester</span>
                        </Link>
                      </div>
                    ) : (
                      <select
                        id="semesterId"
                        className="w-full px-4 py-3 border-[0.15em] border-[#264143] rounded-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] bg-white font-medium"
                        value={semesterId}
                        onChange={(e) => setSemesterId(e.target.value)}
                        required
                      >
                        <option value="">Select a Semester</option>
                        {semesters.map(semester => (
                          <option key={semester.id} value={semester.id}>
                            Year {semester.year.number}, Semester {semester.number}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-[#264143] font-bold mb-2" htmlFor="name">
                      Subject Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 border-[0.15em] border-[#264143] rounded-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] bg-white font-medium"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Data Structures and Algorithms"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[#264143] font-bold mb-2" htmlFor="code">
                      Subject Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="code"
                      className="w-full px-4 py-3 border-[0.15em] border-[#264143] rounded-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] bg-white font-medium"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="e.g. CS201"
                      required
                    />
                    <p className="text-sm text-[#264143]/70 mt-2 font-medium">
                      A unique code used to identify the subject
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-4 pt-6">
                    <Link 
                      href="/admin/subjects" 
                      className="px-6 py-2.5 bg-white border-[0.15em] border-[#264143]/70 text-[#264143] font-bold rounded-[0.4em] hover:bg-[#EDDCD9] transition-all duration-200"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className={`px-6 py-2.5 bg-white border-[0.15em] border-[#264143] text-[#264143] font-bold rounded-[0.4em] shadow-[0.15em_0.15em_0_#E99F4C] hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#E99F4C] transition-all duration-200 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0.15em_0.15em_0_#E99F4C]`}
                      disabled={submitting || semesters.length === 0}
                    >
                      {submitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin w-5 h-5 border-2 border-[#264143] rounded-full border-t-transparent mr-2"></div>
                          <span>Creating...</span>
                        </div>
                      ) : (
                        'Create Subject'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Corner slice */}
      <div className="absolute bottom-0 left-0 w-[2.5em] h-[2.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.8em] z-[3]"></div>
    </div>
  );
}