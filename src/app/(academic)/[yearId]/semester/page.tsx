// app/(academic)/[yearId]/semester/page.tsx
'use client'

import Link from 'next/link'
import React, { use, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { motion } from '@/lib/motion-utils'
import { FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import NavigationCard from '@/components/ui/NavigationCard'
import { SemesterIcon, SubjectIcon, NotesIcon } from '@/components/ui/NavigationIcons'
import { renderCanvas } from '@/components/ui/canvas'

const semesters = [
  { id: '1', yearId: '1', number: 1 },
  { id: '2', yearId: '1', number: 2 },
  { id: '3', yearId: '2', number: 3 },
  { id: '4', yearId: '2', number: 4 },
  { id: '5', yearId: '3', number: 5 },
  { id: '6', yearId: '3', number: 6 },
  { id: '7', yearId: '4', number: 7 },
  { id: '8', yearId: '4', number: 8 },
]

// Semester accent colors
const semesterColors = {
  1: { accent: "#4f46e5", secondary: "#818cf8" }, // Indigo
  2: { accent: "#8b5cf6", secondary: "#a78bfa" }, // Purple
  3: { accent: "#ec4899", secondary: "#f472b6" }, // Pink
  4: { accent: "#ef4444", secondary: "#f87171" }, // Red
  5: { accent: "#f97316", secondary: "#fb923c" }, // Orange
  6: { accent: "#eab308", secondary: "#facc15" }, // Yellow
  7: { accent: "#22c55e", secondary: "#4ade80" }, // Green
  8: { accent: "#06b6d4", secondary: "#22d3ee" }  // Cyan
};

export default function SemesterPage({ params }: { params: { yearId: string } }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const { yearId } = unwrappedParams;
  const filteredSemesters = semesters.filter(s => s.yearId === yearId);
  
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
            <h1 className="text-2xl font-bold">Select Semester</h1>
            <p className="text-zinc-500 mt-1">
              Choose a semester to browse subjects and materials
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={() => router.push('/upload')}>
              <FileText className="mr-2 h-4 w-4" /> Upload Notes
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center">
          {filteredSemesters.map((semester) => (
            <motion.div
              key={semester.id}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <NavigationCard
                title={`Semester ${semester.number}`}
                tagText="Semester"
                description={`Access all subjects and materials for semester ${semester.number}.`}
                features={[
                  { icon: <SemesterIcon />, text: `Semester ${semester.number}` },
                  { icon: <SubjectIcon />, text: "Multiple Subjects" },
                  { icon: <NotesIcon />, text: "Study Materials" },
                ]}
                buttonText="Browse Subjects"
                buttonHref={`/${yearId}/${semester.id}/subject`}
                accentColor={semesterColors[semester.number]?.accent || "#4f46e5"}
                secondaryColor={semesterColors[semester.number]?.secondary || "#818cf8"}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}