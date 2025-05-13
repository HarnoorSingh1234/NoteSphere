import React from 'react'
import Navbar from '@/components/Navbar'
import AdminSidebar from '@/components/admin/AdminSidebar'
import Footer from '@/components/landingpage/footer'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <><Navbar />
    <AdminSidebar>
      {children}
    </AdminSidebar>
    <Footer/>
  </>
}
