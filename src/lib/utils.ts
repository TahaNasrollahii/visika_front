import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts backend media URLs to public URLs.
 * Handles local vs production environments correctly.
 */
export function mediaUrl(url: string | null | undefined): string {
  if (!url) return 'https://placehold.co/600x400/eeeeee/999999.png?text=No+Image'
  
  // Use the env variable or fallback to localhost in dev, live host in prod
  const isProd = process.env.NODE_ENV === 'production'
  const defaultApiUrl = isProd ? 'https://visika-back.vercel.app' : 'http://127.0.0.1:8000'
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || defaultApiUrl
  
  // If it's already a relative path, prepend the apiUrl
  if (url.startsWith('/')) {
    return `${apiUrl}${url}`
  }

  // If we are in production but the URL contains localhost, fix it
  if (isProd && (url.includes('127.0.0.1') || url.includes('localhost'))) {
    try {
      const parsed = new URL(url)
      return `${apiUrl}${parsed.pathname}`
    } catch {}
  }
  
  // Otherwise, it's a valid absolute URL (local or prod)
  return url
}
