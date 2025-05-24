'use server';

import { getYearById } from '../services/yearService';
import { getSemestersByYearId } from '../services/semesterService';
export interface YearPageData {
  year: {
    id: string;
    number: number;
  } | null;
  semesters: Array<{
    id: string;
    number: number;
    yearId: string;
    _count?: {
      subjects: number;
    };
  }>;
}

export async function getYearPageData(yearId: string): Promise<YearPageData> {
  try {
    // Fetch year data
    const year = await getYearById(yearId);
    
    // Fetch semesters for this year
    const semesters = await getSemestersByYearId(yearId);
    
    return {
      year,
      semesters
    };
  } catch (error) {
    console.error('Error fetching year page data:', error);
    return {
      year: null,
      semesters: []
    };
  }
}
