"use client"

import React, { use, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart, Share2, ShieldCheck, Truck, RotateCcw, Store, Star, ChevronLeft, CheckCircle2, Plus, Minus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mediaUrl } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { Product } from "@/components/shared/ProductCard"
import { useAuth } from "@/hooks/useAuth"

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [cartItemId, setCartItemId] = useState<number | null>(null)
  const [cartQuantity, setCartQuantity] = useState(0)
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    api.get(`/products/products/${resolvedParams.slug}/`)
      .then(res => {
        setProduct(res.data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [resolvedParams.slug])

  const checkCart = async () => {
    try {
      const res = await api.get('/orders/cart/')
      const items = res.data.items || []
      const found = items.find((item: any) => String(item.product.id) === String(product?.id))
      if (found) {
        setCartItemId(found.id)
        setCartQuantity(found.quantity)
      } else {
        setCartItemId(null)
        setCartQuantity(0)
      }
    } catch {
      setCartItemId(null)
      setCartQuantity(0)
    }
  }

  useEffect(() => {
    if (product) checkCart()
  }, [product])

  useEffect(() => {
    window.addEventListener('cart-updated', checkCart)
    return () => window.removeEventListener('cart-updated', checkCart)
  }, [product])

  if (loading) return <div>در حال بارگذاری...</div>
  if (!product) return notFound()

  const hasDiscount = product.discountPrice && product.discountPrice < product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8 overflow-hidden min-h-[calc(100vh-200px)]">
      
      {/* Breadcrumbs - Animated */}
      <nav 
        className="flex items-center gap-2 text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide animate-in fade-in slide-in-from-top-4 duration-500"
      >
        <Link href="/" className="hover:text-primary transition-colors">خانه</Link>
        <ChevronLeft className="w-4 h-4 opacity-50" />
        <Link href="/categories" className="hover:text-primary transition-colors">سوپرمارکت</Link>
        <ChevronLeft className="w-4 h-4 opacity-50" />
        <Link href="/categories/dairy" className="hover:text-primary transition-colors">لبنیات</Link>
        <ChevronLeft className="w-4 h-4 opacity-50" />
        <span className="text-foreground font-medium bg-primary/10 px-2.5 py-1 rounded-lg text-primary">{product.title}</span>
      </nav>

      <div 
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 animate-in fade-in duration-700"
      >
        
        {/* Product Gallery */}
        <div className="lg:col-span-4 animate-in slide-in-from-bottom-4 duration-500 fill-mode-both delay-100">
          <div className="relative aspect-square rounded-[2rem] flex items-center justify-center p-8 overflow-hidden group shadow-sm bg-gradient-to-tr from-secondary/50 via-background to-secondary/30 border border-border/60">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px] transform scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div 
              className="relative w-full h-full z-10 flex items-center justify-center hover:scale-105 hover:-rotate-2 transition-transform duration-300"
            >
              <Image 
                src={mediaUrl(product.image)} 
                alt={product.title} 
                fill 
                className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] mix-blend-multiply dark:mix-blend-normal"
                priority
              />
            </div>
            
            {/* Gallery Actions - Floating */}
            <div className="absolute top-6 left-6 flex flex-col gap-3 z-20">
              <div className="hover:scale-110 active:scale-90 transition-transform">
                <Button 
                  onClick={async () => {
                    const previousState = product.is_favorite
                    setProduct({...product, is_favorite: !previousState})
                    try {
                      await api.post(`/users/favorites/${product.id}/toggle/`)
                      if (previousState) toast.info('از لیست علاقه‌مندی‌ها حذف شد')
                      else toast.success('به علاقه‌مندی‌ها اضافه شد')
                      window.dispatchEvent(new Event('favorites-updated'))
                    } catch (err: any) {
                      setProduct({...product, is_favorite: previousState})
                      if (err.response?.status === 401 || err.response?.status === 403) toast.error('ابتدا وارد حساب کاربری خود شوید')
                      else toast.error('خطا در ارتباط با سرور')
                    }
                  }} 
                  variant="outline" 
                  size="icon" 
                  className={`w-12 h-12 rounded-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 hover:text-destructive border-white/20 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 ${product.is_favorite ? 'text-destructive' : 'text-muted-foreground'}`}>
                  <Heart className={`w-5 h-5 ${product.is_favorite ? 'fill-destructive' : ''}`} />
                </Button>
              </div>
              <div className="hover:scale-110 active:scale-90 transition-transform">
                <Button onClick={() => toast.success('لینک کپی شد')} variant="outline" size="icon" className="w-12 h-12 rounded-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 hover:text-primary border-white/20 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-muted-foreground transition-all duration-300">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Info - Redesigned Layout */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-8 lg:px-4 animate-in slide-in-from-bottom-4 duration-500 fill-mode-both delay-200">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="px-3 py-1.5 rounded-xl font-bold bg-primary/10 text-primary hover:bg-primary/20 border-none transition-colors">
                برند: {product.brand || 'متفرقه'}
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-foreground leading-[1.3] tracking-tight text-right w-full">
              {product.title}
            </h1>
            
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg text-right w-full">
              {product.description || 'این محصول با بهترین کیفیت و رعایت کامل اصول بهداشتی تهیه شده است. مناسب برای مصرف روزانه خانواده و سرشار از مواد مغذی که انرژی روزانه شما را تامین می‌کند.'}
            </p>
          </div>

          {product.features && product.features.length > 0 && (
            <div className="space-y-5 py-6 border-y border-border/50">
              <h3 className="font-bold text-xl flex items-center gap-2 text-foreground text-right w-full">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                ویژگی‌های برجسته
              </h3>
              <ul className="space-y-3">
                {product.features.map((item) => (
                  <li 
                    key={item.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/30 hover:bg-secondary/60 transition-colors border border-transparent hover:border-border/50 hover:-translate-x-1 transition-transform"
                  >
                    <span className="text-muted-foreground font-medium text-sm">{item.title}</span>
                    <span className="font-bold text-foreground">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Buy Box - Glassmorphic floating card */}
        <div className="lg:col-span-3 relative z-10 animate-in fade-in slide-in-from-right-8 duration-700 delay-300 fill-mode-both">
          <div className="sticky top-28 w-full rounded-[2.5rem] p-6 lg:p-8 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
            
            {/* Ambient background glow for the card */}
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-white/60 to-transparent dark:from-white/5 pointer-events-none" />

            <div className="relative z-10 space-y-8">
              {/* Vendor */}
              <div className="flex items-center justify-between pb-6 border-b border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-base font-black text-foreground">فروشگاه ویزیکا</p>
                    <div className="flex items-center gap-1.5 mt-1 text-emerald-500">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      <p className="text-xs font-bold">آماده ارسال سریع</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2 pt-2">
                {authLoading ? (
                  <div className="flex items-center justify-start py-4">
                    <span className="text-sm font-bold text-muted-foreground bg-secondary/50 px-3 py-2 rounded-xl animate-pulse">
                      در حال بارگذاری...
                    </span>
                  </div>
                ) : !user || user.status === 1 ? (
                  <div className="flex items-center justify-start py-4">
                    <span className="text-sm font-bold text-muted-foreground bg-secondary/50 px-3 py-2 rounded-xl">
                      {!user ? 'برای مشاهده قیمت وارد حساب شوید' : 'برای مشاهده قیمت نیازمند تایید حساب هستید'}
                    </span>
                  </div>
                ) : (
                  <>
                    {hasDiscount && (
                      <div className="flex items-center justify-start gap-3 mb-1">
                        <span className="text-base text-muted-foreground line-through decoration-destructive/60 decoration-2 font-bold">
                          {product.price.toLocaleString("fa-IR")}
                        </span>
                        <Badge variant="destructive" className="font-black rounded-xl px-2.5 py-1 text-xs animate-pulse shadow-lg shadow-red-500/20">
                          {discountPercent}٪ تخفیف
                        </Badge>
                      </div>
                    )}
                    <div className="flex justify-start items-end gap-1.5">
                      <span className="text-4xl lg:text-5xl font-black text-foreground tracking-tighter">
                        {(product.discountPrice || product.price).toLocaleString("fa-IR")}
                      </span>
                      <span className="text-sm font-bold text-muted-foreground mb-1.5">تومان</span>
                    </div>
                  </>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4">
                {cartItemId ? (
                  <div className="flex items-center border rounded-xl overflow-hidden shadow-sm bg-background h-16">
                    <button
                      onClick={async () => {
                        const newQuantity = cartQuantity + 1
                        try {
                          await api.patch(`/orders/cart/items/${cartItemId}/`, { quantity: newQuantity })
                          setCartQuantity(newQuantity)
                          window.dispatchEvent(new Event('cart-updated'))
                        } catch {
                          toast.error('خطا در بروزرسانی سبد خرید')
                        }
                      }}
                      className="w-14 h-full flex items-center justify-center hover:bg-secondary active:bg-secondary/80 transition-colors text-primary"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                    <span className="flex-1 text-center font-bold text-xl">{cartQuantity}</span>
                    <button
                      onClick={async () => {
                        try {
                          if (cartQuantity === 1) {
                            await api.delete(`/orders/cart/items/${cartItemId}/`)
                            toast.success('کالا از سبد خرید حذف شد')
                            setCartItemId(null)
                            setCartQuantity(0)
                          } else {
                            const newQuantity = cartQuantity - 1
                            await api.patch(`/orders/cart/items/${cartItemId}/`, { quantity: newQuantity })
                            setCartQuantity(newQuantity)
                          }
                          window.dispatchEvent(new Event('cart-updated'))
                        } catch {
                          toast.error('خطا در بروزرسانی سبد خرید')
                        }
                      }}
                      className="w-14 h-full flex items-center justify-center hover:bg-secondary active:bg-secondary/80 transition-colors text-destructive"
                    >
                      {cartQuantity === 1 ? <Trash2 className="w-6 h-6" /> : <Minus className="w-6 h-6" />}
                    </button>
                  </div>
                ) : (
                  <div className="hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95 transition-transform">
                    <Button 
                      onClick={async () => {
                        if (user === undefined) return
                        if (!user || user.status === 1) {
                          toast.error(
                            !user
                              ? 'ابتدا وارد حساب کاربری خود شوید'
                              : 'حساب کاربری شما باید ابتدا توسط مدیران بررسی و فعال شود'
                          )
                          return
                        }
                        if (user.role === 'vendor') {
                          toast.error('فروشندگان امکان ثبت سفارش ندارند')
                          return
                        }
                        setAddingToCart(true)
                        try {
                          await api.post('/orders/cart/items/', { product_id: product.id, quantity: 1 })
                          toast.success('محصول با موفقیت به سبد خرید اضافه شد')
                          window.dispatchEvent(new Event('cart-updated'))
                        } catch (err: any) {
                          if (err.response?.status === 401 || err.response?.status === 403) {
                            toast.error('ابتدا وارد حساب کاربری خود شوید')
                          } else {
                            toast.error('خطا در افزودن به سبد خرید')
                          }
                        } finally {
                          setAddingToCart(false)
                        }
                      }} 
                      disabled={addingToCart}
                      size="lg" 
                      className="w-full text-lg font-black rounded-[1.25rem] h-16 shadow-[0_15px_40px_-10px_rgba(var(--primary),0.6)] hover:shadow-[0_20px_50px_-10px_rgba(var(--primary),0.8)] transition-all bg-primary hover:bg-primary/90 text-primary-foreground relative overflow-hidden group border-b-4 border-primary/20 active:border-b-0 active:mt-1"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <ShoppingCart className="w-6 h-6" />
                        افزودن به سبد خرید
                      </span>
                      <div className="absolute inset-0 -translate-x-[150%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Guarantees */}
              <div className="pt-2 space-y-3">
                {[
                  { icon: ShieldCheck, text: 'تضمین اصالت کالا', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { icon: Truck, text: 'ارسال زیر ۲ ساعت', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                  { icon: RotateCcw, text: 'مرجوعی تا ۷ روز', color: 'text-rose-500', bg: 'bg-rose-500/10' }
                ].map((guarantee, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-3 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group cursor-default hover:-translate-x-1 transition-transform"
                  >
                    <div className={`p-2.5 rounded-xl ${guarantee.bg} ${guarantee.color} transition-transform group-hover:scale-110`}>
                      <guarantee.icon className="w-4 h-4" />
                    </div>
                    <span>{guarantee.text}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
