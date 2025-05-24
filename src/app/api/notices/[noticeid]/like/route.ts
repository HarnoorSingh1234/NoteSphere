import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ noticeid: string }> }
) {
  try {
    const { userId } = await auth();
    const params = await context.params;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Check if user already liked this notice
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        noticeId: params.noticeid,
      },
    });

    if (existingLike) {
      // Unlike - remove the like
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      
      return NextResponse.json({ liked: false });
    } else {
      // Like - create a new like
      await prisma.like.create({
        data: {
          userId,
          noticeId: params.noticeid,
        },
      });
      
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
