import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard } from "@/components/shared/ProductCard"
import { bestSellers, hotOffers, categories } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Hero } from "@/components/home/Hero"

export default function Home() {
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
              href={`/categories/${cat.id}`}
              className="group flex flex-col items-center gap-3 text-center"
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-transform group-hover:-translate-y-1 group-hover:shadow-md ${cat.color}`}>
                {cat.icon}
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {cat.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Hot Offers Section */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-[2rem] p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row items-center lg:items-stretch gap-8 overflow-hidden relative shadow-2xl shadow-primary/20 border border-primary/10">
          
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

          {/* Intro Block (Right Side in RTL) */}
          <div className="w-full lg:w-64 shrink-0 flex flex-col items-center justify-center text-white text-center space-y-6 lg:space-y-8 py-4 relative z-10">
            <div className="space-y-3">
              <span className="inline-block py-1.5 px-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs md:text-sm font-bold tracking-wider shadow-sm">
                پیشنهاد ویژه
              </span>
              <h2 className="text-4xl md:text-5xl font-black leading-tight drop-shadow-md">
                شگفت‌انگیز
              </h2>
              <p className="text-white/90 font-medium text-base md:text-lg">
                تخفیف‌های بی‌نظیر امروز
              </p>
            </div>
            
            {/* Animated percentage badge */}
            <div className="relative group cursor-pointer my-4 lg:my-8">
              <div className="absolute inset-0 bg-white/30 blur-xl rounded-full scale-110 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gradient-to-tr from-yellow-400 to-yellow-200 rounded-full flex items-center justify-center shadow-xl border-4 border-white/40 transform group-hover:-translate-y-2 group-hover:rotate-12 transition-all duration-300">
                <span className="text-5xl md:text-6xl font-black text-primary drop-shadow-sm">%</span>
              </div>
            </div>

            <Link href="/offers" className="hidden lg:flex items-center gap-2 text-white hover:text-yellow-200 font-bold text-lg group transition-colors mt-2">
              مشاهده همه
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1.5 transition-transform" />
            </Link>
          </div>

          {/* Cards Carousel */}
          <div className="flex-1 w-full overflow-x-auto flex gap-4 md:gap-6 pb-6 pt-4 lg:py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory items-stretch relative z-10 px-2">
            {hotOffers.map((product) => (
              <div key={product.id} className="w-[220px] md:w-[250px] shrink-0 snap-center group/card">
                <div className="h-full transform group-hover/card:-translate-y-2 transition-transform duration-300">
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
            
            {/* View All Card */}
            <div className="w-[180px] md:w-[220px] shrink-0 snap-center flex items-stretch py-1">
              <Link href="/offers" className="flex flex-col items-center justify-center w-full h-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-300 rounded-3xl border border-white/20 hover:border-white/40 text-white gap-5 group shadow-lg min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-white text-primary flex items-center justify-center group-hover:scale-110 group-hover:-translate-x-2 transition-all duration-300 shadow-xl">
                  <ChevronLeft className="w-8 h-8" />
                </div>
                <div className="space-y-1 text-center">
                  <span className="font-bold text-xl block">مشاهده همه</span>
                  <span className="text-sm text-white/70">تخفیف‌ها و پیشنهادها</span>
                </div>
              </Link>
            </div>
          </div>
          
        </div>
      </section>

      {/* Banners Section */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Banner 1: Protein */}
          <div className="group relative h-32 md:h-40 rounded-3xl overflow-hidden cursor-pointer bg-gradient-to-br from-rose-50 to-red-100 border border-red-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between px-6 md:px-10">
            {/* Background Decorations */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-200/50 rounded-full blur-2xl group-hover:bg-red-300/50 transition-colors duration-500"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-200/50 rounded-full blur-2xl group-hover:bg-rose-300/50 transition-colors duration-500"></div>
            
            <div className="space-y-1.5 md:space-y-2 z-10">
              <h3 className="text-lg md:text-xl font-extrabold text-red-950">خرید محصولات <br className="hidden sm:block"/> پروتئینی تازه</h3>
              <p className="text-xs md:text-sm font-medium text-red-800/80">با تضمین کیفیت و بهداشت</p>
            </div>
            
            <div className="relative z-10">
              <div className="absolute inset-0 bg-white/40 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="text-5xl md:text-6xl drop-shadow-md group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 ease-out">🥩</div>
            </div>
          </div>

          {/* Banner 2: Summer Drinks */}
          <div className="group relative h-32 md:h-40 rounded-3xl overflow-hidden cursor-pointer bg-gradient-to-br from-orange-50 to-amber-100 border border-amber-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between px-6 md:px-10">
            {/* Background Decorations */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-200/50 rounded-full blur-2xl group-hover:bg-orange-300/50 transition-colors duration-500"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-200/50 rounded-full blur-2xl group-hover:bg-amber-300/50 transition-colors duration-500"></div>
            
            <div className="space-y-1.5 md:space-y-2 z-10">
              <h3 className="text-lg md:text-xl font-extrabold text-orange-950">نوشیدنی‌های <br className="hidden sm:block"/> خنک تابستانی</h3>
              <p className="text-xs md:text-sm font-bold text-orange-600 bg-orange-100/50 w-fit px-2 py-0.5 rounded-md">تا ۲۰٪ تخفیف</p>
            </div>
            
            <div className="relative z-10">
              <div className="absolute inset-0 bg-white/40 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="text-5xl md:text-6xl drop-shadow-md group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500 ease-out">🍹</div>
            </div>
          </div>
        </div>
      </section>

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
    </div>
  )
}
