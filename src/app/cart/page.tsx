"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, Plus, Minus, ShoppingCart, ChevronLeft, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { mediaUrl } from "@/lib/utils"

interface CartItem {
  id: number
  product: {
    id: string
    title: string
    price: number
    discountPrice?: number
    image: string
  }
  quantity: number
  total_price: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [cartTotal, setCartTotal] = useState(0)
  const router = useRouter()

  const fetchCart = async () => {
    try {
      const res = await api.get('/orders/cart/')
      setCartItems(res.data.items)
      setCartTotal(res.data.total_price)
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("برای مشاهده سبد خرید وارد شوید")
        router.push("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const totalItemsPrice = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
  const totalDiscount = cartItems.reduce((acc, item) => acc + ((item.product.price - (item.product.discountPrice || item.product.price)) * item.quantity), 0)
  const finalPrice = cartTotal || (totalItemsPrice - totalDiscount)

  const updateQuantity = async (id: number, delta: number) => {
    const item = cartItems.find(i => i.id === id)
    if (!item) return
    const newQuantity = item.quantity + delta

    try {
      if (newQuantity <= 0) {
        await api.delete(`/orders/cart/items/${id}/`)
        toast.success('کالا از سبد خرید حذف شد')
      } else {
        await api.patch(`/orders/cart/items/${id}/`, { quantity: newQuantity })
      }
      window.dispatchEvent(new Event('cart-updated'))
      fetchCart() // Refresh cart
    } catch (e) {
      toast.error('خطا در بروزرسانی سبد خرید')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Cart Items List */}
        <div className="flex-1 space-y-4">
          <div className="bg-card border rounded-3xl p-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <ShoppingCart className="text-primary w-6 h-6" />
              <div>
                <h2 className="font-bold">سبد خرید ویزیکا</h2>
                <p className="text-sm text-muted-foreground mt-1">{cartItems.length} کالا</p>
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-3xl shadow-sm overflow-hidden divide-y">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                <span className="animate-pulse text-sm">در حال بارگذاری...</span>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <ShoppingCart className="w-16 h-16 text-muted-foreground/30" />
                <div>
                  <p className="font-bold text-lg text-foreground">سبد خرید شما خالی است</p>
                  <p className="text-sm text-muted-foreground mt-1">محصولات مورد نظر خود را به سبد اضافه کنید</p>
                </div>
                <Link href="/categories" className="mt-2">
                  <Button variant="outline" className="rounded-xl">مشاهده محصولات</Button>
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="p-3 md:p-6 flex flex-row gap-3 md:gap-6">
                  {/* Product Image */}
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border relative overflow-hidden">
                    <Image 
                      src={mediaUrl(item.product.image)} 
                      alt={item.product.title} 
                      fill 
                      className="object-contain p-1 md:p-2"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="font-bold text-sm md:text-lg mb-1 md:mb-2 leading-tight truncate">{item.product.title}</h3>
                      <div className="flex items-center gap-2 md:gap-4 text-[11px] md:text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 md:w-4 md:h-4"/> گارانتی اصالت</span>
                        <span className="hidden sm:inline">ارسال امروز</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 md:mt-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center border rounded-xl overflow-hidden shadow-sm bg-background">
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center hover:bg-secondary active:bg-secondary/80 transition-colors text-primary">
                          <Plus className="w-5 h-5" />
                        </button>
                        <span className="w-8 md:w-10 text-center font-bold text-base md:text-lg">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center hover:bg-secondary active:bg-secondary/80 transition-colors text-destructive">
                          {item.quantity === 1 ? <Trash2 className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-left pl-1">
                        {item.product.discountPrice && (
                          <div className="text-[10px] md:text-sm text-muted-foreground line-through mb-0.5 md:mb-1">
                            {item.product.price.toLocaleString("fa-IR")} تومان
                          </div>
                        )}
                        <div className="text-sm md:text-xl font-bold">
                          {(item.product.discountPrice || item.product.price).toLocaleString("fa-IR")} <span className="text-[10px] md:text-sm font-normal text-muted-foreground">تومان</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-card border rounded-3xl p-6 sticky top-24 shadow-sm">
            <h3 className="text-lg font-bold mb-6 pb-4 border-b">خلاصه سفارش</h3>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>قیمت کالاها ({cartItems.length})</span>
                <span>{totalItemsPrice.toLocaleString("fa-IR")} تومان</span>
              </div>
              <div className="flex justify-between text-destructive font-medium">
                <span>تخفیف کالاها</span>
                <span>{totalDiscount.toLocaleString("fa-IR")} تومان</span>
              </div>
              <div className="flex justify-between text-muted-foreground border-b pb-4">
                <span>هزینه ارسال</span>
                <span className="font-medium text-foreground">وابسته به آدرس</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-lg">جمع سبد خرید</span>
                <span className="font-bold text-2xl text-primary">{finalPrice.toLocaleString("fa-IR")} <span className="text-sm font-normal text-foreground">تومان</span></span>
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="py-4 text-center">
                <p className="text-sm text-muted-foreground">سبد خرید شما خالی است</p>
              </div>
            ) : (
              <Link href="/checkout">
                <Button size="lg" className="w-full text-base font-bold rounded-xl h-14 shadow-md gap-2">
                  تایید و تکمیل سفارش
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </Link>
            )}
            
            <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
              هزینه ارسال در مرحله بعد بر اساس آدرس شما محاسبه می‌شود.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
