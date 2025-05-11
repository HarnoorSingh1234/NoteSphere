'use client'

import React from 'react'
import { Heart, FileText, Download } from 'lucide-react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card'
import { Badge } from '../ui/badge'
import { Note } from '@/types'

interface NoteCardProps {
  note: Note
}

export default function NoteCard({ note }: NoteCardProps) {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-purple-900/20 to-indigo-900/10 border border-zinc-200 dark:border-zinc-800 transition-colors">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between mb-1">
          <Badge
            variant="outline"
            className="text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-700"
          >
            {note.type}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
            <Heart className="h-4 w-4" />
            <span>{note.likes.length}</span>
          </div>
        </div>
        <CardTitle className="line-clamp-2 text-lg text-indigo-900 dark:text-indigo-100">
          <Link href={`/notes/${note.id}`} className="hover:underline">
            {note.title}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
            <FileText className="h-4 w-4" />
            <span>{note.subject.name}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {note.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-xs border border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 p-4">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          {new Date(note.createdAt).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          <Download className="h-4 w-4" />
          <span>{note.downloadCount}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
