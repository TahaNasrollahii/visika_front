import React from "react"
import { Percent } from "lucide-react"
import { ProductCard, Product } from "@/components/shared/ProductCard"

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000"

async function getHotOffers() {
  try {
    const res = await fetch(`${BACKEND_URL}/products/products/?is_hot_offer=true`, { cache: "no-store" })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : (data.results || [])
  } catch (error) {
    return []
  }
}

export default async function OffersPage() {
  const hotOffers: Product[] = await getHotOffers()

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8">
      <div className="flex items-center gap-3 mb-8 border-b pb-4">
        <Percent className="w-8 h-8 text-destructive" />
        <h1 className="text-3xl font-bold text-destructive">تخفیف‌ها و پیشنهادهای ویژه</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {hotOffers.map((product) => (
          <ProductCard key={`offer-${product.id}`} product={product} />
        ))}
        {hotOffers.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            هیچ پیشنهاد ویژه‌ای یافت نشد.
          </div>
        )}
      </div>
    </div>
  )
}
