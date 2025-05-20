'use client';

import { NoteType } from '@prisma/client';

/**
 * Determines the color scheme for a note based on its type
 * @param type The type of the note (PDF, PPT, LECTURE, HANDWRITTEN)
 * @returns An object with color and bgColor properties
 */
export const getNoteTypeDetails = (type: NoteType) => {
  switch(type) {
    case 'PDF':
      return { color: '#ff3e00', bgColor: '#ff3e00/10' };
    case 'PPT':
      return { color: '#E99F4C', bgColor: '#E99F4C/10' };
    case 'LECTURE':
      return { color: '#4d61ff', bgColor: '#4d61ff/10' };
    case 'HANDWRITTEN':
      return { color: '#DE5499', bgColor: '#DE5499/10' };
    default:
      return { color: '#050505', bgColor: '#050505/10' };
  }
};

/**
 * Formats a date string for display
 * @param dateString The date string to format
 * @param options Formatting options
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, options: Intl.DateTimeFormatOptions = {}) => {
  if (!dateString) return 'Unknown date';
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return new Date(dateString).toLocaleDateString(undefined, defaultOptions);
};

/**
 * Truncates text if it exceeds the specified length
 * @param text The text to truncate
 * @param maxLength Maximum allowed length
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength) + '...';
};

/**
 * Formats author name from a note author object
 * @param author The author object
 * @returns Formatted author name or 'Anonymous' if not available
 */
export const formatAuthorName = (author: { firstName?: string, lastName?: string } | null): string => {
  if (!author) return 'Anonymous';
  
  const firstName = author.firstName || '';
  const lastName = author.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();
  
  return fullName || 'Anonymous';
};