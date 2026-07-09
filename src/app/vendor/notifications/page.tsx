"use client"
import React, { useEffect, useState } from "react"
import api from "@/lib/api"
import { Bell, Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

export default function VendorNotificationsPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null)
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    // Fetch orders to get unique customers
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
    </div>
  )
}
