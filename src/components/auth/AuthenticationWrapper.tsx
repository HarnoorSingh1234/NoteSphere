'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClerkLoaded, ClerkLoading, useAuth } from '@clerk/nextjs';

export default function AuthenticationWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isLoaded && isSignedIn) {
      // If already signed in, redirect to dashboard
      router.push('/user-dashboard');
    }
  }, [isLoaded, isSignedIn, router, mounted]);

  if (!mounted) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <>
      <ClerkLoading>
        <div className="flex justify-center items-center h-screen">
          Loading authentication...
        </div>
      </ClerkLoading>
      <ClerkLoaded>{children}</ClerkLoaded>
    </>
  );
}
