'use server';

import { prisma } from '@/lib/db';

// Example admin service function
export async function getAdminDashboardStats() {
  const totalUsers = await prisma.user.count();
  const totalNotes = await prisma.note.count();
  const totalSubjects = await prisma.subject.count();
  
  return {
    totalUsers,
    totalNotes,
    totalSubjects,
  };
}