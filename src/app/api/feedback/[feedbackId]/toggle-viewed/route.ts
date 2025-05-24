import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { feedbackId: string } }
) {
  try {
    const user = await getCurrentUser();
    
    // Check if user is an admin
    if (!user || user.publicMetadata?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const feedbackId = params.feedbackId;

    // Find the feedback first
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
    });

    if (!feedback) {
      return NextResponse.json(
        { success: false, message: "Feedback not found" }, 
        { status: 404 }
      );
    }

    // Toggle the viewed status
    const updatedFeedback = await prisma.feedback.update({
      where: { id: feedbackId },
      data: { viewed: !feedback.viewed },
    });

    return NextResponse.json({
      success: true,
      message: `Feedback marked as ${updatedFeedback.viewed ? 'viewed' : 'unviewed'}`,
      feedback: updatedFeedback,
    });
    
  } catch (error) {
    console.error("Error toggling feedback viewed status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update feedback status" }, 
      { status: 500 }
    );
  }
}