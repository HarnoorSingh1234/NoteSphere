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

// Add debug logging to check if the user is found
export async function isAdmin(): Promise<boolean> {
  const authResult = await auth();
  const userId = authResult.userId;
  
  if (!userId) {
    console.log("No userId found in auth");
    return false;
  }
    
  try {
    console.log(`Checking admin status for user: ${userId}`);
    
    // Check from your database only
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true }
    });
    
    console.log("Database query result:", user);
    
    if (user && user.role === 'ADMIN') {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}