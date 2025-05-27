import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

   
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }
    const notices = await prisma.notice.findMany({
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(notices);
  } catch (error) {
    console.error('Error fetching notices:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

   

    const { title, description, driveLink, driveFileId } = await req.json();

    if (!title || !description || !driveLink) {
      return NextResponse.json(
        { error: 'Title, description, and drive link are required' },
        { status: 400 }
      );
    }

    const notice = await prisma.notice.create({
      data: {
        title,
        description,
        driveLink,
        driveFileId,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json(notice, { status: 201 });
  } catch (error) {
    console.error('Error creating notice:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
