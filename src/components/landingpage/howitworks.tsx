// src/components/landing/HowItWorksSection.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'

const steps = [
  { num: '1', title: 'Create an Account', desc: 'Sign up with your university email to join the StudyShare community.' },
  { num: '2', title: 'Browse or Upload', desc: 'Search for notes by subject, tag, or type, or share your own notes with others.' },
  { num: '3', title: 'Collaborate and Learn', desc: 'Download notes, leave comments, and connect with peers to enhance your learning.' },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6 text-center space-y-4">
        <h2 className="text-3xl font-bold sm:text-5xl">How It Works</h2>
        <p className="max-w-[900px] mx-auto text-zinc-500 md:text-xl dark:text-zinc-400">
          Get started with StudyShare in just a few simple steps
        </p>
      </div>
      <div className="container mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3 lg:gap-12 px-4 md:px-6">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 font-bold">
              {s.num}
            </div>
            <h3 className="text-xl font-bold">{s.title}</h3>
            <p className="text-zinc-500 dark:text-zinc-400">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
