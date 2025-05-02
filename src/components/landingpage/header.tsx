// src/components/landing/Header.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from '@clerk/nextjs'

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="container mx-auto flex h-16 items-center justify-between py-4 px-6">
        <div className="flex items-center gap-2">
          
          <BookOpen className="h-6 w-6" />
          <span className="text-xl font-bold">StudyShare</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {['features', 'how-it-works', 'testimonials'].map((id) => (
            <Link
              key={id}
              href={`#${id}`}
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
            >
              {id.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton>
              <Button variant="outline" size="sm">Login</Button>
            </SignInButton>
            <SignUpButton>
              <Button size="sm">Get Started</Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

      </div>
    </motion.header>
)
}
