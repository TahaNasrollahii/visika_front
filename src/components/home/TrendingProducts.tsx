import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { ProductCard } from "@/components/shared/ProductCard"

export function TrendingProducts({ products }: { products: any[] }) {
  // Take top 4 products
  const displayProducts = products.slice(0, 4);

  return (
    <section className="container mx-auto px-4 lg:px-8">
      <div className="relative rounded-[2.5rem] overflow-hidden p-4 md:p-6 lg:p-8 pb-8 md:pb-10 lg:pb-14 shadow-2xl shadow-[#F1B500]/20 bg-gradient-to-r from-[#F1B500] via-[#E23E57] to-[#F1B500] bg-[length:200%_auto] animate-gradient-slow">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col xl:flex-row gap-6 xl:gap-10 items-center xl:items-start">
          {/* Header */}
          <div className="w-full xl:w-1/3 flex flex-col space-y-4 text-white text-center xl:text-right mt-2 xl:mt-4">
            <div className="inline-flex items-center gap-2 bg-white/10 w-fit mx-auto xl:mx-0 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20 shadow-lg">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold tracking-wide">برترین‌های هفته</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black leading-tight drop-shadow-md">
              محصولات ویژه <br className="hidden xl:block" /> و پرطرفدار
            </h2>
            <p className="text-white text-base leading-relaxed max-w-md mx-auto xl:mx-0">
              مجموعه‌ای از محبوب‌ترین و پرفروش‌ترین محصولات که توسط مشتریان ما بیشترین امتیاز را دریافت کرده‌اند.
            </p>
            <div className="pt-2 flex justify-center xl:justify-start">
              <Link href="/trending" className="group flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-2xl font-bold hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 text-sm">
                مشاهده همه محصولات
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Products Grid */}
          <div className="w-full xl:w-2/3 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 pt-4 xl:pt-0">
            {displayProducts.map((product, idx) => (
              <div
                key={product.id}
                className={`transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/10 ${idx % 2 === 1 ? 'xl:translate-y-6' : ''}`}
              >
                <div className="bg-white rounded-3xl p-1 shadow-xl h-full relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 h-full">
                    <ProductCard product={product} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
