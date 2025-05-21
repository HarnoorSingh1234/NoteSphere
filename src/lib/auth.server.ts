import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./db";

/**
 * Get the current authenticated user
 * @returns The current user or null if not authenticated
 */
export async function getCurrentUser() {
  try {
    const authResult = await auth();
    const userId = authResult.userId;
    if (!userId) return null;

    // Get user from Clerk
    const user = await currentUser();
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function isAdmin(): Promise<boolean> {
  const authResult = await auth();
  const userId = authResult.userId;
  
  if (!userId) return false;
  
  try {
    // Method 1: Check from your database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true }
    });
    
    if (user && user.role === 'ADMIN') {
      return true;
    }
   
   
    
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}