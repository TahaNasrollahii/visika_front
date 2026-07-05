import React from "react"
import { notFound } from "next/navigation"
import { Filter, SlidersHorizontal, SortDesc, ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard } from "@/components/shared/ProductCard"
import { Button } from "@/components/ui/button"
import { FiltersSidebar } from "@/components/category/FiltersSidebar"
import Link from "next/link"

async function getCategory(slug: string) {
  const res = await fetch("http://127.0.0.1:8000/products/categories/", { cache: "no-store" })
  if (!res.ok) return null
  const categories = await res.json()
  return categories.find((c: any) => c.slug === slug) ?? null
}

async function getBrands(categorySlug: string) {
  const res = await fetch(`http://127.0.0.1:8000/products/brands/?category_slug=${encodeURIComponent(categorySlug)}`, { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

async function getProductsForCategory(slug: string, searchParams: any) {
  const url = new URL("http://127.0.0.1:8000/products/products/")
  url.searchParams.append("category_slug", slug)
  
  // Add other filters from searchParams
  Object.keys(searchParams).forEach(key => {
    if (searchParams[key] !== undefined && searchParams[key] !== '') {
      url.searchParams.append(key, searchParams[key] as string)
    }
  })

  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) {
    return { results: [], count: 0 }
  }
  return res.json() // With pagination, it returns { count, next, previous, results }
}

export default async function CategoryPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params
  const currentSearchParams = await searchParams
  
  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  const brands = await getBrands(slug)
  
  const categoriesRes = await fetch("http://127.0.0.1:8000/products/categories/", { cache: "no-store" })
  const allCategories = categoriesRes.ok ? await categoriesRes.json() : []

  const productsData = await getProductsForCategory(slug, currentSearchParams)
  
  const products = Array.isArray(productsData) ? productsData : (productsData.results || [])
  const totalCount = productsData.count || products.length
  
  const currentSort = typeof currentSearchParams.ordering === 'string' ? currentSearchParams.ordering : ''
  const currentPage = typeof currentSearchParams.page === 'string' ? parseInt(currentSearchParams.page) : 1
  const totalPages = Math.ceil(totalCount / 12)

  const buildSortUrl = (sortValue: string) => {
    const params = new URLSearchParams(currentSearchParams as any)
    if (sortValue) {
      params.set('ordering', sortValue)
    } else {
      params.delete('ordering')
    }
    params.delete('page') // reset page on sort
    return `/categories/${slug}?${params.toString()}`
  }

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(currentSearchParams as any)
    params.set('page', page.toString())
    return `/categories/${slug}?${params.toString()}`
  }

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
            <p className="text-muted-foreground mt-1">{totalCount.toLocaleString("fa-IR")} کالا یافت شد</p>
          </div>
        </div>

        {/* Desktop Sort Header */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <SortDesc className="w-5 h-5" />
            مرتب‌سازی براساس:
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href={buildSortUrl('-reviews_count')} className={`hover:text-foreground transition-colors pb-1.5 px-1 ${currentSort === '-reviews_count' ? 'text-primary border-b-2 border-primary font-bold' : 'text-muted-foreground'}`}>پرفروش‌ترین</Link>
            <Link href={buildSortUrl('-created_at')} className={`hover:text-foreground transition-colors pb-1.5 px-1 ${currentSort === '-created_at' ? 'text-primary border-b-2 border-primary font-bold' : 'text-muted-foreground'}`}>جدیدترین</Link>
            <Link href={buildSortUrl('price')} className={`hover:text-foreground transition-colors pb-1.5 px-1 ${currentSort === 'price' ? 'text-primary border-b-2 border-primary font-bold' : 'text-muted-foreground'}`}>ارزان‌ترین</Link>
            <Link href={buildSortUrl('-price')} className={`hover:text-foreground transition-colors pb-1.5 px-1 ${currentSort === '-price' ? 'text-primary border-b-2 border-primary font-bold' : 'text-muted-foreground'}`}>گران‌ترین</Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters (Desktop) */}
        <FiltersSidebar 
          brands={brands} 
          categories={allCategories} 
          activeCategorySlug={slug}
        />

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
        <main className="flex-1 flex flex-col">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center flex-1">
              <p className="text-lg font-bold text-foreground">محصولی در این دسته‌بندی با فیلترهای انتخابی یافت نشد</p>
              <p className="text-sm text-muted-foreground mt-2">لطفاً فیلترهای خود را تغییر دهید</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-auto pt-4 border-t border-border/50">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    asChild
                    disabled={currentPage <= 1}
                    className={currentPage <= 1 ? "opacity-50 pointer-events-none" : ""}
                  >
                    <Link href={buildPageUrl(currentPage - 1)}>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="icon"
                        className="w-8 h-8 rounded-full"
                        asChild
                      >
                        <Link href={buildPageUrl(page)}>
                          {page}
                        </Link>
                      </Button>
                    ))}
                  </div>

                  <Button 
                    variant="outline" 
                    size="icon" 
                    asChild
                    disabled={currentPage >= totalPages}
                    className={currentPage >= totalPages ? "opacity-50 pointer-events-none" : ""}
                  >
                    <Link href={buildPageUrl(currentPage + 1)}>
                      <ChevronLeft className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
