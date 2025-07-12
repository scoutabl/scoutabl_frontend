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
