"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Subject {
  id: string;
  name: string;
  code: string;
  semester: {
    id: string;
    number: number;
    year: {
      id: string;
      number: number;
    };
  };
  _count?: {
    notes: number;
  };
}

export default function ManageSubjects() {
  const router = useRouter();
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/subjects');
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch subjects');
      }
      
      setSubjects(data.subjects || []);
      setLoading(false);
    } catch (err: unknown) {
      console.error('Error fetching subjects:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subjects');
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (deleteId !== id) {
      setDeleteId(id);
      return;
    }

    try {
      const res = await fetch(`/api/subjects/${id}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to delete subject');
      }
      
      // Remove the deleted subject from the state
      setSubjects(subjects.filter(subject => subject.id !== id));
      setDeleteId(null);
    } catch (err: unknown) {
      console.error('Error deleting subject:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete subject');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F8F5F2] py-8">
      {/* Pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:1em_1em] pointer-events-none opacity-30 z-[1]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:2em_2em] bg-[-1em_-1em] pointer-events-none opacity-10 z-[1]"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header with Back Link */}
          <div className="bg-white rounded-[0.6em] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#4CAF50] p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <Link 
                  href="/admin/dashboard" 
                  className="inline-flex items-center text-[#264143] hover:text-[#4CAF50] mb-4 md:mb-0 transition-all duration-200 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M19 12H5M12 19l-7-7 7-7"></path>
                  </svg>
                  <span>Back to Admin</span>
                </Link>
                <h1 className="text-3xl font-bold text-[#264143]">Manage Subjects</h1>
              </div>
              <Link 
                href="/admin/subjects/add" 
                className="inline-flex items-center justify-center py-2 px-4 bg-white border-[0.15em] border-[#264143] text-[#264143] font-bold rounded-[0.4em] shadow-[0.1em_0.1em_0_#4CAF50] hover:translate-y-[-0.1em] hover:shadow-[0.2em_0.2em_0_#4CAF50] transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M12 5v14M5 12h14"></path>
                </svg>
                <span>Add New Subject</span>
              </Link>
            </div>
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

          {/* Subjects Table Card */}
          <div className="bg-white border-[0.2em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#E99F4C] overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:0.5em_0.5em] pointer-events-none"></div>
            <div className="absolute bottom-[-1.2em] right-[2em] w-[2.5em] h-[2.5em] bg-[#4CAF50] border-[0.15em] border-[#264143] rounded-[0.3em] rotate-12 z-0"></div>
            <div className="absolute top-[-1em] right-[8em] w-[1.8em] h-[1.8em] bg-[#E99F4C] border-[0.15em] border-[#264143] rounded-[0.3em] rotate-45 z-0"></div>
            <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.2em] border-t-[0.2em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
            
            {/* Table Content */}
            <div className="relative z-1 p-6">
              {loading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="w-16 h-16 border-4 border-[#E99F4C] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : subjects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-20 h-20 bg-[#EDDCD9] rounded-full flex items-center justify-center mb-4 border-[0.15em] border-[#264143]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#264143]">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#264143] mb-2">No Subjects Found</h3>
                  <p className="text-[#264143]/70 mb-6 max-w-md mx-auto">Get started by adding your first subject</p>
                  <Link 
                    href="/admin/subjects/add" 
                    className="inline-flex items-center justify-center py-3 px-6 bg-white border-[0.15em] border-[#264143] text-[#264143] font-bold rounded-[0.4em] shadow-[0.2em_0.2em_0_#E99F4C] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#E99F4C] transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M12 5v14M5 12h14"></path>
                    </svg>
                    <span>Add First Subject</span>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-[0.2em] border-[#264143]/10">
                        <th className="text-left py-4 px-4 text-[#264143] font-bold">Subject</th>
                        <th className="text-left py-4 px-4 text-[#264143] font-bold">Code</th>
                        <th className="text-left py-4 px-4 text-[#264143] font-bold">Semester</th>
                        <th className="text-left py-4 px-4 text-[#264143] font-bold">Notes</th>
                        <th className="text-right py-4 px-4 text-[#264143] font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((subject) => (
                        <tr key={subject.id} className="border-b border-[#EDDCD9] hover:bg-[#F8F5F2] transition-colors">
                          <td className="py-4 px-4">
                            <span className="text-lg font-bold text-[#264143]">{subject.name}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-mono bg-[#EDDCD9] px-3 py-1 rounded-[0.3em] text-[#264143] font-bold border-[0.1em] border-[#264143]/20">
                              {subject.code}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <Link 
                              href={`/admin/semesters/edit/${subject.semester.id}`} 
                              className="inline-flex items-center text-[#264143] font-medium px-3 py-1 bg-[#EDDCD9] rounded-[0.3em] border-[0.1em] border-[#264143]/20 hover:bg-[#4CAF50]/20 transition-all duration-200"
                            >
                              Y{subject.semester.year.number} S{subject.semester.number}
                            </Link>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-block bg-[#EDDCD9] text-[#264143] py-1 px-4 rounded-full font-bold border-[0.1em] border-[#264143]/20">
                              {subject._count?.notes || 0} {subject._count?.notes === 1 ? 'Note' : 'Notes'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">                            <div className="flex items-center justify-end space-x-3">
                              <Link
                                href={`/admin/notes/subject/${subject.id}`}
                                className="p-2 bg-[#4d61ff]/20 border-[0.1em] border-[#4d61ff]/30 text-[#4d61ff] rounded-md hover:bg-[#4d61ff]/30 hover:border-[#4d61ff]/50 transition-all duration-200"
                                title="View Notes"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                              </Link>
                              <Link 
                                href={`/admin/subjects/edit/${subject.id}`}
                                className="p-2 bg-[#EDDCD9] border-[0.1em] border-[#264143]/30 text-[#264143] rounded-md hover:bg-[#4CAF50]/30 hover:border-[#264143]/50 transition-all duration-200"
                                title="Edit"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                              </Link>
                              <button 
                                onClick={() => handleDelete(subject.id)}
                                className={`p-2 rounded-md transition-all duration-200 ${
                                  deleteId === subject.id 
                                    ? 'bg-red-500 border-[0.1em] border-[#264143] text-white' 
                                    : 'bg-[#EDDCD9] border-[0.1em] border-[#264143]/30 text-[#264143] hover:bg-red-100 hover:border-red-500'
                                }`}
                                title={deleteId === subject.id ? 'Confirm Delete' : 'Delete'}
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
                </div>
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