import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getUserFullName(user) {
  if (!user) return "";

  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }

  if (user.first_name) {
    return user.first_name;
  }

  if (user.last_name) {
    return user.last_name;
  }

  return user.username || "Unknown";
}

export function getInitials(user) {
  const fullName = getUserFullName(user) || "";
  return fullName.split(" ").map((name) => name[0]).join("").toUpperCase();
}

export function debounce(func, delay = 300) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Converts a duration string to total minutes
 * @param {string} duration - Duration string in format "HH:MM:SS" or "MM:SS"
 * @returns {number} Total minutes
 * @example
 * durationToMinutes("01:29:00") // returns 89
 * durationToMinutes("05:30") // returns 5
 * durationToMinutes("00:45") // returns 0
 */
export function durationToMinutes(duration) {
  if (!duration || typeof duration !== 'string') {
    return 0;
  }

  const parts = duration.split(':').map(part => parseInt(part, 10) || 0);
  
  if (parts.length === 3) {
    // Format: "HH:MM:SS"
    const [hours, minutes, seconds] = parts;
    return hours * 60 + minutes + Math.round(seconds / 60);
  } else if (parts.length === 2) {
    // Format: "MM:SS"
    const [minutes, seconds] = parts;
    return minutes + Math.round(seconds / 60);
  } else if (parts.length === 1) {
    // Format: "MM" (just minutes)
    return parts[0];
  }
  
  return 0;
}
