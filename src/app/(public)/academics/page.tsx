"use client";

import React from 'react';
import { motion } from 'framer-motion';
import NoticesCard from '@/components/academics/NoticesCard';
import PageHeader from '@/components/academics/PageHeader';
import YearsCard from '@/components/academics/YearsCard';
import InfoSection from '@/components/academics/InfoSection';

export default function AcademicPage() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 pt-4 sm:pt-6 md:pt-10 pb-8 sm:pb-12 md:pb-16 px-3 sm:px-4 md:px-6 relative">
      {/* Background patterns - responsive sizing */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:14px_14px] sm:bg-[length:18px_18px] md:bg-[length:24px_24px] pointer-events-none"></div>
      
      {/* Decorative blobs - responsive positioning and sizing */}
      <div className="absolute top-[10%] right-[5%] w-[15vw] max-w-[8rem] aspect-square bg-[#DE5499]/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute top-[30%] left-[8%] w-[18vw] max-w-[10rem] aspect-square bg-[#7BB4B1]/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute bottom-[15%] right-[10%] w-[20vw] max-w-[12rem] aspect-square bg-[#E99F4C]/10 rounded-full blur-xl pointer-events-none"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-[90rem] mx-auto px-1 sm:px-2 md:px-4">
          {/* Page Header */}
          <PageHeader 
            title="Academic Resources" 
            description="Access notes, notifications, and academic information"
          />

          {/* Main content - responsive grid with equal height cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Notices Card */}
            <motion.div 
              custom={0}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="w-full h-full"
            >
              <NoticesCard />
            </motion.div>

            {/* Academic Years Card */}
            <motion.div 
              custom={1}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="w-full h-full"
            >
              <YearsCard />
            </motion.div>
          </div>
          
          {/* Info section */}
          <div className="mt-6 sm:mt-8 md:mt-12">
            <InfoSection />
          </div>
        </div>
      </div>
    </div>
  );
}