import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPlan(plan: string) {
  return plan.charAt(0).toUpperCase() + plan.slice(1)
}