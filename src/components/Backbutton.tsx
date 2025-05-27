"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface BackButtonProps {
  subjectName: string;
}

export default function BackButton({ subjectName }: BackButtonProps) {
  const router = useRouter();
  
  return (
    <motion.button 
      onClick={() => router.back()}
      className="inline-flex items-center px-3 py-1.5 bg-white border-[0.15em] border-[#264143] text-[#264143] font-medium rounded-[0.4em] shadow-[0.15em_0.15em_0_#7BB4B1] hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#7BB4B1] active:translate-y-[0.05em] active:shadow-[0.05em_0.05em_0_#7BB4B1] transition-all duration-200"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        whileHover={{ x: -3 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
      </motion.div>
      <span>Back to {subjectName}</span>
    </motion.button>
  );
}