"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="container mx-auto px-4 lg:px-8 pt-6">
      <div className="w-full h-[380px] md:h-[420px] lg:h-[480px] rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 bg-[length:200%_auto] animate-[gradient-x_8s_linear_infinite] relative overflow-hidden flex items-center justify-center md:justify-start shadow-2xl shadow-blue-500/30">

        {/* Animated Background Elements */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 bg-white/20 rounded-full blur-[100px] pointer-events-none animate-pulse duration-1000"
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none animate-pulse duration-1000 delay-500"
        />

        {/* Floating Glassmorphic Widget 1 */}
        <div
          className="absolute left-[10%] top-[20%] lg:left-[8%] lg:top-[15%] flex flex-col gap-2 lg:gap-3 bg-white/10 backdrop-blur-xl border border-white/20 p-2 lg:p-4 rounded-2xl lg:rounded-3xl shadow-2xl w-48 lg:w-64 rotate-[-4deg] z-20 animate-float scale-75 lg:scale-100 origin-top-left"
        >
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-tr from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-lg lg:text-2xl shadow-lg border-2 border-white/30">🛵</div>
            <div>
              <div className="text-white font-bold text-xs lg:text-sm drop-shadow-sm">سفارش در حال ارسال</div>
              <div className="text-white/80 text-[10px] lg:text-xs mt-0.5">رسیدن تا ۱۵ دقیقه دیگر</div>
            </div>
          </div>
          <div className="w-full bg-white/20 h-1 lg:h-1.5 rounded-full overflow-hidden mt-1">
            <div 
              className="h-full w-full bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)] origin-left animate-pulse"
            />
          </div>
        </div>

        {/* Floating Glassmorphic Widget 2 */}
        <div
          className="absolute left-[15%] bottom-[32%] lg:left-[28%] lg:bottom-[20%] flex items-center gap-2 lg:gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-3 py-2 lg:px-5 lg:py-3.5 rounded-xl lg:rounded-2xl shadow-2xl rotate-[3deg] z-20 animate-float [animation-delay:1s] scale-75 lg:scale-100 origin-bottom-left"
        >
          <div className="text-xl lg:text-3xl drop-shadow-lg">🎉</div>
          <div className="flex flex-col">
            <span className="text-white font-black text-xs lg:text-sm drop-shadow-md">تخفیف ویژه امروز</span>
            <span className="text-yellow-300 font-bold text-[10px] lg:text-xs mt-0.5">-۵۰٪ محصولات پروتئینی</span>
          </div>
        </div>



        {/* Main Content */}
        <div
          className="relative z-10 px-6 md:px-16 py-8 md:py-0 w-full h-full md:h-auto max-w-3xl text-white flex flex-col items-start text-right animate-in fade-in slide-in-from-bottom-8 duration-700"
        >
          <div className="inline-block mb-auto md:mb-6 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs md:text-sm font-medium">
            ✨ تجربه نسل جدید خرید آنلاین
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-7xl font-black leading-[1.25] md:leading-tight tracking-tight mt-4 md:mt-0 drop-shadow-sm">
            خرید <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">تازه</span>، <br />
            تحویل سریع
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-white max-w-lg leading-relaxed font-bold mt-3 md:mt-6 drop-shadow-sm">
            ویزیکا، اولین ویزیتور آنلاین کالا
          </p>

          <div className="mt-auto md:mt-10 flex flex-row gap-3 md:gap-4 w-full sm:w-auto justify-start">
            <Link href="/categories" className="flex-1 sm:flex-none">
              <Button size="lg" className="w-full bg-white text-primary hover:bg-gray-100 hover:scale-105 transition-transform duration-300 font-bold rounded-2xl px-2 md:px-8 h-12 md:h-14 text-sm md:text-lg shadow-xl shadow-white/20">
                شروع خرید
              </Button>
            </Link>
            <Link href="/offers" className="flex-1 sm:flex-none">
              <Button size="lg" variant="outline" className="w-full bg-white/10 hover:bg-white/20 hover:text-[#F1B400] border-white/30 text-white backdrop-blur-md font-bold rounded-2xl px-2 md:px-8 h-12 md:h-14 text-sm md:text-lg transition-all">
                مشاهده تخفیف‌ها
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
