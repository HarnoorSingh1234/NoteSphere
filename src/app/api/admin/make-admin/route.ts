import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST() {
  try {
    // Get the current authenticated user
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is already admin in Clerk metadata
    const role = user.publicMetadata.role;
    if (role !== "ADMIN") {
      return NextResponse.json(
        { error: "User must be made admin in Clerk first" },
        { status: 403 }
      );
    }

    // Update user role to ADMIN in the database to match Clerk
    const updatedUser = await prisma.user.update({
      where: { clerkId: user.id },
      data: { role: "ADMIN" },
      select: { firstName: true, lastName: true, email: true, role: true }
    });

    // Return success response with updated user info
    return NextResponse.json({
      message: "User role updated to admin in database to match Clerk metadata",
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