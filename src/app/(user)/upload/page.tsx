'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Upload, 
  FileText, 
   
  FileInput, 
  File, 
  CheckCircle,
  X,
  Tag,
  Plus,
  Loader2,
  FileChartLine
} from 'lucide-react';
import Link from 'next/link';
import { preprocessFileForUpload } from '@/lib/client/file-processing';

// Define types based on your Prisma schema
type NoteType = 'PPT' | 'LECTURE' | 'HANDWRITTEN' | 'PDF';

interface Year {
  id: string;
  number: number;
}

interface Semester {
  id: string;
  number: number;
  yearId: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  semesterId: string;
}

interface Tag {
  id?: string;
  name: string;
}

const noteTypes: NoteType[] = ['PPT', 'LECTURE', 'HANDWRITTEN', 'PDF'];

export default function UploadNotePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noteType, setNoteType] = useState<NoteType>('PDF');
  const [isPublic, setIsPublic] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedYearId, setSelectedYearId] = useState<string>('');
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>('');

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Data fetching states
  const [years, setYears] = useState<Year[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);

  // Fetch years on component mount
  useEffect(() => {
    async function fetchYears() {
      try {
        const response = await fetch('/api/years');
        if (!response.ok) throw new Error('Failed to fetch years');
        const data = await response.json();
        setYears(data.years || []);
      } catch (err) {
        console.error('Error fetching years:', err);
        setError('Failed to load years. Please try again.');
      }
    }

    // Fetch all existing tags
    async function fetchTags() {
      try {
        const response = await fetch('/api/tags');
        if (!response.ok) throw new Error('Failed to fetch tags');
        const data = await response.json();
        setAllTags(data.tags || []);
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    }

    fetchYears();
    fetchTags();
  }, []);

  // Fetch semesters when year changes
  useEffect(() => {
    async function fetchSemesters() {
      if (!selectedYearId) {
        setSemesters([]);
        return;
      }

      try {
        const response = await fetch(`/api/semesters?yearId=${selectedYearId}`);
        if (!response.ok) throw new Error('Failed to fetch semesters');
        const data = await response.json();
        setSemesters(data.semesters || []);
        setSelectedSemesterId(''); // Reset semester selection
      } catch (err) {
        console.error('Error fetching semesters:', err);
        setError('Failed to load semesters. Please try again.');
      }
    }

    fetchSemesters();
  }, [selectedYearId]);

  // Fetch subjects when semester changes
  useEffect(() => {
    async function fetchSubjects() {
      if (!selectedSemesterId) {
        setSubjects([]);
        return;
      }

      try {
        const response = await fetch(`/api/subjects?semesterId=${selectedSemesterId}`);
        if (!response.ok) throw new Error('Failed to fetch subjects');
        const data = await response.json();
        setSubjects(data.subjects || []);
        setSelectedSubjectId(''); // Reset subject selection
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError('Failed to load subjects. Please try again.');
      }
    }

    fetchSubjects();
  }, [selectedSemesterId]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Auto-detect note type based on file extension
      const extension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (extension === 'pdf') {
        setNoteType('PDF');
      } else if (extension === 'ppt' || extension === 'pptx') {
        setNoteType('PPT');
      }
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    if (!content.trim()) {
      setError('Please enter content or description');
      return;
    }
    
    if (!selectedSubjectId) {
      setError('Please select a subject');
      return;
    }
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setError(null);
    setUploading(true);
      try {
      // Preprocess the file (compress if it's a PDF)
      let fileToUpload = file;
      if (file.type === 'application/pdf') {
        console.log('Processing PDF file before upload...');
        try {
          fileToUpload = await preprocessFileForUpload(file);
          console.log(`PDF processed: Original size: ${file.size} bytes, New size: ${fileToUpload.size} bytes`);
          
          // Show compression info
          const compressionRatio = ((1 - (fileToUpload.size / file.size)) * 100).toFixed(1);
          console.log(`Compression ratio: ${compressionRatio}% reduction`);
          
        } catch (compressionError) {
          console.error('PDF compression failed:', compressionError);
          // Continue with original file if compression fails
          console.log('Continuing with original uncompressed file');
        }
      }
      
      // Step 1: Upload file to obtain URL
      const fileFormData = new FormData();
      fileFormData.append('file', fileToUpload);
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: fileFormData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error('File upload failed');
      }
      
      const uploadData = await uploadResponse.json();
      const fileUrl = uploadData.url;
      
      // Step 2: Create note with file URL
      const noteData = {
        title,
        content,
        type: noteType,
        fileUrl,
        isPublic,
        subjectId: selectedSubjectId,
        tags,
      };
      
      const noteResponse = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      
      if (!noteResponse.ok) {
        throw new Error('Failed to create note');
      }
      
      // Success!
      setSuccess(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setTitle('');
        setContent('');
        setNoteType('PDF');
        setIsPublic(false);
        setFile(null);
        setSelectedYearId('');
        setSelectedSemesterId('');
        setSelectedSubjectId('');
        setTags([]);
        setSuccess(false);
        
        // Redirect to the notes page
        router.push(`/subjects/${selectedSubjectId}/notes`);
      }, 2000);
      
    } catch (err: any) {
      console.error('Error uploading note:', err);
      setError(err.message || 'Failed to upload note. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // File type icon mapping
  const getFileIcon = () => {
    if (!file) return <FileInput className="w-8 h-8 text-[#050505]/70" />;
    
    switch (noteType) {
      case 'PPT':
        return <FileChartLine className="w-8 h-8 text-orange-500" />;
      case 'LECTURE':
        return <FileText className="w-8 h-8 text-blue-500" />;
      case 'HANDWRITTEN':
        return <File className="w-8 h-8 text-purple-500" />;
      case 'PDF':
      default:
        return <FileText className="w-8 h-8 text-red-500" />;
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#EDDCD9] py-12">
      {/* Pattern grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:1em_1em] pointer-events-none opacity-30 z-[1]" />
      
      {/* Overlay dots */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:2em_2em] bg-[-1em_-1em] pointer-events-none opacity-10 z-[1]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <div className="inline-flex items-center justify-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-white border-[0.15em] border-[#050505] rounded-full shadow-[0.2em_0.2em_0_#ff3e00] mb-4">
                <Upload className="w-6 h-6 text-[#050505]" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#050505] mb-2">
              Upload <span className="text-[#ff3e00]">New Note</span>
            </h1>
            
            <p className="max-w-[600px] mx-auto text-[#050505]/80 text-lg mb-4">
              Share your notes with other students and help them learn
            </p>
          </motion.div>

          {/* Success message */}
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6 rounded-md flex items-center">
              <CheckCircle className="text-green-500 mr-3" size={20} />
              <p className="text-green-700">Your note has been uploaded successfully!</p>
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 rounded-md flex items-center">
              <X className="text-red-500 mr-3" size={20} />
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <div className="bg-white border-[0.15em] border-[#050505] rounded-[0.6em] shadow-[0.4em_0.4em_0_#000] p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              {/* Academic Selection (Year, Semester, Subject) */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#050505] mb-4 border-b border-gray-200 pb-2">
                  Academic Selection
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Year Selection */}
                  <div>
                    <label htmlFor="year" className="block text-[#050505] font-medium mb-2">
                      Year
                    </label>
                    <select
                      id="year"
                      className="w-full p-3 border-2 border-[#050505] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#ff3e00]"
                      value={selectedYearId}
                      onChange={(e) => setSelectedYearId(e.target.value)}
                      required
                    >
                      <option value="">Select Year</option>
                      {years.map((year) => (
                        <option key={year.id} value={year.id}>
                          Year {year.number}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Semester Selection */}
                  <div>
                    <label htmlFor="semester" className="block text-[#050505] font-medium mb-2">
                      Semester
                    </label>
                    <select
                      id="semester"
                      className="w-full p-3 border-2 border-[#050505] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#ff3e00]"
                      value={selectedSemesterId}
                      onChange={(e) => setSelectedSemesterId(e.target.value)}
                      disabled={!selectedYearId}
                      required
                    >
                      <option value="">Select Semester</option>
                      {semesters.map((semester) => (
                        <option key={semester.id} value={semester.id}>
                          Semester {semester.number}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Subject Selection */}
                  <div>
                    <label htmlFor="subject" className="block text-[#050505] font-medium mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      className="w-full p-3 border-2 border-[#050505] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#ff3e00]"
                      value={selectedSubjectId}
                      onChange={(e) => setSelectedSubjectId(e.target.value)}
                      disabled={!selectedSemesterId}
                      required
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.code} - {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Note Details */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#050505] mb-4 border-b border-gray-200 pb-2">
                  Note Details
                </h2>
                
                {/* Title */}
                <div className="mb-4">
                  <label htmlFor="title" className="block text-[#050505] font-medium mb-2">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    className="w-full p-3 border-2 border-[#050505] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#ff3e00]"
                    placeholder="e.g., Data Structures Midterm Notes"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                {/* Content/Description */}
                <div className="mb-4">
                  <label htmlFor="content" className="block text-[#050505] font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    id="content"
                    rows={4}
                    className="w-full p-3 border-2 border-[#050505] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#ff3e00]"
                    placeholder="Describe what's in these notes..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  ></textarea>
                </div>
                
                {/* Note Type */}
                <div className="mb-6">
                  <label className="block text-[#050505] font-medium mb-2">
                    Note Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {noteTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNoteType(type)}
                        className={`p-3 border-2 rounded-md flex items-center justify-center transition-all ${
                          noteType === type
                            ? 'border-[#ff3e00] bg-[#ff3e00]/10 text-[#ff3e00]'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* File Upload */}
                <div className="mb-6">
                  <label className="block text-[#050505] font-medium mb-2">
                    Upload File
                  </label>
                  <div 
                    className="border-2 border-dashed border-gray-400 rounded-md p-6 flex flex-col items-center cursor-pointer hover:bg-gray-50"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                    
                    <div className="mb-3">{getFileIcon()}</div>
                    
                    {file ? (
                      <div>
                        <p className="text-[#050505] font-medium">{file.name}</p>
                        <p className="text-gray-500 text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-[#050505] font-medium">Drag & drop or click to upload</p>
                        <p className="text-gray-500 text-sm">PDF, PPT, Word documents, or images</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Tags */}
                <div className="mb-6">
                  <label className="block text-[#050505] font-medium mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <div 
                        key={tag} 
                        className="bg-[#4d61ff]/10 text-[#4d61ff] px-3 py-1 rounded-full flex items-center"
                      >
                        <Tag size={14} className="mr-1" />
                        <span>{tag}</span>
                        <button 
                          type="button" 
                          className="ml-1 text-[#4d61ff] hover:text-[#050505]"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-grow p-3 border-2 border-[#050505] rounded-l-md bg-white focus:outline-none focus:ring-2 focus:ring-[#ff3e00]"
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <button
                      type="button"
                      className="bg-[#050505] text-white px-4 rounded-r-md flex items-center"
                      onClick={handleAddTag}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  
                  {/* Suggested tags */}
                  {allTags.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-1">Suggested tags:</p>
                      <div className="flex flex-wrap gap-1">
                        {allTags.slice(0, 5).map((tag) => (
                          <button
                            key={tag.id}
                            type="button"
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-200"
                            onClick={() => !tags.includes(tag.name) && setTags([...tags, tag.name])}
                          >
                            {tag.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Visibility */}
                <div className="mb-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isPublic}
                      onChange={() => setIsPublic(!isPublic)}
                    />
                    <div className={`relative w-10 h-5 transition-colors duration-200 ease-linear rounded-full ${isPublic ? 'bg-[#ff3e00]' : 'bg-gray-300'}`}>
                      <div className={`absolute left-0 top-0 w-5 h-5 transition-transform duration-200 ease-linear transform bg-white border border-gray-200 rounded-full ${isPublic ? 'translate-x-full' : 'translate-x-0'}`} />
                    </div>
                    <span className="ml-3 text-[#050505]">Make this note public</span>
                  </label>
                  <p className="text-sm text-gray-500 ml-12 mt-1">
                    {isPublic 
                      ? "Anyone can view this note without requiring special access" 
                      : "Only you can view this note until you make it public"}
                  </p>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={uploading}
                  className={`px-8 py-3 text-[#050505] font-bold bg-white border-[0.2em] border-[#050505] rounded-[0.4em] shadow-[0.2em_0.2em_0_#ff3e00] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#ff3e00] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#ff3e00] transition-all duration-200 ${
                    uploading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {uploading ? (
                    <div className="flex items-center">
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <span>Upload Note</span>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-8 flex justify-center gap-4">
            <Link 
              href="/subjects"
              className="inline-flex items-center justify-center px-5 py-2 text-[#050505] font-bold bg-white border-[0.2em] border-[#050505] rounded-[0.4em] shadow-[0.2em_0.2em_0_#ff3e00] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#ff3e00] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#ff3e00] transition-all duration-200"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
      
      {/* Corner slice */}
      <div className="absolute bottom-0 left-0 w-[2.5em] h-[2.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#050505] rounded-tr-[0.8em] z-[3]" />
    </div>
  );
}