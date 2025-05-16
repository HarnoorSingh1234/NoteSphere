'use client';

import React, { JSX, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AcademicCard from '@/components/AcademicCard';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

interface Year {
  id: string;
  number: number;
  _count?: {
    semesters: number;
  };
}

export default function YearsPage() {
  const [years, setYears] = useState<Year[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchYears() {
      try {
        const response = await fetch('/api/years');
        const data = await response.json();
        if (data.years) {
          setYears(data.years);
        }
      } catch (error) {
        console.error('Error fetching years:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchYears();
  }, []);

  // Color schemes for different cards
  const colorSchemes = [
    { accent: "#ff3e00", secondary: "#4d61ff" },   // Orange/Blue
    { accent: "#E99F4C", secondary: "#DE5499" },   // Gold/Pink
    { accent: "#4CAF50", secondary: "#9C27B0" },   // Green/Purple
    { accent: "#2196F3", secondary: "#FF9800" },   // Blue/Orange
    { accent: "#00BCD4", secondary: "#FF5722" }    // Teal/Deep Orange
  ];

  // Map database years to the AcademicCard format with different colors
  const academicYears = years.map((year, index) => ({
    id: year.id,
    title: `Year ${year.number}`,
    tagText: getYearTagText(year.number),
    description: getYearDescription(year.number),
    features: getYearFeatures(year.number),
    price: year._count?.semesters.toString() || "2",
    priceDescription: "semesters",
    buttonText: "Select Year",
    buttonHref: `/academics/years/${year.id}`,
    // Assign different colors by rotating through the colorSchemes array
    accentColor: colorSchemes[index % colorSchemes.length].accent,
    secondaryColor: colorSchemes[index % colorSchemes.length].secondary
  }));

  return (
    <div className="relative w-full min-h-screen bg-[#EDDCD9] py-12">
      {/* Pattern grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:1em_1em] pointer-events-none opacity-30 z-[1]" />
      
      {/* Overlay dots */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:2em_2em] bg-[-1em_-1em] pointer-events-none opacity-10 z-[1]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-full">
        <div className="w-full">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <div className="inline-flex items-center justify-center mb-4">
              <div className="flex items-center transition-all duration-200 ease-in-out hover:rotate-[-5deg] hover:scale-105 justify-center w-12 h-12 bg-white border-[0.15em] border-[#050505] rounded-full shadow-[0.2em_0.2em_0_#ff3e00] mb-4">
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
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-[#ff3e00] border-t-transparent rounded-full animate-spin"></div>
            </div>          ) : academicYears.length === 0 ? (
            <div className="text-center p-12 bg-white border-[0.15em] border-[#050505] rounded-[0.6em] shadow-[0.4em_0.4em_0_#000]">
              <h3 className="text-2xl font-bold text-[#050505] mb-2">No Years Available</h3>
              <p className="text-[#050505]/70">Academic years will be added by the administrators.</p>
            </div>
          ) : (
            // Responsive grid layout that covers the full screen area
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 pb-6">
              {academicYears.map((year, index) => (
                <motion.div 
                  key={year.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="h-full"
                >
                  <AcademicCard
                    title={year.title}
                    tagText={year.tagText}
                    description={year.description}
                    features={year.features}
                    price={year.price}
                    priceDescription={year.priceDescription}
                    buttonText={year.buttonText}
                    buttonHref={year.buttonHref}
                    accentColor={year.accentColor}
                    secondaryColor={year.secondaryColor}
                    // Alternate between different types for more variation
                    type={['primary', 'secondary', 'info', 'purple', 'teal'][index % 5] as any}
                  />
                </motion.div>
              ))}
            </div>
          )}
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

// Helper functions remain unchanged
function getYearTagText(yearNumber: number): string {
  const tags = ["Freshman", "Sophomore", "Junior", "Senior", "Post-grad"];
  return tags[yearNumber - 1] || `Year ${yearNumber}`;
}

function getYearDescription(yearNumber: number): string {
  const descriptions = [
    "Fundamental courses to build your academic foundation.",
    "Core subject mastery and specialized knowledge development.",
    "Advanced topics and professional skill development.",
    "Capstone projects and career preparation.",
    "Specialized research and expertise development."
  ];
  return descriptions[yearNumber - 1] || `Courses and materials for Year ${yearNumber} students.`;
}

function getYearFeatures(yearNumber: number): { icon: JSX.Element; text: string; }[] {
  // Base features that apply to all years
  const coreFeatures = [
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
    }
  ];
  
  // Additional features based on year
  let yearSpecificFeatures = [];
  
  switch(yearNumber) {
    case 1:
      yearSpecificFeatures = [
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
      ];
      break;
    case 2:
      yearSpecificFeatures = [
        {
          icon: (
            <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
              <path d="M18,2A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2H18M18,4H6V20H18V4M16,12V14H6V12H16M16,8V10H6V8H16Z" />
            </svg>
          ),
          text: "Projects",
        },
        {
          icon: (
            <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
              <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
            </svg>
          ),
          text: "Workshops",
        }
      ];
      break;
    case 3:
      yearSpecificFeatures = [
        {
          icon: (
            <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
              <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
            </svg>
          ),
          text: "Internships",
        },
        {
          icon: (
            <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
              <path d="M4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H16L12,22L8,18H4A2,2 0 0,1 2,16V4A2,2 0 0,1 4,2M4,4V16H8.83L12,19.17L15.17,16H20V4H4M6,7H18V9H6V7M6,11H16V13H6V11Z" />
            </svg>
          ),
          text: "Seminars",
        }
      ];
      break;
    case 4:
    default:
      yearSpecificFeatures = [
        {
          icon: (
            <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
              <path d="M14,2L20,8V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2H14M18,20V9H13V4H6V20H18M12,11L15,14H13V18H11V14H9L12,11Z" />
            </svg>
          ),
          text: "Capstones",
        },
        {
          icon: (
            <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
              <path d="M12,5A3.5,3.5 0 0,0 8.5,8.5A3.5,3.5 0 0,0 12,12A3.5,3.5 0 0,0 15.5,8.5A3.5,3.5 0 0,0 12,5M12,7A1.5,1.5 0 0,1 13.5,8.5A1.5,1.5 0 0,1 12,10A1.5,1.5 0 0,1 10.5,8.5A1.5,1.5 0 0,1 12,7M5.5,8A2.5,2.5 0 0,0 3,10.5C3,11.44 3.53,12.25 4.29,12.68C4.65,12.88 5.06,13 5.5,13C5.94,13 6.35,12.88 6.71,12.68C7.08,12.47 7.39,12.17 7.62,11.81C6.89,10.86 6.5,9.7 6.5,8.5C6.5,8.41 6.5,8.31 6.5,8.22C6.2,8.08 5.86,8 5.5,8M18.5,8C18.14,8 17.8,8.08 17.5,8.22C17.5,8.31 17.5,8.41 17.5,8.5C17.5,9.7 17.11,10.86 16.38,11.81C16.5,12 16.63,12.15 16.78,12.3C16.94,12.45 17.1,12.58 17.29,12.68C17.65,12.88 18.06,13 18.5,13C18.94,13 19.35,12.88 19.71,12.68C20.47,12.25 21,11.44 21,10.5A2.5,2.5 0 0,0 18.5,8M12,14C9.66,14 5,15.17 5,17.5V19H19V17.5C19,15.17 14.34,14 12,14M4.71,14.55C2.78,14.78 0,15.76 0,17.5V19H3V17.07C3,16.06 3.69,15.22 4.71,14.55M19.29,14.55C20.31,15.22 21,16.06 21,17.07V19H24V17.5C24,15.76 21.22,14.78 19.29,14.55M12,16C13.53,16 15.24,16.5 16.23,17H7.77C8.76,16.5 10.47,16 12,16Z" />
            </svg>
          ),
          text: "Mentorship",
        }
      ];
  }
  
  return [...coreFeatures, ...yearSpecificFeatures];
}