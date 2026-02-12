import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCitizenId(value: string) {
  const cleaned = value.replace(/\D/g, "");
  // 1-2345-67890-12-3
  let formatted = cleaned;
  if (cleaned.length > 12) {
    formatted = `${cleaned.slice(0, 1)}-${cleaned.slice(1, 5)}-${cleaned.slice(5, 10)}-${cleaned.slice(10, 12)}-${cleaned.slice(12, 13)}`;
  } else if (cleaned.length > 10) {
    formatted = `${cleaned.slice(0, 1)}-${cleaned.slice(1, 5)}-${cleaned.slice(5, 10)}-${cleaned.slice(10)}`;
  } else if (cleaned.length > 5) {
    formatted = `${cleaned.slice(0, 1)}-${cleaned.slice(1, 5)}-${cleaned.slice(5)}`;
  } else if (cleaned.length > 1) {
    formatted = `${cleaned.slice(0, 1)}-${cleaned.slice(1)}`;
  }
  return formatted;
}
