'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface PDFViewerProps {
  fileUrl: string;
  driveFileId?: string | null;
  title?: string;
  className?: string;
}

/**
 * PDF Viewer component that can render PDFs from various sources
 * - Google Drive files (using the driveFileId)
 * - Direct URLs
 */
const PDFViewer: React.FC<PDFViewerProps> = ({ 
  fileUrl, 
  driveFileId, 
  title = 'Document', 
  className = '' 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
    useEffect(() => {
    const prepareEmbedUrl = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If we have a Google Drive file ID, use the Drive viewer
        if (driveFileId) {
          // Google Drive viewer URL - will work for PDFs
          const googleViewerUrl = `https://drive.google.com/file/d/${driveFileId}/preview`;
          setEmbedUrl(googleViewerUrl);
        } else if (fileUrl) {
          // Handle non-Drive URLs
          if (fileUrl.includes('drive.google.com')) {
            // Handle Google Drive URLs that might not have driveFileId property set
            const match = fileUrl.match(/[-\w]{25,}/);
            if (match && match[0]) {
              const extractedFileId = match[0];
              const googleViewerUrl = `https://drive.google.com/file/d/${extractedFileId}/preview`;
              setEmbedUrl(googleViewerUrl);
            } else {
              // If we couldn't extract the ID, try using the URL directly
              setEmbedUrl(fileUrl);
            }
          } else {
            // For direct PDF URLs
            setEmbedUrl(fileUrl);
          }
        } else {
          setError('No file source provided');
        }
      } catch (err) {
        console.error('Error preparing PDF for viewing:', err);
        setError('Failed to load PDF');
      } finally {
        setLoading(false);
      }
    };

    prepareEmbedUrl();
  }, [fileUrl, driveFileId]);
  
  // Handle loading state
  if (loading) {
    return (
      <div className={`flex items-center justify-center p-10 bg-[#EDDCD9]/30 border-[0.15em] border-[#264143] rounded-[0.4em] min-h-[400px] ${className}`}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 mx-auto animate-spin text-[#264143]" />
          <p className="mt-4 text-[#264143] font-medium">Loading document...</p>
        </div>
      </div>
    );
  }
    // Handle error state
  if (error || !embedUrl) {
    return (
      <div className={`flex items-center justify-center p-10 bg-[#EDDCD9]/30 border-[0.15em] border-[#264143] rounded-[0.4em] min-h-[400px] ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10 text-red-500">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#264143]">Failed to load PDF</h3>
          <p className="mt-2 text-[#264143]/70">{error || 'Document could not be displayed'}</p>
          
          {/* Provide direct download option */}
          <div className="mt-4">
            <a 
              href={driveFileId ? `https://drive.google.com/uc?export=download&id=${driveFileId}` : fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-white font-medium bg-[#DE5499] border-[0.15em] border-[#264143] rounded-md hover:bg-[#c53d7e] transition-colors"
            >
              Download PDF
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  // Render the PDF
  return (
    <div className={`pdf-viewer-container border-[0.15em] border-[#264143] rounded-[0.4em] overflow-hidden ${className}`}>
      <div className="bg-[#264143] text-white px-4 py-2 font-medium flex items-center justify-between">
        <div className="truncate">{title}</div>
        <a 
          href={driveFileId ? `https://drive.google.com/uc?export=download&id=${driveFileId}` : fileUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs bg-white text-[#264143] px-2 py-1 rounded hover:bg-[#EDDCD9] transition-colors"
        >
          Download
        </a>
      </div>      <iframe 
        src={embedUrl}
        className="w-full min-h-[600px] border-0"
        title={`PDF Viewer - ${title}`}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        onLoad={() => setLoading(false)}
        onError={() => {
          console.error(`Failed to load PDF from URL: ${embedUrl}`);
          setLoading(false);
          setError(`Failed to load document. Please try downloading it instead.`);
        }}
      />
    </div>
  );
};

export default PDFViewer;
