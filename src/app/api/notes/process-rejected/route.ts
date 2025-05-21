import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { deleteFileFromDrive } from '@/lib/server/google-drive';

// Time limit in milliseconds (48 hours)
const REJECTION_TIME_LIMIT = 48 * 60 * 60 * 1000;

/**
 * Process expired rejected notes
 */
export async function POST() {
  try {    // Check if user is authorized (admin check)
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json(
        { message: 'Unauthorized' }, 
        { status: 401 }
      );
    }
      // Get user role from database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      select: { role: true }
    });
      // Verify user is an admin
    if (!dbUser || dbUser.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized, admin role required' }, 
        { status: 403 }
      );
    }

    const cutoffDate = new Date(Date.now() - REJECTION_TIME_LIMIT);
  
    // Find rejected notes older than the cutoff date
    const expiredRejectedNotes = await prisma.note.findMany({
      where: {
        isRejected: true,
        rejectedAt: {
          lte: cutoffDate
        }
      },
      include: {
        author: true,
        subject: true,
      }
    });

    console.log(`Found ${expiredRejectedNotes.length} expired rejected notes to process`);
    
    let processedCount = 0;
    const errors: string[] = [];
    
    // Process each expired rejected note
    for (const note of expiredRejectedNotes) {
      try {
        // 1. Create entry in RejectedNote table
        await prisma.rejectedNote.create({
          data: {
            id: note.id, // Using the original note's ID as the RejectedNote's ID
            originalNoteId: note.id,
            title: note.title,
            authorClerkId: note.authorClerkId,
            authorName: `${note.author.firstName} ${note.author.lastName}`,
            subjectId: note.subjectId,
            subjectName: note.subject?.name || "Unknown Subject",
            rejectedAt: note.rejectedAt!,
            deletedAt: new Date(), // Add current date as the deletion date
            driveFileId: note.driveFileId || null // Use null instead of undefined for database fields
          }
        });
        
        // 2. Delete file from Google Drive if driveFileId exists
        if (note.driveFileId) {
          await deleteFileFromDrive(note.driveFileId);
        }
        
        // 3. Delete note from the database
        await prisma.note.delete({
          where: { id: note.id }
        });
        
        processedCount++;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`Failed to process rejected note ${note.id}:`, errorMessage);
        errors.push(`Note ${note.id}: ${errorMessage}`);
      }
    }
    
    return NextResponse.json({
      success: true,
      processedCount,
      errors: errors.length > 0 ? errors : undefined
    });
    
  } catch (error) {
    console.error('Error processing rejected notes:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json(
      { 
        success: false,
        message: errorMessage
      },
      { status: 500 }
    );
  }
}