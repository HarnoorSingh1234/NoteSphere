'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { ClerkProvider } from '@clerk/nextjs';
import { ProtectedAuthenticationWrapper } from '@/components/auth/AuthenticationWrapper';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ProtectedAuthenticationWrapper adminRequired={true}>
        <Navbar isAdmin={true} />
        <AdminSidebar>
          {children}
        </AdminSidebar>
      </ProtectedAuthenticationWrapper>
    </ClerkProvider>
  );
}
