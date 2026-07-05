import { useState, useEffect, useCallback } from "react"
import api from "@/lib/api"

// Module-level cache to avoid redundant fetches across component instances
let cachedUser: any = undefined // undefined = not fetched yet, null = logged out, object = user
let isFetching = false
let fetchCallbacks: Array<(user: any) => void> = []

function fetchUserOnce(onDone: (user: any) => void) {
  if (cachedUser !== undefined) {
    // Already have a result (even null) — return immediately
    onDone(cachedUser)
    return
  }
  fetchCallbacks.push(onDone)
  if (isFetching) return // already in-flight

  isFetching = true
  api.get('/users/info')
    .then(res => {
      cachedUser = res.data
    })
    .catch(() => {
      cachedUser = null // explicitly null = logged out / no session
    })
    .finally(() => {
      isFetching = false
      const cbs = fetchCallbacks
      fetchCallbacks = []
      cbs.forEach(cb => cb(cachedUser))
    })
}

function resetCache() {
  cachedUser = undefined
  isFetching = false
  fetchCallbacks = []
}

if (typeof window !== 'undefined') {
  // When user logs in / out, reset cache and notify all hook instances
  window.addEventListener("user-updated", resetCache)
}

export function useAuth() {
  // Start loading if we don't have a result yet
  const [user, setUser] = useState<any>(cachedUser === undefined ? undefined : cachedUser)
  const [loading, setLoading] = useState(cachedUser === undefined)

  const refresh = useCallback(() => {
    setLoading(true)
    resetCache()
    fetchUserOnce((u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (cachedUser !== undefined) {
      // Cache already populated from a previous render
      setUser(cachedUser)
      setLoading(false)
      return
    }

    fetchUserOnce((u) => {
      setUser(u)
      setLoading(false)
    })

    const handleUpdate = () => refresh()
    window.addEventListener("user-updated", handleUpdate)
    return () => window.removeEventListener("user-updated", handleUpdate)
  }, [refresh])

  return {
    // null = definitely logged out, undefined/loading = still checking
    user: loading ? undefined : user,
    loading,
    refresh,
  }
}
