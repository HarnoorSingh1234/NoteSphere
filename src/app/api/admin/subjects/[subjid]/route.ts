import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { fetchAdminSubject } from '@/lib/admin-subject-actions';

export async function GET(
  request: Request,
  context: { params: Promise<{ subjid: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    try {
      // Await the params Promise to get the actual parameters
      const params = await context.params;
      
      // Use the separated server action function to fetch subject data
      const subject = await fetchAdminSubject(params.subjid);
      return NextResponse.json({ subject });
    } catch (error: any) {
      // Handle specific errors
      if (error.message === 'Forbidden: Only admins can perform this action') {
        return NextResponse.json(
          { error: 'Forbidden: Only admins can access this endpoint' },
          { status: 403 }
        );
      }
      
      if (error.message === 'Subject not found') {
        return NextResponse.json(
          { error: 'Subject not found' },
          { status: 404 }
        );
      }
      
      // Generic server error
      console.error('Error in admin subject route:', error);
      return NextResponse.json(
        { error: 'Failed to fetch subject' },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Unexpected error in route handler:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}