import React from "react"
import { Percent } from "lucide-react"
import { hotOffers } from "@/lib/data"
import { ProductCard } from "@/components/shared/ProductCard"

export default function OffersPage() {
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
      </div>
    </div>
  )
}
