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

        {/* Floating Glassmorphic Emoji 1 (Mobile only) */}
        <div
          className="lg:hidden absolute top-[20%] left-[10%] flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] rotate-[-6deg] animate-float [animation-delay:1s] z-20 group hover:bg-white/20 transition-colors duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -inset-4 bg-yellow-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none" />
          <span className="text-4xl lg:text-6xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)] transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 z-10 relative">🧀</span>
        </div>
        
        {/* Floating Glassmorphic Emoji 2 (Mobile only) */}
        <div
          className="lg:hidden absolute bottom-[30%] left-[5%] flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/30 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] rotate-[8deg] animate-float [animation-delay:2.5s] z-20 group hover:bg-white/20 transition-colors duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -inset-4 bg-white/30 blur-xl rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none" />
          <span className="text-3xl lg:text-5xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)] transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 z-10 relative">🥛</span>
        </div>
        {/* Desktop Widget 1: سفارش */}
        <div
          className="hidden lg:flex absolute left-[8%] top-[15%] flex-col gap-3 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl w-64 rotate-[-4deg] z-20 animate-float origin-top-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 border-white/30">🛵</div>
            <div>
              <div className="text-white font-bold text-sm drop-shadow-sm">سفارش در حال ارسال</div>
              <div className="text-white/80 text-xs mt-0.5">رسیدن تا ۱۵ دقیقه دیگر</div>
            </div>
          </div>
          <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden mt-1">
            <div 
              className="h-full w-full bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)] origin-left animate-pulse"
            />
          </div>
        </div>

        {/* Desktop Widget 2: تخفیف */}
        <div
          className="hidden lg:flex absolute left-[28%] bottom-[20%] items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-3.5 rounded-2xl shadow-2xl rotate-[3deg] z-20 animate-float [animation-delay:1s] origin-bottom-left"
        >
          <div className="text-3xl drop-shadow-lg">🎉</div>
          <div className="flex flex-col">
            <span className="text-white font-black text-sm drop-shadow-md">تخفیف ویژه امروز</span>
            <span className="text-yellow-300 font-bold text-xs mt-0.5">-۵۰٪ محصولات پروتئینی</span>
          </div>
        </div>

        {/* Desktop Floating Emojis */}
        <div
          className="hidden lg:block absolute top-1/3 left-[45%] text-5xl opacity-60 blur-[1px] animate-float [animation-delay:2s]"
        >
          🥑
        </div>
        <div
          className="hidden lg:block absolute bottom-[20%] left-[85%] text-4xl opacity-40 blur-[1px] animate-float [animation-delay:3.5s] z-0"
        >
          🍅
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
