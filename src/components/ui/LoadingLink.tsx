'use client';

import React from 'react';
import Link from 'next/link';
import { useLoadingNavigation } from './LoadingProvider';

interface LoadingLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
}

export function LoadingLink({
  href,
  className,
  children,
  prefetch,
  replace,
  scroll,
  ...props
}: LoadingLinkProps & React.HTMLAttributes<HTMLAnchorElement>) {
  const { startLoading } = useLoadingNavigation();  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only show loading for external navigation, not hash navigation
    if (!href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
      e.preventDefault(); // Prevent default navigation
      startLoading();
      
      // Add a small delay to ensure the loading state is visible
      setTimeout(() => {
        // Programmatically navigate using the Next.js router behavior
        window.location.href = href;
      }, 100);
    }
    
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <Link 
      href={href} 
      className={className} 
      onClick={handleClick} 
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      {...props}
    >
      {children}
    </Link>
  );
}

export default LoadingLink;
