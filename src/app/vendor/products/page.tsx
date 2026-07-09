"use client"
import React, { useEffect, useState } from "react"
import api from "@/lib/api"
import { Package, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VendorProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/vendor/products/")
      .then(res => {
        setProducts(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="bg-white dark:bg-zinc-950 rounded-3xl p-6 border border-border shadow-sm min-h-[500px]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black flex items-center gap-2">
          <Package className="w-6 h-6 text-primary" />
          مدیریت محصولات
        </h2>
        <Button className="gap-2 rounded-xl h-10 px-4 font-bold">
          <Plus className="w-4 h-4" />
          افزودن محصول جدید
        </Button>
      </div>

      {loading ? (
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-16 bg-secondary/50 rounded-xl" />
          <div className="h-16 bg-secondary/50 rounded-xl" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Package className="w-16 h-16 opacity-20 mb-4" />
          <p className="font-bold text-lg">محصولی برای نمایش وجود ندارد</p>
          <p className="text-sm mt-1">شما هنوز هیچ محصولی اضافه نکرده‌اید.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p: any) => (
            <div key={p.id} className="border border-border p-4 rounded-2xl shadow-sm flex flex-col gap-3">
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} className="w-full h-40 object-contain rounded-xl bg-secondary/20" />
              ) : (
                <div className="w-full h-40 bg-secondary/20 rounded-xl flex items-center justify-center">
                  <Package className="w-10 h-10 opacity-20" />
                </div>
              )}
              <h3 className="font-bold line-clamp-1">{p.title}</h3>
              <p className="text-primary font-black text-left">{p.price.toLocaleString("fa-IR")} تومان</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
