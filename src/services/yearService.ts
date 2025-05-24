import { prisma } from '@/lib/db';

/**
 * Get all academic years
 */
export async function getAllYears() {
  return prisma.year.findMany({
    orderBy: {
      number: 'asc',
    },
  });
}

/**
 * Get year by ID
 */
export async function getYearById(id: string) {
  return prisma.year.findUnique({
    where: { id },
    include: {
      semesters: true,
    },
  });
}

/**
 * Create a new year
 */
export async function createYear(number: number) {
  return prisma.year.create({
    data: {
      number,
    },
  });
}

/**
 * Update an existing year
 */
export async function updateYear(id: string, number: number) {
  return prisma.year.update({
    where: { id },
    data: {
      number,
    },
  });
}

/**
 * Delete a year
 */
export async function deleteYear(id: string) {
  return prisma.year.delete({
    where: { id },
  });
}
