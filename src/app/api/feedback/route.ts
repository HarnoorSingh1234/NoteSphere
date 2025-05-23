import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Manual validation
    const { content, authorClerkId } = body;
    
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          message: "Feedback content is required" 
        }, 
        { status: 400 }
      );
    }
    
    // Check if authorClerkId is a string or null
    if (authorClerkId !== null && typeof authorClerkId !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid author ID format" 
        }, 
        { status: 400 }
      );
    }
    
    // If authorClerkId is provided, verify the user exists
    if (authorClerkId) {
      const user = await getCurrentUser();
      
      // If user is not authenticated but trying to submit with a clerkId
      if (!user || user.id !== authorClerkId) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" }, 
          { status: 401 }
        );
      }
    }
    
    // Create the feedback entry
    const feedback = await prisma.feedback.create({
      data: {
        content,
        authorClerkId,
        viewed: false,
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Feedback submitted successfully",
      feedbackId: feedback.id
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error processing feedback submission:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process feedback" }, 
      { status: 500 }
    );
  }
}

// API endpoint to get all feedback (admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    // Check if user is an admin
    if (!user || user.publicMetadata?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" }, 
        { status: 401 }
      );
    }
    
    // Get query parameters
    const url = new URL(request.url);
    const viewedFilter = url.searchParams.get('viewed');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Build the where clause based on filters
    const where: any = {};
    if (viewedFilter === 'true') {
      where.viewed = true;
    } else if (viewedFilter === 'false') {
      where.viewed = false;
    }
    
    // Get feedback with pagination
    const feedback = await prisma.feedback.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      skip,
      take: limit,
    });
    
    // Get total count for pagination
    const totalCount = await prisma.feedback.count({ where });
    
    return NextResponse.json({
      success: true,
      feedback,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
    
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch feedback" }, 
      { status: 500 }
    );
  }
}
