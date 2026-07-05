import React from "react"
import { notFound } from "next/navigation"
import { Filter, SlidersHorizontal, SortDesc } from "lucide-react"
import { ProductCard } from "@/components/shared/ProductCard"
import { Button } from "@/components/ui/button"
import { FiltersSidebar } from "@/components/category/FiltersSidebar"

async function getCategory(slug: string) {
  const res = await fetch("http://127.0.0.1:8000/products/categories/", { cache: "no-store" })
  if (!res.ok) return null
  const categories = await res.json()
  return categories.find((c: any) => c.slug === slug) ?? null
}

async function getProductsForCategory(slug: string) {
  const res = await fetch(
    `http://127.0.0.1:8000/products/products/?category_slug=${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  )
  if (!res.ok) return []
  return res.json()
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  const products = await getProductsForCategory(slug)

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      {/* Category Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-sm ${category.color}`}>
            {category.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{category.title}</h1>
            <p className="text-muted-foreground mt-1">{products.length.toLocaleString("fa-IR")} کالا یافت شد</p>
          </div>
        </div>

        {/* Desktop Sort Header */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <SortDesc className="w-5 h-5" />
            مرتب‌سازی براساس:
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <button className="text-primary border-b-2 border-primary pb-1.5 font-bold px-1">پرفروش‌ترین</button>
            <button className="text-muted-foreground hover:text-foreground transition-colors pb-1.5 px-1">جدیدترین</button>
            <button className="text-muted-foreground hover:text-foreground transition-colors pb-1.5 px-1">ارزان‌ترین</button>
            <button className="text-muted-foreground hover:text-foreground transition-colors pb-1.5 px-1">گران‌ترین</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters (Desktop) */}
        <FiltersSidebar />

        {/* Mobile Filters Trigger */}
        <div className="lg:hidden flex items-center gap-2 mb-4">
          <Button variant="outline" className="flex-1 gap-2">
            <Filter className="w-4 h-4" />
            فیلترها
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            مرتب‌سازی
          </Button>
        </div>

        {/* Product Grid */}
        <main className="flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-lg font-bold text-foreground">محصولی در این دسته‌بندی یافت نشد</p>
              <p className="text-sm text-muted-foreground mt-2">به‌زودی محصولات جدید اضافه می‌شوند</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
