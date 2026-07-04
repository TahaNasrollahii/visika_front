"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 15 } }
  }

  return (
    <section className="container mx-auto px-4 lg:px-8 pt-6">
      <div className="w-full h-[360px] md:h-[450px] lg:h-[500px] rounded-[2.5rem] bg-gradient-to-br from-primary via-blue-500 to-indigo-600 relative overflow-hidden flex items-center justify-center md:justify-start shadow-2xl shadow-primary/20">
        
        {/* Animated Background Elements */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"
        />

        {/* Floating Emojis */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 text-6xl hidden lg:block opacity-80"
        >
          🥑
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 left-1/3 text-7xl hidden lg:block opacity-60"
        >
          🥐
        </motion.div>
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/3 left-10 text-5xl hidden lg:block opacity-70"
        >
          🍎
        </motion.div>

        {/* Main Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 px-6 md:px-16 py-8 md:py-0 w-full h-full md:h-auto max-w-3xl text-white flex flex-col items-center md:items-start text-center md:text-right"
        >
          <motion.div variants={itemVariants} className="inline-block mb-auto md:mb-6 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs md:text-sm font-medium">
            ✨ تجربه نسل جدید خرید آنلاین
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight md:leading-tight tracking-tight mt-4 md:mt-0">
            خرید <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">تازه</span>، <br className="hidden sm:block" /> 
            تحویل سریع
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-sm sm:text-base md:text-xl text-blue-50/90 max-w-lg leading-relaxed font-medium mt-3 md:mt-6">
            هر آنچه برای خانه نیاز دارید، با بهترین قیمت و بالاترین کیفیت، در کمتر از ۴۵ دقیقه درب منزل شماست.
          </motion.p>
          
          <motion.div variants={itemVariants} className="mt-auto md:mt-10 flex flex-row gap-3 md:gap-4 w-full sm:w-auto justify-center md:justify-start">
            <Link href="/categories" className="flex-1 sm:flex-none">
              <Button size="lg" className="w-full bg-white text-primary hover:bg-gray-100 hover:scale-105 transition-transform duration-300 font-bold rounded-2xl px-2 md:px-8 h-12 md:h-14 text-sm md:text-lg shadow-xl shadow-white/10">
                شروع خرید
              </Button>
            </Link>
            <Link href="/offers" className="flex-1 sm:flex-none">
              <Button size="lg" variant="outline" className="w-full bg-white/10 hover:bg-white/20 border-white/30 text-white backdrop-blur-md font-bold rounded-2xl px-2 md:px-8 h-12 md:h-14 text-sm md:text-lg transition-all">
                مشاهده تخفیف‌ها
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
