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

        {/* Floating Emojis */}
        <div
          className="absolute top-[20%] left-[10%] lg:top-[15%] lg:left-[15%] text-5xl lg:text-7xl drop-shadow-2xl animate-float [animation-delay:1s] z-20"
        >
          🧀
        </div>
        <div
          className="absolute bottom-[30%] left-[5%] lg:bottom-[25%] lg:left-[20%] text-5xl lg:text-7xl drop-shadow-2xl animate-float [animation-delay:2.5s] z-20"
        >
          🥛
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
