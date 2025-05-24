import { NoteType, Prisma } from '@prisma/client'

export type { NoteType }

// Define type for Subject with Prisma aggregations
type SubjectWithCount = Prisma.SubjectGetPayload<{
  include: {
    _count: {
      select: {
        notes: true
      }
    }
  }
}>

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

export interface Subject extends Omit<SubjectWithCount, '_count'> {
  id: string
  name: string
  code: string
  semesterId: string
  semester: Semester
  notes: Note[]
  _count?: SubjectWithCount['_count']
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
