'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AcademicCard from '@/components/AcademicCard';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

// Sample data for academic years with SVG icons for features
const academicYears = [
  {
    id: '1',
    title: 'First Year',
    tagText: 'Freshman',
    description: 'Fundamental courses to build your academic foundation.',
    features: [
      {
        icon: (
          <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
            <path d="M20,4C21.1,4 22,4.9 22,6V18C22,19.1 21.1,20 20,20H4C2.9,20 2,19.1 2,18V6C2,4.9 2.9,4 4,4H20M4,6V18H20V6H4M6,9H18V11H6V9M6,13H16V15H6V13Z" />
          </svg>
        ),
        text: "Core Courses",
      },
      {
        icon: (
          <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
            <path d="M12,17.56L16.07,16.43L16.62,10.33H9.38L9.2,8.3H16.8L17,6.31H7L7.56,12.32H14.45L14.22,14.9L12,15.5L9.78,14.9L9.64,13.24H7.64L7.93,16.43L12,17.56M4.07,3H19.93L18.5,19.2L12,21L5.5,19.2L4.07,3Z" />
          </svg>
        ),
        text: "Electives",
      },
      {
        icon: (
          <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
            <path d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z" />
          </svg>
        ),
        text: "Labs",
      },
      {
        icon: (
          <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
            <path d="M9.19,6.35C8.41,7.13 7.75,8.05 7.25,9H5V11H7.12C7.05,11.32 7,11.66 7,12C7,12.34 7.05,12.68 7.12,13H5V15H7.25C7.75,15.95 8.41,16.87 9.19,17.65L7.77,19.07L9.88,21.18L11.3,19.77C11.85,20.03 12.41,20.2 13,20.31V23H15V20.31C15.59,20.2 16.15,20.03 16.7,19.77L18.12,21.18L20.23,19.07L18.81,17.65C19.59,16.87 20.25,15.95 20.75,15H23V13H20.88C20.95,12.68 21,12.34 21,12C21,11.66 20.95,11.32 20.88,11H23V9H20.75C20.25,8.05 19.59,7.13 18.81,6.35L20.23,4.93L18.12,2.82L16.7,4.23C16.15,3.97 15.59,3.8 15,3.69V1H13V3.69C12.41,3.8 11.85,3.97 11.3,4.23L9.88,2.82L7.77,4.93L9.19,6.35M13,17A5,5 0 0,1 8,12A5,5 0 0,1 13,7A5,5 0 0,1 18,12A5,5 0 0,1 13,17Z" />
          </svg>
        ),
        text: "Tutorials",
      }
    ],
    price: "30",
    priceDescription: "credits",
    buttonText: "Select Year",
    buttonHref: "/academic/semester?year=1"
  },
  // Add other years with similar structure
];

export default function YearSelectionPage() {
  return (
    <div className="relative w-full min-h-screen bg-[#EDDCD9] py-12">
      {/* Pattern grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:1em_1em] pointer-events-none opacity-30 z-[1]" />
      
      {/* Overlay dots */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:2em_2em] bg-[-1em_-1em] pointer-events-none opacity-10 z-[1]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <div className="inline-flex items-center justify-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-white border-[0.15em] border-[#050505] rounded-full shadow-[0.2em_0.2em_0_#ff3e00] mb-4">
                <BookOpen className="w-6 h-6 text-[#050505]" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#050505] mb-2">
              Select Your <span className="text-[#ff3e00]">Year</span>
            </h1>
            
            <p className="max-w-[600px] mx-auto text-[#050505]/80 text-lg mb-4">
              Choose your academic year to find the appropriate semester and subjects
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
            {academicYears.map((year, index) => (
              <AcademicCard
                key={year.id}
                title={year.title}
                tagText={year.tagText}
                description={year.description}
                features={year.features}
                price={year.price}
                priceDescription={year.priceDescription}
                buttonText={year.buttonText}
                buttonHref={year.buttonHref}
                accentColor={index % 2 === 0 ? "#ff3e00" : "#E99F4C"}
                secondaryColor={index % 2 === 0 ? "#4d61ff" : "#DE5499"}
              />
            ))}
          </div>
          
          <div className="mt-12 flex justify-center gap-4">
            <Link 
              href="/"
              className="inline-flex items-center justify-center px-5 py-2 text-[#050505] font-bold bg-white border-[0.2em] border-[#050505] rounded-[0.4em] shadow-[0.2em_0.2em_0_#ff3e00] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#ff3e00] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#ff3e00] transition-all duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      
      {/* Corner slice */}
      <div className="absolute bottom-0 left-0 w-[2.5em] h-[2.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#050505] rounded-tr-[0.8em] z-[3]" />
    </div>
  );
}