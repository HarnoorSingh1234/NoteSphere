import React from 'react'
import Footer from '@/components/landingpage/footer'
import UserSidebar from '@/components/user/UserSidebar'
import Navbar from '@/components/Navbar'

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <UserSidebar>
        {children}
      </UserSidebar>
      <Footer />
    </>
  )
}
