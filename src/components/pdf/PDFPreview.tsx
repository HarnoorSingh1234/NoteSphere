'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface PDFPreviewProps {
  file: File | null;
  className?: string;
}

/**
 * Component to preview a PDF file before uploading
 */
const PDFPreview: React.FC<PDFPreviewProps> = ({ file, className = '' }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    
    // Only handle PDF files
    if (file.type !== 'application/pdf') {
      setError('Not a PDF file');
      setPreviewUrl(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Create a URL for the file
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    setLoading(false);
    
    // Clean up the URL object when component unmounts
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [file]);
  
  if (!file) {
    return null;
  }
  
  if (loading) {
    return (
      <div className={`flex items-center justify-center p-6 bg-[#EDDCD9]/30 border-[0.15em] border-[#264143] rounded-[0.4em] ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-[#264143]" />
      </div>
    );
  }
  
  if (error || !previewUrl) {
    return (
      <div className={`flex items-center justify-center p-6 bg-[#EDDCD9]/30 border-[0.15em] border-[#264143] rounded-[0.4em] ${className}`}>
        <div className="flex items-center text-[#DE5499]">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error || 'Cannot preview this file'}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`border-[0.15em] border-[#264143] rounded-[0.4em] overflow-hidden ${className}`}>
      <div className="bg-[#264143] text-white px-3 py-1.5 text-sm font-medium">
        PDF Preview
      </div>
      <iframe 
        src={previewUrl}
        className="w-full h-[300px] border-0"
        title="PDF Preview"
      />
    </div>
  );
};

export default PDFPreview;
