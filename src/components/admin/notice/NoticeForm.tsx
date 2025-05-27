'use client';

import React, { useState } from 'react';
import { FileText, Loader2, Upload, X, AlertTriangle } from 'lucide-react';
import { uploadFileToDrive } from '@/lib/client/uploadToDrive';
import { preprocessFileForUpload } from '@/lib/client/file-processing';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface Notice {
  id: string;
  title: string;
  description: string;
  driveLink: string;
  driveFileId?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

interface NoticeFormProps {
  editingNotice: Notice | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface NoticeFormData {
  title: string;
  description: string;
  driveLink: string;
  driveFileId?: string;
}

const NoticeForm: React.FC<NoticeFormProps> = ({ 
  editingNotice, 
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<NoticeFormData>({
    title: editingNotice?.title || '',
    description: editingNotice?.description || '',
    driveLink: editingNotice?.driveLink || '',
    driveFileId: editingNotice?.driveFileId || '',
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setError(null); // Clear any error when a new file is selected
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required');
      return;
    }

    // If we're editing and not changing the file, proceed with the existing link
    if (editingNotice && !selectedFile) {
      try {
        const response = await fetch(`/api/admin/notices/${editingNotice.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Failed to update notice');

        toast.success('Notice updated successfully');
        onSuccess();
        onClose();
      } catch (error) {
        toast.error('Failed to update notice');
        console.error(error);
      }
      return;
    }
    
    // For new notices or when changing file in edit mode
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setUploadingFile(true);
    setError(null);
    setUploadProgress(5);
    
    try {
      // Step 1: Preprocess the file (compress if it's a PDF)
      let fileToUpload = selectedFile;
      if (selectedFile.type === 'application/pdf') {
        setUploadProgress(10);
        try {
          fileToUpload = await preprocessFileForUpload(selectedFile);
        } catch (compressionError) {
          console.error('PDF compression failed:', compressionError);
          // Continue with original file if compression fails
        }
      }
      
      setUploadProgress(20);
      
      // Step 2: Request upload URL from backend
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
        throw new Error(data.error || 'Failed to initialize upload');
      }
      
      setUploadProgress(30);
      
      // Step 3: Upload file using the URL
      const { uploadUrl, fileId, downloadUrl } = data;
      const uploadResult = await uploadFileToDrive(fileToUpload, uploadUrl, fileId);
      
      if (!uploadResult.success) {
        throw new Error('File upload to Google Drive failed');
      }
      
      setUploadProgress(70);
      
      // Step 4: Create or update notice with file info
      const noticeData = {
        ...formData,
        driveLink: uploadResult.downloadUrl || downloadUrl,
        driveFileId: uploadResult.fileId || fileId,
      };
      
      const url = editingNotice ? `/api/admin/notices/${editingNotice.id}` : '/api/admin/notices';
      const method = editingNotice ? 'PATCH' : 'POST';
      
      const noticeResponse = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noticeData),
      });

      if (!noticeResponse.ok) {
        const errorData = await noticeResponse.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save notice');
      }

      setUploadProgress(100);
      toast.success(editingNotice ? 'Notice updated successfully' : 'Notice created successfully');
      
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save notice');
      toast.error('Failed to save notice');
      console.error(error);
    } finally {
      setUploadingFile(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-[#DE5499]/10 border-[0.15em] border-[#DE5499] rounded-[0.4em] flex items-start"
        >
          <AlertTriangle className="text-[#DE5499] mr-3 mt-0.5" size={20} />
          <div>
            <h4 className="font-bold text-[#DE5499]">Error</h4>
            <p className="text-sm text-[#264143]">{error}</p>
          </div>
        </motion.div>
      )}
      
      <div className="space-y-2">
        <label className="block text-[#264143] font-medium">Title</label>
        <input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter notice title"
          disabled={uploadingFile}
          required
          className="w-full px-4 py-2.5 bg-white border-[0.15em] border-[#264143] rounded-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#7BB4B1] placeholder-[#264143]/50 text-[#264143]"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-[#264143] font-medium">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter notice description"
          rows={4}
          disabled={uploadingFile}
          required
          className="w-full px-4 py-2.5 bg-white border-[0.15em] border-[#264143] rounded-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#7BB4B1] placeholder-[#264143]/50 text-[#264143]"
        />
      </div>
      
      {/* File upload section */}
      <div className="space-y-2">
        <label className="block text-[#264143] font-medium">
          File {!editingNotice && <span className="text-[#DE5499]">*</span>}
        </label>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`border-[0.15em] border-dashed ${selectedFile ? 'border-[#7BB4B1]' : 'border-[#264143]/40'} rounded-[0.5em] p-6 text-center bg-white relative cursor-pointer ${uploadingFile ? 'opacity-70 cursor-not-allowed' : 'hover:border-[#264143]'}`}
        >
          {selectedFile ? (
            <div>
              <FileText className="w-10 h-10 mx-auto text-[#7BB4B1] mb-2" />
              <p className="text-[#264143] font-medium">{selectedFile.name}</p>
              <p className="text-[#264143]/70 text-sm">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div>
              <Upload className="w-10 h-10 mx-auto text-[#264143]/50 mb-2" />
              <p className="text-[#264143] font-medium">
                {editingNotice ? 'Click to change file (optional)' : 'Click to upload file'}
              </p>
              <p className="text-[#264143]/70 text-sm">PDF, DOCX, PPTX, Images (Max: 50MB)</p>
              
              {editingNotice && (
                <p className="mt-2 text-xs text-[#7BB4B1]">
                  Current file will be kept if no new file is selected
                </p>
              )}
            </div>
          )}
          <input
            type="file"
            onChange={handleFileChange}
            disabled={uploadingFile}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
          />
        </motion.div>
      </div>
      
      {/* Upload Progress */}
      {uploadingFile && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2"
        >
          <div className="flex justify-between text-sm">
            <span className="text-[#264143]/70 font-medium">Uploading...</span>
            <span className="text-[#264143] font-bold">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-[#EDDCD9]/40 rounded-full h-2.5 overflow-hidden border-[0.1em] border-[#264143]/20">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: `${uploadProgress}%` }}
              className="bg-[#7BB4B1] h-2.5 rounded-full" 
            />
          </div>
        </motion.div>
      )}
      
      <div className="flex gap-3 pt-4">
        <motion.button 
          type="submit" 
          className="px-5 py-2.5 bg-[#7BB4B1] text-white font-bold rounded-[0.4em] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#264143] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#264143] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#264143] transition-all duration-200 flex-1 flex items-center justify-center"
          disabled={uploadingFile}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
        >
          {uploadingFile ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : editingNotice ? (
            'Update Notice'
          ) : (
            'Create Notice'
          )}
        </motion.button>
        <motion.button 
          type="button" 
          onClick={onClose}
          disabled={uploadingFile}
          className="px-5 py-2.5 bg-white text-[#264143] font-bold rounded-[0.4em] border-[0.2em] border-[#264143] hover:bg-[#EDDCD9]/40 hover:translate-y-[-0.1em] hover:shadow-[0.2em_0.2em_0_rgba(0,0,0,0.1)] active:translate-y-[0.05em] active:shadow-none transition-all duration-200"
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
        >
          Cancel
        </motion.button>
      </div>
    </form>
  );
};

export default NoticeForm;