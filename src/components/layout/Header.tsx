"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Search, ShoppingBag, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export function Header() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("")

  // Add scroll event listener for sticky header styling (glassmorphism)
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

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
        <div className="flex h-[88px] items-center justify-between gap-4">
          
          {/* Right Section: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-[42px] h-[42px] bg-primary rounded-full flex items-center justify-center shadow-sm">
                <ShoppingBag className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="hidden md:flex flex-col">
                <span className="font-extrabold text-[22px] tracking-tight text-foreground leading-tight">
                  ویزیکا
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  فروشگاه هوشمند
                </span>
              </div>
            </Link>
          </div>

          {/* Middle Section: Search Bar */}
          <div className="flex-1 max-w-3xl hidden md:flex mx-6">
            <form onSubmit={handleSearch} className="relative w-full group flex items-center">
              <Search 
                strokeWidth={1.5}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-[22px] h-[22px] text-muted-foreground group-focus-within:text-primary transition-colors" 
              />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جست‌وجو در بین بیش از ۱۰,۰۰۰ محصول..."
                className="w-full pr-[46px] pl-[70px] h-[48px] rounded-full border border-input bg-background focus-visible:ring-1 focus-visible:ring-primary shadow-none text-[13.5px] font-medium placeholder:text-muted-foreground/70"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[11px] font-medium px-3 py-1.5 rounded-xl">
                Ctrl K
              </div>
            </form>
          </div>

          {/* Left Section: Actions */}
          <div className="flex items-center gap-2 md:gap-5 shrink-0">
            <Link href="/search" className="md:hidden">
              <Button variant="ghost" size="icon">
                <Search className="w-5 h-5" />
              </Button>
            </Link>
            
            <Link href="/login" tabIndex={-1} className="hidden sm:block">
              <Button variant="ghost" className="gap-2 text-foreground/80 hover:text-foreground font-semibold text-sm px-3 hover:bg-secondary/80 h-11 rounded-xl">
                <User className="w-[22px] h-[22px]" />
                حساب کاربری
              </Button>
            </Link>

            <Link href="/cart" tabIndex={-1}>
              <Button className="h-[46px] px-2 sm:px-5 rounded-full gap-2 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all flex items-center text-sm">
                <ShoppingBag className="w-5 h-5" />
                <span className="hidden sm:inline">سبد خرید</span>
                <div className="bg-white/20 text-white w-6 h-6 rounded-full flex items-center justify-center text-[13px] pt-[2px] ml-1">
                  ۱
                </div>
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
