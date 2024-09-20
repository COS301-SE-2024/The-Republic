export function formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) {
      throw new Error("Invalid input: Seconds must be a non-negative number.");
    }
  
    const SECONDS_IN_A_YEAR = 365 * 24 * 3600;
    const SECONDS_IN_A_MONTH = 30 * 24 * 3600;
    const SECONDS_IN_A_WEEK = 7 * 24 * 3600;
    const SECONDS_IN_A_DAY = 24 * 3600;
  
    const years = Math.floor(seconds / SECONDS_IN_A_YEAR);
    seconds %= SECONDS_IN_A_YEAR;
  
    const months = Math.floor(seconds / SECONDS_IN_A_MONTH);
    seconds %= SECONDS_IN_A_MONTH;
  
    const weeks = Math.floor(seconds / SECONDS_IN_A_WEEK);
    seconds %= SECONDS_IN_A_WEEK;
  
    const days = Math.floor(seconds / SECONDS_IN_A_DAY);
  
    const result: string[] = [];
  
    if (years > 0) {
      result.push(`${years} year${years > 1 ? 's' : ''}`);
    }
  
    if (months > 0) {
      result.push(`${months} month${months > 1 ? 's' : ''}`);
    }
  
    if (weeks > 0) {
      result.push(`${weeks} week${weeks > 1 ? 's' : ''}`);
    }
  
    if (days > 0) {
      result.push(`${days + 1} day${days > 1 ? 's' : ''}`);
    } else if (result.length === 0) {
      result.push(`1 day`);
    }
  
    return result.join(', ').replace(/,([^,]*)$/, ' and$1');
}
  