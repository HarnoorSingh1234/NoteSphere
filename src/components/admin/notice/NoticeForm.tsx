'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Loader2, Upload, X } from 'lucide-react';
import { uploadFileToDrive } from '@/lib/client/uploadToDrive';
import { preprocessFileForUpload } from '@/lib/client/file-processing';
import { toast } from 'sonner';

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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="p-4 bg-white border-[0.15em] border-red-500 rounded-md shadow-sm flex items-start">
          <X className="text-red-500 mr-3 mt-0.5" size={20} />
          <div>
            <h4 className="font-bold text-red-500">Error</h4>
            <p className="text-sm text-gray-700">{error}</p>
          </div>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter notice title"
          disabled={uploadingFile}
          required
          className="focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter notice description"
          rows={4}
          disabled={uploadingFile}
          required
          className="focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
      
      {/* File upload section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          File {!editingNotice && <span className="text-red-500">*</span>}
        </label>
        <div 
          className={`border-2 border-dashed ${selectedFile ? 'border-primary-500' : 'border-gray-300'} rounded-lg p-6 text-center bg-white relative cursor-pointer ${uploadingFile ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-50'}`}
        >
          {selectedFile ? (
            <div>
              <FileText className="w-8 h-8 mx-auto text-primary-500 mb-2" />
              <p className="text-gray-700 font-medium">{selectedFile.name}</p>
              <p className="text-gray-500 text-sm">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div>
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600 font-medium">
                {editingNotice ? 'Click to change file (optional)' : 'Click to upload file'}
              </p>
              <p className="text-gray-500 text-sm">PDF, DOCX, PPTX, Images (Max: 50MB)</p>
              
              {editingNotice && (
                <p className="mt-2 text-xs text-primary-500">
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
        </div>
      </div>
      
      {/* Upload Progress */}
      {uploadingFile && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Uploading...</span>
            <span className="text-gray-800 font-medium">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary-500 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="flex gap-2 pt-4">        <Button 
          type="submit" 
          className="bg-[#4d61ff] hover:bg-[#3a4cd1] text-white flex-1"
          disabled={uploadingFile}
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
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          disabled={uploadingFile}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default NoticeForm;
