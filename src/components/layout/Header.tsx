"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingBag, User, Menu, LayoutGrid, LogOut, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter, usePathname } from "next/navigation"
import api from "@/lib/api"
import { useCategories } from "@/hooks/useCategories"

export function Header() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [liveResults, setLiveResults] = useState<any[]>([])
  const [showLiveResults, setShowLiveResults] = useState(false)
  const pathname = usePathname()
  const [cartCount, setCartCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<{ full_name?: string; role?: string } | null>(null)

  // Categories are fetched independently of the user session so the menu works
  // whether or not the visitor is logged in, with its own loading/error states.
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategories()

  const fetchData = async () => {
    try {
      // Fetch user info first
      const userRes = await api.get('/users/info')
      setUser(userRes.data)
      setIsLoggedIn(true)

      // Then fetch cart, but catch its error independently
      // so a 403 (e.g. for vendors) doesn't log the user out
      try {
        const cartRes = await api.get('/orders/cart')
        const items = cartRes.data.items || []
        const totalQuantity = items.reduce((acc: number, item: any) => acc + item.quantity, 0)
        setCartCount(totalQuantity)
      } catch (cartErr) {
        setCartCount(0)
      }
    } catch (err) {
      // Only log out if user info fails
      setCartCount(0)
      setUser(null)
      setIsLoggedIn(false)
    }
  }

  const handleLogout = async () => {
    try {
      await api.post('/users/logout/')
    } catch {
      // Continue with logout even if server request fails
    }
    // Full page reload to ensure cookies are cleared
    window.location.href = '/login'
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

  // Clear search query on pathname change
  React.useEffect(() => {
    setSearchQuery("")
    setShowLiveResults(false)
  }, [pathname])

  // Debounced search for live results
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() && searchQuery.trim().length >= 2) {
        api.get(`/products/products/?q=${encodeURIComponent(searchQuery.trim())}`)
          .then(res => {
            const data = res.data.results || res.data;
            setLiveResults(Array.isArray(data) ? data.slice(0, 5) : [])
            setShowLiveResults(true)
          })
          .catch(() => setLiveResults([]))
      } else {
        setLiveResults([])
        setShowLiveResults(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

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
            <Link 
              href="/" 
              className="flex items-center gap-0 md:gap-1"
              onClick={() => {
                setSearchQuery("")
                setShowLiveResults(false)
              }}
            >
              <div className="relative w-20 h-20 md:w-[130px] md:h-[46px] flex items-center justify-center shrink-0">
                <Image src="/newlogo.png" alt="ویزیکا" fill className="hidden md:block object-contain object-right" priority unoptimized />
                <Image src="/mobile_logo.png" alt="ویزیکا" fill className="block md:hidden object-contain scale-[1.3]" priority unoptimized />
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
                  {categoriesLoading ? (
                    // Loading skeleton
                    <div className="grid grid-cols-3 gap-6">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-2">
                          <span className="w-10 h-10 rounded-lg bg-secondary animate-pulse shrink-0" />
                          <span className="h-4 flex-1 rounded bg-secondary animate-pulse" />
                        </div>
                      ))}
                    </div>
                  ) : categoriesError ? (
                    // Error state with retry
                    <div className="flex flex-col items-center gap-3 py-8 text-center">
                      <p className="text-sm text-muted-foreground">خطا در دریافت دسته‌بندی‌ها</p>
                      <Button size="sm" variant="outline" onClick={() => refetchCategories()} className="rounded-lg">
                        تلاش مجدد
                      </Button>
                    </div>
                  ) : categories.length === 0 ? (
                    // Empty state
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      دسته‌بندی‌ای برای نمایش وجود ندارد
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-6 max-h-[65vh] overflow-y-auto scrollbar-hide">
                      {categories.map((cat) => (
                        <div key={cat.id} className="flex flex-col gap-2 p-2 rounded-xl hover:bg-secondary/50 transition-colors">
                          <Link href={`/categories/${cat.slug}`} className="font-bold text-foreground flex items-center gap-3 hover:text-primary transition-colors">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-secondary shadow-sm">
                              {cat.image ? (
                                <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
                              ) : (
                                <span className={`w-full h-full flex items-center justify-center text-xl ${cat.color || ""}`}>
                                  {cat.icon}
                                </span>
                              )}
                            </div>
                            {cat.title}
                          </Link>

                          {/* Nested sub-categories, rendered only if the backend provides them */}
                          {cat.children && cat.children.length > 0 && (
                            <div className="flex flex-col gap-1.5 pr-[52px] text-[13px] text-muted-foreground">
                              {cat.children.map((child) => (
                                <Link key={child.id} href={`/categories/${child.slug}`} className="hover:text-foreground transition-colors">
                                  {child.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Promotional Banner */}
                  <div className="bg-destructive/10 dark:bg-destructive/20 rounded-2xl p-4 flex items-center justify-between mt-2">
                    <div className="flex flex-col">
                      <span className="font-bold text-destructive dark:text-red-400">تخفیف‌ها و پیشنهادهای ویژه 🔥</span>
                      <span className="text-[11px] text-muted-foreground mt-1">مشاهده داغ‌ترین تخفیف‌های روز و محصولات شگفت‌انگیز</span>
                    </div>
                    <Link href="/offers" tabIndex={-1}>
                      <Button size="sm" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl px-5 h-8 text-xs font-bold shadow-md">
                        مشاهده
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Actions (Hidden on Desktop) */}
            <div className="flex md:hidden items-center gap-1">
              <Link href={isLoggedIn ? (user?.role === 'vendor' ? "/vendor/products" : "/profile") : "/login"} tabIndex={-1}>
                <Button variant="ghost" size="icon" className="text-foreground/80 hover:bg-secondary/80 rounded-full h-10 w-10">
                  {user?.role === 'vendor' ? <Store className="w-[22px] h-[22px]" /> : <User className="w-[22px] h-[22px]" />}
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
            <div className="relative w-full group">
              <form onSubmit={handleSearch} className="relative flex items-center">
                <Search
                  strokeWidth={1.5}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-[20px] h-[20px] md:w-[22px] md:h-[22px] text-muted-foreground group-focus-within:text-primary transition-colors"
                />
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if (liveResults.length > 0) setShowLiveResults(true) }}
                  onBlur={() => { setTimeout(() => setShowLiveResults(false), 200) }}
                  placeholder="جست‌وجو در بین بیش از ۱۰,۰۰۰ محصول..."
                  className="w-full pr-11 md:pr-[46px] pl-4 md:pl-6 h-12 md:h-[48px] rounded-full border-none md:border-solid border-input bg-secondary/60 md:bg-background focus-visible:ring-1 focus-visible:ring-primary shadow-none text-[13px] md:text-[13.5px] font-medium placeholder:text-muted-foreground/70"
                />
              </form>
              
              {/* Live search results dropdown */}
              {showLiveResults && liveResults.length > 0 && (
                <div 
                  className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-2xl shadow-xl z-50 overflow-hidden"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {liveResults.map(product => (
                    <Link 
                      key={product.id} 
                      href={`/product/${product.id}`} 
                      className="flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors border-b last:border-0"
                    >
                      <div className="w-10 h-10 bg-secondary rounded-lg overflow-hidden shrink-0">
                         {product.image && <img src={product.image} alt={product.title} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-sm font-bold truncate text-foreground">{product.title}</span>
                        {product.vendor?.name && <span className="text-[11px] text-muted-foreground">{product.vendor.name}</span>}
                      </div>
                    </Link>
                  ))}
                  <div className="p-2 text-center bg-secondary/30">
                    <button 
                      type="button"
                      onClick={(e) => { e.preventDefault(); router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`); setShowLiveResults(false); }}
                      className="text-xs text-primary font-bold hover:underline"
                    >
                      مشاهده همه نتایج
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Left Section: Actions (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-2 md:gap-5 shrink-0">
            {isLoggedIn && (
              <>
                <Button variant="ghost" onClick={handleLogout} className="gap-2 text-destructive/80 hover:text-destructive font-semibold text-sm px-3 hover:bg-destructive/10 h-11 rounded-xl transition-colors">
                  <LogOut className="w-[22px] h-[22px]" />
                  خروج
                </Button>
                {user?.role === 'vendor' ? (
                  <Link href="/vendor/products" tabIndex={-1}>
                    <Button variant="ghost" className="gap-2 text-foreground/80 hover:text-foreground font-semibold text-sm px-3 hover:bg-secondary/80 h-11 rounded-xl">
                      <Store className="w-[22px] h-[22px]" />
                      پنل فروشنده
                    </Button>
                  </Link>
                ) : (
                  <Link href="/profile" tabIndex={-1}>
                    <Button variant="ghost" className="gap-2 text-foreground/80 hover:text-foreground font-semibold text-sm px-3 hover:bg-secondary/80 h-11 rounded-xl">
                      <User className="w-[22px] h-[22px]" />
                      {user?.full_name?.trim() ? user.full_name : "حساب کاربری"}
                    </Button>
                  </Link>
                )}
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
