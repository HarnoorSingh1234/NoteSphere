/**
 * Custom date formatting utilities to replace date-fns dependency
 * This file centralizes all date formatting functions for the application
 */

/**
 * Format a date to a relative time string (e.g., "2 hours ago")
 * Custom implementation to remove date-fns dependency
 */
export const formatTimeAgo = (date: Date | string): string => {
  if (!date) return '';
  const now = new Date();
  const pastDate = new Date(typeof date === 'string' ? date : date);
  const seconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval === 1 ? '1 year ago' : `${interval} years ago`;
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval === 1 ? '1 month ago' : `${interval} months ago`;
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? '1 day ago' : `${interval} days ago`;
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
  }
  
  return seconds < 5 ? 'just now' : `${Math.floor(seconds)} seconds ago`;
};

/**
 * Format a date to a standard format
 * @param date The date to format
 * @param format Optional format (currently not supported, but added for future extensibility)
 */
export const formatDate = (date: Date | string, format?: string): string => {
  if (!date) return '';
  const dateObj = new Date(typeof date === 'string' ? date : date);
  
  try {
    // Using built-in date formatting - can be expanded later with custom formatting
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
};
