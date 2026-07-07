import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts an absolute backend media URL (e.g. http://127.0.0.1:8000/media/products/foo.png)
 * into a relative path (/media/products/foo.png) so Next.js serves it through
 * the /media/ proxy rewrite instead of hitting the private IP directly.
 * Next.js 16+ blocks image optimization requests to private IPs like 127.0.0.1.
 */
export function mediaUrl(url: string | null | undefined): string {
  if (!url) return 'https://placehold.co/600x400/eeeeee/999999.png?text=No+Image'
  // If it's already a relative path, return as-is
  if (url.startsWith('/')) return url
  try {
    const parsed = new URL(url)
    return parsed.pathname  // e.g. /media/products/foo.png
  } catch {
    return url
  }
}
