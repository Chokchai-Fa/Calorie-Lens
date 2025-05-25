import { format } from "date-fns";

/**
 * Formats a timestamp into a relative time string (e.g., "5 minutes ago", "2 hours ago")
 * @param timestamp Timestamp in milliseconds
 * @returns Formatted relative time string
 */
export const getTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else {
    return format(timestamp, 'MMM d, h:mm a');
  }
};