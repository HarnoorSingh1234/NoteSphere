'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, X, Twitter, Facebook, Linkedin, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareButtonProps {
  noteId: string;
  noteTitle: string;
}

export default function ShareButton({ noteId, noteTitle }: ShareButtonProps) {
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Construct the full URL to the note
  const getNoteUrl = () => {
    // Get the base URL, handling both client and server rendering
    const baseUrl = typeof window !== 'undefined' 
      ? `${window.location.protocol}//${window.location.host}`
      : 'https://notesphere.vercel.app'; // Fallback URL, replace with your actual domain
    
    return `${baseUrl}/notes/${noteId}`;
  };

  // Copy the note URL to clipboard
  const copyToClipboard = async () => {
    try {
      const url = getNoteUrl();
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL: ', err);
    }
  };

  // Share to social media
  const shareToSocial = (platform: 'twitter' | 'facebook' | 'linkedin' | 'email') => {
    const url = encodeURIComponent(getNoteUrl());
    const title = encodeURIComponent(`Check out this note: ${noteTitle}`);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${title}&body=${url}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
    
    // Close the share menu after sharing
    setIsShareMenuOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#7BB4B1] text-white font-bold rounded-[0.4em] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#264143] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#264143] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#264143] transition-all duration-200"
      >
        <Share2 className="w-4 h-4" />
        Share
      </motion.button>
      
      <AnimatePresence>
        {isShareMenuOpen && (
          <>
            {/* Backdrop for closing the menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[49]"
              onClick={() => setIsShareMenuOpen(false)}
            />
            
            {/* Share menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute right-0 z-[50] mt-2 bg-white border-[0.15em] border-[#264143] rounded-[0.4em] p-3 shadow-[0.25em_0.25em_0_#E99F4C] min-w-[240px]"
            >
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#264143]/20">
                <h3 className="font-bold text-[#264143]">Share Note</h3>
                <button 
                  onClick={() => setIsShareMenuOpen(false)}
                  className="p-1 text-[#264143]/60 hover:text-[#264143] rounded-full hover:bg-[#EDDCD9]/30"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {/* Copy link option */}
                <button 
                  onClick={copyToClipboard}
                  className="w-full flex items-center justify-between p-2 text-[#264143] hover:bg-[#EDDCD9]/30 rounded-[0.3em] transition-colors"
                >
                  <div className="flex items-center">
                    <Copy className="w-4 h-4 mr-2" />
                    <span>Copy link</span>
                  </div>
                  {copySuccess && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </button>
                
                {/* Social share options */}
                <div className="flex justify-around pt-2 border-t border-[#264143]/10">
                  <button 
                    onClick={() => shareToSocial('twitter')}
                    className="p-2 rounded-full bg-[#EDDCD9]/30 hover:bg-[#EDDCD9] transition-colors"
                    aria-label="Share on Twitter"
                    title="Share on Twitter"
                  >
                    <Twitter className="w-5 h-5 text-[#264143]" />
                  </button>
                  
                  <button 
                    onClick={() => shareToSocial('facebook')}
                    className="p-2 rounded-full bg-[#EDDCD9]/30 hover:bg-[#EDDCD9] transition-colors"
                    aria-label="Share on Facebook"
                    title="Share on Facebook"
                  >
                    <Facebook className="w-5 h-5 text-[#264143]" />
                  </button>
                  
                  <button 
                    onClick={() => shareToSocial('linkedin')}
                    className="p-2 rounded-full bg-[#EDDCD9]/30 hover:bg-[#EDDCD9] transition-colors"
                    aria-label="Share on LinkedIn"
                    title="Share on LinkedIn"
                  >
                    <Linkedin className="w-5 h-5 text-[#264143]" />
                  </button>
                  
                  <button 
                    onClick={() => shareToSocial('email')}
                    className="p-2 rounded-full bg-[#EDDCD9]/30 hover:bg-[#EDDCD9] transition-colors"
                    aria-label="Share via Email"
                    title="Share via Email"
                  >
                    <Mail className="w-5 h-5 text-[#264143]" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
