'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  CheckCircle, 
  Heart,
  MessageCircle,
  Calendar,
  Search,
  Download,
  Eye,
  BookOpen,
  User,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { formatTimeAgo } from '@/lib/date-utils';

interface Note {
  id: string;
  title: string;
  content: string;
  type: string;
  fileUrl: string;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  isRejected: boolean;
  authorClerkId: string;
  author: {
    firstName: string;
    lastName: string;
  };
  subject: {
    id: string;
    name: string;
    code: string;
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

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function LikedNotesPage() {
  const { user, isLoaded } = useUser();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });

  useEffect(() => {
    if (isLoaded && user) {
      fetchLikedNotes();
    }
  }, [isLoaded, user, pagination.page]);

  useEffect(() => {
    filterNotes();
  }, [notes, searchTerm, typeFilter]);

  const fetchLikedNotes = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch notes liked by the current user
      const response = await fetch(`/api/users/${user?.id}/liked-notes?page=${pagination.page}&limit=${pagination.limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch your liked notes');
      }

      const data = await response.json();
      
      if (Array.isArray(data.notes)) {
        setNotes(data.notes);
        setPagination(data.pagination);
      } else {
        console.error('Unexpected API response format:', data);
        throw new Error('Unexpected response format');
      }
    } catch (err: any) {
      console.error('Error fetching liked notes:', err);
      setError(err.message || 'Failed to load your liked notes');
    } finally {
      setLoading(false);
    }
  };

  const filterNotes = () => {
    let filtered = [...notes];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${note.author.firstName} ${note.author.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(note => note.type === typeFilter);
    }

    setFilteredNotes(filtered);
  };

  const getNoteTypeDetails = (type: string) => {
    switch (type) {
      case 'PDF':
        return { color: '#e53e3e', bgColor: 'rgba(229, 62, 62, 0.1)' };
      case 'PPT':
        return { color: '#dd6b20', bgColor: 'rgba(221, 107, 32, 0.1)' };
      case 'LECTURE':
        return { color: '#3182ce', bgColor: 'rgba(49, 130, 206, 0.1)' };
      case 'HANDWRITTEN':
        return { color: '#38a169', bgColor: 'rgba(56, 161, 105, 0.1)' };
      default:
        return { color: '#264143', bgColor: 'rgba(38, 65, 67, 0.1)' };
    }
  };

  const uniqueTypes = [...new Set(notes.map(note => note.type))];

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#264143] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#264143] font-medium">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#DE5499] p-8 text-center max-w-md"
            >
              <AlertTriangle className="w-12 h-12 text-[#DE5499] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#264143] mb-2">Unable to Load</h3>
              <p className="text-[#264143]/80 mb-4">{error}</p>
              <button
                onClick={fetchLikedNotes}
                className="px-4 py-2 bg-[#7BB4B1] text-white font-bold rounded-[0.4em] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#264143] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#264143] transition-all duration-200"
              >
                Try Again
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 py-8 px-4">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:18px_18px] md:bg-[length:24px_24px] pointer-events-none"></div>
      
      {/* Decorative blobs */}
      <div className="absolute top-[15%] right-[5%] w-[15vw] max-w-[8rem] aspect-square bg-[#DE5499]/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute bottom-[25%] left-[8%] w-[18vw] max-w-[10rem] aspect-square bg-[#7BB4B1]/10 rounded-full blur-xl pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#264143] mb-2">Liked Notes</h1>
              <p className="text-[#264143]/80">Explore all the notes you've liked across NoteSphere</p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#E99F4C] p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#264143]/60 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by title, author, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-[0.15em] border-[#264143] rounded-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#7BB4B1]/50"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="lg:w-48">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border-[0.15em] border-[#264143] rounded-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#7BB4B1]/50"
              >
                <option value="all">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filters indicator */}
          {(searchTerm || typeFilter !== 'all') && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-[#264143]/70">Active filters:</span>
              {searchTerm && (
                <span className="px-2 py-1 bg-[#7BB4B1]/20 text-[#264143] rounded-full text-xs">
                  Search: "{searchTerm}"
                </span>
              )}
              {typeFilter !== 'all' && (
                <span className="px-2 py-1 bg-[#DE5499]/20 text-[#264143] rounded-full text-xs">
                  Type: {typeFilter}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                }}
                className="px-2 py-1 bg-[#264143]/10 text-[#264143] rounded-full text-xs hover:bg-[#264143]/20 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </motion.div>

        {/* Notes List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {loading ? (
            <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#DE5499] p-12 text-center">
              <div className="w-16 h-16 border-4 border-[#264143] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#264143] font-medium">Loading liked notes...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#DE5499] p-12 text-center">
              <Heart className="w-16 h-16 text-[#DE5499]/70 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#264143] mb-2">
                {notes.length === 0 ? 'No Liked Notes Yet' : 'No Notes Match Your Filters'}
              </h3>
              <p className="text-[#264143]/80 mb-6">
                {notes.length === 0 
                  ? 'Start exploring and liking notes from other users to build your collection!'
                  : 'Try adjusting your search or filter criteria to find your liked notes.'
                }
              </p>
              {notes.length === 0 && (
                <Link
                  href="/notes"
                  className="inline-flex items-center px-6 py-3 bg-[#7BB4B1] text-white font-bold rounded-[0.4em] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#264143] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#264143] transition-all duration-200"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Explore Notes
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredNotes.map((note, index) => {
                  const typeDetails = getNoteTypeDetails(note.type);
                  
                  return (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-white border-[0.2em] border-[#264143] rounded-[0.5em] shadow-[0.25em_0.25em_0_#DE5499] hover:translate-y-[-0.1em] hover:shadow-[0.35em_0.35em_0_#DE5499] transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Corner slice */}
                      <div className="absolute bottom-0 left-0 w-[1em] h-[1em] bg-white border-r-[0.2em] border-t-[0.2em] border-[#264143] rounded-tr-[0.3em] z-10"></div>
                      
                      <div className="p-5 relative z-[1]">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div 
                              className="w-12 h-12 rounded-[0.4em] border-[0.15em] border-[#264143] flex items-center justify-center shadow-[0.15em_0.15em_0_#E99F4C]"
                              style={{ backgroundColor: typeDetails.bgColor }}
                            >
                              <FileText className="w-6 h-6" style={{ color: typeDetails.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg text-[#264143] mb-1 line-clamp-2">{note.title}</h3>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2 py-0.5 bg-[#264143]/10 text-[#264143] rounded-full text-xs">
                                  {note.type}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Author info */}
                        <div className="mb-4 p-3 bg-[#F8F5F2] rounded-[0.4em] border-[0.1em] border-[#264143]/20">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-4 h-4 text-[#264143]" />
                            <span className="font-medium text-[#264143]">
                              {note.author.firstName} {note.author.lastName}
                            </span>
                          </div>
                        </div>

                        {/* Subject Info */}
                        <div className="mb-4 p-3 bg-[#F8F5F2] rounded-[0.4em] border-[0.1em] border-[#264143]/20">
                          <div className="flex items-center gap-2 mb-1">
                            <BookOpen className="w-4 h-4 text-[#264143]" />
                            <span className="font-medium text-[#264143]">{note.subject.name}</span>
                          </div>
                          <p className="text-sm text-[#264143]/80">
                            {note.subject.code} • Year {note.subject.semester.year.number}, Semester {note.subject.semester.number}
                          </p>
                        </div>

                        {/* Content Preview */}
                        {note.content && (
                          <div className="mb-4">
                            <p className="text-sm text-[#264143]/80 line-clamp-2">{note.content}</p>
                          </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-[#EDDCD9]/30 rounded-[0.4em]">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-[#DE5499]">
                              <Heart className="w-4 h-4 fill-[#DE5499]" />
                              <span className="font-bold">{note._count.likes}</span>
                            </div>
                            <p className="text-xs text-[#264143]/70">Likes</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-[#7BB4B1]">
                              <MessageCircle className="w-4 h-4" />
                              <span className="font-bold">{note._count.comments}</span>
                            </div>
                            <p className="text-xs text-[#264143]/70">Comments</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-[#E99F4C]">
                              <Download className="w-4 h-4" />
                              <span className="font-bold">{note.downloadCount}</span>
                            </div>
                            <p className="text-xs text-[#264143]/70">Downloads</p>
                          </div>
                        </div>

                        {/* Timestamps */}
                        <div className="flex items-center text-xs text-[#264143]/70 mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Uploaded {formatTimeAgo(note.createdAt)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Link
                            href={`/notes/${note.id}`}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-[#7BB4B1] text-white font-medium rounded-[0.3em] border-[0.1em] border-[#264143] shadow-[0.1em_0.1em_0_#264143] hover:translate-y-[-0.05em] hover:shadow-[0.15em_0.15em_0_#264143] transition-all duration-200 text-sm"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Link>
                          
                          <a
                            href={note.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-[#E99F4C] text-white font-medium rounded-[0.3em] border-[0.1em] border-[#264143] shadow-[0.1em_0.1em_0_#264143] hover:translate-y-[-0.05em] hover:shadow-[0.15em_0.15em_0_#264143] transition-all duration-200"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
          
          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`px-3 py-1 border-[0.1em] border-[#264143] rounded-[0.3em] ${
                    pagination.page === 1 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-[#EDDCD9]/40'
                  }`}
                >
                  Previous
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      pagination.page === page
                        ? 'bg-[#DE5499] text-white'
                        : 'bg-white border-[0.1em] border-[#264143] hover:bg-[#EDDCD9]/40'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`px-3 py-1 border-[0.1em] border-[#264143] rounded-[0.3em] ${
                    pagination.page === pagination.totalPages
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-[#EDDCD9]/40'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Results Summary */}
          {filteredNotes.length > 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 text-center"
            >
              <p className="text-[#264143]/80">
                Showing {filteredNotes.length} of {pagination.total} notes
                {(searchTerm || typeFilter !== 'all') && ' (filtered)'}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
