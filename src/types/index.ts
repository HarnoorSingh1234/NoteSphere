export interface User {
  id: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  type: string;
  fileUrl?: string;
  driveFileId?: string;
  fileSize?: number;
  downloadCount: number;
  isPublic: boolean;
  isRejected: boolean;
  rejectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  subjectId: string;
  tags?: string[];
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
  subject?: Subject;
  likes?: Like[];
  comments?: Comment[];
  _count?: {
    likes: number;
    comments: number;
  };
}

export interface Like {
  id: string;
  userId: string;
  noteId: string;
  user?: User;
  note?: Note;
  createdAt: Date;
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  noteId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  note?: Note;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  semesterId: string;
  semester?: Semester;
  notes?: Note[];
  _count?: {
    notes: number;
  };
}

export interface Semester {
  id: string;
  number: number;
  yearId: string;
  year?: Year;
  subjects?: Subject[];
  _count?: {
    subjects: number;
  };
}

export interface Year {
  id: string;
  number: number;
  semesters?: Semester[];
  _count?: {
    semesters: number;
  };
}

export interface StatsData {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}