"use client"

import Link from "next/link"
import React, { useEffect, useState } from "react"
import { Package, ChevronLeft, Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import api from "@/lib/api"
import { toast } from "sonner"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/')
        setOrders(res.data)
      } catch (err) {
        toast.error("خطا در دریافت لیست سفارش‌ها")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'paid':
      case 'completed':
        return { label: "پرداخت شده", color: "bg-green-100 text-green-700 border-green-200" }
      case 'pending':
        return { label: "در انتظار پرداخت", color: "bg-amber-100 text-amber-700 border-amber-200" }
      case 'cancelled':
        return { label: "لغو شده", color: "bg-red-100 text-red-700 border-red-200" }
      default:
        return { label: "در حال پردازش", color: "bg-blue-100 text-blue-700 border-blue-200" }
    }
  }

  if (loading) {
    return <div>در حال بارگذاری...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">سفارش‌های من</h1>
      
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status)
            return (
              <div key={order.id} className="border-2 rounded-2xl p-5 hover:border-primary/30 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${statusInfo.color}`}>
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold">سفارش {order.id}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {new Date(order.created_at).toLocaleDateString('fa-IR')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`${statusInfo.color} border font-bold`}>{statusInfo.label}</Badge>
                    <div className="font-bold">{order.total_amount.toLocaleString('fa-IR')} تومان</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">محصولات: </span> 
                    {order.items?.map((item: any) => item.product_title).join("، ")}
                  </p>
                  
                  <Link href={`/profile/orders/${order.id}/invoice`} className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                    مشاهده فاکتور <ChevronLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-secondary/30 rounded-2xl border-2 border-dashed">
          <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-muted-foreground mb-2">هنوز سفارشی ثبت نکرده‌اید</h2>
          <p className="text-sm text-muted-foreground">با مراجعه به فروشگاه، اولین خرید خود را انجام دهید.</p>
        </div>
      )}
    </div>
  )
}
