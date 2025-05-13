'use client';

import React from 'react';
import { motion } from '@/lib/motion-utils';
import { useEffect } from 'react';
import { 
  NotesIcon,
  DownloadIcon,
  ViewIcon,
  FavoriteIcon,
} from '@/components/ui/NavigationIcons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CanvasBackground } from '@/components/ui/CanvasBackground';

// Hardcoded notes data
const notesFiles = [
  {
    id: '1',
    title: 'Introduction to Calculus',
    subjectId: '1',
    semesterId: '1',
    yearId: '1',
    sectionId: 'AId',
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
    subjectId: '1',
    semesterId: '1',
    yearId: '1',
    sectionId: 'BId',
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
    subjectId: '1',
    semesterId: '1',
    yearId: '1',
    sectionId: 'CId',
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
    subjectId: '1',
    semesterId: '1',
    yearId: '1',
    sectionId: 'DId',
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
  },
  {
    id: '5',
    title: 'Laws of Motion',
    subjectId: '2',
    semesterId: '1',
    yearId: '1',
    sectionId: 'AId',
    type: 'LECTURE',
    description: 'Detailed notes on Newton\'s laws of motion with practical examples and problem-solving techniques.',
    fileUrl: 'https://example.com/files/laws-of-motion.pdf',
    downloadCount: 78,
    createdAt: new Date('2025-02-18'),
    author: {
      name: 'Robert Brown',
      avatar: '/placeholder.svg'
    },
    likes: 19
  },
  {
    id: '6',
    title: 'Organic Chemistry Basics',
    subjectId: '3',
    semesterId: '2',
    yearId: '1',
    sectionId: 'BId',
    type: 'HANDWRITTEN',
    description: 'Comprehensive notes on organic compounds, reactions, and molecular structures.',
    fileUrl: 'https://example.com/files/organic-chemistry.pdf',
    downloadCount: 104,
    createdAt: new Date('2025-03-22'),
    author: {
      name: 'Emily Chen',
      avatar: '/placeholder.svg'
    },
    likes: 27
  },
  {
    id: '7',
    title: 'Cell Biology',
    subjectId: '4',
    semesterId: '2',
    yearId: '1',
    sectionId: 'CId',
    type: 'PDF',
    description: 'In-depth study notes on cell structures, functions, and cellular processes.',
    fileUrl: 'https://example.com/files/cell-biology.pdf',
    downloadCount: 92,
    createdAt: new Date('2025-04-05'),
    author: {
      name: 'Thomas Garcia',
      avatar: '/placeholder.svg'
    },
    likes: 18
  },
  {
    id: '8',
    title: 'Data Structures and Algorithms',
    subjectId: '5',
    semesterId: '3',
    yearId: '2',
    sectionId: 'AId',
    type: 'LECTURE',
    description: 'Comprehensive lecture notes on common data structures and algorithms with implementation examples.',
    fileUrl: 'https://example.com/files/dsa.pdf',
    downloadCount: 156,
    createdAt: new Date('2025-03-17'),
    author: {
      name: 'Alex Kumar',
      avatar: '/placeholder.svg'
    },
    likes: 42
  }
];

export default function AllNotesPage() {
  return (
    <main className="flex-1 p-4 md:p-6 relative">
      <CanvasBackground />

      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">All Study Materials</h1>
            <p className="text-zinc-500 mt-1">
              Browse and download notes from all subjects
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notesFiles.map((note) => (
            <motion.div
              key={note.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="mr-2">{note.title}</CardTitle>
                    <Badge variant="outline">{note.type}</Badge>
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
                    <span className="text-xs text-zinc-400">• {new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-4 text-sm text-zinc-500">
                    <div className="flex items-center">
                      <div className="w-4 h-4 mr-1">
                        <DownloadIcon />
                      </div>
                      {note.downloadCount}
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 mr-1">
                        <FavoriteIcon />
                      </div>
                      {note.likes}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex gap-2">
                  <Button variant="default" size="sm" className="flex-1" asChild>
                    <Link href={`/${note.yearId}/${note.semesterId}/${note.subjectId}/${note.sectionId}/notes/${note.id}`}>
                      <div className="w-4 h-4 mr-2">
                        <ViewIcon />
                      </div>
                      View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <div className="w-4 h-4 mr-2">
                      <DownloadIcon />
                    </div>
                    Download
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
} 