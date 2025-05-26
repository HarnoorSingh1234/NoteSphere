export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    clerkId: string;
  };
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  driveLink: string;
  driveFileId: string | null;
  createdAt: string;
  author: {
    firstName: string;
    lastName: string;
    image: string | null;
  };
  likes: { userId: string }[];
  _count?: {
    likes: number;
    comments: number;
  };
  comments: Comment[];
}
