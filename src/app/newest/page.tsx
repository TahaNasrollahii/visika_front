import React from "react"
import { Sparkles } from "lucide-react"
import { bestSellers, hotOffers } from "@/lib/data"
import { ProductCard } from "@/components/shared/ProductCard"

export default function NewestPage() {
  const newestProducts = [...bestSellers, ...hotOffers].reverse()

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8">
      <div className="flex items-center gap-3 mb-8 border-b pb-4">
        <Sparkles className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold">جدیدترین محصولات</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {newestProducts.map((product) => (
          <ProductCard key={`new-${product.id}`} product={product} />
        ))}
      </div>
    </div>
  )
}
