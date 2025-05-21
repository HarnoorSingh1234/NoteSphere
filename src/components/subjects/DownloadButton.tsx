'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface DownloadButtonProps {
  noteId: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ noteId }) => {  const [isDownloading, setIsDownloading] = React.useState(false);
  const downloadTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Cleanup function to clear any pending timeouts
  React.useEffect(() => {
    return () => {
      if (downloadTimeoutRef.current) {
        clearTimeout(downloadTimeoutRef.current);
      }
    };
  }, []);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);      // Validate note ID
      if (!noteId) {
        throw new Error('Missing note ID');
      }
      
      // Proceed directly to the file download endpoint
      const downloadWindow = window.open(`/api/notes/${noteId}/download-file`, '_blank');
      
      // Check if the window was blocked by popup blockers
      if (!downloadWindow || downloadWindow.closed || typeof downloadWindow.closed === 'undefined') {
        console.warn('Download window may have been blocked by a popup blocker');
        toast({
          title: "Download may be blocked",
          description: "Please allow popups for this site and try again",
          variant: "destructive",
          duration: 5000,
        });
        return;
      }
        // Show success toast
      toast({
        title: "Download started",
        description: "Your file should begin downloading shortly",
        duration: 3000,
      });
        // Set a timeout to detect potential download issues
      if (downloadTimeoutRef.current) {
        clearTimeout(downloadTimeoutRef.current);
      }
      
      downloadTimeoutRef.current = setTimeout(() => {
        // Check if download still seems to be in progress after a reasonable timeout
        if (isDownloading) {
          toast({
            title: "Download taking longer than expected",
            description: "If your file doesn't appear, please try again",
            duration: 5000,
          });
          setIsDownloading(false);
        }
      }, 10000); 
    } catch (error) {
      console.error('Error handling download:', error);
      
    
      let errorMessage = "Unexpected error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Check for specific error types to provide more helpful messages
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (errorMessage.includes('not found')) {
        errorMessage = "The requested file could not be found.";
      } else if (errorMessage.includes('permission')) {
        errorMessage = "You don't have permission to access this file.";
      }
      
      toast({
        title: "Download failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });    } finally {
      // Clear the timeout to prevent the "taking too long" message if we've already finished
      if (downloadTimeoutRef.current) {
        clearTimeout(downloadTimeoutRef.current);
        downloadTimeoutRef.current = null;
      }
      setIsDownloading(false);
    }
  };  return (
    <Button 
      onClick={handleDownload}
      disabled={isDownloading}
      aria-busy={isDownloading}
      className={`w-full sm:max-w-[300px] px-5 py-3 font-medium transition-all duration-200 rounded-[0.4em] border-[0.15em] ${
        isDownloading 
          ? 'bg-[#EDDCD9] text-[#264143] border-[#264143] cursor-wait shadow-[0.1em_0.1em_0_#264143]' 
          : 'bg-[#4CAF50] text-white border-[#264143] shadow-[0.2em_0.2em_0_#264143] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#264143] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#264143]'
      }`}
    >
      <Download className={`w-5 h-5 mr-3 ${isDownloading ? 'animate-pulse' : ''}`} /> 
      <span className="text-base">
        {isDownloading ? 'Downloading...' : 'Download Study Material'}
      </span>
    </Button>
  );
};

export default DownloadButton;
