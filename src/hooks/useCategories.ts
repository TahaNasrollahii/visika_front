import { useState, useEffect, useCallback } from "react"
import api from "@/lib/api"

export interface Category {
  id: number
  title: string
  slug: string
  icon?: string
  color?: string
  image?: string
  // Present only if the backend ever exposes nested categories; the current
  // Django model is flat, so this is normally undefined.
  children?: Category[]
}

// Module-level cache shared across every Header mount so the dropdown renders
// instantly (and without a flash) after the first successful fetch.
let cachedCategories: Category[] | null = null

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(cachedCategories ?? [])
  const [loading, setLoading] = useState(cachedCategories === null)
  const [error, setError] = useState(false)

  const fetchCategories = useCallback(async () => {
    setError(false)
    // Only show the skeleton on the very first load — background revalidation
    // keeps the current list on screen.
    if (cachedCategories === null) setLoading(true)
    try {
      const res = await api.get<Category[]>("/products/categories/")
      const data = Array.isArray(res.data) ? res.data : []
      cachedCategories = data
      setCategories(data)
    } catch {
      // Keep any previously fetched data visible; only surface the error state
      // when we have nothing to show.
      if (cachedCategories === null) setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()

    // Stay in sync with the backend: revalidate when the tab becomes visible
    // again and whenever something explicitly signals a change.
    const revalidate = () => fetchCategories()
    const onVisible = () => {
      if (document.visibilityState === "visible") fetchCategories()
    }

    window.addEventListener("categories-updated", revalidate)
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      window.removeEventListener("categories-updated", revalidate)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [fetchCategories])

  return { categories, loading, error, refetch: fetchCategories }
}
