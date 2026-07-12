"use client"
import React, { useEffect, useState } from "react"
import api from "@/lib/api"
import { Bell, Send, User, History, Mail, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

type Tab = "send" | "history"

export default function VendorNotificationsPage() {
  const [tab, setTab] = useState<Tab>("send")
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null)
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)

  // History state
  const [history, setHistory] = useState<any[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  useEffect(() => {
    api.get("/vendor/orders/")
      .then(res => {
        const uniqueCustomersMap = new Map()
        res.data.forEach((order: any) => {
          if (!uniqueCustomersMap.has(order.customer_id)) {
            uniqueCustomersMap.set(order.customer_id, {
              id: order.customer_id,
              name: order.customer_name,
              phone: order.customer_phone
            })
          }
        })
        setCustomers(Array.from(uniqueCustomersMap.values()))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const fetchHistory = () => {
    setHistoryLoading(true)
    api.get("/vendor/notifications/history/")
      .then(res => {
        setHistory(res.data)
        setHistoryLoading(false)
      })
      .catch(() => {
        toast.error("خطا در دریافت تاریخچه پیام‌ها")
        setHistoryLoading(false)
      })
  }

  useEffect(() => {
    if (tab === "history") {
      fetchHistory()
    }
  }, [tab])

  const handleSend = async () => {
    if (!selectedCustomer) return toast.error("لطفا یک مشتری را انتخاب کنید")
    if (!message.trim()) return toast.error("متن پیام را وارد کنید")

    setSending(true)
    try {
      await api.post("/vendor/notifications/send/", {
        recipient: selectedCustomer,
        message: message
      })
      toast.success("پیام با موفقیت ارسال شد")
      setMessage("")
      setSelectedCustomer(null)
    } catch (e: any) {
      toast.error(e.response?.data?.error || "خطا در ارسال پیام")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-950 rounded-3xl p-6 border border-border shadow-sm min-h-[500px]">
      {/* Tabs */}
      <div className="flex gap-2 mb-8 pb-4 border-b">
        <button
          onClick={() => setTab("send")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
            tab === "send" ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80 text-muted-foreground"
          }`}
        >
          <Send className="w-4 h-4" />
          ارسال پیام
        </button>
        <button
          onClick={() => setTab("history")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
            tab === "history" ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80 text-muted-foreground"
          }`}
        >
          <History className="w-4 h-4" />
          تاریخچه پیام‌ها
        </button>
      </div>

      {tab === "send" ? (
        // Send tab
        <>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <Bell className="w-6 h-6 text-primary" />
              ارسال اعلان به مشتریان
            </h2>
          </div>

          {loading ? (
            <div className="animate-pulse h-40 bg-secondary/50 rounded-xl" />
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <User className="w-16 h-16 opacity-20 mb-4" />
              <p className="font-bold text-lg">شما هنوز مشتری‌ای ندارید</p>
              <p className="text-sm mt-1">پس از ثبت اولین سفارش توسط مشتریان، می‌توانید به آن‌ها پیام ارسال کنید.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8 max-w-2xl">
              <div className="space-y-3">
                <label className="font-bold text-sm block">انتخاب مشتری</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                  {customers.map((c: any) => (
                    <div 
                      key={c.id} 
                      onClick={() => setSelectedCustomer(c.id)}
                      className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-colors ${selectedCustomer === c.id ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"}`}
                    >
                      <span className="font-bold text-sm">{c.name}</span>
                      <span className="text-xs text-muted-foreground mt-1">{c.phone}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="font-bold text-sm block">متن پیام</label>
                <Textarea 
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="متن پیام خود را اینجا بنویسید... (به عنوان مثال: محصول شما آماده ارسال است)"
                  className="resize-none rounded-xl"
                />
              </div>

              <Button 
                onClick={handleSend} 
                disabled={sending || !selectedCustomer || !message.trim()}
                className="w-full h-12 rounded-xl text-base font-bold gap-2"
              >
                {sending ? "در حال ارسال..." : (
                  <>
                    <Send className="w-5 h-5" />
                    ارسال پیام
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        // History tab
        <>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <History className="w-6 h-6 text-primary" />
              تاریخچه پیام‌های ارسال شده
            </h2>
            <Button variant="outline" size="sm" onClick={fetchHistory} className="rounded-xl">
              بروزرسانی
            </Button>
          </div>

          {historyLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse h-24 bg-secondary/50 rounded-xl" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Mail className="w-16 h-16 opacity-20 mb-4" />
              <p className="font-bold text-lg">هنوز پیامی ارسال نکرده‌اید</p>
              <p className="text-sm mt-1">پس از ارسال اولین پیام، تاریخچه آن‌ها در اینجا نمایش داده می‌شود.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((notif: any) => (
                <div key={notif.id} className="flex gap-4 p-4 border border-border rounded-2xl bg-card">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${notif.is_read ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}>
                    {notif.is_read ? <CheckCheck className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-sm">{notif.recipient_name}</h3>
                        <span className="text-xs text-muted-foreground" dir="ltr">{notif.recipient_phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {notif.is_read && (
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-md">خوانده شده</span>
                        )}
                        <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-md w-fit" dir="ltr">
                          {new Date(notif.created_at).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
