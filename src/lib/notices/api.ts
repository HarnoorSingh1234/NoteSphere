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
export async function fetchNoticeById(noticeId: string): Promise<Notice> {
  const res = await fetch(`/api/notices/${noticeId}`);
  if (!res.ok) throw new Error('Failed to fetch notice');
  return res.json();
}

export async function toggleNoticeLike(noticeId: string): Promise<void> {
  const res = await fetch(`/api/notices/${noticeId}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!res.ok) throw new Error('Failed to update like');
}

export async function postComment(noticeId: string, content: string): Promise<{ comment: Comment }> {
  const res = await fetch(`/api/notices/${noticeId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) throw new Error('Failed to post comment');
  return res.json();
}