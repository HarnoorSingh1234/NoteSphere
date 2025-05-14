'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, ArrowRight } from 'lucide-react'

const steps = [
  { 
    num: '1', 
    title: 'Create an Account', 
    desc: 'Sign up with your university email to join the NoteSphere community.',
    color: '#DE5499'
  },
  { 
    num: '2', 
    title: 'Browse or Upload', 
    desc: 'Search for notes by subject, tag, or type, or share your own notes with others.',
    color: '#E99F4C'
  },
  { 
    num: '3', 
    title: 'Collaborate and Learn', 
    desc: 'Download notes, leave comments, and connect with peers to enhance your learning.',
    color: '#DE5499'
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full bg-[#EDDCD9] border-b-[0.35em] border-[#264143] py-16 md:py-24 lg:py-28 relative overflow-hidden group">
      {/* Pattern grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:1em_1em] pointer-events-none opacity-30 transition-opacity duration-300 ease-in-out z-[1] group-hover:opacity-50" />
      
      {/* Overlay dots */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:2em_2em] bg-[-1em_-1em] pointer-events-none opacity-10 transition-opacity duration-300 ease-in-out z-[1] group-hover:opacity-30" />
      
      {/* Decorative elements */}
      <div className="absolute top-[20%] right-[5%] w-[2em] h-[2em] bg-[#DE5499] border-[0.15em] border-[#264143] rounded-[0.3em] rotate-12 shadow-[0.2em_0.2em_0_#E99F4C] transition-transform duration-300 ease-in-out group-hover:rotate-6 group-hover:scale-110" />
      <div className="absolute bottom-[25%] left-[8%] w-[3em] h-[3em] bg-[#E99F4C] border-[0.15em] border-[#264143] rounded-[0.3em] rotate-45 shadow-[0.2em_0.2em_0_#DE5499] transition-transform duration-300 ease-in-out group-hover:rotate-[55deg] group-hover:scale-110" />
      
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
              <BookOpen className="w-6 h-6 text-[#264143]" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold sm:text-5xl text-[#264143] mb-4">
            How It <span className="text-[#DE5499]">Works</span>
          </h2>
          
          <p className="max-w-[700px] mx-auto text-lg md:text-xl text-[#264143]/80">
            Get started with NoteSphere in just a few simple steps
          </p>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row justify-center lg:items-stretch gap-12 py-6 max-w-6xl mx-auto px-4 md:px-6 relative">
          {/* Connection lines */}
          <div className="absolute top-1/2 left-[calc(16.67%-1em)] right-[calc(16.67%-1em)] h-[0.2em] bg-[#264143] hidden lg:block" />
          <div className="absolute top-[5.5em] left-[50%] w-[0.2em] h-[calc(100%-11em)] bg-[#264143] lg:hidden" />
          
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex-1 flex flex-col items-center relative"
            >
              {/* Step number */}
              <motion.div
                whileHover={{ y: -5, scale: 1.05, transition: { duration: 0.2 } }}
                className={`flex items-center justify-center w-14 h-14 bg-white border-[0.25em] border-[#264143] rounded-full text-xl font-bold text-[#264143] shadow-[0.2em_0.2em_0_${s.color}] relative z-20 transition-all duration-200 ease-in-out mb-8`}
              >
                {s.num}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute left-full ml-2 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="w-5 h-5 text-[#264143]" />
                  </div>
                )}
              </motion.div>
              
              {/* Step content */}
              <motion.div
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="w-full bg-white border-[0.25em] border-[#264143] rounded-[0.6em] p-6 shadow-[0.3em_0.3em_0_#E99F4C] transition-all duration-300 ease-in-out hover:translate-y-[-0.2em] hover:shadow-[0.4em_0.4em_0_#E99F4C] relative z-10"
              >
                {/* Pattern background */}
                <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:1em_1em] opacity-20 transition-opacity duration-300 ease-in-out hover:opacity-40" />
                
                <h3 className="text-xl font-bold text-[#264143] mb-3">{s.title}</h3>
                <p className="text-[#264143]/80 text-center">{s.desc}</p>
                
                {/* Decorative corner */}
                <div className="absolute bottom-0 right-0 w-[1.2em] h-[1.2em] bg-[#EDDCD9] border-l-[0.15em] border-t-[0.15em] border-[#264143] rounded-tl-[0.3em]" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Corner slice */}
      <div className="absolute bottom-0 left-0 w-[2.5em] h-[2.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.8em] z-[3]" />
    </section>
  )
}