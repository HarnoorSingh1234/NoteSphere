'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, X, Loader2, CheckCircle, Tag, Plus, AlignLeft } from 'lucide-react';
import { NoteType } from '@prisma/client';
import { uploadFileToDrive } from '@/lib/client/uploadToDrive';
import { preprocessFileForUpload } from '@/lib/client/file-processing';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
        setError(null);
        setSuccess(false);
        setTags([]);
        setNewTag('');
        setNoteContent('');
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

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openDialog}
        className="w-full px-5 py-3 text-white font-bold bg-[#DE5499] border-[0.15em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#264143] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#264143] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#264143] transition-all duration-200 flex items-center justify-center"
      >
        <Upload className="w-5 h-5 mr-2" /> Upload Notes
      </button>      {/* Modal Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-hidden"
          onClick={handleBackdropClick}
        >
          {/* Modal Content */}          <motion.div
            ref={dialogRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-[#F8F5F2] border-[0.2em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#DE5499] w-full max-w-xl mx-auto overflow-hidden relative z-[101]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b-[0.15em] border-[#264143] p-4 flex justify-between items-center bg-[#e34282] text-white">
              <h2 className="text-xl font-bold">Share Your Knowledge</h2>
              {!uploadingFile && (
                <button 
                  onClick={closeDialog}
                  className="text-white hover:text-[#DE5499] transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>            {/* Body */}
            <div className="p-6 space-y-5 max-h-[calc(80vh-120px)] overflow-y-auto">
              {/* Connection error message - only show when needed */}
              {googleAuthUrl && (
                <div className="p-4 bg-white border-[0.15em] border-[#4d61ff] rounded-[0.4em] shadow-[0.2em_0.2em_0_#4d61ff] mb-4">
                  <h3 className="font-bold text-[#264143] mb-2">Connect Google Drive</h3>
                  <p className="text-[#264143]/80 text-sm mb-3">
                    Please connect your Google Drive account to upload files.
                  </p>
                  <button 
                    onClick={connectGoogleAccount} 
                    className="px-4 py-2 text-white font-bold bg-[#4d61ff] border-[0.15em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#264143] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#264143] transition-all duration-200"
                  >
                    Connect Google Drive
                  </button>
                </div>
              )}
              
              {/* Success Message */}
              {success && (
                <div className="p-4 bg-white border-[0.15em] border-green-600 rounded-[0.4em] shadow-[0.2em_0.2em_0_green-600] flex items-start">
                  <CheckCircle className="text-green-600 mr-3 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-bold text-green-700">Upload Successful!</h4>
                    <p className="text-sm text-green-600">Your note has been uploaded and will be reviewed shortly</p>
                  </div>
                </div>
              )}
              
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-white border-[0.15em] border-[#ff3e00] rounded-[0.4em] shadow-[0.2em_0.2em_0_#ff3e00] flex items-start">
                  <X className="text-[#ff3e00] mr-3 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-bold text-[#ff3e00]">Upload Failed</h4>
                    <p className="text-sm text-[#264143]/80">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <label className="block text-[#264143] font-medium">Note Title <span className="text-[#ff3e00]">*</span></label>
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    disabled={uploadingFile}
                    className="w-full p-3 text-black bg-white border-[0.15em] border-[#264143] rounded-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#DE5499] shadow-[0.1em_0.1em_0_#264143]"
                    placeholder="Enter a descriptive title for your notes"
                  />
                </div>
                
                {/* Note Content */}
                <div className="space-y-2">
                  <label className=" text-[#264143] font-medium flex items-center">
                    <AlignLeft className="w-4 h-4 mr-1" /> 
                    Description
                  </label>
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    disabled={uploadingFile}
                    className="w-full p-3 text-black bg-white border-[0.15em] border-[#264143] rounded-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#DE5499] shadow-[0.1em_0.1em_0_#264143] min-h-[100px]"
                    placeholder="Add a brief description or summary of these notes"
                  />
                </div>
                
                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-[#264143] font-medium flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <div 
                        key={tag} 
                        className="bg-[#4d61ff]/10 text-[#4d61ff] px-3 py-1 rounded-full flex items-center"
                      >
                        <span>{tag}</span>
                        <button 
                          type="button" 
                          className="ml-1 text-[#4d61ff] hover:text-[#264143]"
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
                      className="flex-grow p-3 text-black border-[0.15em] border-[#264143] border-r-0 rounded-l-[0.4em] bg-white focus:outline-none focus:ring-2 focus:ring-[#DE5499] shadow-[0.1em_0.1em_0_#264143]"
                      placeholder="Add tags (e.g., midterm, chapter1)"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <button
                      type="button"
                      className="bg-[#4d61ff] text-white px-4 py-3 border-[0.15em] border-[#264143] rounded-r-[0.4em] shadow-[0.1em_0.1em_0_#264143] flex items-center"
                      onClick={handleAddTag}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                
                {/* Note Type Selector */}
                <div className="space-y-2 ">
                  <label className="block text-[#264143] font-medium">Note Type <span className="text-[#ff3e00]">*</span></label>
                  <div className="flex gap-2 flex-wrap">
                    {Object.values(NoteType).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNoteType(type as NoteType)}
                        className={`px-3 py-3 rounded-[0.4em] border-[0.15em] flex-1 font-medium transition-all ${
                          noteType === type 
                            ? 'bg-pink-500 text-white border-pink-400' 
                            : 'bg-white text-[#264143] border-pink-500 hover:border-pink-400'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* File Upload */}
                <div className="space-y-2">
                  <label className="block text-[#264143] font-medium">File <span className="text-[#ff3e00]">*</span></label>
                  <div className={`border-[0.15em] border-dashed ${selectedFile ? 'border-[#DE5499]' : 'border-[#264143]'} rounded-[0.4em] p-6 text-center bg-white relative cursor-pointer ${uploadingFile ? 'opacity-70 cursor-not-allowed' : 'hover:bg-white/80'}`}>
                    {selectedFile ? (
                      <div>
                        <FileText className="w-8 h-8 mx-auto text-[#DE5499] mb-2" />
                        <p className="text-[#264143] font-medium">{selectedFile.name}</p>
                        <p className="text-[#264143]/70 text-sm">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
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
                </div>

                {/* Upload Progress */}
                {uploadingFile && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#264143]/80">Uploading...</span>
                      <span className="text-[#264143] font-medium">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-[#264143]/10 rounded-full h-2.5">
                      <div 
                        className="bg-[#DE5499] h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t-[0.15em] border-[#264143] p-4 flex justify-end gap-2 bg-white/20">
              {!uploadingFile && !success && (
                <button 
                  onClick={closeDialog}
                  className="px-4 py-2 text-[#264143] font-bold bg-white border-[0.15em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#264143] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#264143] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#264143] transition-all duration-200"
                >
                  Cancel
                </button>
              )}
              
              <button
                onClick={handleUploadClick}
                disabled={!selectedFile || !noteTitle || uploadingFile || success}
                className={`px-5 py-2 text-white font-bold bg-[#DE5499] border-[0.15em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#264143] flex items-center ${
                  !selectedFile || !noteTitle || uploadingFile || success
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#264143] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#264143]'
                } transition-all duration-200`}
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
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default UploadNoteDialog;