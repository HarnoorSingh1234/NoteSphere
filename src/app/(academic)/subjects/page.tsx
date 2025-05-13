'use client';

import React from 'react';
import { motion } from '@/lib/motion-utils';
import NavigationCard from '@/components/ui/NavigationCard';
import { renderCanvas } from '@/components/ui/canvas';
import { useEffect } from 'react';
import { 
  SubjectIcon, 
  SectionIcon, 
  NotesIcon,
  UploadIcon,
  SearchIcon
} from '@/components/ui/NavigationIcons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Semesters data
const semesters = [
  { id: '1', yearId: '1', number: 1 },
  { id: '2', yearId: '1', number: 2 },
  { id: '3', yearId: '2', number: 3 },
  { id: '4', yearId: '2', number: 4 },
  { id: '5', yearId: '3', number: 5 },
  { id: '6', yearId: '3', number: 6 },
  { id: '7', yearId: '4', number: 7 },
  { id: '8', yearId: '4', number: 8 },
];

// Subjects data
const subjects = [
  { id: '1', semesterId: '1', name: 'Mathematics', code: 'MATH101' },
  { id: '2', semesterId: '1', name: 'Physics', code: 'PHY101' },
  { id: '3', semesterId: '2', name: 'Chemistry', code: 'CHEM101' },
  { id: '4', semesterId: '2', name: 'Biology', code: 'BIO101' },
  { id: '5', semesterId: '3', name: 'Computer Science', code: 'CS201' },
  { id: '6', semesterId: '3', name: 'Mechanics', code: 'MECH201' },
  { id: '7', semesterId: '4', name: 'Electronics', code: 'ELEC201' },
  { id: '8', semesterId: '4', name: 'Statistics', code: 'STAT201' },
  { id: '9', semesterId: '5', name: 'Database Systems', code: 'DB301' },
  { id: '10', semesterId: '5', name: 'Web Development', code: 'WEB301' },
  { id: '11', semesterId: '6', name: 'Artificial Intelligence', code: 'AI301' },
  { id: '12', semesterId: '6', name: 'Operating Systems', code: 'OS301' },
];

// Sections data
const sections = [
  { id: 'AId', name: 'A' },
  { id: 'BId', name: 'B' },
  { id: 'CId', name: 'C' },
  { id: 'DId', name: 'D' }
];

export default function SubjectsPage() {
  useEffect(() => {
    renderCanvas();
  }, []);

  // Group subjects by year
  const groupedSubjects = subjects.reduce((groups, subject) => {
    const semester = semesters.find(s => s.id === subject.semesterId);
    const yearId = semester ? semester.yearId : '1';
    
    if (!groups[yearId]) {
      groups[yearId] = [];
    }
    
    groups[yearId].push({
      ...subject,
      yearId,
      semesterNumber: semester ? semester.number : 0
    });
    
    return groups;
  }, {});

  return (
    <main className="flex-1 p-4 md:p-6 relative">
      <canvas
        className="bg-skin-base pointer-events-none absolute inset-0 mx-auto"
        id="canvas"
      ></canvas>

      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">All Subjects</h1>
            <p className="text-zinc-500 mt-1">
              Browse all available subjects and access their study materials
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Link href="/upload">
              <Button variant="default">
                Upload Notes
              </Button>
            </Link>
            <Link href="/academics">
              <Button variant="outline">
                Back to Academics
              </Button>
            </Link>
          </div>
        </div>

        {Object.keys(groupedSubjects).map((yearId) => (
          <section className="mb-12" key={yearId}>
            <h2 className="text-xl font-bold mb-4">Year {yearId} Subjects</h2>
            <div className="flex flex-wrap justify-center">
              {groupedSubjects[yearId].map((subject) => (
                <motion.div
                  key={subject.id}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <NavigationCard
                    title={subject.name}
                    tagText={subject.code}
                    description={`Access all ${subject.name} materials for Semester ${subject.semesterNumber}.`}
                    features={[
                      { icon: <NotesIcon />, text: "Lecture Notes" },
                      { icon: <SectionIcon />, text: `${sections.length} Sections` },
                      { icon: <UploadIcon />, text: "Upload Materials" },
                      { icon: <SearchIcon />, text: "Find Resources" }
                    ]}
                    buttonText="View Subject"
                    buttonHref={`/${subject.yearId}/${subject.semesterId}/${subject.id}/section`}
                    accentColor={
                      subject.yearId === '1' ? "#4f46e5" : 
                      subject.yearId === '2' ? "#ea580c" : 
                      subject.yearId === '3' ? "#0ea5e9" : 
                      "#16a34a"
                    }
                    secondaryColor="#4f46e5"
                  />
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
} 