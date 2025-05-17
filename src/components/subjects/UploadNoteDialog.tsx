'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2, CheckCircle } from 'lucide-react';
import { NoteType } from '@prisma/client';
import GoogleDriveConnect from '@/components/GoogleDriveConnect';
import { uploadFileToDrive } from '@/lib/uploadtoDrive';
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
  const [noteType, setNoteType] = useState<NoteType>(NoteType.PDF);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null); // Clear any error when a new file is selected
    }
  };
  
  // Connect to Google account when user clicks the connect button
  const connectGoogleAccount = () => {
    if (googleAuthUrl) {
      window.location.href = googleAuthUrl;
    }
  };
  
  // Handle dialog open/close
  const openDialog = () => setIsOpen(true);
  const closeDialog = () => {
    if (!uploadingFile) {
      setIsOpen(false);
      setTimeout(() => {
        setError(null);
        setSuccess(false);
      }, 300);
    }
  };

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
      setUploadProgress(10);
      
      // Step 1: Request upload URL from our backend
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: selectedFile.name,
          mimeType: selectedFile.type
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
      const uploadResult = await uploadFileToDrive(selectedFile, uploadUrl, fileId);
      
      if (!uploadResult.success) {
        throw new Error('File upload to Google Drive failed');
      }
      
      setUploadProgress(70);
        // Step 3: Create note record in our database
      console.log('Creating note record in database...');
      const noteResponse = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: noteTitle,
          content: '', // Empty content for PDF uploads
          type: noteType,
          fileUrl: uploadResult.downloadUrl || downloadUrl, // Store the download URL
          driveFileId: uploadResult.fileId || fileId, // Also store the fileId for future reference
          subjectId: subjectId,
          isPublic: true
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
          setUploadingFile(false);
          setSuccess(false);
          setUploadProgress(0);
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
        className="w-full px-5 py-3 text-white font-bold bg-[#DE5499] border-[0.15em] border-[#050505] rounded-[0.4em] shadow-[0.2em_0.2em_0_#050505] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#050505] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#050505] transition-all duration-200 flex items-center justify-center"
      >
        <Upload className="w-5 h-5 mr-2" /> Upload Notes
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          {/* Modal Content */}
          <motion.div
            ref={dialogRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-[#EDDCD9] border-[0.2em] border-[#050505] rounded-[0.6em] shadow-[0.4em_0.4em_0_#050505] w-full max-w-md mx-auto overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b-[0.15em] border-[#050505] p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#050505]">Upload Notes</h2>
              {!uploadingFile && (
                <button 
                  onClick={closeDialog}
                  className="text-[#050505] hover:text-[#ff3e00] transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Google Drive connection status */}
              {googleAuthUrl ? (
                <div className="p-4 bg-white border-[0.15em] border-[#050505] rounded-[0.4em] shadow-[0.2em_0.2em_0_#4d61ff] mb-4">
                  <h3 className="font-bold text-[#050505] mb-2">Connect Google Drive</h3>
                  <p className="text-[#050505]/80 text-sm mb-3">
                    Please connect your Google Drive account to upload files.
                  </p>
                  <button 
                    onClick={connectGoogleAccount} 
                    className="px-4 py-2 text-white font-bold bg-[#4d61ff] border-[0.15em] border-[#050505] rounded-[0.4em] shadow-[0.2em_0.2em_0_#050505] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#050505] transition-all duration-200"
                  >
                    Connect Google Drive
                  </button>
                </div>
              ) : (
                <GoogleDriveConnect onConnected={() => setGoogleAuthUrl(null)} />
              )}
              
              {/* Success Message */}
              {success && (
                <div className="p-4 bg-white border-[0.15em] border-green-600 rounded-[0.4em] shadow-[0.2em_0.2em_0_green-700] flex items-start">
                  <CheckCircle className="text-green-600 mr-3 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-bold text-green-700">Upload Successful!</h4>
                    <p className="text-sm text-green-600">Your note has been uploaded successfully</p>
                  </div>
                </div>
              )}
              
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-white border-[0.15em] border-[#ff3e00] rounded-[0.4em] shadow-[0.2em_0.2em_0_#ff3e00] flex items-start">
                  <X className="text-[#ff3e00] mr-3 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-bold text-[#ff3e00]">Upload Failed</h4>
                    <p className="text-sm text-[#050505]/80">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {/* Title Input */}
                <div className="space-y-2">
                  <label className="block text-[#050505] font-medium">Note Title</label>
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    disabled={uploadingFile}
                    className="w-full p-3 bg-white border-[0.15em] border-[#050505] rounded-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#DE5499] shadow-[0.1em_0.1em_0_#050505]"
                    placeholder="Enter note title"
                  />
                </div>
                
                {/* Note Type Selector */}
                <div className="space-y-2">
                  <label className="block text-[#050505] font-medium">Note Type</label>
                  <select
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value as NoteType)}
                    disabled={uploadingFile}
                    className="w-full p-3 bg-white border-[0.15em] border-[#050505] rounded-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#DE5499] shadow-[0.1em_0.1em_0_#050505] appearance-none"
                    style={{ 
                      backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23050505' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                      backgroundPosition: "right 0.5rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em 1.5em",
                      paddingRight: "2.5rem"
                    }}
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="LECTURE">Lecture Notes</option>
                    <option value="HANDWRITTEN">Handwritten Notes</option>
                    <option value="PPT">Presentation</option>
                  </select>
                </div>
                
                {/* File Upload */}
                <div className="space-y-2">
                  <label className="block text-[#050505] font-medium">File</label>
                  <div className={`border-[0.15em] border-dashed ${selectedFile ? 'border-[#DE5499]' : 'border-[#050505]'} rounded-[0.4em] p-6 text-center bg-white relative cursor-pointer ${uploadingFile ? 'opacity-70 cursor-not-allowed' : 'hover:bg-white/80'}`}>
                    {selectedFile ? (
                      <div>
                        <FileText className="w-8 h-8 mx-auto text-[#DE5499] mb-2" />
                        <p className="text-[#050505] font-medium">{selectedFile.name}</p>
                        <p className="text-[#050505]/70 text-sm">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 mx-auto text-[#050505]/70 mb-2" />
                        <p className="text-[#050505]/80 font-medium">Click or drag file to upload</p>
                        <p className="text-[#050505]/60 text-sm">PDF, DOCX, PPTX (Max: 50MB)</p>
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
                      <span className="text-[#050505]/80">Uploading...</span>
                      <span className="text-[#050505] font-medium">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-[#050505]/10 rounded-full h-2.5">
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
            <div className="border-t-[0.15em] border-[#050505] p-4 flex justify-end gap-2 bg-white/20">
              {!uploadingFile && !success && (
                <button 
                  onClick={closeDialog}
                  className="px-4 py-2 text-[#050505] font-bold bg-white border-[0.15em] border-[#050505] rounded-[0.4em] shadow-[0.2em_0.2em_0_#050505] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#050505] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#050505] transition-all duration-200"
                >
                  Cancel
                </button>
              )}
              
              <button
                onClick={handleUploadClick}
                disabled={!selectedFile || !noteTitle || uploadingFile || success}
                className={`px-5 py-2 text-white font-bold bg-[#DE5499] border-[0.15em] border-[#050505] rounded-[0.4em] shadow-[0.2em_0.2em_0_#050505] flex items-center ${
                  !selectedFile || !noteTitle || uploadingFile || success
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#050505] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#050505]'
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