import React from "react"
import { Flame } from "lucide-react"
import { bestSellers } from "@/lib/data"
import { ProductCard } from "@/components/shared/ProductCard"

export default function BestSellingPage() {
  return (
    <div className="container mx-auto px-4 py-12 lg:px-8">
      <div className="flex items-center gap-3 mb-8 border-b pb-4">
        <Flame className="w-8 h-8 text-amber-500" />
        <h1 className="text-3xl font-bold">پرفروش‌ترین‌های وزیکا</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {bestSellers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
