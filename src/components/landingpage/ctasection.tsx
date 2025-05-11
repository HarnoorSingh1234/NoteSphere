// src/components/landing/CTASection.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full py-12 md:py-24  bg-gradient-to-br from-purple-900/10 to-indigo-900/10 lg:py-32"
    >
      <div className="container mx-auto px-4 md:px-6 text-center space-y-4">
        <h2 className="text-3xl font-bold sm:text-5xl">Ready to Elevate Your Studies?</h2>
        <p className="max-w-[900px] mx-auto text-zinc-500 md:text-xl dark:text-zinc-400">
          Join thousands of students already using StudyShare to excel in their university courses
        </p>
        <Button asChild size="lg">
          <Link href="/register">
            Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </motion.section>
  )
}
