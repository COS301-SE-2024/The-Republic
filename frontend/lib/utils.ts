import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast as shadToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/globals";
import { Api, AnalysisResult } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeSince(time: string) {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(time).getTime()) / 1000,
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
      title: "Something Went Wrong",
      variant: "destructive",
      description: "Failed to sign out, please try again",
    });
  } else {
    toast({
      title: "Success",
      description: "Signed out succesfully",
    });
  }
}

export function objectToQuery(obj: {
  [key: string]: string | number | boolean;
}) {
  const params = [];

  for (const key in obj) {
    params.push(key + "=" + encodeURIComponent(obj[key]));
  }

  return params.join("&");
}

export function colorFromCategory(api: Api, category: string) {
  switch (category) {
    case "Transportation":
      return "#E7E7E7";
    case "Healthcare Services":
      return "#E91E63";
    case "Public Safety":
      return "#F75D4D";
    case "Water":
      return "#00BDEE";
    case "Electricity":
      return "#EED288";
    case "Sanitation":
      return "#4CAF50";
    case "Social Services":
      return "#957DAD";
    case "Administrative Services":
      return "#80A3C5";
    default:
      return api.visual("color");
  }
}

export function formatDate(dateString: string): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
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

    reader.onload = () =>
      resolve((reader.result as string).replace(/data:.+\/.+;base64,/, ""));
    reader.onerror = (error) => reject(error);
  });
}

export async function checkImageAppropriateness(
  base64Image: string,
): Promise<boolean> {
  const apiKey = process.env
    .NEXT_PUBLIC_AZURE_IMAGE_CONTENT_SAFETY_KEY as string;
  const url = process.env.NEXT_PUBLIC_AZURE_IMAGE_CONTENT_SAFETY_URL as string;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: {
        content: base64Image,
      },
    }),
  });

  const result = await response.json();

  return !(result.categoriesAnalysis as AnalysisResult[]).some(
    (analysisResult) => analysisResult.severity > 0,
  );
}

export async function checkImageFileAndToast(
  image: File,
  toast: typeof shadToast,
): Promise<boolean> {
  let base64Image;
  try {
    base64Image = await fileToBase64(image);
  } catch (error) {
    if (error === "File too big") {
      toast({
        title: "Something Went Wrong",
        variant: "destructive",
        description: "File exceeds limit of 1MB",
      });
    } else {
      toast({
        title: "Something Went Wrong",
        variant: "destructive",
        description: "A file system error occured. Please try again",
      });
    }

    return false;
  }

  const isImageAppropriate = await checkImageAppropriateness(base64Image!);

  if (!isImageAppropriate) {
    toast({
      title: "Something Went Wrong",
      variant: "destructive",
      description: "Please use an appropriate image.",
    });

    return false;
  }

  return true;
}

export function formatLongDate(input: Date | string | number) {
  const date = new Date(input);

  return date
    .toLocaleString(undefined, {
      hour12: true,
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .replace("am", "AM")
    .replace("pm", "PM")
    .replace(" at", ",");
}
