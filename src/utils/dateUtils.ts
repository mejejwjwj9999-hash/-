
/**
 * Utility functions for handling dates in forms and database operations
 */

export const formatDateForInput = (date: string | null | undefined): string => {
  if (!date) return '';
  try {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

export const formatDateTimeForInput = (datetime: string | null | undefined): string => {
  if (!datetime) return '';
  try {
    const d = new Date(datetime);
    // Format as YYYY-MM-DDTHH:mm for datetime-local input
    return d.toISOString().slice(0, 16);
  } catch {
    return '';
  }
};

export const formatTimeForInput = (time: string | null | undefined): string => {
  if (!time) return '';
  // Time is already in HH:mm format from database
  return time;
};

export const sanitizeDateForDatabase = (dateString: string | null | undefined): string | null => {
  if (!dateString || dateString.trim() === '') return null;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  } catch {
    return null;
  }
};

export const sanitizeTimeForDatabase = (timeString: string | null | undefined): string | null => {
  if (!timeString || timeString.trim() === '') return null;
  
  // Validate time format HH:mm or HH:mm:ss
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  if (!timeRegex.test(timeString)) return null;
  
  return timeString;
};

export const validateTimeRange = (startTime: string, endTime: string): boolean => {
  if (!startTime || !endTime) return false;
  
  try {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    return start < end;
  } catch {
    return false;
  }
};

export const formatDateForDisplay = (date: string | null | undefined): string => {
  if (!date) return 'غير محدد';
  try {
    return new Date(date).toLocaleDateString('ar-SA');
  } catch {
    return 'غير صحيح';
  }
};

export const formatTimeForDisplay = (time: string | null | undefined): string => {
  if (!time) return 'غير محدد';
  return time;
};
