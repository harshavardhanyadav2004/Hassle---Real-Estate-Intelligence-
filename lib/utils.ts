import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Safe date conversion helper
export function ensureDate(date: Date | string | undefined | null): Date {
  if (!date) return new Date() // Default to current date if undefined/null

  if (date instanceof Date) {
    return isNaN(date.getTime()) ? new Date() : date
  }

  try {
    const parsedDate = new Date(date)
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate
  } catch (e) {
    return new Date()
  }
}

export function formatTime(dateInput: Date | string | undefined | null): string {
  const date = ensureDate(dateInput)
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date)
}

export function formatDistanceToNow(dateInput: Date | string | undefined | null): string {
  const now = new Date()
  const date = ensureDate(dateInput)

  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return "just now"
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d ago`
}


