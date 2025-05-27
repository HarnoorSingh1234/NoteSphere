'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Download, 
  Heart,
  MessageCircle,
  Calendar,
  Edit3,
  Trash2,
  Eye,
  Filter,
  Search,
  Upload,
  TrendingUp,
  BookOpen,
  Users
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
  rejectedAt?: string;
  authorClerkId: string;
  subjectId: string;
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

interface Statistics {
  totalNotes: number;
  publishedNotes: number;
  pendingNotes: number;
  rejectedNotes: number;
  totalDownloads: number;
  totalLikes: number;
}

export default function MyUploadsPage() {
  const { userId } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalNotes: 0,
    publishedNotes: 0,
    pendingNotes: 0,
    rejectedNotes: 0,
    totalDownloads: 0,
    totalLikes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'pending' | 'rejected'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    if (userId) {
      fetchUserNotes();
    }
  }, [userId]);

  useEffect(() => {
    filterNotes();
  }, [notes, searchTerm, statusFilter, typeFilter]);

  const fetchUserNotes = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all notes by the current user (both public and private)
      const response = await fetch(`/api/admin/notes?authorId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch your notes');
      }

      const data = await response.json();
      
      if (Array.isArray(data.notes)) {
        setNotes(data.notes);
        calculateStatistics(data.notes);
      } else {
        console.error('Unexpected API response format:', data);
        throw new Error('Unexpected response format');
      }
    } catch (err: any) {
      console.error('Error fetching user notes:', err);
      setError(err.message || 'Failed to load your notes');
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (notesList: Note[]) => {
    const stats: Statistics = {
      totalNotes: notesList.length,
      publishedNotes: notesList.filter(note => note.isPublic && !note.isRejected).length,
      pendingNotes: notesList.filter(note => !note.isPublic && !note.isRejected).length,
      rejectedNotes: notesList.filter(note => note.isRejected).length,
      totalDownloads: notesList.reduce((sum, note) => sum + note.downloadCount, 0),
      totalLikes: notesList.reduce((sum, note) => sum + note._count.likes, 0),
    };
    setStatistics(stats);
  };

  const filterNotes = () => {
    let filtered = [...notes];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(note => {
        switch (statusFilter) {
          case 'published':
            return note.isPublic && !note.isRejected;
          case 'pending':
            return !note.isPublic && !note.isRejected;
          case 'rejected':
            return note.isRejected;
          default:
            return true;
        }
      });
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(note => note.type === typeFilter);
    }

    setFilteredNotes(filtered);
  };

  const getStatusDisplay = (note: Note) => {
    if (note.isRejected) {
      return {
        label: 'Rejected',
        icon: <XCircle className="w-4 h-4" />,
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-200'
      };
    } else if (note.isPublic) {
      return {
        label: 'Published',
        icon: <CheckCircle className="w-4 h-4" />,
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200'
      };
    } else {
      return {
        label: 'Pending Review',
        icon: <Clock className="w-4 h-4" />,
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-200'
      };
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#264143] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#264143] font-medium">Loading your uploads...</p>
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
              className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#DE5499] p-8 text-center max-w-md"
            >
              <AlertTriangle className="w-12 h-12 text-[#DE5499] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#264143] mb-2">Unable to Load</h3>
              <p className="text-[#264143]/80 mb-4">{error}</p>
              <button
                onClick={fetchUserNotes}
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
              <h1 className="text-3xl md:text-4xl font-bold text-[#264143] mb-2">My Uploads</h1>
              <p className="text-[#264143]/80">Manage and track all your uploaded study materials</p>
            </div>
            
            <Link
              href="/upload"
              className="inline-flex items-center px-6 py-3 bg-[#7BB4B1] text-white font-bold rounded-[0.4em] border-[0.2em] border-[#264143] shadow-[0.3em_0.3em_0_#264143] hover:translate-y-[-0.1em] hover:shadow-[0.4em_0.4em_0_#264143] transition-all duration-200"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload New Note
            </Link>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8"
        >
          <div className="bg-white border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_#7BB4B1] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#7BB4B1]/20 border-[0.15em] border-[#264143] rounded-[0.4em] flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#264143]" />
              </div>
              <div>
                <p className="text-xs text-[#264143]/70">Total Notes</p>
                <p className="text-lg font-bold text-[#264143]">{statistics.totalNotes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_#7BB4B1] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 border-[0.15em] border-green-500 rounded-[0.4em] flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-[#264143]/70">Published</p>
                <p className="text-lg font-bold text-[#264143]">{statistics.publishedNotes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_#7BB4B1] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 border-[0.15em] border-yellow-500 rounded-[0.4em] flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-[#264143]/70">Pending</p>
                <p className="text-lg font-bold text-[#264143]">{statistics.pendingNotes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_#7BB4B1] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 border-[0.15em] border-red-500 rounded-[0.4em] flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-[#264143]/70">Rejected</p>
                <p className="text-lg font-bold text-[#264143]">{statistics.rejectedNotes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_#7BB4B1] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E99F4C]/20 border-[0.15em] border-[#E99F4C] rounded-[0.4em] flex items-center justify-center">
                <Download className="w-5 h-5 text-[#E99F4C]" />
              </div>
              <div>
                <p className="text-xs text-[#264143]/70">Downloads</p>
                <p className="text-lg font-bold text-[#264143]">{statistics.totalDownloads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_#7BB4B1] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#DE5499]/20 border-[0.15em] border-[#DE5499] rounded-[0.4em] flex items-center justify-center">
                <Heart className="w-5 h-5 text-[#DE5499]" />
              </div>
              <div>
                <p className="text-xs text-[#264143]/70">Total Likes</p>
                <p className="text-lg font-bold text-[#264143]">{statistics.totalLikes}</p>
              </div>
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
                  placeholder="Search your notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-[0.15em] border-[#264143] rounded-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#7BB4B1]/50"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-4 py-2 border-[0.15em] border-[#264143] rounded-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#7BB4B1]/50"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
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
          {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-[#264143]/70">Active filters:</span>
              {searchTerm && (
                <span className="px-2 py-1 bg-[#7BB4B1]/20 text-[#264143] rounded-full text-xs">
                  Search: "{searchTerm}"
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="px-2 py-1 bg-[#E99F4C]/20 text-[#264143] rounded-full text-xs">
                  Status: {statusFilter}
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
                  setStatusFilter('all');
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
          {filteredNotes.length === 0 ? (
            <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#DE5499] p-12 text-center">
              <FileText className="w-16 h-16 text-[#264143]/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#264143] mb-2">
                {notes.length === 0 ? 'No Notes Yet' : 'No Notes Match Your Filters'}
              </h3>
              <p className="text-[#264143]/80 mb-6">
                {notes.length === 0 
                  ? 'Start sharing your knowledge by uploading your first study material!'
                  : 'Try adjusting your search or filter criteria to find your notes.'
                }
              </p>
              {notes.length === 0 && (
                <Link
                  href="/upload"
                  className="inline-flex items-center px-6 py-3 bg-[#7BB4B1] text-white font-bold rounded-[0.4em] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#264143] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#264143] transition-all duration-200"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Your First Note
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredNotes.map((note, index) => {
                  const status = getStatusDisplay(note);
                  const typeDetails = getNoteTypeDetails(note.type);
                  
                  return (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-white border-[0.2em] border-[#264143] rounded-[0.5em] shadow-[0.25em_0.25em_0_#7BB4B1] hover:translate-y-[-0.1em] hover:shadow-[0.35em_0.35em_0_#7BB4B1] transition-all duration-300 relative overflow-hidden"
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
                                <span 
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor} border ${status.borderColor}`}
                                >
                                  {status.icon}
                                  {status.label}
                                </span>
                                <span className="px-2 py-0.5 bg-[#264143]/10 text-[#264143] rounded-full text-xs">
                                  {note.type}
                                </span>
                              </div>
                            </div>
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
                              <Heart className="w-4 h-4" />
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
                        <div className="flex justify-between items-center text-xs text-[#264143]/70 mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Uploaded {formatTimeAgo(note.createdAt)}</span>
                          </div>
                          {note.rejectedAt && (
                            <div className="flex items-center gap-1 text-red-600">
                              <XCircle className="w-3 h-3" />
                              <span>Rejected {formatTimeAgo(note.rejectedAt)}</span>
                            </div>
                          )}
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
        </motion.div>

        {/* Results Summary */}
        {filteredNotes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-[#264143]/80">
              Showing {filteredNotes.length} of {notes.length} notes
              {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && ' (filtered)'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}