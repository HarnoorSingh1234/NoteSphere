import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Extract content and authorClerkId
    const { content, authorClerkId } = body;
    
    // Validate content
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          message: "Feedback content is required" 
        }, 
        { status: 400 }
      );
    }
    
    // Create the feedback entry - authorClerkId can be null for anonymous feedback
    const feedback = await prisma.feedback.create({
      data: {
        content,
        authorClerkId: authorClerkId || null, // Handle null/undefined case
        viewed: false,
      },
    });
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: "Feedback submitted successfully",
      feedbackId: feedback.id
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error processing feedback submission:", error);
    
    // Return detailed error information
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to process feedback", 
        error: error instanceof Error ? error.message : String(error) 
      }, 
      { status: 500 }
    );
  }
}

// API endpoint to get all feedback (admin only)
export async function GET(request: NextRequest) {
  try {
    // Get current user from Clerk
    const { userId } = await auth();
    
    // If no user is authenticated, return unauthorized
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" }, 
        { status: 401 }
      );
    }
    
    // Fetch the user to check if they are an admin
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true }
    });
    
    // If user not found or not an admin, return unauthorized
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Admin access required" }, 
        { status: 403 }
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