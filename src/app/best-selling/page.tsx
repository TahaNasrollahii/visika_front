import React from "react"
import { Flame } from "lucide-react"
import { ProductCard, Product } from "@/components/shared/ProductCard"

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000"

async function getBestSellers() {
  try {
    const res = await fetch(`${BACKEND_URL}/products/products/?is_best_seller=true`, { cache: "no-store" })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : (data.results || [])
  } catch (error) {
    return []
  }
}

export default async function BestSellingPage() {
  const bestSellers: Product[] = await getBestSellers()

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8">
      <div className="flex items-center gap-3 mb-8 border-b pb-4">
        <Flame className="w-8 h-8 text-amber-500" />
        <h1 className="text-3xl font-bold">پرفروش‌ترین‌های ویزیکا</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {bestSellers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {bestSellers.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            هیچ کالای پرفروشی یافت نشد.
          </div>
        )}
      </div>
    </div>
  )
}
