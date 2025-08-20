import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Utility function to safely sort RTK Query arrays
 * RTK Query returns immutable arrays, so we need to create a copy before sorting
 */
export function safeSortArray<T>(array: readonly T[], compareFn?: (a: T, b: T) => number): T[] {
  return [...array].sort(compareFn)
}

/**
 * Utility function to safely perform any mutating operation on RTK Query arrays
 */
export function createMutableCopy<T>(array: readonly T[]): T[] {
  return [...array]
}
