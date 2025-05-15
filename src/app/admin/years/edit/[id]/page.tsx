"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface YearProps {
  params: {
    id: string;
  }
}

export default function EditYear({ params }: YearProps) {
  const router = useRouter();
  const { id } = params;
  
  const [yearNumber, setYearNumber] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchYear = async () => {
      try {
        const res = await fetch(`/api/years/${id}`);
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
  }, [id]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

      const res = await fetch(`/api/years/${id}`, {
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
      setError(err instanceof Error ? err.message : 'Failed to fetch years');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto flex items-center justify-center p-8">
          <div className="animate-spin w-10 h-10 border-4 border-[#E99F4C] rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header with Back Link */}
        <div className="mb-8">
          <Link 
            href="/admin/years" 
            className="inline-flex items-center text-[#264143] hover:text-[#E99F4C] mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
            <span>Back to Years</span>
          </Link>
          <h1 className="text-3xl font-bold text-[#264143]">Edit Year</h1>
        </div>

        {/* Form Card */}
        <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] overflow-hidden relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:0.5em_0.5em] pointer-events-none opacity-30"></div>
          <div className="absolute w-[2em] h-[2em] bg-[#DE5499] border-[0.15em] border-[#264143] rounded-[0.3em] rotate-12 top-[-0.8em] right-[2em] z-0"></div>
          <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
          
          {/* Form Content */}
          <div className="relative z-1 p-6">
            {successMessage ? (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-md animate-pulse">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-3">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <p className="text-green-700">{successMessage}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Error Alert */}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mr-3">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" x2="12" y1="8" y2="12"></line>
                        <line x1="12" x2="12.01" y1="16" y2="16"></line>
                      </svg>
                      <p className="text-red-700">{error}</p>
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <label htmlFor="yearNumber" className="block text-[#264143] font-medium mb-2">Year Number</label>
                  <div className="relative">
                    <input
                      id="yearNumber"
                      type="number"
                      min="1"
                      max="10"
                      value={yearNumber}
                      onChange={(e) => setYearNumber(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                      className="block w-full border-[0.2em] border-[#264143] rounded-[0.4em] py-2 px-4 text-[#264143] focus:outline-none focus:ring-2 focus:ring-[#E99F4C] focus:border-[#E99F4C]"
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
                  <p className="mt-2 text-sm text-[#264143] opacity-70">Enter a number between 1 and 10 to represent the academic year.</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`py-2 px-6 bg-[#264143] text-white font-medium rounded-md hover:bg-[#1c3233] transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span>Updating...</span>
                      </div>
                    ) : 'Update Year'}
                  </button>
                  <Link 
                    href="/admin/years" 
                    className="py-2 px-6 bg-[#EDDCD9] text-[#264143] font-medium rounded-md hover:bg-[#E99F4C] transition-colors"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}