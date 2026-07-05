"use client"

import React, { use, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShoppingCart, Heart, Share2, ShieldCheck, Truck, RotateCcw, Store, Star, ChevronLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import api from "@/lib/api"
import { Product } from "@/components/shared/ProductCard"
import { useAuth } from "@/hooks/useAuth"

// Animation Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 28 } }
}

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
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

  if (loading) return <div>در حال بارگذاری...</div>
  if (!product) return notFound()

  const hasDiscount = product.discountPrice && product.discountPrice < product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8 overflow-hidden min-h-[calc(100vh-200px)]">
      
      {/* Breadcrumbs - Animated */}
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2 text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide"
      >
        <Link href="/" className="hover:text-primary transition-colors">خانه</Link>
        <ChevronLeft className="w-4 h-4 opacity-50" />
        <Link href="/categories" className="hover:text-primary transition-colors">سوپرمارکت</Link>
        <ChevronLeft className="w-4 h-4 opacity-50" />
        <Link href="/categories/dairy" className="hover:text-primary transition-colors">لبنیات</Link>
        <ChevronLeft className="w-4 h-4 opacity-50" />
        <span className="text-foreground font-medium bg-primary/10 px-2.5 py-1 rounded-lg text-primary">{product.title}</span>
      </motion.nav>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10"
      >
        
        {/* Product Gallery (Immersive) */}
        <motion.div variants={fadeUp} className="lg:col-span-4 space-y-6">
          <div className="relative aspect-square rounded-[2rem] flex items-center justify-center p-8 overflow-hidden group shadow-sm bg-gradient-to-tr from-secondary/50 via-background to-secondary/30 border border-border/60">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px] transform scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <motion.div 
              className="relative w-full h-full z-10 flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: -2 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <Image 
                src={product.image} 
                alt={product.title} 
                fill 
                className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] mix-blend-multiply dark:mix-blend-normal"
                priority
              />
            </motion.div>
            
            {/* Gallery Actions - Floating */}
            <div className="absolute top-6 left-6 flex flex-col gap-3 z-20">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
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
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button onClick={() => toast.success('لینک کپی شد')} variant="outline" size="icon" className="w-12 h-12 rounded-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 hover:text-primary border-white/20 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-muted-foreground transition-all duration-300">
                  <Share2 className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </div>
          
          {/* Interactive Thumbnails */}
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={`aspect-square rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 shadow-sm overflow-hidden relative ${i === 1 ? 'ring-2 ring-primary ring-offset-2 ring-offset-background bg-gradient-to-br from-primary/10 to-transparent' : 'bg-secondary/50 hover:bg-secondary/80 border border-transparent'}`}
              >
                {i === 1 ? (
                   <Image src={product.image} alt="thumbnail" fill className="object-contain p-2 mix-blend-multiply dark:mix-blend-normal" />
                ) : (
                  <ShoppingCart className="w-6 h-6 text-muted-foreground/30" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Product Info - Redesigned Layout */}
        <motion.div variants={fadeUp} className="lg:col-span-5 flex flex-col justify-center space-y-8 lg:px-4">
          <div className="space-y-5">
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="px-3 py-1.5 rounded-xl font-bold bg-primary/10 text-primary hover:bg-primary/20 border-none transition-colors">
                برند: {product.brand || 'متفرقه'}
              </Badge>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-3xl md:text-4xl font-black text-foreground leading-[1.3] tracking-tight text-right w-full">
              {product.title}
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed text-base md:text-lg text-right w-full">
              این محصول با بهترین کیفیت و رعایت کامل اصول بهداشتی تهیه شده است. مناسب برای مصرف روزانه خانواده و سرشار از مواد مغذی که انرژی روزانه شما را تامین می‌کند.
            </motion.p>
          </div>

          {product.features && product.features.length > 0 && (
            <motion.div variants={fadeUp} className="space-y-5 py-6 border-y border-border/50">
              <h3 className="font-bold text-xl flex items-center gap-2 text-foreground text-right w-full">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                ویژگی‌های برجسته
              </h3>
              <ul className="space-y-3">
                {product.features.map((item) => (
                  <motion.li 
                    key={item.id}
                    whileHover={{ x: -4 }}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/30 hover:bg-secondary/60 transition-colors border border-transparent hover:border-border/50"
                  >
                    <span className="text-muted-foreground font-medium text-sm">{item.title}</span>
                    <span className="font-bold text-foreground">{item.value}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

        </motion.div>

        {/* Buy Box - Glassmorphic floating card */}
        <motion.div variants={slideInRight} className="lg:col-span-3 relative z-10">
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
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="pt-4"
              >
                <Button 
                  onClick={async () => {
                    // user === undefined means still loading auth — wait silently
                    if (user === undefined) return
                    if (!user || user.status === 1) {
                      toast.error(
                        !user
                          ? 'ابتدا وارد حساب کاربری خود شوید'
                          : 'حساب کاربری شما باید ابتدا توسط مدیران بررسی و فعال شود'
                      )
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
                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 -translate-x-[150%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                </Button>
              </motion.div>

              {/* Guarantees */}
              <div className="pt-2 space-y-3">
                {[
                  { icon: ShieldCheck, text: 'تضمین اصالت کالا', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { icon: Truck, text: 'ارسال زیر ۲ ساعت', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                  { icon: RotateCcw, text: 'مرجوعی تا ۷ روز', color: 'text-rose-500', bg: 'bg-rose-500/10' }
                ].map((guarantee, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ x: -4 }}
                    className="flex items-center gap-3 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group cursor-default"
                  >
                    <div className={`p-2.5 rounded-xl ${guarantee.bg} ${guarantee.color} transition-transform group-hover:scale-110`}>
                      <guarantee.icon className="w-4 h-4" />
                    </div>
                    <span>{guarantee.text}</span>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  )
}
