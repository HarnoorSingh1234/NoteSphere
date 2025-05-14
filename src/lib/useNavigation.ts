'use client';

import { useRouter } from 'next/navigation';
import { useLoadingNavigation } from '@/components/ui/LoadingProvider';

export function useNavigation() {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoadingNavigation();  const navigate = (path: string) => {
    // First trigger the loading state
    startLoading();
    
    // Add a small delay to ensure the loading state is visible
    setTimeout(() => {
      router.push(path);
    }, 100);
  };  const navigateReplace = (path: string) => {
    // First trigger the loading state
    startLoading();
    
    // Add a small delay to ensure the loading state is visible
    setTimeout(() => {
      router.replace(path);
    }, 100);
  };

  const navigateBack = () => {
    startLoading();
    router.back();
  };

  const navigateForward = () => {
    startLoading();
    router.forward();
  };

  return {
    navigate,
    navigateReplace,
    navigateBack,
    navigateForward,
    startLoading,
    stopLoading
  };
}

export default useNavigation;
