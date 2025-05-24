\'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full py-16 md:py-24 bg-[#EDDCD9] border-t-[0.35em] border-b-[0.35em] border-[#264143] relative overflow-hidden group"
    >
      {/* Pattern grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:1em_1em] pointer-events-none opacity-30 transition-opacity duration-300 ease-in-out z-[1] group-hover:opacity-50" />
      
      {/* Overlay dots */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:2em_2em] bg-[-1em_-1em] pointer-events-none opacity-10 transition-opacity duration-300 ease-in-out z-[1] group-hover:opacity-30" />
      
      {/* Decorative elements */}
      <div className="absolute top-[10%] left-[5%] w-[2em] h-[2em] bg-[#E99F4C] border-[0.15em] border-[#264143] rounded-[0.3em] rotate-12 shadow-[0.2em_0.2em_0_#DE5499] transition-transform duration-300 ease-in-out group-hover:rotate-6 group-hover:scale-110" />
      <div className="absolute bottom-[15%] right-[8%] w-[2.5em] h-[2.5em] bg-[#DE5499] border-[0.15em] border-[#264143] rounded-[0.3em] rotate-45 shadow-[0.2em_0.2em_0_#E99F4C] transition-transform duration-300 ease-in-out group-hover:rotate-[55deg] group-hover:scale-110" />
      
      <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white border-[0.35em] border-[#264143] rounded-[0.6em] p-8 md:p-10 shadow-[0.5em_0.5em_0_#E99F4C] max-w-4xl mx-auto transition-all duration-300 ease-in-out hover:translate-y-[-0.2em] hover:shadow-[0.7em_0.7em_0_#E99F4C]"
        >
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-white border-[0.15em] border-[#264143] rounded-full shadow-[0.2em_0.2em_0_#E99F4C] transition-all duration-300 ease-in-out hover:rotate-12">
              <Sparkles className="w-6 h-6 text-[#DE5499]" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl mb-6 text-[#264143]">
            Ready to <span className="text-[#DE5499]">Elevate</span> Your Studies?
          </h2>
          
          <p className="max-w-[600px] mx-auto text-lg md:text-xl mb-8 text-[#264143]/80">
            Join thousands of students already using NoteSphere to excel in their university courses
          </p>
          
          <Link 
            href="/sign-up"
            className="inline-flex items-center justify-center px-6 py-3 text-white font-bold bg-[#DE5499] border-[0.2em] border-[#264143] rounded-[0.4em] shadow-[0.3em_0.3em_0_#E99F4C] hover:translate-x-[-0.1em] hover:translate-y-[-0.1em] hover:bg-[#E66BA7] hover:shadow-[0.4em_0.4em_0_#E99F4C] active:translate-x-[0.1em] active:translate-y-[0.1em] active:shadow-[0.15em_0.15em_0_#E99F4C] transition-all duration-200"
          >
            Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </motion.div>
      </div>
      
      {/* Corner slice */}
      <div className="absolute bottom-0 left-0 w-[2.5em] h-[2.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.8em] z-[3]" />
    </motion.section>
  )
}
