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

// Check if the current user is an admin using Clerk's public metadata
export async function isAdmin(): Promise<boolean> {
  try {
    const user = await currentUser();
    
    if (!user) {
      console.log("No user found in auth");
      return false;
    }
    
    console.log(`Checking admin status for user: ${user.id}`);
    console.log("User public metadata:", user.publicMetadata);
    
    // Check role from Clerk's public metadata
    const role = user.publicMetadata?.role as string;
    
    if (role === 'ADMIN' || role === 'admin') {
      console.log("User is admin via public metadata");
      return true;
    }
    
    console.log("User is not admin, role:", role);
    return false;
    } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}