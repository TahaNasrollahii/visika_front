"use client"

import React from "react"
import Link from "next/link"
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SuccessPage() {
  const [orderId, setOrderId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('order_id')
    if (id) setOrderId(id)
  }, [])

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center">
      <div className="bg-card border rounded-3xl p-8 max-w-md w-full text-center shadow-sm relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-green-50/50"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-200">
            <CheckCircle className="w-10 h-10" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">سفارش با موفقیت ثبت شد</h1>
          <p className="text-muted-foreground mb-8">
            پرداخت شما تایید شد. سفارش شما در حال آماده‌سازی است و در زمان مقرر ارسال خواهد شد.
          </p>

          <div className="space-y-3">
            {orderId && (
              <Link href={`/profile/orders/${orderId}/invoice`}>
                <Button size="lg" className="w-full text-base font-bold rounded-xl gap-2 shadow-sm mb-3">
                  <Package className="w-5 h-5" />
                  مشاهده فاکتور
                </Button>
              </Link>
            )}
            <Link href="/profile/orders">
              <Button variant={orderId ? "outline" : "default"} size="lg" className="w-full text-base font-bold rounded-xl gap-2 shadow-sm">
                <Package className="w-5 h-5" />
                پیگیری سفارش
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full text-base font-bold rounded-xl gap-2">
                <Home className="w-5 h-5" />
                بازگشت به خانه
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
