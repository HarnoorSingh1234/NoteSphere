// app/(academic)/[yearId]/[semesterId]/subject/page.tsx
'use client'

import Link from 'next/link'
import React, { use, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { motion } from '@/lib/motion-utils'
import { FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import NavigationCard from '@/components/ui/NavigationCard'
import { SubjectIcon, SectionIcon, NotesIcon } from '@/components/ui/NavigationIcons'
import { renderCanvas } from '@/components/ui/canvas'

const subjects = [
  { id: '1', semesterId: '1', name: 'Mathematics', code: 'MATH101' },
  { id: '2', semesterId: '1', name: 'Physics', code: 'PHY101' },
  { id: '3', semesterId: '2', name: 'Chemistry', code: 'CHEM101' },
  { id: '4', semesterId: '2', name: 'Biology', code: 'BIO101' },
  { id: '5', semesterId: '3', name: 'Computer Science', code: 'CS201' },
  { id: '6', semesterId: '3', name: 'Mechanics', code: 'MECH201' },
  { id: '7', semesterId: '4', name: 'Electronics', code: 'ELEC201' },
  { id: '8', semesterId: '4', name: 'Statistics', code: 'STAT201' },
]

// Subject-specific color schemes
const subjectColors = {
  'Mathematics': { accent: "#4f46e5", secondary: "#818cf8" }, // Indigo
  'Physics': { accent: "#0ea5e9", secondary: "#38bdf8" }, // Blue
  'Chemistry': { accent: "#06b6d4", secondary: "#22d3ee" }, // Cyan
  'Biology': { accent: "#22c55e", secondary: "#4ade80" }, // Green
  'Computer Science': { accent: "#7c3aed", secondary: "#a78bfa" }, // Violet
  'Mechanics': { accent: "#f97316", secondary: "#fb923c" }, // Orange
  'Electronics': { accent: "#ef4444", secondary: "#f87171" }, // Red
  'Statistics': { accent: "#ec4899", secondary: "#f472b6" }, // Pink
  // Default color
  'default': { accent: "#6366f1", secondary: "#818cf8" } // Indigo
};

export default function SubjectPage({ params }: { params: { yearId: string, semesterId: string } }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const { yearId, semesterId } = unwrappedParams;
  const filteredSubjects = subjects.filter(s => s.semesterId === semesterId);
  
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
            <h1 className="text-2xl font-bold">Select Subject</h1>
            <p className="text-zinc-500 mt-1">
              Browse subjects for Year {yearId}, Semester {semesterId}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={() => router.push('/upload')}>
              <FileText className="mr-2 h-4 w-4" /> Upload Notes
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center">
          {filteredSubjects.map((subject) => (
            <motion.div
              key={subject.id}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <NavigationCard
                title={subject.name}
                tagText={subject.code}
                description={`Access all materials for ${subject.name} including lecture notes, tutorials, and exam preparation.`}
                features={[
                  { icon: <SubjectIcon />, text: subject.name },
                  { icon: <SectionIcon />, text: "Multiple Sections" },
                  { icon: <NotesIcon />, text: "Study Materials" },
                ]}
                buttonText="View Sections"
                buttonHref={`/${yearId}/${semesterId}/${subject.id}/section`}
                accentColor={subjectColors[subject.name]?.accent || subjectColors.default.accent}
                secondaryColor={subjectColors[subject.name]?.secondary || subjectColors.default.secondary}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}