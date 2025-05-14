'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface LoadingLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const LoadingLink: React.FC<LoadingLinkProps> = ({ 
  href, 
  children,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // For external links or specific behaviors, don't handle it
    if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }
    
    e.preventDefault();
    setIsLoading(true);
    
    // Navigate after a short delay to show loading state
    setTimeout(() => {
      router.push(href);
    }, 200);
  };
  
  return (
    <Link 
      href={href} 
      onClick={handleClick} 
      className={`relative ${className} ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
    >
      {children}
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/10 rounded">
          <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
      )}
    </Link>
  );
};