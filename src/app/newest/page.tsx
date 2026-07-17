import React from "react"
import { Sparkles } from "lucide-react"
import { ProductCard, Product } from "@/components/shared/ProductCard"

async function getNewestProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://visika-back.vercel.app'}/products/products/`, { cache: "no-store" })
    if (!res.ok) return []
    const data = await res.json()
    const products: Product[] = Array.isArray(data) ? data : (data.results || [])
    return products.reverse() // Simulate newest by reversing the list
  } catch (error) {
    return []
  }
}

export default async function NewestPage() {
  const newestProducts: Product[] = await getNewestProducts()

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
        {newestProducts.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            هیچ محصولی یافت نشد.
          </div>
        )}
      </div>
    </div>
  )
}
