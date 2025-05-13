'use client'

import React, { useState, use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileText, Download, Heart, ChevronLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { CanvasBackground } from '@/components/ui/CanvasBackground'

// Hardcoded notes data matching the list from the notes page
const notesFiles = [
  {
    id: '1',
    title: 'Introduction to Calculus',
    type: 'LECTURE',
    description: 'Comprehensive lecture notes covering the basics of calculus, including limits, derivatives, and integrals.',
    content: 'This is a detailed overview of calculus fundamentals. The notes cover limits, continuity, derivatives, and integrals in depth.',
    fileUrl: 'https://example.com/files/intro-to-calculus.pdf',
    downloadCount: 124,
    createdAt: new Date('2025-02-15'),
    author: {
      name: 'John Doe',
      avatar: '/placeholder.svg'
    },
    likes: 15,
    subject: {
      name: 'Mathematics',
      code: 'MATH101'
    },
    tags: [
      { id: '1', name: 'Calculus' },
      { id: '2', name: 'Beginner' },
      { id: '3', name: 'Derivatives' }
    ]
  },
  {
    id: '2',
    title: 'Linear Algebra Fundamentals',
    type: 'HANDWRITTEN',
    description: 'Detailed handwritten notes on vector spaces, matrices, and linear transformations.',
    content: 'These handwritten notes cover vector spaces, linear transformations, matrix operations, and eigen values in detail.',
    fileUrl: 'https://example.com/files/linear-algebra.pdf',
    downloadCount: 89,
    createdAt: new Date('2025-02-20'),
    author: {
      name: 'Jane Smith',
      avatar: '/placeholder.svg'
    },
    likes: 23,
    subject: {
      name: 'Mathematics',
      code: 'MATH101'
    },
    tags: [
      { id: '4', name: 'Linear Algebra' },
      { id: '5', name: 'Matrices' },
      { id: '6', name: 'Vectors' }
    ]
  },
  {
    id: '3',
    title: 'Differential Equations',
    type: 'PPT',
    description: 'PowerPoint slides covering first-order and second-order differential equations with examples.',
    content: 'These slides present first-order and second-order differential equations with numerous practical examples.',
    fileUrl: 'https://example.com/files/diff-equations.pptx',
    downloadCount: 56,
    createdAt: new Date('2025-03-05'),
    author: {
      name: 'Michael Johnson',
      avatar: '/placeholder.svg'
    },
    likes: 8,
    subject: {
      name: 'Mathematics',
      code: 'MATH101'
    },
    tags: [
      { id: '7', name: 'Differential Equations' },
      { id: '8', name: 'ODEs' }
    ]
  },
  {
    id: '4',
    title: 'Probability Theory',
    type: 'PDF',
    description: 'Comprehensive PDF on probability distributions, random variables, and statistical inference.',
    content: 'A thorough coverage of probability distributions, random variables, and statistical inference methods.',
    fileUrl: 'https://example.com/files/probability.pdf',
    downloadCount: 112,
    createdAt: new Date('2025-03-12'),
    author: {
      name: 'Sara Wilson',
      avatar: '/placeholder.svg'
    },
    likes: 31,
    subject: {
      name: 'Mathematics',
      code: 'MATH101'
    },
    tags: [
      { id: '9', name: 'Probability' },
      { id: '10', name: 'Statistics' }
    ]
  }
]

export default function NoteDetailPage({ params }: { params: { yearId: string, semesterId: string, subjectId: string, sectionId: string, noteId: string } }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const { yearId, semesterId, subjectId, sectionId, noteId } = unwrappedParams;
  const note = notesFiles.find(n => n.id === noteId);
  const [liked, setLiked] = React.useState(false);

  if (!note) return notFound();
  
  return (
    <main className="flex-1 p-4 md:p-6 relative">
      <CanvasBackground />
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <Link href={`/${yearId}/${semesterId}/${subjectId}/${sectionId}/notes`} className="inline-flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Notes
          </Link>            
          <div className="mt-4 md:mt-0">
            <Button variant="secondary" onClick={() => router.push('/upload')}>
              <FileText className="mr-2 h-4 w-4" /> Upload Notes
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">{note.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-zinc-500">By {note.author.name}</span>
              <span className="text-sm text-zinc-500">{new Date(note.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download ({note.downloadCount})
            </Button>
            <Button 
              variant="secondary"
              className={liked ? "bg-red-500 text-white hover:bg-red-600" : ""}
              onClick={() => setLiked(!liked)}
            >
              <Heart className={`mr-2 h-4 w-4 ${liked ? "fill-current" : ""}`} />
              Like ({note.likes})
            </Button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <Badge variant="outline">{note.type}</Badge>
          <Badge variant="outline">{note.subject.name}</Badge>
          {note.tags.map(tag => (
            <Badge key={tag.id} variant="secondary">{tag.name}</Badge>
          ))}
        </div>

        <div className="mb-8">
          <iframe 
            src={note.fileUrl} 
            className="w-full h-[600px] rounded-lg border"
            title={note.title}
          />
        </div>
      </div>
    </main>
  )
}
