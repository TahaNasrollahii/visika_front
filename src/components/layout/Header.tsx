"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, User, Menu, MapPin, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  // Add scroll event listener for sticky header styling (glassmorphism)
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
          : "bg-background border-b"
      }`}
    >
      {/* Top Banner (Optional for promos) */}
      <div className="bg-primary text-primary-foreground py-1.5 text-xs text-center font-medium">
        ارسال رایگان برای سفارش‌های بالای ۵۰۰ هزار تومان!
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Right Section: Logo & Location */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-10 h-10 overflow-hidden rounded-xl shadow-sm">
                <Image src="/logo.png" alt="Vzika Logo" fill className="object-cover" />
              </div>
              <span className="font-bold text-2xl tracking-tight hidden md:block text-primary">
                وزیکا
              </span>
            </Link>

            {/* Location selector (Desktop) */}
            <div onClick={() => toast.info('انتخاب آدرس جدید به زودی در دسترس خواهد بود')} className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors bg-secondary/50 px-3 py-2 rounded-lg">
              <MapPin className="w-4 h-4 text-primary" />
              <span>ارسال به تهران، پلاک ۱۲</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>

          {/* Middle Section: Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:flex">
            <div className="relative w-full group">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="search"
                placeholder="جستجو در هزاران محصول..."
                className="w-full pl-4 pr-10 h-12 rounded-full border-muted bg-secondary/50 focus-visible:bg-background focus-visible:ring-primary shadow-inner"
              />
            </div>
          </div>

          {/* Left Section: Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/search" className="md:hidden">
              <Button variant="ghost" size="icon">
                <Search className="w-5 h-5" />
              </Button>
            </Link>
            
            <div className="hidden sm:flex items-center gap-2 border-l pl-4 ml-2">
              <Link href="/login" tabIndex={-1}>
                <Button variant="ghost" className="gap-2 rounded-full px-4 font-semibold">
                  <User className="w-5 h-5" />
                  ورود | ثبت‌نام
                </Button>
              </Link>
            </div>

            <Link href="/cart" tabIndex={-1}>
              <Button variant="outline" className="relative rounded-full w-12 h-12 p-0 border-muted-foreground/20 hover:border-primary/50 transition-colors">
                <ShoppingCart className="w-5 h-5 text-foreground" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-[10px]"
                >
                  3
                </Badge>
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom Nav / Categories Menu (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 h-12 text-sm font-medium text-muted-foreground border-t">
          <Link href="/categories" tabIndex={-1}>
            <Button variant="ghost" className="gap-2 font-bold text-foreground hover:bg-secondary rounded-lg px-3">
              <Menu className="w-5 h-5" />
              دسته‌بندی کالاها
            </Button>
          </Link>
          <Link href="/offers" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
            </span>
            تخفیف‌ها و پیشنهادها
          </Link>
          <Link href="/best-selling" className="hover:text-primary transition-colors">پرفروش‌ترین‌ها</Link>
          <Link href="/newest" className="hover:text-primary transition-colors">جدیدترین‌ها</Link>
          <Link href="/about" className="hover:text-primary transition-colors">سوالی دارید؟</Link>
        </div>
      </div>
    </header>
  )
}
