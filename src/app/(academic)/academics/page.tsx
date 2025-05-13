'use client';

import React from 'react';
import { motion } from '@/lib/motion-utils';
import NavigationCard from '@/components/ui/NavigationCard';
import { renderCanvas } from '@/components/ui/canvas';
import { useEffect } from 'react';
import { 
  YearIcon, 
  SemesterIcon, 
  SubjectIcon, 
  SectionIcon, 
  NotesIcon,
  UploadIcon,
  CollaborateIcon,
  SearchIcon
} from '@/components/ui/NavigationIcons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Years data
const years = [
  { id: '1', name: 'First Year' },
  { id: '2', name: 'Second Year' },
  { id: '3', name: 'Third Year' },
  { id: '4', name: 'Fourth Year' }
];

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
];

// Sections data
const sections = [
  { id: 'AId', name: 'A' },
  { id: 'BId', name: 'B' },
  { id: 'CId', name: 'C' },
  { id: 'DId', name: 'D' }
];

export default function AcademicsPage() {
  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <main className="flex-1 p-4 md:p-6 relative">
      <canvas
        className="bg-skin-base pointer-events-none absolute inset-0 mx-auto"
        id="canvas"
      ></canvas>

      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Academic Resources</h1>
            <p className="text-zinc-500 mt-1">
              Browse courses, materials, and notes by category
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Link href="/upload">
              <Button variant="default">
                Upload Notes
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="outline">
                Search
              </Button>
            </Link>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Browse by Year</h2>
          <div className="flex flex-wrap justify-center">
            {years.map((year) => (
              <motion.div
                key={year.id}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <NavigationCard
                  title={year.name}
                  tagText="Year"                  description={`Access all resources, subjects, and study materials for ${year.name.toLowerCase()} courses.`}
                  features={[
                    { icon: <SemesterIcon />, text: `${year.id === '1' || year.id === '2' ? '2' : '2'} Semesters` },
                    { icon: <SubjectIcon />, text: "Multiple Subjects" },
                    { icon: <NotesIcon />, text: "Study Materials" },
                    { icon: <CollaborateIcon />, text: "Peer Notes" }
                  ]}
                  buttonText="Explore Year"
                  buttonHref={`/${year.id}/semester`}
                  accentColor={
                    year.id === '1' ? "#4f46e5" : 
                    year.id === '2' ? "#ea580c" : 
                    year.id === '3' ? "#0ea5e9" : 
                    "#16a34a"
                  }
                />
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
} 