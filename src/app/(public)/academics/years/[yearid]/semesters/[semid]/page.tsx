'use client';

import React, { JSX, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import AcademicCardSubject from '@/components/AcademicCardSubject';
import { useParams } from 'next/navigation';

interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  semesterId: string;
  _count?: {
    notes: number;
  };
}

interface Semester {
  id: string;
  number: number;
  yearId: string;
}

interface Year {
  id: string;
  number: number;
}

export default function SemesterPage() {
  // Use the useParams hook to access route parameters
  const params = useParams();
  const yearid = params.yearid as string;
  const semid = params.semid as string;
  
  const [semester, setSemester] = useState<Semester | null>(null);
  const [year, setYear] = useState<Year | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Scroll controls
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  useEffect(() => {
    async function fetchSemesterData() {
      try {
        // Using semid from useParams
        const semesterResponse = await fetch(`/api/semesters/${semid}`);
        const semesterData = await semesterResponse.json();
        
        if (semesterData.semester) {
          setSemester(semesterData.semester);
          
          // Fetch year data for this semester
          const yearResponse = await fetch(`/api/years/${yearid}`);
          const yearData = await yearResponse.json();
          
          if (yearData.year) {
            setYear(yearData.year);
          }
          
          // Fetch subjects for this semester
          const subjectsResponse = await fetch(`/api/subjects?semesterId=${semid}`);
          const subjectsData = await subjectsResponse.json();
          
          if (subjectsData.subjects) {
            setSubjects(subjectsData.subjects);
          }
        }
      } catch (error) {
        console.error('Error fetching semester data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (semid && yearid) {
      fetchSemesterData();
    }
  }, [semid, yearid]); // Add dependencies
  
  // Map subjects to AcademicCard format
  const academicSubjects = subjects.map((subject, index) => {
    // Explicitly type the card type as one of the allowed values
    // Define an array of available card types
    const cardTypes: ('primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'purple' | 'teal')[] = [
      'primary', 'secondary', 'success', 'info', 'warning', 'danger', 'purple', 'teal'
    ];
    
    // Use modulo operation to cycle through all card types
    const cardType = cardTypes[index % cardTypes.length];
    
    // Define color pairs for each card type
    const colorPairs = {
      primary: { accent: "#ff3e00", secondary: "#4d61ff" },
      secondary: { accent: "#E99F4C", secondary: "#DE5499" },
      success: { accent: "#2ecc71", secondary: "#27ae60" },
      info: { accent: "#3498db", secondary: "#2980b9" },
      warning: { accent: "#f39c12", secondary: "#e67e22" },
      danger: { accent: "#e74c3c", secondary: "#c0392b" },
      purple: { accent: "#9b59b6", secondary: "#8e44ad" },
      teal: { accent: "#1abc9c", secondary: "#16a085" }
    };
    
    return {
      id: subject.id,
      title: subject.name,
      tagText: subject.code,
      description: subject.description || getDefaultSubjectDescription(subject.name),
      features: getSubjectFeatures(subject.name),
      price: subject._count?.notes.toString() || "0",
      priceDescription: "notes",
      buttonText: "View Notes",
      buttonHref: `/academics/years/${yearid}/semesters/${semid}/subject/${subject.id}`,
      accentColor: colorPairs[cardType].accent,
      secondaryColor: colorPairs[cardType].secondary,
      type: cardType
    };
  });

  // Get semester tag text (Fall/Spring)
  const semesterTagText = semester ? getSemesterTagText(semester.number) : "";

  return (
    <div className="relative w-full min-h-screen bg-[#EDDCD9] py-8 px-4 sm:py-12 sm:px-6 overflow-x-hidden">
      {/* Pattern grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:1em_1em] pointer-events-none opacity-30 z-[1]" />
      
      {/* Overlay dots */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:2em_2em] bg-[-1em_-1em] pointer-events-none opacity-10 z-[1]" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="w-full">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 md:mb-12 text-center"
          >
            <div className="inline-flex items-center justify-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-white border-[0.15em] border-[#050505] rounded-full shadow-[0.2em_0.2em_0_#ff3e00] mb-4">
                <GraduationCap className="w-6 h-6 text-[#050505]" />
              </div>
            </div>
            
            {loading ? (
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#050505] mb-2">
                Loading...
              </h1>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#050505] mb-2">
                  Semester <span className="text-[#ff3e00]">{semester?.number}</span> 
                  {semesterTagText && <span className="text-[#4d61ff]"> ({semesterTagText})</span>}
                </h1>
                
                <p className="max-w-[600px] mx-auto text-[#050505]/80 text-lg mb-4">
                  Year {year?.number} - Select a subject to view available notes
                </p>
              </>
            )}
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-[#ff3e00] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : academicSubjects.length === 0 ? (
            <div className="text-center p-12 bg-white border-[0.15em] border-[#050505] rounded-[0.6em] shadow-[0.4em_0.4em_0_#000]">
              <h3 className="text-2xl font-bold text-[#050505] mb-2">No Subjects Available</h3>
              <p className="text-[#050505]/70">Subjects will be added by the administrators.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Mobile horizontal scroll view with nav buttons */}
              <div className="block md:hidden relative mt-2 mb-6">
                <div className="relative overflow-hidden">
                  <button
                    onClick={scrollLeft}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white border-[0.15em] border-[#050505] rounded-full shadow-[0.1em_0.1em_0_#ff3e00] hover:translate-y-[-0.1em] hover:shadow-[0.15em_0.15em_0_#ff3e00] transition-all duration-200 flex items-center justify-center"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#050505]" />
                  </button>
                  
                  <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto py-4 px-6 snap-x snap-mandatory hide-scrollbar"
                    style={{
                      scrollbarWidth: 'none', // Firefox
                      msOverflowStyle: 'none', // IE/Edge
                    }}
                  >
                    {academicSubjects.map((subject, index) => (
                      <div 
                        key={subject.id} 
                        className="flex-shrink-0 w-[280px] mx-2 snap-center"
                        style={{scrollSnapAlign: 'center'}}
                      >
                        <AcademicCardSubject
                          title={subject.title}
                          tagText={subject.tagText}
                          description={subject.description}
                          features={subject.features}
                          price={subject.price}
                          priceDescription={subject.priceDescription}
                          buttonText={subject.buttonText}
                          buttonHref={subject.buttonHref}
                          accentColor={subject.accentColor}
                          secondaryColor={subject.secondaryColor}
                          type={subject.type}
                          className="mx-auto"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white border-[0.15em] border-[#050505] rounded-full shadow-[0.1em_0.1em_0_#ff3e00] hover:translate-y-[-0.1em] hover:shadow-[0.15em_0.15em_0_#ff3e00] transition-all duration-200 flex items-center justify-center"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="w-5 h-5 text-[#050505]" />
                  </button>
                </div>
                
                {/* Scroll indicator dots */}
                <div className="flex justify-center gap-2 mt-4">
                  {academicSubjects.map((_, index) => (
                    <button 
                      key={index} 
                      className="w-3 h-3 rounded-full bg-[#050505]/30 hover:bg-[#ff3e00]/70 transition-colors duration-200"
                      onClick={() => {
                        if (scrollContainerRef.current) {
                          const cardWidth = 280 + 8; // card width + margin
                          scrollContainerRef.current.scrollLeft = index * cardWidth;
                        }
                      }}
                      aria-label={`Go to subject ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
                {/* Desktop grid layout */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 md:gap-10 lg:gap-14">
                {academicSubjects.map((subject) => (
                  <div key={subject.id} className="flex justify-center">
                    <AcademicCardSubject
                      title={subject.title}
                      tagText={subject.tagText}
                      description={subject.description}
                      features={subject.features}
                      price={subject.price}
                      priceDescription={subject.priceDescription}
                      buttonText={subject.buttonText}
                      buttonHref={subject.buttonHref}
                      accentColor={subject.accentColor}
                      secondaryColor={subject.secondaryColor}
                      type={subject.type}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
            
          <div className="mt-12 flex justify-center gap-4">
            <Link 
              href={`/academics/years/${yearid}`}
              className="inline-flex items-center justify-center px-5 py-2 text-[#050505] font-bold bg-white border-[0.2em] border-[#050505] rounded-[0.4em] shadow-[0.2em_0.2em_0_#ff3e00] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#ff3e00] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#ff3e00] transition-all duration-200"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Year {year?.number}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Corner slice */}
      <div className="absolute bottom-0 left-0 w-[2.5em] h-[2.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#050505] rounded-tr-[0.8em] z-[3]" />
      
      {/* Add the style to hide scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

// Helper functions remain unchanged
function getSemesterTagText(semesterNumber: number): string {
  return semesterNumber % 2 !== 0 ? "Fall" : "Spring";
}

function getDefaultSubjectDescription(subjectName: string): string {
  return `Comprehensive course material for ${subjectName} including lecture notes, practice problems, and study resources.`;
}

function getSubjectFeatures(subjectName: string): { icon: JSX.Element; text: string; }[] {
  // Standard features that all subjects will have
  const standardFeatures = [
    {
      icon: (
        <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
          <path d="M20,4C21.1,4 22,4.9 22,6V18C22,19.1 21.1,20 20,20H4C2.9,20 2,19.1 2,18V6C2,4.9 2.9,4 4,4H20M4,6V18H20V6H4M6,9H18V11H6V9M6,13H16V15H6V13Z" />
        </svg>
      ),
      text: "Lecture Notes",
    },
    {
      icon: (
        <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
          <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
        </svg>
      ),
      text: "Study Materials",
    },
    {
      icon: (
        <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
          <path d="M18,2A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2H18M18,4H6V20H18V4M16,12V14H6V12H16M16,8V10H6V8H16Z" />
        </svg>
      ),
      text: "PYQ's",
    },
    {
      icon: (
        <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
          <path d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z" />
        </svg>
      ),
      text: "Exam Prep",
    },
  ];
  
  return standardFeatures;
}