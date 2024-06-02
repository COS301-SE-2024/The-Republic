import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeSince(time: string) {
    const seconds = Math.floor((
        (new Date().getTime()) - 
        (new Date(time).getTime())) / 
        1000
    );

    let interval = Math.floor(seconds / 31536000);
    if (interval > 0) {
        return interval + " year(s)";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 0) {
        return interval + " month(s)";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 0) {
        return interval + " day(s)";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 0) {
        return interval + " hour(s)";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 0) {
        return interval + " minute(s)";
    }
    return Math.floor(seconds) + " seconds";
}