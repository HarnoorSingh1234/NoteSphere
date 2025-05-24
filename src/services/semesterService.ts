import { prisma } from '@/lib/db';

/**
 * Get all semesters
 */
export async function getAllSemesters() {
  return prisma.semester.findMany({
    include: {
      year: true,
    },
    orderBy: {
      number: 'asc',
    },
  });
}

/**
 * Get semester by ID
 */
export async function getSemesterById(id: string) {
  return prisma.semester.findUnique({
    where: { id },
    include: {
      year: true,
      subjects: true,
    },
  });
}

/**
 * Get semesters by year ID
 */
export async function getSemestersByYearId(yearId: string) {
  return prisma.semester.findMany({
    where: {
      yearId,
    },
    include: {
      _count: {
        select: {
          subjects: true,
        },
      },
    },
    orderBy: {
      number: 'asc',
    },
  });
}

/**
 * Create a new semester
 */
export async function createSemester(data: { number: number; yearId: string }) {
  return prisma.semester.create({
    data,
    include: {
      year: true,
    },
  });
}

/**
 * Update an existing semester
 */
export async function updateSemester(
  id: string,
  data: { number?: number; yearId?: string }
) {
  return prisma.semester.update({
    where: { id },
    data,
    include: {
      year: true,
    },
  });
}

/**
 * Delete a semester
 */
export async function deleteSemester(id: string) {
  return prisma.semester.delete({
    where: { id },
  });
}
