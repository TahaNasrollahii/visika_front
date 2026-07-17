import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts backend media URLs to public URLs.
 * Bypasses the local proxy to ensure images load correctly on Vercel.
 */
export function mediaUrl(url: string | null | undefined): string {
  if (!url) return 'https://placehold.co/600x400/eeeeee/999999.png?text=No+Image'
  
  const liveHost = 'https://visika-back.vercel.app'
  
  // If it's a relative path, prepend the live host
  if (url.startsWith('/')) {
    return `${liveHost}${url}`
  }

  // If the backend mistakenly returned a localhost URL, rewrite it
  if (url.includes('127.0.0.1') || url.includes('localhost')) {
    try {
      const parsed = new URL(url)
      return `${liveHost}${parsed.pathname}`
    } catch {}
  }
  
  // Otherwise, it's a valid absolute URL (e.g., from the live backend)
  return url
}
