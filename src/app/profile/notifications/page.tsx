"use client"

import React, { useEffect, useState } from "react"
import { Bell, Tag, Package, Mail } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/users/notifications/')
      .then(res => {
        setNotifications(res.data)
        setLoading(false)
      })
      .catch(err => {
        toast.error("خطا در دریافت اعلان‌ها")
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground font-bold">در حال بارگذاری...</div>
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8 pb-4 border-b">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
          <Bell className="w-5 h-5 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold">پیام‌ها و اعلان‌ها</h1>
      </div>
      
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notif) => {
            return (
              <div key={notif.id} className={`flex gap-4 p-5 border rounded-2xl transition-colors bg-card ${notif.is_read ? 'opacity-70' : 'border-primary/30 shadow-sm'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-blue-100 text-blue-600`}>
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className="font-bold">پیام از: {notif.sender_name}</h3>
                    <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-md w-fit" dir="ltr">
                      {new Date(notif.created_at).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-secondary/30 rounded-2xl border-2 border-dashed">
          <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-muted-foreground mb-2">پیام و اعلانی ندارید</h2>
          <p className="text-sm text-muted-foreground">اعلانات مهم حساب کاربری و سفارشات شما در اینجا نمایش داده خواهند شد.</p>
        </div>
      )}
    </div>
  )
}
