'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import Loader from '@/components/ui/Loader';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setIsLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // This effect will run whenever the route changes
  useEffect(() => {
    // Add a small delay before stopping loading to ensure animations are visible
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && <Loader />}
      {children}
    </LoadingContext.Provider>
  );
}

// Custom hook to trigger loading state for manual navigation
export function useLoadingNavigation() {
  const { setIsLoading } = useLoading();
  const router = useRouter();
  
  return {
    startLoading: () => setIsLoading(true),
    stopLoading: () => setIsLoading(false),    navigateTo: (path: string) => {
      setIsLoading(true);
      setTimeout(() => {
        router.push(path);
      }, 100);
    }
  };
}
