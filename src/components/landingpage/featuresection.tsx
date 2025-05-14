'use client'

import React from 'react'
import { FileText, Users, BookOpen, Sparkles } from 'lucide-react'
import FeatureCard from './featurecard'
import { motion } from 'framer-motion'

const features = [
  {
    icon: <FileText className="h-6 w-6" />,
    title: 'Comprehensive Notes',
    description: 'Access a vast library of high-quality notes across all subjects and courses.',
    iconColor: '#DE5499'
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Peer Collaboration',
    description: 'Connect with classmates, discuss topics, and improve your understanding together.',
    iconColor: '#E99F4C'
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: 'Organized Learning',
    description: 'Filter by subject, tag, or note type to find exactly what you need, when you need it.',
    iconColor: '#DE5499'
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full bg-[#EDDCD9] border-b-[0.35em] border-[#264143] py-16 md:py-24 lg:py-28 relative overflow-hidden group">
      {/* Pattern grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:1em_1em] pointer-events-none opacity-30 transition-opacity duration-300 ease-in-out z-[1] group-hover:opacity-50" />
      
      {/* Overlay dots */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:2em_2em] bg-[-1em_-1em] pointer-events-none opacity-10 transition-opacity duration-300 ease-in-out z-[1] group-hover:opacity-30" />
      
      {/* Decorative elements */}
      <div className="absolute top-[10%] left-[8%] w-[2em] h-[2em] bg-[#DE5499] border-[0.15em] border-[#264143] rounded-[0.3em] rotate-12 shadow-[0.2em_0.2em_0_#E99F4C] transition-transform duration-300 ease-in-out group-hover:rotate-6 group-hover:scale-110" />
      <div className="absolute bottom-[15%] right-[6%] w-[3em] h-[3em] bg-[#E99F4C] border-[0.15em] border-[#264143] rounded-[0.3em] rotate-45 shadow-[0.2em_0.2em_0_#DE5499] transition-transform duration-300 ease-in-out group-hover:rotate-[55deg] group-hover:scale-110" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white border-[0.15em] border-[#264143] rounded-full shadow-[0.2em_0.2em_0_#DE5499] transition-all duration-300 ease-in-out hover:rotate-12">
              <Sparkles className="w-6 h-6 text-[#E99F4C]" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold sm:text-5xl text-[#264143] mb-4">
            Platform <span className="text-[#DE5499]">Features</span>
          </h2>
          
          <p className="max-w-[700px] mx-auto text-lg md:text-xl text-[#264143]/80">
            Everything you need to excel in your university studies
          </p>
        </motion.div>
        
        <div className="grid gap-8 py-6 lg:grid-cols-3 max-w-6xl mx-auto px-4 md:px-6">
          {features.map((f, i) => (
            <FeatureCard 
              key={i} 
              icon={f.icon} 
              title={f.title} 
              description={f.description} 
              iconColor={f.iconColor}
            />
          ))}
        </div>
      </div>
      
      {/* Corner slice */}
      <div className="absolute bottom-0 left-0 w-[2.5em] h-[2.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.8em] z-[3]" />
    </section>
  )
}