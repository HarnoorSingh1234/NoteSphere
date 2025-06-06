'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, X, Loader2, CheckCircle, Tag, Plus, AlignLeft } from 'lucide-react';
import { NoteType } from '@prisma/client';
import { uploadFileToDrive } from '@/lib/client/uploadToDrive';
import { preprocessFileForUpload } from '@/lib/client/file-processing';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadNoteProps {
  subjectId: string;
  googleAuthUrl: string | null;
  setGoogleAuthUrl: (url: string | null) => void;
}

const UploadNoteDialog: React.FC<UploadNoteProps> = ({ subjectId, googleAuthUrl, setGoogleAuthUrl }) => {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState<NoteType>(NoteType.PDF);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  // Sample tags for quick selection
  const sampleTags = ['MST', 'SEC A', 'SEC B', 'SEC C', 'SEC D'];
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setError(null); // Clear any error when a new file is selected
      
      // Auto-detect note type based on file extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'pdf') {
        setNoteType(NoteType.PDF);
      } else if (extension === 'ppt' || extension === 'pptx') {
        setNoteType(NoteType.PPT);
      }
    }
  };
  
  // Handle adding and removing tags
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Add a sample tag to the current tags list
  const addSampleTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };
  
  // Connect to Google account when user clicks the connect button
  const connectGoogleAccount = () => {
    if (googleAuthUrl) {
      window.location.href = googleAuthUrl;
    }
  };
  
  // Handle dialog open/close
  const openDialog = () => {
    setIsOpen(true);
    // Prevent scrolling on the body when dialog is open
    document.body.style.overflow = 'hidden';
  };
    const closeDialog = () => {
    if (!uploadingFile) {
      setIsOpen(false);
      // Re-enable scrolling when dialog closes
      document.body.style.overflow = 'auto';
      setTimeout(() => {
        // Reset all form fields and state
        setError(null);
        setSuccess(false);
        setSelectedFile(null);
        setNoteTitle('');
        setNoteContent('');
        setTags([]);
        setNewTag('');
        setUploadProgress(0);
      }, 300);
    }
  };
  
  // Clean up body overflow style when component unmounts or dialog closes
  useEffect(() => {
    // When component unmounts, ensure we reset the body overflow
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  // Effect to manage body overflow based on dialog state
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  // Handle click outside to close dialog
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node) && !uploadingFile) {
      closeDialog();
    }
  };

  // Handle upload button click
  const handleUploadClick = async () => {
    if (!selectedFile || !noteTitle) {
      setError("Please provide both a title and a file");
      return;
    }
    
    try {
      setError(null);
      setUploadingFile(true);
      setUploadProgress(5);
      
      // Preprocess the file (compress if it's a PDF)
      let fileToUpload = selectedFile;
      if (selectedFile.type === 'application/pdf') {
        setUploadProgress(10);
        console.log('Processing PDF file before upload...');
        try {
          fileToUpload = await preprocessFileForUpload(selectedFile);
          console.log(`PDF processed: Original size: ${selectedFile.size} bytes, New size: ${fileToUpload.size} bytes`);
          
          // Show compression details
          const compressionRatio = ((1 - (fileToUpload.size / selectedFile.size)) * 100).toFixed(1);
          console.log(`Compression ratio: ${compressionRatio}% reduction`);
          
        } catch (compressionError) {
          console.error('PDF compression failed:', compressionError);
          // Continue with original file if compression fails
          console.log('Continuing with original uncompressed file');
        }
      }
      
      setUploadProgress(20);
      
      // Step 1: Request upload URL from our backend
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: fileToUpload.name,
          mimeType: fileToUpload.type
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.needsAuth && data.authUrl) {
          // Store the Google Auth URL for the user to connect their account
          setGoogleAuthUrl(data.authUrl);
          setUploadingFile(false);
          return;
        }
        throw new Error(data.error || 'Failed to initialize upload');
      }
      
      setUploadProgress(30);
      
      // Step 2: Upload file using the URL
      const { uploadUrl, fileId, downloadUrl } = data;
      const uploadResult = await uploadFileToDrive(fileToUpload, uploadUrl, fileId);
      
      if (!uploadResult.success) {
        throw new Error('File upload to Google Drive failed');
      }
      
      setUploadProgress(70);
      
      // Step 3: Create note record in our database
      const noteResponse = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: noteTitle,
          content: noteContent, // Include content field
          type: noteType,
          fileUrl: uploadResult.downloadUrl || downloadUrl, // Store the download URL
          driveFileId: uploadResult.fileId || fileId, // Also store the fileId for future reference
          subjectId: subjectId,
          isPublic: true,
          tags: tags // Add tags to the request
        })
      });
      
      if (!noteResponse.ok) {
        // Try to get more detailed error information
        const errorData = await noteResponse.json().catch(() => ({}));
        console.error('Note creation failed:', noteResponse.status, errorData);
        throw new Error(errorData.error || 'Failed to create note record');
      }
      
      setUploadProgress(100);
      setSuccess(true);
      
      // Close dialog and refresh the page
      setTimeout(() => {
        setIsOpen(false);
        router.refresh();
        
        // Reset form
        setTimeout(() => {
          setSelectedFile(null);
          setNoteTitle('');
          setNoteContent('');
          setUploadingFile(false);
          setSuccess(false);
          setUploadProgress(0);
          setTags([]);
          setNewTag('');
        }, 300);
      }, 1500);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploadingFile(false);
      setUploadProgress(0);
    }
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };
  
  const dialogVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    exit: { 
      scale: 0.95, 
      opacity: 0, 
      transition: { duration: 0.2 } 
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openDialog}
        className="w-full px-5 py-3 text-white font-bold bg-[#DE5499] border-[0.25em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#264143] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#264143] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#264143] transition-all duration-200 flex items-center justify-center"
      >
        <Upload className="w-5 h-5 mr-2" /> Upload Notes
      </button>
      
      {/* Modal Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-hidden"
            onClick={handleBackdropClick}
          >
            {/* Modal Content */}
            <motion.div
              ref={dialogRef}
              variants={dialogVariants}
              className="bg-[#F9F5F2] border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#DE5499] w-full max-w-xl mx-auto overflow-hidden relative z-[101]"
              onClick={e => e.stopPropagation()}
            >
              {/* Corner slice */}
              <div className="absolute bottom-0 left-0 w-[1.2em] h-[1.2em] bg-[#F9F5F2] border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
              
              {/* Header */}              <div className="border-b-[0.25em] border-[#264143] p-4 flex justify-between items-center bg-[#DE5499] text-white">
                <h2 className="text-xl font-bold">Share Your Knowledge</h2>
                {!uploadingFile && (
                  <motion.button 
                    onClick={closeDialog}
                    className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close dialog"
                  >
                    <X size={20} />
                  </motion.button>
                )}
              </div>
              
              {/* Body */}
              <div className="p-6 space-y-5 max-h-[calc(80vh-120px)] overflow-y-auto">
                {/* Connection error message - only show when needed */}
                {googleAuthUrl && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white border-[0.25em] border-[#7BB4B1] rounded-[0.4em] shadow-[0.2em_0.2em_0_#7BB4B1] mb-4"
                  >
                    <h3 className="font-bold text-[#264143] mb-2">Connect Google Drive</h3>
                    <p className="text-[#264143]/80 text-sm mb-3">
                      Please connect your Google Drive account to upload files.
                    </p>
                    <button 
                      onClick={connectGoogleAccount} 
                      className="px-4 py-2 text-white font-bold bg-[#7BB4B1] border-[0.25em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#264143] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#264143] transition-all duration-200"
                    >
                      Connect Google Drive
                    </button>
                  </motion.div>
                )}                  {/* Success Message */}
                <AnimatePresence>
                  {success && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="p-4 bg-white border-[0.25em] border-[#7BB4B1] rounded-[0.4em] shadow-[0.2em_0.2em_0_#7BB4B1] flex items-start"
                    >
                      <CheckCircle className="text-[#7BB4B1] mr-3 mt-0.5" size={20} />
                      <div>
                        <h4 className="font-bold text-[#264143]">Upload Successful!</h4>
                        <p className="text-sm text-[#264143]/80">Your note has been uploaded and will be reviewed shortly</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Publication Notice */}
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white border-[0.15em] border-[#E99F4C] rounded-[0.4em] shadow-[0.2em_0.2em_0_rgba(0,0,0,0.05)] flex items-start"
                >
                  <div className="bg-[#E99F4C]/20 p-1.5 rounded-full mr-3 mt-0.5">
                    <FileText className="text-[#E99F4C]" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#264143]">Note Publication</h4>
                    <p className="text-sm text-[#264143]/80">
                      Your note will be published immediately after verification by Admin and available to other students.
                    </p>
                  </div>
                </motion.div>
                
                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="p-4 bg-white border-[0.25em] border-[#DE5499] rounded-[0.4em] shadow-[0.2em_0.2em_0_#DE5499] flex items-start"
                    >
                      <X className="text-[#DE5499] mr-3 mt-0.5" size={20} />
                      <div>
                        <h4 className="font-bold text-[#264143]">Upload Failed</h4>
                        <p className="text-sm text-[#264143]/80">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-6">
                  {/* Title Input */}
                  <div className="space-y-2">
                    <label className="block text-[#264143] font-medium">Note Title <span className="text-[#DE5499]">*</span></label>
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      disabled={uploadingFile}
                      className="w-full p-3 text-[#264143] bg-white border-[0.25em] border-[#264143] rounded-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#DE5499] shadow-[0.15em_0.15em_0_#E99F4C] placeholder-[#264143]/40 transition-shadow duration-200"
                      placeholder="Enter a descriptive title for your notes"
                    />
                  </div>
                  
                  {/* Note Content */}
                  <div className="space-y-2">
                    <label className="text-[#264143] font-medium flex items-center">
                      <AlignLeft className="w-4 h-4 mr-1" /> 
                      Description
                    </label>
                    <textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      disabled={uploadingFile}
                      className="w-full p-3 text-[#264143] bg-white border-[0.25em] border-[#264143] rounded-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#DE5499] shadow-[0.15em_0.15em_0_#E99F4C] min-h-[100px] placeholder-[#264143]/40 transition-shadow duration-200"
                      placeholder="Add a brief description or summary of these notes"
                    />
                  </div>
                  
                  {/* Tags */}
                  <div className="space-y-2">
                    <label className="text-[#264143] font-medium flex items-center">
                      <Tag className="w-4 h-4 mr-1" />
                      Tags
                    </label>                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag) => (
                        <motion.div 
                          key={tag} 
                          className="bg-[#EDDCD9] text-[#264143] px-3 py-1 rounded-full flex items-center border-[0.1em] border-[#264143]"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        >
                          <span className="font-medium">{tag}</span>
                          <button 
                            type="button" 
                            className="ml-1 text-[#264143] hover:text-[#DE5499]"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <X size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                         {/* Sample Tags */}
                    <div className="mt-4">
                      <p className="text-sm text-[#264143]/70 mb-2">Suggested tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {sampleTags.map((tag) => (
                          <motion.button
                            key={tag}
                            onClick={() => addSampleTag(tag)}
                            disabled={tags.includes(tag) || uploadingFile}
                            className={`px-2 py-1 text-xs rounded-full transition-all duration-200 border-[0.1em] ${
                              tags.includes(tag)
                                ? 'bg-[#EDDCD9]/50 text-[#264143]/50 border-[#264143]/20 cursor-not-allowed'
                                : 'bg-[#EDDCD9]/80 text-[#264143] border-[#264143]/30 hover:border-[#264143] hover:bg-[#EDDCD9]'
                            }`}
                            whileHover={!tags.includes(tag) ? { scale: 1.05 } : {}}
                            whileTap={!tags.includes(tag) ? { scale: 0.95 } : {}}
                          >
                            {tag}
                          </motion.button>
                        ))}
                      </div>
                    </div>               
                    <div className="flex">
                      <input
                        type="text"
                        className="flex-grow p-3 text-[#264143] border-[0.25em] border-[#264143] border-r-0 rounded-l-[0.4em] bg-white focus:outline-none focus:ring-2 focus:ring-[#DE5499] shadow-[0.15em_0.15em_0_#E99F4C] placeholder-[#264143]/40 transition-shadow duration-200"
                        placeholder="Add tags (e.g., midterm, chapter1)"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      />
                      <button
                        type="button"
                        className="bg-[#7BB4B1] text-white px-4 py-3 border-[0.25em] border-[#264143] rounded-r-[0.4em] shadow-[0.15em_0.15em_0_#E99F4C] flex items-center hover:bg-[#6ba3a0] transition-colors duration-200"
                        onClick={handleAddTag}
                      >
                        <Plus size={18} />
                      </button>
                    </div>

               
                  </div>
                  
                  {/* Note Type Selector */}
                  <div className="space-y-2">
                    <label className="block text-[#264143] font-medium">Note Type <span className="text-[#DE5499]">*</span></label>
                    <div className="flex gap-2 flex-wrap">
                      {Object.values(NoteType).map((type) => (
                        <motion.button
                          key={type}
                          type="button"
                          onClick={() => setNoteType(type as NoteType)}
                          className={`px-3 py-3 rounded-[0.4em] border-[0.25em] flex-1 font-medium transition-all duration-200 ${
                            noteType === type 
                              ? 'bg-[#DE5499] text-white border-[#264143] shadow-[0.15em_0.15em_0_#264143]' 
                              : 'bg-white text-[#264143] border-[#264143]/30 hover:border-[#264143] hover:shadow-[0.1em_0.1em_0_#E99F4C]'
                          }`}
                          whileHover={{ scale: noteType !== type ? 1.03 : 1 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          {type}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  {/* File Upload */}
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: uploadingFile ? 0.7 : 1 }}
                  >
                    <label className="block text-[#264143] font-medium">File <span className="text-[#DE5499]">*</span></label>
                    <div className={`border-[0.25em] border-dashed ${selectedFile ? 'border-[#DE5499]' : 'border-[#264143]'} rounded-[0.4em] p-6 text-center bg-white relative cursor-pointer transition-all duration-200 ${uploadingFile ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#EDDCD9]/10'} ${selectedFile ? 'shadow-[0.15em_0.15em_0_#DE5499]' : 'shadow-[0.15em_0.15em_0_#264143]'}`}>
                      {selectedFile ? (
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                          <FileText className="w-8 h-8 mx-auto text-[#DE5499] mb-2" />
                          <p className="text-[#264143] font-medium">{selectedFile.name}</p>
                          <p className="text-[#264143]/70 text-sm">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </motion.div>
                      ) : (
                        <div>
                          <Upload className="w-8 h-8 mx-auto text-[#264143]/70 mb-2" />
                          <p className="text-[#264143]/80 font-medium">Click or drag file to upload</p>
                          <p className="text-[#264143]/60 text-sm">PDF, DOCX, PPTX (Max: 50MB)</p>
                        </div>
                      )}
                      <input
                        type="file"
                        onChange={handleFileChange}
                        disabled={uploadingFile}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                      />
                    </div>
                  </motion.div>

                  {/* Upload Progress */}
                  <AnimatePresence>
                    {uploadingFile && (
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="flex justify-between text-sm">
                          <span className="text-[#264143]/80">Uploading...</span>
                          <span className="text-[#264143] font-medium">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-[#264143]/10 rounded-full h-3 overflow-hidden border border-[#264143]/20">
                          <motion.div 
                            className="bg-[#DE5499] h-full rounded-full transition-all"
                            initial={{ width: "0%" }}
                            animate={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer */}              <div className="border-t-[0.25em] border-[#264143] p-4 flex justify-end gap-2 bg-white">
                {!uploadingFile && !success && (
                  <motion.button 
                    onClick={closeDialog}
                    type="button"
                    className="px-4 py-2 text-[#264143] font-bold bg-white border-[0.25em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#E99F4C] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#E99F4C] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#E99F4C] transition-all duration-200"
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 1 }}
                  >
                    Cancel
                  </motion.button>
                )}
                
                <motion.button
                  onClick={handleUploadClick}
                  disabled={!selectedFile || !noteTitle || uploadingFile || success}
                  className={`px-5 py-2 text-white font-bold bg-[#DE5499] border-[0.25em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#264143] flex items-center ${
                    !selectedFile || !noteTitle || uploadingFile || success
                      ? 'opacity-70 cursor-not-allowed'
                      : 'hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#264143] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#264143]'
                  } transition-all duration-200`}
                  whileHover={!(!selectedFile || !noteTitle || uploadingFile || success) ? { y: -2 } : {}}
                  whileTap={!(!selectedFile || !noteTitle || uploadingFile || success) ? { y: 1 } : {}}
                >
                  {uploadingFile ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete!
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Notes
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UploadNoteDialog;