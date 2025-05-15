'use client';

import React, { JSX, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, CalendarDays } from 'lucide-react';
import AcademicCard from '@/components/AcademicCard';

interface Semester {
  id: string;
  number: number;
  yearId: string;
  _count?: {
    subjects: number;
  };
}

interface Year {
  id: string;
  number: number;
}

export default function YearPage({ params }: { params: { id: string } }) {
  const [year, setYear] = useState<Year | null>(null);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchYearData() {
      try {
        // Fetch year details
        const yearResponse = await fetch(`/api/years/${params.id}`);
        const yearData = await yearResponse.json();
        
        // Fetch semesters for this year
        const semestersResponse = await fetch(`/api/semesters?yearId=${params.id}`);
        const semestersData = await semestersResponse.json();
        
        if (yearData.year) {
          setYear(yearData.year);
        }
        
        if (semestersData.semesters) {
          setSemesters(semestersData.semesters);
        }
      } catch (error) {
        console.error('Error fetching year data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchYearData();
  }, [params.id]);

  // Map semesters to AcademicCard format
  const academicSemesters = semesters.map((semester, index) => ({
    id: semester.id,
    title: `Semester ${semester.number}`,
    tagText: getSemesterTagText(semester.number),
    description: getSemesterDescription(year?.number, semester.number),
    features: getSemesterFeatures(semester.number),
    price: semester._count?.subjects.toString() || "6",
    priceDescription: "subjects",
    buttonText: "View Subjects",
    buttonHref: `/years/${params.id}/semesters/${semester.id}`
  }));

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
                <CalendarDays className="w-6 h-6 text-[#050505]" />
              </div>
            </div>
            
            {loading ? (
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#050505] mb-2">
                Loading...
              </h1>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#050505] mb-2">
                  Year <span className="text-[#ff3e00]">{year?.number}</span>
                </h1>
                
                <p className="max-w-[600px] mx-auto text-[#050505]/80 text-lg mb-4">
                  Select a semester to view its subjects and available notes
                </p>
              </>
            )}
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-[#ff3e00] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : academicSemesters.length === 0 ? (
            <div className="text-center p-12 bg-white border-[0.15em] border-[#050505] rounded-[0.6em] shadow-[0.4em_0.4em_0_#000]">
              <h3 className="text-2xl font-bold text-[#050505] mb-2">No Semesters Available</h3>
              <p className="text-[#050505]/70">Semesters will be added by the administrators.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
              {academicSemesters.map((semester, index) => (
                <AcademicCard
                  key={semester.id}
                  title={semester.title}
                  tagText={semester.tagText}
                  description={semester.description}
                  features={semester.features}
                  price={semester.price}
                  priceDescription={semester.priceDescription}
                  buttonText={semester.buttonText}
                  buttonHref={semester.buttonHref}
                  accentColor={index % 2 === 0 ? "#ff3e00" : "#E99F4C"}
                  secondaryColor={index % 2 === 0 ? "#4d61ff" : "#DE5499"}
                  type={index % 2 === 0 ? "primary" : "secondary"}
                />
              ))}
            </div>
          )}
          
          <div className="mt-12 flex justify-center gap-4">
            <Link 
              href="/years"
              className="inline-flex items-center justify-center px-5 py-2 text-[#050505] font-bold bg-white border-[0.2em] border-[#050505] rounded-[0.4em] shadow-[0.2em_0.2em_0_#ff3e00] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#ff3e00] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#ff3e00] transition-all duration-200"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Years
            </Link>
          </div>
        </div>
      </div>
      
      {/* Corner slice */}
      <div className="absolute bottom-0 left-0 w-[2.5em] h-[2.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#050505] rounded-tr-[0.8em] z-[3]" />
    </div>
  );
}

// Helper functions for semester content
function getSemesterTagText(semesterNumber: number): string {
  return semesterNumber === 1 ? "Fall" : "Spring";
}

function getSemesterDescription(yearNumber?: number, semesterNumber?: number): string {
  if (!yearNumber || !semesterNumber) return "Semester courses and materials";
  
  if (semesterNumber === 1) {
    return `First semester courses for Year ${yearNumber} students. Core fundamentals and introductory subjects.`;
  } else {
    return `Second semester courses for Year ${yearNumber} students. Advanced topics and expanded knowledge.`;
  }
}

function getSemesterFeatures(semesterNumber: number): { icon: JSX.Element; text: string; }[] {
  const commonFeatures = [
    {
      icon: (
        <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
          <path d="M20,4C21.1,4 22,4.9 22,6V18C22,19.1 21.1,20 20,20H4C2.9,20 2,19.1 2,18V6C2,4.9 2.9,4 4,4H20M4,6V18H20V6H4M6,9H18V11H6V9M6,13H16V15H6V13Z" />
        </svg>
      ),
      text: semesterNumber === 1 ? "Core Subjects" : "Advanced Subjects",
    },
    {
      icon: (
        <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
          <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
        </svg>
      ),
      text: "Lecture Notes",
    },
  ];
  
  const semesterSpecificFeatures = semesterNumber === 1 ? [
    {
      icon: (
        <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
          <path d="M18,2A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2H18M18,4H6V20H18V4M16,12V14H6V12H16M16,8V10H6V8H16Z" />
        </svg>
      ),
      text: "Fundamentals",
    },
    {
      icon: (
        <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
          <path d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z" />
        </svg>
      ),
      text: "Theory",
    }
  ] : [
    {
      icon: (
        <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
          <path d="M14,2L20,8V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2H14M18,20V9H13V4H6V20H18M12,11L15,14H13V18H11V14H9L12,11Z" />
        </svg>
      ),
      text: "Applications",
    },
    {
      icon: (
        <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
          <path d="M9,5V9H21V5M9,19H21V15H9M9,14H21V10H9M4,9H8V5H4M4,19H8V15H4M4,14H8V10H4V14Z" />
        </svg>
      ),
      text: "Projects",
    }
  ];
  
  return [...commonFeatures, ...semesterSpecificFeatures];
}