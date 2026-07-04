"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, Plus, Minus, ShoppingCart, ChevronLeft, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    { id: 1, title: "شیر کم چرب کاله 1 لیتری", price: 35000, discountPrice: 32000, quantity: 2, image: "https://placehold.co/500x500/f8fafc/334155.png?text=Milk" },
    { id: 2, title: "پنیر فتا دوشه هراز 400 گرمی", price: 45000, quantity: 1, image: "https://placehold.co/500x500/f8fafc/334155.png?text=Cheese" },
  ])

  const totalItemsPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const totalDiscount = cartItems.reduce((acc, item) => acc + ((item.price - (item.discountPrice || item.price)) * item.quantity), 0)
  const finalPrice = totalItemsPrice - totalDiscount

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta
        if (newQuantity <= 0) {
          toast.success('کالا از سبد خرید حذف شد')
          return { ...item, quantity: 0 } // In real app, we'd filter it out, but keep it simple
        }
        return { ...item, quantity: newQuantity }
      }
      return item
    }).filter(item => item.quantity > 0))
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
            {cartItems.map((item) => (
              <div key={item.id} className="p-3 md:p-6 flex flex-row gap-3 md:gap-6">
                {/* Product Image */}
                <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border relative overflow-hidden">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill 
                    className="object-contain p-1 md:p-2"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 className="font-bold text-sm md:text-lg mb-1 md:mb-2 leading-tight truncate">{item.title}</h3>
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
                      {item.discountPrice && (
                        <div className="text-[10px] md:text-sm text-muted-foreground line-through mb-0.5 md:mb-1">
                          {item.price.toLocaleString("fa-IR")} تومان
                        </div>
                      )}
                      <div className="text-sm md:text-xl font-bold">
                        {(item.discountPrice || item.price).toLocaleString("fa-IR")} <span className="text-[10px] md:text-sm font-normal text-muted-foreground">تومان</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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

            <Link href="/checkout">
              <Button size="lg" className="w-full text-base font-bold rounded-xl h-14 shadow-md gap-2">
                تایید و تکمیل سفارش
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            
            <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
              هزینه ارسال در مرحله بعد بر اساس آدرس شما محاسبه می‌شود.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
