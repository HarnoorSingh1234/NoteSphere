// src/components/landing/HeroSection.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <motion.section
      id="hero"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full py-12 md:py-24 lg:py-32 xl:py-48"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          {/* Left text */}
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl xl:text-6xl">
              Share Knowledge, Ace Your Exams
            </h1>
            <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">
              StudyShare is the ultimate platform for university students to share and discover high-quality notes, collaborate with peers, and excel in their studies.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/register">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Login with University Email</Link>
              </Button>
            </div>
          </div>
          {/* Right image */}
          <div className="flex items-center justify-center">
            <Image
              src="/placeholder.svg"
              alt="StudyShare Platform"
              width={550}
              height={550}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </motion.section>
  )
}
