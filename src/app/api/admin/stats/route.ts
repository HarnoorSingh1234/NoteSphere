import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { isAdmin } from '@/lib/auth';

// GET admin statistics for dashboard
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Verify admin status
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }
    
    // Statistics about users
    const userStats = {
      total: await prisma.user.count()
    };
    
    // Statistics about notes
    const noteStats = {
      total: await prisma.note.count(),
      public: await prisma.note.count({ where: { isPublic: true } }),
      pending: await prisma.note.count({ where: { isPublic: false } }),
      thisWeek: await prisma.note.count({ 
        where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } 
      }),
      thisMonth: await prisma.note.count({ 
        where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } 
      })
    };
    
    // Statistics about interactions
    const interactionStats = {
      totalLikes: await prisma.like.count(),
      totalComments: await prisma.comment.count(),
      totalDownloads: await prisma.note.aggregate({
        _sum: {
          downloadCount: true
        }
      }).then(result => result._sum.downloadCount || 0)
    };
    
    // Get top notes by downloads
    const topNotes = await prisma.note.findMany({
      where: { isPublic: true },
      orderBy: { downloadCount: 'desc' },
      take: 5,
      include: {
        subject: {
          select: {
            name: true,
            semester: {
              select: {
                number: true,
                year: {
                  select: { number: true }
                }
              }
            }
          }
        },
        author: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });
    
    // Get most active subjects
    const topSubjects = await prisma.subject.findMany({
      orderBy: {
        notes: {
          _count: 'desc'
        }
      },
      take: 5,
      include: {
        semester: {
          include: {
            year: true
          }
        },
        _count: {
          select: { notes: true }
        }
      }
    });
    
    // Get recent activity timeline
    const recentActivity = await prisma.$transaction([
      // Recent notes
      prisma.note.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          createdAt: true,
          isPublic: true,
          author: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      }),
      // Recent comments
      prisma.comment.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          note: {
            select: {
              title: true
            }
          }
        }
      })
    ]);
    
    return NextResponse.json({
      userStats,
      noteStats,
      interactionStats,
      topNotes,
      topSubjects,
      recentActivity: {
        notes: recentActivity[0],
        comments: recentActivity[1]
      }
    });
  } catch (error: unknown) {
    console.error('Error fetching admin statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}