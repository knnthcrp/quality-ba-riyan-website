/**
 * Formats a timestamp into a relative time string (e.g., "Just now", "2 mins ago").
 * @param {Date|number|string} timestamp - The timestamp to format.
 * @returns {string} - The relative time string.
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 30) {
    return 'Just now';
  }

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'min' : 'mins'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hr' : 'hrs'} ago`;
  }

  return formatAbsoluteTime(timestamp);
};

/**
 * Formats a timestamp into an absolute time string (e.g., "10:32 PM").
 * @param {Date|number|string} timestamp - The timestamp to format.
 * @returns {string} - The absolute time string.
 */
export const formatAbsoluteTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
};
