'use client';

import React from 'react';
import Footer from '@/components/landingpage/footer';
import UserSidebar from '@/components/user/UserSidebar';
import Navbar from '@/components/Navbar';
import { ClerkProvider } from '@clerk/nextjs';
import { ProtectedAuthenticationWrapper } from '@/components/auth/AuthenticationWrapper';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ProtectedAuthenticationWrapper>
        <Navbar />
        <UserSidebar>
          {children}
        </UserSidebar>
        <Footer />
      </ProtectedAuthenticationWrapper>
    </ClerkProvider>
  );
}
