import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// GET: Retrieve the user's profile data
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
      // Check if user exists in the User table first
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId
      }
    });
    
    if (!user) {
      return new NextResponse("User not found. Please complete registration first.", { status: 404 });
    }
    
    // Get user profile
    const userProfile = await prisma.userProfile.findUnique({
      where: {
        clerkId: userId
      }
    });
    
    if (!userProfile) {
      // Create a new profile if none exists
      const newProfile = await prisma.userProfile.create({
        data: {
          clerkId: userId,
          visibility: true,
        }
      });
      
      return NextResponse.json(newProfile);
    }
    
    // If there's a yearId, fetch the year number
    let yearNumber = null;
    if (userProfile.yearId) {
      const year = await prisma.year.findUnique({
        where: { id: userProfile.yearId }
      });
      
      if (year) {
        yearNumber = year.number;
      }
    }
    
    // If there's a semesterId, fetch the semester number
    let semesterNumber = null;
    if (userProfile.semesterId) {
      const semester = await prisma.semester.findUnique({
        where: { id: userProfile.semesterId }
      });
      
      if (semester) {
        semesterNumber = semester.number;
      }
    }
    
    // Return profile with additional data
    return NextResponse.json({
      ...userProfile,
      yearNumber,
      semesterNumber
    });
      } catch (error) {
    console.error("[PROFILE_GET]", error);
    
    // Provide more details about the error
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new NextResponse(`Internal Error: ${errorMessage}`, { status: 500 });
  }
}

// PUT: Update the user's profile data
export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const {
      bio,
      studentId,
      department,
      yearId,
      semesterId,
      visibility
    } = await req.json();
    
    // Validate semesterId belongs to yearId if both are provided
    if (yearId && semesterId) {
      const semester = await prisma.semester.findUnique({
        where: { id: semesterId }
      });
      
      if (!semester || semester.yearId !== yearId) {
        return new NextResponse("Invalid semester for selected year", { status: 400 });
      }
    }
    
    // Check if student ID is already in use by another user
    if (studentId) {
      const existingProfile = await prisma.userProfile.findUnique({
        where: { studentId }
      });
      
      if (existingProfile && existingProfile.clerkId !== userId) {
        return new NextResponse("Student ID already in use", { status: 400 });
      }
    }
    
    // Create or update user profile
    const updatedProfile = await prisma.userProfile.upsert({
      where: {
        clerkId: userId
      },
      create: {
        clerkId: userId,
        bio,
        studentId,
        department,
        yearId,
        semesterId,
        visibility: visibility !== undefined ? visibility : true,
      },
      update: {
        bio,
        studentId,
        department,
        yearId,
        semesterId,
        visibility: visibility !== undefined ? visibility : undefined,
      }
    });
    
    revalidatePath('/profile/details');
    return NextResponse.json(updatedProfile);
      } catch (error) {
    console.error("[PROFILE_UPDATE]", error);
    
    // Check for specific error types
    if (error instanceof Error) {
      // Check for Prisma client known error codes
      if (error.message.includes('Foreign key constraint failed')) {
        return new NextResponse("User does not exist in the database. Please complete registration first.", { status: 400 });
      }
      
      if (error.message.includes('Unique constraint failed')) {
        return new NextResponse("Student ID is already in use by another user.", { status: 400 });
      }
      
      return new NextResponse(`Error updating profile: ${error.message}`, { status: 500 });
    }
    
    return new NextResponse("Internal Error", { status: 500 });
  }
}
