"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

interface Year {
  id: string;
  number: number;
  _count?: {
    semesters: number;
  };
}

export default function ManageYears() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  const [years, setYears] = useState<Year[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded) {
      fetchYears();
    }
  }, [isLoaded]);

  const fetchYears = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/years');
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch years');
      }
      
      setYears(data.years || []);
      setLoading(false);    } catch (err: unknown) {
      console.error('Error fetching years:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch years');
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (deleteId !== id) {
      setDeleteId(id);
      return;
    }

    try {
      const res = await fetch(`/api/years/${id}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to delete year');
      }
      
      // Remove the deleted year from the state
      setYears(years.filter(year => year.id !== id));
      setDeleteId(null);    } catch (err: unknown) {
      console.error('Error deleting year:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete year');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with Back Link */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <Link 
              href="/admin" 
              className="inline-flex items-center text-[#264143] hover:text-[#E99F4C] mb-4 md:mb-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M19 12H5M12 19l-7-7 7-7"></path>
              </svg>
              <span>Back to Admin</span>
            </Link>
            <h1 className="text-3xl font-bold text-[#264143]">Manage Years</h1>
          </div>
          <Link 
            href="/admin/years/add" 
            className="inline-flex items-center justify-center py-2 px-4 bg-[#264143] text-white font-medium rounded-md hover:bg-[#1c3233] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M12 5v14M5 12h14"></path>
            </svg>
            <span>Add New Year</span>
          </Link>
        </div>

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

        {/* Years Table Card */}
        <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] overflow-hidden relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:0.5em_0.5em] pointer-events-none opacity-30"></div>
          <div className="absolute w-[2.5em] h-[2.5em] bg-[#DE5499] border-[0.15em] border-[#264143] rounded-[0.3em] rotate-45 bottom-[-1.2em] right-[5em] z-0"></div>
          <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
          
          {/* Table Content */}
          <div className="relative z-1 overflow-x-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin w-10 h-10 border-4 border-[#E99F4C] rounded-full border-t-transparent"></div>
              </div>
            ) : years.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-[#EDDCD9] rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#264143]">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                    <line x1="16" x2="16" y1="2" y2="6"></line>
                    <line x1="8" x2="8" y1="2" y2="6"></line>
                    <line x1="3" x2="21" y1="10" y2="10"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#264143] mb-1">No Years Found</h3>
                <p className="text-[#264143] opacity-70 mb-4">Get started by adding your first academic year</p>
                <Link 
                  href="/admin/years/add" 
                  className="inline-flex items-center justify-center py-2 px-4 bg-[#264143] text-white font-medium rounded-md hover:bg-[#1c3233] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M12 5v14M5 12h14"></path>
                  </svg>
                  <span>Add First Year</span>
                </Link>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#EDDCD9]">
                    <th className="text-left py-3 px-4 text-[#264143] font-bold">Year #</th>
                    <th className="text-left py-3 px-4 text-[#264143] font-bold">Semesters</th>
                    <th className="text-right py-3 px-4 text-[#264143] font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {years.map((year) => (
                    <tr key={year.id} className="border-b border-[#EDDCD9] hover:bg-[#EDDCD9]/10">
                      <td className="py-3 px-4">
                        <span className="text-lg font-bold text-[#264143]">Year {year.number}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-[#EDDCD9] text-[#264143] py-1 px-3 rounded-full font-medium">
                          {year._count?.semesters || 0} {year._count?.semesters === 1 ? 'Semester' : 'Semesters'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link 
                            href={`/admin/years/edit/${year.id}`}
                            className="p-2 bg-[#EDDCD9] text-[#264143] rounded-md hover:bg-[#E99F4C] transition-colors"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </Link>
                          <button 
                            onClick={() => handleDelete(year.id)}
                            className={`p-2 ${deleteId === year.id ? 'bg-red-500 text-white' : 'bg-[#EDDCD9] text-[#264143]'} rounded-md hover:bg-red-500 hover:text-white transition-colors`}
                            title={deleteId === year.id ? 'Confirm Delete' : 'Delete'}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}