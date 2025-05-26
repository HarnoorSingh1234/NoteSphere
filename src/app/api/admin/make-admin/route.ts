import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST() {
  try {
    // Get the current authenticated user
    const authResult = await auth();
    const userId = authResult.userId;
    
    // If user is not authenticated, return unauthorized error
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Update user role to ADMIN in the database
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: { role: "ADMIN" },
      select: { firstName: true, lastName: true, email: true, role: true }
    });

    // Return success response with updated user info
    return NextResponse.json({
      message: "User role updated to admin successfully",
      user: updatedUser
    });
    
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}