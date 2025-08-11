// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to compose className strings with Tailwind merging.
 * Usage: cn('p-4', condition && 'bg-red-500', 'rounded')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
