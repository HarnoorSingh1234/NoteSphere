/**
 * Custom date formatting utilities to replace date-fns dependency
 * This file centralizes all date formatting functions for the application
 */

/**
 * Format a date to a relative time string (e.g., "2 hours ago")
 */
export const formatTimeAgo = (date: Date | string): string => {
  if (!date) return '';
  const now = new Date();
  const pastDate = new Date(typeof date === 'string' ? date : date);
  const seconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }
  
  return seconds < 5 ? 'just now' : `${Math.floor(seconds)} seconds ago`;
};

/**
 * Format a date to a standard format
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  const dateObj = new Date(typeof date === 'string' ? date : date);
  
  try {
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

/**
 * Format a date to include time
 */
export const formatDateTime = (date: Date | string): string => {
  if (!date) return '';
  const dateObj = new Date(typeof date === 'string' ? date : date);
  
  try {
    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
};
