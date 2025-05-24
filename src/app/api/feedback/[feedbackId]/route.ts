import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ feedbackId: string }> }
) {
  try {
    // Await the params Promise to get the actual parameters
    const params = await context.params;
    const { feedbackId } = params;
    
    const user = await getCurrentUser();
    
    // Parse the request body to get the new viewed status
    const body = await request.json();
    const { viewed } = body;
    
    if (typeof viewed !== 'boolean') {
      return NextResponse.json(
        { success: false, message: "Invalid viewed status" }, 
        { status: 400 }
      );
    }
    
    // Update the feedback item
    const updatedFeedback = await prisma.feedback.update({
      where: { id: feedbackId },
      data: { viewed },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    
    return NextResponse.json({
      success: true,
      feedback: updatedFeedback,
      message: `Feedback marked as ${viewed ? 'viewed' : 'unviewed'}`
    });
    
  } catch (error) {
    console.error("Error updating feedback status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update feedback status" }, 
      { status: 500 }
    );
  }
}