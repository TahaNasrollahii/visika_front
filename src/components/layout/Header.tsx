"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Search, ShoppingBag, User, Menu, LayoutGrid, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

export function Header() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [cartCount, setCartCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<{full_name?: string} | null>(null)
  const [categories, setCategories] = useState<any[]>([])

  const fetchData = async () => {
    try {
      // Run both requests in parallel
      const [cartRes, userRes, catRes] = await Promise.all([
        api.get('/orders/cart/'),
        api.get('/users/info/'),
        api.get('/products/categories/')
      ])
      
      const items = cartRes.data.items || []
      const totalQuantity = items.reduce((acc: number, item: any) => acc + item.quantity, 0)
      setCartCount(totalQuantity)
      setUser(userRes.data)
      setIsLoggedIn(true)
      setCategories(catRes.data || [])
    } catch {
      setCartCount(0)
      setUser(null)
      setIsLoggedIn(false)
    }
  }

  const handleLogout = async () => {
    try {
      await api.post('/users/logout/')
      setIsLoggedIn(false)
      setUser(null)
      setCartCount(0)
      window.dispatchEvent(new Event("user-updated"))
      window.dispatchEvent(new Event("cart-updated"))
      router.push('/login')
    } catch (err) {
      console.error("Logout failed", err)
    }
  }

  // Add scroll event listener for sticky header styling (glassmorphism)
  React.useEffect(() => {
    fetchData()

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    // Listen for custom event to update cart and user info
    const handleUpdate = () => fetchData()

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("cart-updated", handleUpdate)
    window.addEventListener("user-updated", handleUpdate)
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("cart-updated", handleUpdate)
      window.removeEventListener("user-updated", handleUpdate)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
        ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
        : "bg-background border-b"
        }`}
    >


      <div className="container mx-auto px-4 lg:px-8 pb-3 md:pb-0">
        {/* Desktop: Single Row. Mobile: Two Rows (Top Nav + Search) */}
        <div className="flex flex-col md:flex-row md:h-[88px] justify-center md:items-center justify-between gap-3 md:gap-4 pt-3 md:pt-0">

          {/* Mobile Top Row */}
          <div className="flex items-center justify-between w-full md:w-auto md:gap-6">
            {/* Right Section: Logo */}
            <Link href="/" className="flex items-center gap-2 md:gap-3">
              <div className="w-10 h-10 md:w-[42px] md:h-[42px] bg-primary rounded-full flex items-center justify-center shadow-sm">
                <ShoppingBag className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl md:text-[22px] tracking-tight text-foreground leading-tight">
                  ویزیکا
                </span>
                <span className="text-[10px] md:text-[11px] text-muted-foreground font-medium hidden md:block">
                  ویزیتور هوشمند
                </span>
              </div>
            </Link>

            {/* Categories Menu */}
            <div className="hidden md:flex relative group items-center">
              <Link href="/categories" tabIndex={-1}>
                <Button variant="ghost" className="gap-2 font-bold text-foreground hover:bg-secondary rounded-lg px-3">
                  <LayoutGrid className="w-5 h-5" />
                  دسته‌بندی‌ها
                </Button>
              </Link>

              {/* Mega Menu Dropdown */}
              <div className="absolute top-full right-0 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-[650px] z-50">
                <div className="bg-background border rounded-3xl shadow-xl overflow-hidden p-6 flex flex-col gap-6">

                  {/* Categories Columns */}
                  <div className="grid grid-cols-3 gap-6">
                    {categories.slice(0, 9).map((cat) => (
                      <div key={cat.id} className="flex flex-col gap-2 p-2 rounded-xl hover:bg-secondary/50 transition-colors">
                        <Link href={`/categories/${cat.id}`} className="font-bold text-foreground flex items-center gap-3 hover:text-primary transition-colors">
                          <span className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-sm ${cat.color}`}>
                            {cat.icon}
                          </span>
                          {cat.title}
                        </Link>
                      </div>
                    ))}
                  </div>

                  {/* Promotional Banner */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold text-blue-600 dark:text-blue-400">تخفیف ویژه میوه‌های تابستانی 🍉</span>
                      <span className="text-[11px] text-muted-foreground mt-1">تا ۳۰٪ تخفیف روی محصولات منتخب</span>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 h-8 text-xs font-bold shadow-md">
                      مشاهده
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Actions (Hidden on Desktop) */}
            <div className="flex md:hidden items-center gap-1">
              <Link href={isLoggedIn ? "/profile" : "/login"} tabIndex={-1}>
                <Button variant="ghost" size="icon" className="text-foreground/80 hover:bg-secondary/80 rounded-full h-10 w-10">
                  <User className="w-[22px] h-[22px]" />
                </Button>
              </Link>
              {isLoggedIn && (
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-destructive/80 hover:bg-destructive/10 hover:text-destructive rounded-full h-10 w-10">
                  <LogOut className="w-[22px] h-[22px]" />
                </Button>
              )}
              {isLoggedIn ? (
                <Link href="/cart" tabIndex={-1}>
                  <Button variant="ghost" size="icon" className="relative text-foreground/80 hover:bg-secondary/80 rounded-full h-10 w-10">
                    <ShoppingBag className="w-[22px] h-[22px]" />
                    {cartCount > 0 && (
                      <div className="absolute top-1.5 right-1.5 bg-primary text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-background">
                        {cartCount.toLocaleString('fa-IR')}
                      </div>
                    )}
                  </Button>
                </Link>
              ) : null}
            </div>
          </div>

          {/* Middle Section: Search Bar (Full width on mobile, flexible on desktop) */}
          <div className="flex-1 w-full md:max-w-3xl md:mx-6">
            <form onSubmit={handleSearch} className="relative w-full group flex items-center">
              <Search
                strokeWidth={1.5}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-[20px] h-[20px] md:w-[22px] md:h-[22px] text-muted-foreground group-focus-within:text-primary transition-colors"
              />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جست‌وجو در بین بیش از ۱۰,۰۰۰ محصول..."
                className="w-full pr-11 md:pr-[46px] pl-4 md:pl-6 h-12 md:h-[48px] rounded-full border-none md:border-solid border-input bg-secondary/60 md:bg-background focus-visible:ring-1 focus-visible:ring-primary shadow-none text-[13px] md:text-[13.5px] font-medium placeholder:text-muted-foreground/70"
              />
            </form>
          </div>

          {/* Desktop Left Section: Actions (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-2 md:gap-5 shrink-0">
            {isLoggedIn && (
              <>
                <Button variant="ghost" onClick={handleLogout} className="gap-2 text-destructive/80 hover:text-destructive font-semibold text-sm px-3 hover:bg-destructive/10 h-11 rounded-xl transition-colors">
                  <LogOut className="w-[22px] h-[22px]" />
                  خروج
                </Button>
                <Link href="/profile" tabIndex={-1}>
                  <Button variant="ghost" className="gap-2 text-foreground/80 hover:text-foreground font-semibold text-sm px-3 hover:bg-secondary/80 h-11 rounded-xl">
                    <User className="w-[22px] h-[22px]" />
                    {user?.full_name?.trim() ? user.full_name : "حساب کاربری"}
                  </Button>
                </Link>
              </>
            )}

            {isLoggedIn ? (
              <Link href="/cart" tabIndex={-1}>
                <Button className="h-[46px] px-5 rounded-full gap-2 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all flex items-center text-sm">
                  <ShoppingBag className="w-5 h-5" />
                  <span>سبد خرید</span>
                  {cartCount > 0 && (
                    <div className="bg-white/20 text-white w-6 h-6 rounded-full flex items-center justify-center text-[13px] pt-[2px] ml-1">
                      {cartCount.toLocaleString('fa-IR')}
                    </div>
                  )}
                </Button>
              </Link>
            ) : (
              <Link href="/login" tabIndex={-1}>
                <Button className="h-[46px] px-5 rounded-full gap-2 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all flex items-center text-sm">
                  <User className="w-5 h-5" />
                  <span>وارد شوید</span>
                </Button>
              </Link>
            )}
          </div>
        </div>


      </div>
    </header>
  )
}
