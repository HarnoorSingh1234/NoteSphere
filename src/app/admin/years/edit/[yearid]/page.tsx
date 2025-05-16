"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditYear() {
  const router = useRouter();
  const { yearid } = useParams<{ yearid: string }>();
  
  const [yearNumber, setYearNumber] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchYear = async () => {
      if (!yearid) {
        setError('Year ID is missing');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/years/${yearid}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch year');
        }
        
        setYearNumber(data.year.number);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching year:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch years');
        setLoading(false);
      }
    };
    
    fetchYear();
  }, [yearid]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!yearid) {
      setError('Year ID is missing');
      return;
    }

    // Validate the form
    if (yearNumber === '') {
      setError('Year number is required');
      return;
    }

    if (typeof yearNumber === 'number' && (yearNumber <= 0 || yearNumber > 10)) {
      setError('Year number must be between 1 and 10');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const res = await fetch(`/api/years/${yearid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ number: Number(yearNumber) })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update year');
      }

      setSuccessMessage(`Year updated successfully to Year ${yearNumber}!`);
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        router.push('/admin/years');
      }, 1500);
    } catch (err) {
      console.error('Error updating year:', err);
      setError(err instanceof Error ? err.message : 'Failed to update year');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#F8F5F2] py-8">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:1em_1em] pointer-events-none opacity-30 z-[1]"></div>
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-2xl mx-auto flex items-center justify-center p-12">
            <div className="w-16 h-16 border-4 border-[#E99F4C] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

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
              href="/admin/years" 
              className="inline-flex items-center text-[#264143] hover:text-[#4CAF50] mb-4 transition-all duration-200 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M19 12H5M12 19l-7-7 7-7"></path>
              </svg>
              <span>Back to Years</span>
            </Link>
            <h1 className="text-3xl font-bold text-[#264143]">Edit Year</h1>
          </div>

          {/* Form Card */}
          <div className="bg-white border-[0.2em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#E99F4C] overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:0.5em_0.5em] pointer-events-none"></div>
            <div className="absolute bottom-[-1.5em] left-[6em] w-[2.5em] h-[2.5em] bg-[#DE5499] border-[0.15em] border-[#264143] rounded-[0.3em] rotate-12 z-0"></div>
            <div className="absolute top-[-1em] right-[3em] w-[1.8em] h-[1.8em] bg-[#4CAF50] border-[0.15em] border-[#264143] rounded-[0.3em] rotate-45 z-0"></div>
            <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.2em] border-t-[0.2em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
            
            {/* Form Content */}
            <div className="relative z-1 p-8">
              {successMessage ? (
                <div className="bg-white border-[0.15em] border-green-500 rounded-[0.5em] shadow-[0.2em_0.2em_0_#4CAF50] p-4 mb-6 animate-pulse">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-3">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <p className="text-green-700 font-medium">{successMessage}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
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
                  
                  <div>
                    <label htmlFor="yearNumber" className="block text-[#264143] font-bold mb-2">Year Number <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        id="yearNumber"
                        type="number"
                        min="1"
                        max="10"
                        value={yearNumber}
                        onChange={(e) => setYearNumber(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                        className="w-full px-4 py-3 border-[0.15em] border-[#264143] rounded-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] bg-white text-[#264143] font-medium"
                        placeholder="Enter year number (1-10)"
                        required
                      />
                      <div className="absolute right-0 top-0 h-full w-12 flex items-center justify-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#264143]">
                          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                          <line x1="16" x2="16" y1="2" y2="6"></line>
                          <line x1="8" x2="8" y1="2" y2="6"></line>
                          <line x1="3" x2="21" y1="10" y2="10"></line>
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-[#264143]/70 mt-2 font-medium">Enter a number between 1 and 10 to represent the academic year.</p>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-4 pt-6">
                    <Link 
                      href="/admin/years" 
                      className="px-6 py-2.5 bg-white border-[0.15em] border-[#264143]/70 text-[#264143] font-bold rounded-[0.4em] hover:bg-[#EDDCD9] transition-all duration-200"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className={`px-6 py-2.5 bg-white border-[0.15em] border-[#264143] text-[#264143] font-bold rounded-[0.4em] shadow-[0.15em_0.15em_0_#E99F4C] hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#E99F4C] transition-all duration-200 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0.15em_0.15em_0_#E99F4C]`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin w-5 h-5 border-2 border-[#264143] rounded-full border-t-transparent mr-2"></div>
                          <span>Updating...</span>
                        </div>
                      ) : (
                        'Update Year'
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