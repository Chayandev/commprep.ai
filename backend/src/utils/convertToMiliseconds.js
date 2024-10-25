// Utility function to convert time strings to milliseconds
export const convertToMilliseconds = (timeString) => {
    const timeUnit = timeString.slice(-1);
    const timeValue = parseInt(timeString.slice(0, -1), 10);
  
    switch (timeUnit) {
      case 'd': // days
        return timeValue * 24 * 60 * 60 * 1000;
      case 'h': // hours
        return timeValue * 60 * 60 * 1000;
      case 'm': // minutes
        return timeValue * 60 * 1000;
      case 's': // seconds
        return timeValue * 1000;
      default:
        throw new Error('Invalid time format');
    }
  };
  