import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET popular subjects sorted by likes count
export async function GET() {
  try {
    // Get subjects with their note counts and aggregate likes
    const subjects = await prisma.subject.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        semester: {
          select: {
            number: true,
            year: {
              select: {
                number: true
              }
            }
          }
        },
        notes: {
          select: {
            id: true,
            likes: {
              select: {
                id: true
              }
            }
          }
        },
        _count: {
          select: {
            notes: true
          }
        }
      },
      orderBy: [
        { name: 'asc' }
      ]
    });

    // Calculate total likes for each subject
    const subjectsWithLikes = subjects.map(subject => {
      const totalLikes = subject.notes.reduce((total, note) => total + note.likes.length, 0);
      return {
        id: subject.id,
        name: subject.name,
        code: subject.code,
        semester: subject.semester,
        notesCount: subject._count.notes,
        likesCount: totalLikes
      };
    });

    // Sort by likes count (descending)
    subjectsWithLikes.sort((a, b) => b.likesCount - a.likesCount);

    return NextResponse.json({ subjects: subjectsWithLikes.slice(0, 5) });
  } catch (error: unknown) {
    console.error('Error fetching popular subjects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular subjects' },
      { status: 500 }
    );
  }
}
