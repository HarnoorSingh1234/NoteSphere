import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { isAdmin } from '@/lib/auth';

// Check if the current user has admin access
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Verify admin status
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({ status: 'authorized', role: 'admin' });
  } catch (error: unknown) {
    console.error('Error verifying admin status:', error);
    return NextResponse.json(
      { error: 'Failed to verify admin status' },
      { status: 500 }
    );
  }
}
