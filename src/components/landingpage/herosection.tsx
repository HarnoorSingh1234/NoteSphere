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
      className="w-full py-12 md:py-24 bg-gradient-to-br from-purple-700/20 to-indigo-900/20 lg:py-32 xl:py-48"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Text */}
          <div className="text-center lg:text-left space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Share Knowledge, Ace Your Exams
            </h1>
            <p className="max-w-[600px] mx-auto lg:mx-0 text-zinc-600 dark:text-zinc-400 text-base sm:text-lg md:text-xl">
              StudyShare is the ultimate platform for university students to share and discover high-quality notes, collaborate with peers, and excel in their studies.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Button asChild size="lg">
                <Link href="/notes">
                  Semester Notes <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/sign-up">
                  Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          {/* Right Image */}
          <div className="w-full flex justify-center">
            <Image
              src="/placeholder.svg"
              alt="StudyShare Platform"
              width={500}
              height={500}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </motion.section>
  )
}
