import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ noticeid: string }> }
) {
  try {
    const { userId } = await auth();
    const params = await context.params;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

   
    const { title, description, driveLink, driveFileId, isPublished } = await req.json();

    const notice = await prisma.notice.update({
      where: { id: params.noticeid },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(driveLink && { driveLink }),
        ...(driveFileId && { driveFileId }),
        ...(typeof isPublished === 'boolean' && { isPublished }),
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

    return NextResponse.json(notice);
  } catch (error) {
    console.error('Error updating notice:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ noticeid: string }> }
) {
  try {
    const { userId } = await auth();
    const params = await context.params;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    

    await prisma.notice.delete({
      where: { id: params.noticeid },
    });

    return NextResponse.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Error deleting notice:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
