'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Book, ArrowLeft } from 'lucide-react';

interface SubjectHeaderProps {
  subjectName: string;
  subjectCode: string;
  yearid: string;
  semid: string;
}

const SubjectHeader: React.FC<SubjectHeaderProps> = ({
  subjectName,
  subjectCode,
  yearid,
  semid,
}) => {
  return (
    <>
      {/* Breadcrumb navigation */}
      <div className="flex items-center mb-6">
        <Link 
          href={`/academics/years/${yearid}/semesters/${semid}`}
          className="inline-flex items-center justify-center px-4 py-1.5 text-[#264143] font-medium bg-white border-[0.25em] border-[#264143] rounded-[0.4em] shadow-[0.15em_0.15em_0_#E99F4C] hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#E99F4C] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#E99F4C] transition-all duration-200"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          <span>Back to Subjects</span>
        </Link>
      </div>
      
      {/* Subject header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div 
            className="flex items-center justify-center w-12 h-12 bg-white border-[0.25em] border-[#264143] rounded-[0.5em] shadow-[0.25em_0.25em_0_#7BB4B1]"
            whileHover={{ rotate: -5, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Book className="w-6 h-6 text-[#264143]" />
          </motion.div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#264143]">{subjectName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="inline-flex items-center px-2.5 py-0.5 bg-white border-[0.15em] border-[#264143] rounded-full text-sm font-semibold text-[#DE5499] shadow-[0.1em_0.1em_0_#264143]">
                {subjectCode}
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-2xl">
          <p className="text-[#264143]/80 leading-relaxed">
            Explore resources, notes and materials for this subject to enhance your learning experience.
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default SubjectHeader;