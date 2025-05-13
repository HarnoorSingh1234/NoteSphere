'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClerkLoaded, ClerkLoading, useAuth } from '@clerk/nextjs';

// Public authentication wrapper for auth pages - redirects if already signed in
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
    return <div className="flex justify-center items-center h-screen" suppressHydrationWarning>Loading...</div>;
  }

  return (
    <>
      <ClerkLoading>
        <div className="flex justify-center items-center h-screen" suppressHydrationWarning>
          Loading authentication...
        </div>
      </ClerkLoading>
      <ClerkLoaded>{children}</ClerkLoaded>
    </>
  );
}

// Protected authentication wrapper for admin and user pages - redirects if not signed in
export function ProtectedAuthenticationWrapper({
  children,
  adminRequired = false,
}: {
  children: React.ReactNode;
  adminRequired?: boolean;
}) {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isLoaded) {
      if (!isSignedIn) {
        // If not signed in, redirect to sign-in
        router.push('/sign-in');
      }
      
      // Here you could add additional admin check logic if adminRequired is true
      // This would typically involve checking a user's role in your database
      // if (adminRequired && !isAdmin) {
      //   router.push('/access-denied');
      // }
    }
  }, [isLoaded, isSignedIn, router, mounted, adminRequired]);
  if (!mounted || !isLoaded) {
    return <div className="flex justify-center items-center h-screen" suppressHydrationWarning>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div className="flex justify-center items-center h-screen" suppressHydrationWarning>Redirecting to login...</div>;
  }

  return (
    <>
      <ClerkLoading>
        <div className="flex justify-center items-center h-screen" suppressHydrationWarning>
          Loading authentication...
        </div>
      </ClerkLoading>
      <ClerkLoaded>{children}</ClerkLoaded>
    </>
  );
}
