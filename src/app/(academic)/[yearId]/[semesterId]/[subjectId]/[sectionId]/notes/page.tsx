'use client'

import React, { useEffect } from 'react'
import { motion } from '@/lib/motion-utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Download, Heart, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { CanvasBackground } from '@/components/ui/CanvasBackground'
import { LoadingLink } from '@/components/ui/LoadingLink'
import { useLoadingNavigation } from '@/components/ui/LoadingProvider'

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

const sections = [
  { id: 'AId', name: 'A' },
  { id: 'BId', name: 'B' },
  { id: 'CId', name: 'C' },
  { id: 'DId', name: 'D' }
];

// Note type color schemes
const noteTypeColors: {
  [key: string]: { accent: string; secondary: string }
} = {
  'LECTURE': { accent: "#4f46e5", secondary: "#818cf8" }, // Indigo
  'HANDWRITTEN': { accent: "#f97316", secondary: "#fb923c" }, // Orange
  'PPT': { accent: "#ec4899", secondary: "#f472b6" }, // Pink
  'PDF': { accent: "#0ea5e9", secondary: "#38bdf8" }, // Blue
  'default': { accent: "#6366f1", secondary: "#818cf8" } // Indigo
};

// Hardcoded notes data
const notesFiles = [
  {
    id: '1',
    title: 'Introduction to Calculus',
    type: 'LECTURE',
    description: 'Comprehensive lecture notes covering the basics of calculus, including limits, derivatives, and integrals.',
    fileUrl: 'https://example.com/files/intro-to-calculus.pdf',
    downloadCount: 124,
    createdAt: new Date('2025-02-15'),
    author: {
      name: 'John Doe',
      avatar: '/placeholder.svg'
    },
    likes: 15
  },
  {
    id: '2',
    title: 'Linear Algebra Fundamentals',
    type: 'HANDWRITTEN',
    description: 'Detailed handwritten notes on vector spaces, matrices, and linear transformations.',
    fileUrl: 'https://example.com/files/linear-algebra.pdf',
    downloadCount: 89,
    createdAt: new Date('2025-02-20'),
    author: {
      name: 'Jane Smith',
      avatar: '/placeholder.svg'
    },
    likes: 23
  },
  {
    id: '3',
    title: 'Differential Equations',
    type: 'PPT',
    description: 'PowerPoint slides covering first-order and second-order differential equations with examples.',
    fileUrl: 'https://example.com/files/diff-equations.pptx',
    downloadCount: 56,
    createdAt: new Date('2025-03-05'),
    author: {
      name: 'Michael Johnson',
      avatar: '/placeholder.svg'
    },
    likes: 8
  },
  {
    id: '4',
    title: 'Probability Theory',
    type: 'PDF',
    description: 'Comprehensive PDF on probability distributions, random variables, and statistical inference.',
    fileUrl: 'https://example.com/files/probability.pdf',
    downloadCount: 112,
    createdAt: new Date('2025-03-12'),
    author: {
      name: 'Sara Wilson',
      avatar: '/placeholder.svg'
    },
    likes: 31
  }
]

function formatDate(date: Date) {
  // Always outputs YYYY-MM-DD
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function NotesPage({ params }: { params: { yearId: string, semesterId: string, subjectId: string, sectionId: string } }) {
  const router = useRouter();
  // Unwrap params for Next.js 15+
  const unwrappedParams = React.use(params);
  const { yearId, semesterId, subjectId, sectionId } = unwrappedParams;
  const { navigateTo } = useLoadingNavigation();
  
  const subject = subjects.find(s => s.id === subjectId);
  const section = sections.find(s => s.id === sectionId) || sections.find(s => s.id === 'AId'); // Fallback to section A if not found
  
  const subjectName = subject ? subject.name : 'Subject';
  const sectionName = section ? section.name : 'Section';
    useEffect(() => {
    // No need to call renderCanvas() as it's handled in CanvasBackground component
  }, []);
  
  return (
    <main className="flex-1 p-4 md:p-6 relative">
      <CanvasBackground />
      
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Notes and Materials</h1>
            <p className="text-zinc-500 mt-1">
              {subjectName}
            </p>
          </div>          <div className="mt-4 md:mt-0">
            <Button 
              variant="secondary" 
              navigateTo="/upload"
            >
              <FileText className="mr-2 h-4 w-4" /> Upload Notes
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notesFiles.map((note) => {
            const colors = noteTypeColors[note.type] || noteTypeColors.default;
            
            return (
              <motion.div
                key={note.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Card 
                  className="h-full flex flex-col"
                  style={{ 
                    borderColor: colors.accent,
                    boxShadow: `0 4px 6px -1px ${colors.accent}20, 0 2px 4px -1px ${colors.accent}10`
                  }}
                >
                  <CardHeader style={{ backgroundColor: `${colors.accent}10` }}>
                    <div className="flex justify-between items-start">
                      <CardTitle className="mr-2">{note.title}</CardTitle>
                      <Badge 
                        variant="outline"
                        style={{ 
                          backgroundColor: colors.accent,
                          color: 'white',
                          borderColor: colors.accent 
                        }}
                      >
                        {note.type}
                      </Badge>
                    </div>
                    <CardDescription>{note.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-center gap-2 mb-4">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={note.author.avatar} alt={note.author.name} />
                        <AvatarFallback>{note.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-zinc-500">{note.author.name}</span>
                      <span className="text-xs text-zinc-400">• {formatDate(note.createdAt)}</span>
                    </div>
                    <div className="flex gap-4 text-sm text-zinc-500">
                      <div className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        {note.downloadCount}
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {note.likes}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex gap-2">
                    <Button 
                      variant="default"                      size="sm" 
                      className="flex-1" 
                      style={{ backgroundColor: colors.accent }}
                      navigateTo={`/${yearId}/${semesterId}/${subjectId}/${sectionId}/notes/${note.id}`}
                    >
                      <Eye className="mr-2 h-4 w-4" /> View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      style={{ borderColor: colors.accent, color: colors.accent }}
                    >
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  )
}
