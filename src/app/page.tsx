import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard, Product } from "@/components/shared/ProductCard"
import { Button } from "@/components/ui/button"
import { Hero } from "@/components/home/Hero"
import { HotOffers } from "@/components/home/HotOffers"

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000"

async function getCategories() {
  const res = await fetch(`${BACKEND_URL}/products/categories/`, { cache: "no-store" })
  if (!res.ok) return []
  const data = await res.json()
  return (Array.isArray(data) ? data : (data.results || [])) as { id: number; title: string; slug: string; icon: string; color: string; image?: string }[]
}

async function getBestSellers() {
  const res = await fetch(`${BACKEND_URL}/products/products/?is_best_seller=true`, { cache: "no-store" })
  if (!res.ok) return []
  const data = await res.json()
  return Array.isArray(data) ? data : (data.results || [])
}

async function getHotOffers() {
  const res = await fetch(`${BACKEND_URL}/products/products/?is_hot_offer=true`, { cache: "no-store" })
  if (!res.ok) return []
  const data = await res.json()
  return Array.isArray(data) ? data : (data.results || [])
}

export default async function Home() {
  const [categories, bestSellers, hotOffers] = await Promise.all([
    getCategories(),
    getBestSellers(),
    getHotOffers()
  ])

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Section */}
      <Hero />

      {/* Categories Grid */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">دسته‌بندی‌ها</h2>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col items-center gap-3 text-center"
            >
              <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-transform group-hover:-translate-y-1 group-hover:shadow-md ${cat.color} overflow-hidden`}>
                {cat.image ? (
                  <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
                ) : (
                  cat.icon
                )}
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {cat.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Hot Offers Section */}
      <HotOffers hotOffers={hotOffers} />

      {/* Best Sellers Section */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-primary rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">پرفروش‌ترین کالاها</h2>
          </div>
          <Link href="/best-selling" className="text-primary font-medium flex items-center hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">
            مشاهده همه
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>


      {/* Banners Section */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Banner 1: Protein */}
          <div className="group relative h-32 md:h-40 rounded-3xl overflow-hidden cursor-pointer bg-gradient-to-r from-orange-500 via-red-600 to-orange-500 bg-[length:200%_auto] animate-gradient-slow border border-red-400 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between px-6 md:px-10">
            {/* Background Decorations */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-colors duration-500"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl group-hover:bg-yellow-400/30 transition-colors duration-500"></div>

            <div className="space-y-1.5 md:space-y-2 z-10">
              <h3 className="text-lg md:text-xl font-extrabold text-white">خرید محصولات <br className="hidden sm:block" /> پروتئینی تازه</h3>
              <p className="text-xs md:text-sm font-medium text-white/80">با تضمین کیفیت و بهداشت</p>
            </div>

            <div className="relative z-10">
              <div className="absolute inset-0 bg-white/40 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="text-5xl md:text-6xl drop-shadow-md group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 ease-out">🥩</div>
            </div>
          </div>

          {/* Banner 2: Summer Drinks */}
          <div className="group relative h-32 md:h-40 rounded-3xl overflow-hidden cursor-pointer bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-[length:200%_auto] animate-gradient-slow border border-orange-400 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between px-6 md:px-10">
            {/* Background Decorations */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-colors duration-500"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-200/20 rounded-full blur-2xl group-hover:bg-yellow-200/30 transition-colors duration-500"></div>

            <div className="space-y-1.5 md:space-y-2 z-10">
              <h3 className="text-lg md:text-xl font-extrabold text-white">نوشیدنی‌های <br className="hidden sm:block" /> خنک تابستانی</h3>
              <p className="text-xs md:text-sm font-bold text-white bg-white/20 w-fit px-2 py-0.5 rounded-md">تا ۲۰٪ تخفیف</p>
            </div>

            <div className="relative z-10">
              <div className="absolute inset-0 bg-white/40 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="text-5xl md:text-6xl drop-shadow-md group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500 ease-out">🍹</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
