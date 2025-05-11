'use client'

import React from 'react'
import { FileText, Users, BookOpen } from 'lucide-react'
import FeatureCard from './featurecard'

const features = [
  {
    icon: <FileText className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />,
    title: 'Comprehensive Notes',
    description: 'Access a vast library of high-quality notes across all subjects and courses.',
  },
  {
    icon: <Users className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />,
    title: 'Peer Collaboration',
    description: 'Connect with classmates, discuss topics, and improve your understanding together.',
  },
  {
    icon: <BookOpen className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />,
    title: 'Organized Learning',
    description: 'Filter by subject, tag, or note type to find exactly what you need, when you need it.',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full bg-gradient-to-br from-indigo-900/10 to-purple-700/20 py-12 md:py-24 lg:py-32 ">
      <div className="container mx-auto px-4 md:px-6 text-center space-y-4">
        <h2 className="text-3xl font-bold not-last:not-first: sm:text-5xl">Platform Features</h2>
        <p className="max-w-[900px] mx-auto text-zinc-500 md:text-xl dark:text-zinc-400">
          Everything you need to excel in your university studies
        </p>
      </div>
      <div className="container mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3 lg:gap-12 px-4 md:px-6">
        {features.map((f, i) => (
          <FeatureCard key={i} icon={f.icon} title={f.title} description={f.description} />
        ))}
      </div>
    </section>
  )
}
