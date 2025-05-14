'use client'

import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  iconColor?: string
}

export default function FeatureCard({ 
  icon, 
  title, 
  description, 
  iconColor = "#DE5499" 
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#E99F4C] overflow-hidden transition-all duration-300 ease-in-out group-hover:translate-y-[-0.2em] group-hover:shadow-[0.4em_0.4em_0_#E99F4C]">
        {/* Pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:1em_1em] opacity-20 transition-opacity duration-300 ease-in-out group-hover:opacity-40" />
        
        {/* Header with icon */}
        <div className="relative z-10 p-5 border-b border-[#264143]/20">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white border-[0.15em] border-[#264143] rounded-[0.3em] shadow-[0.15em_0.15em_0_var(--icon-color)] transition-all duration-200 ease-in-out group-hover:rotate-[5deg]"
                style={{ "--icon-color": iconColor } as React.CSSProperties}>
              <div className="text-[#264143]">
                {icon}
              </div>
            </div>
            <h3 className="text-lg font-bold text-[#264143]">{title}</h3>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 p-5">
          <p className="text-[#264143]/80">{description}</p>
        </div>
        
        {/* Decorative corner */}
        <div className="absolute bottom-0 right-0 w-[1.2em] h-[1.2em] bg-[#EDDCD9] border-l-[0.15em] border-t-[0.15em] border-[#264143] rounded-tl-[0.3em]" />
      </div>
    </motion.div>
  )
}