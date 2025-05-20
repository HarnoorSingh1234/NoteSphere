import { NoteType } from '@prisma/client'

export type { NoteType }

export interface User {
  clerkId: string
  email: string
  firstName: string
  lastName: string
  createdAt: Date

  notes: Note[]
  likes: Like[]
  comments: Comment[]
}

export interface Year {
  id: string
  number: number
  semesters: Semester[]
}

export interface Semester {
  id: string
  number: number
  yearId: string
  year: Year
  subjects: Subject[]
}

export interface Subject {
  id: string
  name: string
  code: string
  semesterId: string
  semester: Semester
  notes: Note[]
}


export interface Note {
  id: string
  title: string
  content: string
  type: NoteType
  fileUrl: string
  downloadCount: number
  createdAt: Date
  updatedAt: Date
  isRejected: boolean
  isPublic: boolean

  authorClerkId: string
  author: User
  subjectId: string
  subject: Subject
  likes: Like[]
  comments: Comment[]
  tags: Tag[]
}

export interface Like {
  id: string
  userId: string
  user: User
  noteId: string
  note: Note
  createdAt: Date
}

export interface Comment {
  id: string
  content: string
  createdAt: Date

  userId: string
  user: User
  noteId: string
  note: Note
  parentId?: string
  parent?: Comment
  replies: Comment[]
}

export interface Tag {
  id: string
  name: string
  notes: Note[]
}
