import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast as shadToast } from "@/components/ui/use-toast";
import { supabase } from "./globals";
import { Api } from "./types";

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

export async function signOutWithToast(toast: typeof shadToast) {
  const { error } = await supabase.auth.signOut();

  if (error) {
    toast({
      variant: "destructive",
      description: "Failed to sign out, please try again",
    });
  } else {
    toast({
      description: "Signed out succesfully",
    });

    setTimeout(() => {
      window.location.assign("/");
    }, 2000);
  }
}

export function objectToQuery(obj: { [key: string]: string | number | boolean}) {
    const params = [];

    for (const key in obj) {
        params.push(key + "=" + encodeURIComponent(obj[key]));
    }

    return params.join("&");
}

export function colorFromCategory(api: Api, category: string) {
  switch(category) {
    case "Transportation":
      return "#e7e7e7";
    case "Healthcare Services":
      return "#c72c48";
    case "Public Safety":
      return "#f0dc82";
    case "Water":
      return "#f2f3f4";
    case "Electricity":
      return "#1dacd6";
    default:
      return api.visual("color");
  }
}

export function formatDate(dateString: string): string {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${month}`;
}

export function formatMoreDate(dateString: string[]): string[] {
    const dates = [];
    for (const date of dateString) {
        dates.push(formatDate(date));
    }
    return dates;
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > 1048576) {
      // TODO: Make constant or replace with type
      reject("File too big");
      return;
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(
      (reader.result as string).replace(/data:.+\/.+;base64,/, "")
    );
    reader.onerror = (error) => reject(error);
  });
}
