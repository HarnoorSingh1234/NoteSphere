import { NoteType } from '@/types';
import { formatTimeAgo } from '@/lib/date-utils';

// Export for backward compatibility
export { formatTimeAgo };

// Maintain backward compatibility
export const formatDate = formatTimeAgo;

/**
 * Get color and background color for a note type
 */
export const getNoteTypeDetails = (type: string) => {
  switch (type) {
    case 'PDF':
      return { color: '#e53e3e', bgColor: 'rgba(229, 62, 62, 0.1)' };
    case 'PPT':
      return { color: '#dd6b20', bgColor: 'rgba(221, 107, 32, 0.1)' };
    case 'DOCX':
      return { color: '#3182ce', bgColor: 'rgba(49, 130, 206, 0.1)' };
    case 'XLSX':
      return { color: '#38a169', bgColor: 'rgba(56, 161, 105, 0.1)' };
    case 'LECTURE':
      return { color: '#3182ce', bgColor: 'rgba(49, 130, 206, 0.1)' };
    case 'HANDWRITTEN':
      return { color: '#805ad5', bgColor: 'rgba(128, 90, 213, 0.1)' };
    default:
      return { color: '#718096', bgColor: 'rgba(113, 128, 150, 0.1)' };
  }
};

/**
 * Truncate text to a specific length
 */
export const truncateText = (text: string, maxLength: number) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

/**
 * Format author name
 */
export const formatAuthorName = (author: { firstName: string; lastName: string }) => {
  if (!author) return 'Unknown User';
  return `${author.firstName} ${author.lastName}`;
};

/**
 * Get file extension from URL
 */
export const getFileExtension = (url: string): string => {
  if (!url) return '';
  const parts = url.split('.');
  return parts.length > 1 ? parts.pop()?.toUpperCase() || '' : '';
};