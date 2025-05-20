export interface Note {
  id: string;
  title: string;
  content: string;
  type: any; // Using any instead of NoteType to avoid import issues
  fileUrl: string;
  driveFileId?: string;
  isPublic: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  authorClerkId: string;
  subjectId: string;
  likes: {
    userId: string;
  }[];
  comments: {
    id: string;
  }[];
  author: {
    firstName: string;
    lastName: string;
  };
}
