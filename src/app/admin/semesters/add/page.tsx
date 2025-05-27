"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Year {
  id: string;
  number: number;
}

export default function AddSemester() {
  const router = useRouter();
    const [number, setNumber] = useState<number>(0);
  const [yearId, setYearId] = useState<string>('');
  const [years, setYears] = useState<Year[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchYears() {
      try {
        setLoading(true);
        const res = await fetch('/api/years');
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch years');
        }
        
        setYears(data.years || []);
        if (data.years && data.years.length > 0) {
          setYearId(data.years[0].id);
        }
      } catch (err: unknown) {
        console.error('Error fetching years:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch years');
      } finally {
        setLoading(false);
      }
    }
    
    fetchYears();
  }, []);
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!yearId) {
      setError('Please select a year');
      return;
    }
    
    if (number === 0) {
      setError('Please enter a semester number between 1 and 4');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const res = await fetch('/api/semesters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number,
          yearId,
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to create semester');
      }
      
      router.push('/admin/semesters');
    } catch (err: unknown) {
      console.error('Error creating semester:', err);
      setError(err instanceof Error ? err.message : 'Failed to create semester');
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
          <div className="bg-white rounded-[0.6em] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#DE5499] p-6 mb-8">
            <Link 
              href="/admin/semesters" 
              className="inline-flex items-center text-[#264143] hover:text-[#DE5499] mb-4 transition-all duration-200 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M19 12H5M12 19l-7-7 7-7"></path>
              </svg>
              <span>Back to Semesters</span>
            </Link>
            <h1 className="text-3xl font-bold text-[#264143]">Add New Semester</h1>
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
          <div className="bg-white border-[0.2em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#4CAF50] overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:0.5em_0.5em] pointer-events-none"></div>
            <div className="absolute bottom-[-1.5em] left-[6em] w-[2.5em] h-[2.5em] bg-[#E99F4C] border-[0.15em] border-[#264143] rounded-[0.3em] rotate-12 z-0"></div>
            <div className="absolute top-[-1em] right-[3em] w-[1.8em] h-[1.8em] bg-[#DE5499] border-[0.15em] border-[#264143] rounded-[0.3em] rotate-45 z-0"></div>
            <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.2em] border-t-[0.2em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
            
            {/* Form Content */}
            <div className="relative z-1 p-8">
              {loading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="w-16 h-16 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[#264143] font-bold mb-2" htmlFor="yearId">
                      Academic Year <span className="text-red-500">*</span>
                    </label>
                    {years.length === 0 ? (
                      <div className="p-5 bg-[#EDDCD9] rounded-[0.5em] border-[0.1em] border-[#264143]/20">
                        <p className="text-[#264143] font-medium">No years available. Please create a year first.</p>
                        <Link 
                          href="/admin/years/add" 
                          className="inline-flex items-center bg-white mt-3 px-4 py-2 rounded-[0.3em] text-[#264143] border-[0.1em] border-[#264143] font-bold shadow-[0.1em_0.1em_0_#E99F4C] hover:translate-y-[-0.1em] hover:shadow-[0.2em_0.2em_0_#E99F4C] transition-all duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <path d="M12 5v14M5 12h14"></path>
                          </svg>
                          <span>Create Year</span>
                        </Link>
                      </div>
                    ) : (
                      <select
                        id="yearId"
                        className="w-full px-4 py-3 border-[0.15em] border-[#264143] rounded-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] bg-white font-medium"
                        value={yearId}
                        onChange={(e) => setYearId(e.target.value)}
                        required
                      >
                        <option value="">Select a Year</option>
                        {years.map(year => (
                          <option key={year.id} value={year.id}>
                            Year {year.number}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-[#264143] font-bold mb-2" htmlFor="number">
                      Semester Number <span className="text-red-500">*</span>
                    </label>                    <input
                      type="number"
                      id="number"
                      className="w-full px-4 py-3 border-[0.15em] border-[#264143] rounded-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] bg-white font-medium"
                      value={number === 0 ? "" : number}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          setNumber(0);
                        } else {
                          const val = parseInt(value);
                          setNumber(isNaN(val) ? 0 : Math.min(Math.max(val, 1), 10));
                        }
                      }}
                      min="1"
                      max="10"
                      required
                    />
                    
                  </div>
                  
                  <div className="flex items-center justify-end space-x-4 pt-6">
                    <Link 
                      href="/admin/semesters" 
                      className="px-6 py-2.5 bg-white border-[0.15em] border-[#264143]/70 text-[#264143] font-bold rounded-[0.4em] hover:bg-[#EDDCD9] transition-all duration-200"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className={`px-6 py-2.5 bg-white border-[0.15em] border-[#264143] text-[#264143] font-bold rounded-[0.4em] shadow-[0.15em_0.15em_0_#4CAF50] hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#4CAF50] transition-all duration-200 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0.15em_0.15em_0_#4CAF50]`}
                      disabled={submitting || years.length === 0}
                    >
                      {submitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin w-5 h-5 border-2 border-[#264143] rounded-full border-t-transparent mr-2"></div>
                          <span>Creating...</span>
                        </div>
                      ) : (
                        'Create Semester'
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