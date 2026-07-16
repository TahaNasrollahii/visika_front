"use client"
import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Plus, Heart, ShoppingCart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import { mediaUrl } from "@/lib/utils"

export interface Product {
  id: string
  title: string
  description?: string
  price: number
  discountPrice?: number
  image: string
  badge?: string
  is_favorite?: boolean
  features?: { id: number, title: string, value: string }[]
  brand?: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(product.is_favorite || false)
  const [addingToCart, setAddingToCart] = useState(false)
  const { user, loading: authLoading } = useAuth()

  const hasDiscount = product.discountPrice && product.discountPrice < product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Optimistic UI update
    const previousState = isFavorite
    setIsFavorite(!isFavorite)
    
    try {
      await api.post(`/users/favorites/${product.id}/toggle/`)
      if (previousState) {
        toast.info('از لیست علاقه‌مندی‌ها حذف شد')
      } else {
        toast.success('به لیست علاقه‌مندی‌ها اضافه شد')
      }
      window.dispatchEvent(new Event('favorites-updated'))
    } catch (err: any) {
      // Revert if failed
      setIsFavorite(previousState)
      if (err.response?.status === 401 || err.response?.status === 403) {
         toast.error('ابتدا وارد حساب کاربری خود شوید')
      } else {
         toast.error('خطا در ارتباط با سرور')
      }
    }
  }

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // user === undefined means auth is still loading — don't block yet
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
      toast.success('محصول به سبد خرید اضافه شد')
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
  }

  return (
    <Card className="group relative overflow-hidden h-full flex flex-col border-muted hover:border-primary/50 transition-all duration-300">
      {/* Badges */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {hasDiscount && (
          <Badge variant="destructive" className="font-bold">
            {discountPercent}٪ تخفیف
          </Badge>
        )}
        {product.badge && (
          <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
            {product.badge}
          </Badge>
        )}
      </div>

      <button 
        onClick={toggleFavorite}
        className={`absolute top-3 left-3 z-10 w-8 h-8 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center transition-colors shadow-sm ${isFavorite ? 'text-destructive opacity-100' : 'text-muted-foreground hover:text-destructive hover:bg-background opacity-0 group-hover:opacity-100'}`}
      >
        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-destructive' : ''}`} />
      </button>

      {/* Image */}
      <Link href={`/product/${product.id}`} className="relative block aspect-square w-full shrink-0 p-4 bg-secondary/20">
        <div className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
          <Image 
            src={mediaUrl(product.image)} 
            alt={product.title} 
            fill 
            className="object-contain mix-blend-multiply dark:mix-blend-normal hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <CardContent className="flex flex-col flex-1 p-4 gap-2">
        <Link href={`/product/${product.id}`} className="font-medium text-sm leading-tight line-clamp-2 hover:text-primary transition-colors flex-1">
          {product.title}
        </Link>
        
        <div className="flex items-end justify-between mt-2">
          <div className="flex flex-col">
            {authLoading || user === undefined ? (
              <span className="text-xs font-bold text-muted-foreground bg-secondary/50 px-2 py-1 rounded-lg animate-pulse">
                در حال بارگذاری...
              </span>
            ) : !user || user.status === 1 ? (
              <span className="text-xs font-bold text-muted-foreground bg-secondary/50 px-2 py-1 rounded-lg">
                {!user ? 'برای مشاهده قیمت وارد شوید' : 'نیازمند تایید حساب'}
              </span>
            ) : (
              <>
                {hasDiscount && (
                  <span className="text-xs text-muted-foreground line-through decoration-destructive/50">
                    {product.price.toLocaleString("fa-IR")} تومان
                  </span>
                )}
                <span className="font-bold text-lg text-foreground flex items-center gap-1">
                  {(product.discountPrice || product.price).toLocaleString("fa-IR")}
                  <span className="text-[10px] font-normal text-muted-foreground">تومان</span>
                </span>
              </>
            )}
          </div>
          
          <Button 
            onClick={addToCart}
            disabled={addingToCart}
            size="icon" 
            className="h-9 w-9 rounded-full shadow-sm"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
