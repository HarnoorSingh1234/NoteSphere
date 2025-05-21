import { prisma } from './db';
import { deleteFileFromDrive } from './server/google-drive';

// Time limit in milliseconds (48 hours)
const REJECTION_TIME_LIMIT = 48 * 60 * 60 * 1000; 

/**
 * Processes notes that have been rejected for more than 48 hours
 * - Moves their data to RejectedNote table
 * - Deletes the file from Google Drive
 * - Removes the note from the database
 */
export async function processExpiredRejectedNotes() {
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
  
  // Process each expired rejected note
  for (const note of expiredRejectedNotes) {
    try {      // 1. Create entry in RejectedNote table
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
        try {
          await deleteFileFromDrive(note.driveFileId);
          console.log(`Successfully deleted file from Google Drive: ${note.driveFileId}`);
        } catch (error) {
          console.error(`Failed to delete file from Google Drive: ${note.driveFileId}`, error);
        }
      }
      
      // 3. Delete any likes and comments associated with the note
      await prisma.like.deleteMany({
        where: { noteId: note.id }
      });
      
      await prisma.comment.deleteMany({
        where: { noteId: note.id }
      });
      
      // 4. Delete the note from database
      await prisma.note.delete({
        where: { id: note.id }
      });
      
      console.log(`Successfully processed expired rejected note: ${note.id}`);
    } catch (error) {
      console.error(`Failed to process expired rejected note ${note.id}:`, error);
    }
  }
  
  return expiredRejectedNotes.length;
}

/**
 * Calculates how many hours remain before a rejected note is permanently deleted
 * @param rejectedAt Date when the note was rejected
 * @returns Number of hours remaining, or 0 if already expired
 */
export function calculateRemainingHours(rejectedAt: Date | null | undefined): number {
  if (!rejectedAt) return 0;
  
  const rejectionTime = new Date(rejectedAt).getTime();
  const deletionTime = rejectionTime + REJECTION_TIME_LIMIT;
  const timeRemaining = Math.max(0, deletionTime - Date.now());
  return Math.floor(timeRemaining / (1000 * 60 * 60));
}
