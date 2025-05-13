import React from 'react'
import Navbar from '@/components/Navbar'

export default function AcademicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
} 