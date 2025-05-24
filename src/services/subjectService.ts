'use server';

import { prisma } from '@/lib/db';

export async function getAllSubjects() {
  return prisma.subject.findMany({
    include: {
      semester: {
        include: {
          year: true,
        },
      },
      _count: {
        select: { notes: true },
      },
    },
    orderBy: { name: 'asc' },
  });
}

export async function getSubjectById(id: string) {
  return prisma.subject.findUnique({
    where: { id },
    include: {
      semester: {
        include: {
          year: true,
        },
      },
      notes: {
        include: {
          author: true,
          _count: {
            select: { likes: true, comments: true },
          },
        },
      },
    },
  });
}