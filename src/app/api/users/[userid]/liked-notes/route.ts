import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userid: string }> }
) {
  try {
    const params = await context.params;
    const userId = params.userid;
    
    // Extract limit from query parameters (default: 10)
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;
    
    // Fetch notes that the user has liked
    const likes = await prisma.like.findMany({
      where: {
        userId: userId,
        noteId: { not: null }, // Only get likes for notes (not notices)
      },
      include: {
        note: {
          include: {
            subject: {
              include: {
                semester: {
                  include: {
                    year: true,
                  },
                },
              },
            },
            author: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: skip,
    });

    // Count total likes for pagination
    const totalLikes = await prisma.like.count({
      where: {
        userId: userId,
        noteId: { not: null },
      },
    });
    
    // Extract just the notes from the likes and handle potential null values
    const notes = likes
      .map(like => like.note)
      .filter(note => note !== null);

    return NextResponse.json({
      notes,
      pagination: {
        total: totalLikes,
        page,
        limit,
        totalPages: Math.ceil(totalLikes / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching liked notes:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
