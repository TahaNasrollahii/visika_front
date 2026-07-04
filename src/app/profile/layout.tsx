"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Package, Heart, MapPin, Bell, LogOut, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import api from "@/lib/api"

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [user, setUser] = useState<{full_name?: string, phone_number?: string, avatar?: string} | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const fetchUser = () => {
    api.get('/users/info/')
      .then(res => setUser(res.data))
      .catch(() => {})
  }

  useEffect(() => {
    fetchUser()
    window.addEventListener("user-updated", fetchUser)
    return () => window.removeEventListener("user-updated", fetchUser)
  }, [])

  const sidebarLinks = [
    { title: "اطلاعات حساب کاربری", href: "/profile", icon: User },
    { title: "سفارش‌های من", href: "/profile/orders", icon: Package },
    { title: "لیست علاقه‌مندی‌ها", href: "/profile/favorites", icon: Heart },
    { title: "آدرس‌های من", href: "/profile/addresses", icon: MapPin },
    { title: "پیام‌ها و اعلان‌ها", href: "/profile/notifications", icon: Bell },
  ]

  const handleLogout = async () => {
    try {
      await api.post('/users/logout/')
      window.dispatchEvent(new Event("user-updated"))
      window.dispatchEvent(new Event("cart-updated"))
      window.location.href = '/login' // Force full navigation to clear state
    } catch (err) {
      console.error("Logout failed", err)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("avatar", file)

    setUploading(true)
    try {
      const res = await api.patch('/users/info/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setUser(res.data)
      window.dispatchEvent(new Event("user-updated"))
    } catch (err) {
      console.error("Avatar upload failed", err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="bg-card border rounded-3xl p-6 mb-6 flex items-center gap-4 shadow-sm">
            <div 
              className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-2xl border cursor-pointer relative overflow-hidden group"
              onClick={handleAvatarClick}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>👤</span>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploading ? (
                  <span className="text-white text-xs">...</span>
                ) : (
                  <span className="text-white text-xs text-center leading-tight">تغییر</span>
                )}
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleAvatarChange}
            />
            <div>
              <h2 className="font-bold text-lg">{user?.full_name?.trim() ? user.full_name : "کاربر ویزیکا"}</h2>
              <p className="text-sm text-muted-foreground mt-1" dir="ltr">{user?.phone_number || "..."}</p>
            </div>
          </div>

          <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
            <nav className="flex flex-col divide-y">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between p-4 transition-colors hover:bg-secondary/50 group",
                      isActive ? "bg-primary/5 text-primary" : "text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                      <span className="font-medium text-sm">{link.title}</span>
                    </div>
                    <ChevronLeft className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  </Link>
                )
              })}
              
              <button onClick={handleLogout} className="flex items-center justify-between p-4 transition-colors hover:bg-destructive/5 text-destructive group">
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium text-sm">خروج از حساب</span>
                </div>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm min-h-[400px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
