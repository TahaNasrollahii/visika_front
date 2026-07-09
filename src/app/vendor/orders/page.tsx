"use client"
import React, { useEffect, useState } from "react"
import api from "@/lib/api"
import { ShoppingBag, Box, User, Phone, Clock } from "lucide-react"

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/vendor/orders/")
      .then(res => {
        setOrders(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="bg-white dark:bg-zinc-950 rounded-3xl p-6 border border-border shadow-sm min-h-[500px]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-primary" />
          سفارشات مشتریان
        </h2>
      </div>

      {loading ? (
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-20 bg-secondary/50 rounded-xl" />
          <div className="h-20 bg-secondary/50 rounded-xl" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <ShoppingBag className="w-16 h-16 opacity-20 mb-4" />
          <p className="font-bold text-lg">سفارشی برای نمایش وجود ندارد</p>
          <p className="text-sm mt-1">تا کنون سفارشی برای محصولات شما ثبت نشده است.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order: any) => (
            <div key={order.id} className="border border-border p-5 rounded-2xl shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-secondary/10 hover:bg-secondary/30 transition-colors">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2 font-bold text-lg">
                  <Box className="w-5 h-5 text-primary" />
                  {order.product_title}
                  <span className="text-sm font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-lg mr-2">
                    {order.quantity} عدد
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>{order.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4" />
                    <span>{order.customer_phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span dir="ltr">{new Date(order.order_date).toLocaleString("fa-IR")}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-primary font-black text-xl">{(order.price * order.quantity).toLocaleString("fa-IR")} تومان</span>
                <span className="text-xs font-bold px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg">
                  پرداخت شده
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
