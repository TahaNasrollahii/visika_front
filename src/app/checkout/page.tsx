"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Clock, CreditCard, ChevronLeft, ShieldCheck, CheckCircle2, Circle, Edit2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { toast } from "sonner"

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 28 } }
}

export default function CheckoutPage() {
  const [selectedTime, setSelectedTime] = useState(0)
  const [selectedPayment, setSelectedPayment] = useState('online')
  const [cartTotal, setCartTotal] = useState(0)
  const [cartItemsTotal, setCartItemsTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)
  const [defaultAddress, setDefaultAddress] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    api.get('/orders/cart/')
      .then(res => {
        const items = res.data.items || []
        const totalItemsPrice = items.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0)
        setCartItemsTotal(totalItemsPrice)
        setCartTotal(res.data.total_price)
        return api.get('/users/addresses/')
      })
      .then(res => {
        if (res && res.data) {
          const defaultAddr = res.data.find((a: any) => a.is_default) || res.data[0]
          setDefaultAddress(defaultAddr)
        }
        setLoading(false)
      })
      .catch(() => {
        toast.error("خطا در دریافت سبد خرید")
        router.push('/cart')
      })
  }, [])

  const shippingCost = 25000
  const finalPrice = cartTotal
  const totalDiscount = cartItemsTotal - finalPrice

  const deliveryTimes = ['امروز - ۱۸ تا ۲۰', 'امروز - ۲۰ تا ۲۲', 'فردا - ۱۰ تا ۱۲']

  const paymentMethods = [
    { id: 'online', title: 'پرداخت اینترنتی', subtitle: 'پرداخت آنلاین با تمامی کارت‌های بانکی' },
    { id: 'cod', title: 'پرداخت در محل', subtitle: 'با دستگاه کارتخوان هنگام تحویل' }
  ]

  const handleCheckout = async (e: React.MouseEvent) => {
    e.preventDefault()
    setCheckingOut(true)
    try {
      await api.post('/orders/checkout/')
      toast.success("سفارش با موفقیت ثبت شد")
      router.push('/success')
    } catch (err) {
      toast.error("خطا در ثبت سفارش")
      setCheckingOut(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8 min-h-[calc(100vh-200px)] overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <CreditCard className="w-5 h-5" />
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">تکمیل سفارش</h1>
      </motion.div>
      
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex flex-col lg:flex-row gap-8 lg:gap-10"
      >
        
        {/* Checkout Steps */}
        <div className="flex-1 space-y-8">
          
          {/* Address Section */}
          <motion.div variants={fadeUp} className="bg-secondary/30 border border-border/50 rounded-[2rem] p-6 lg:p-8 shadow-sm relative overflow-hidden group">
            {/* Subtle Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border/50">
                <h2 className="font-bold text-xl flex items-center gap-3 text-foreground">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  آدرس تحویل سفارش
                </h2>
                <Link href="/profile/addresses">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="sm" className="rounded-xl border-border/60 hover:bg-background shadow-sm flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Edit2 className="w-4 h-4" />
                      ویرایش آدرس
                    </Button>
                  </motion.div>
                </Link>
              </div>
              <div className="space-y-4">
                {defaultAddress ? (
                  <>
                    <p className="font-bold text-lg text-foreground leading-relaxed">
                      {defaultAddress.detail}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-medium text-muted-foreground">
                      <span className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-lg border border-border/30">
                        <ShieldCheck className="w-4 h-4 text-emerald-500"/> عنوان آدرس: {defaultAddress.title}
                      </span>
                      {defaultAddress.postal_code && (
                        <span className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-lg border border-border/30">
                          کد پستی: {defaultAddress.postal_code}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">هیچ آدرسی یافت نشد. لطفا از بخش ویرایش آدرس، یک آدرس ثبت کنید.</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Delivery Time Section */}
          <motion.div variants={fadeUp} className="bg-secondary/30 border border-border/50 rounded-[2rem] p-6 lg:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-6 border-b border-border/50">
              <h2 className="font-bold text-xl flex items-center gap-3 text-foreground">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <Clock className="w-5 h-5" />
                </div>
                زمان ارسال
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {deliveryTimes.map((time, i) => {
                const isActive = selectedTime === i
                return (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTime(i)}
                    className="relative cursor-pointer"
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeTime"
                        className="absolute inset-0 bg-primary border-2 border-primary rounded-2xl shadow-[0_8px_20px_rgba(var(--primary),0.2)]"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    <div className={`relative flex items-center justify-center p-4 rounded-2xl border-2 transition-colors duration-300 ${isActive ? 'border-transparent text-primary-foreground' : 'border-border/60 bg-background/50 text-muted-foreground hover:border-primary/40 hover:bg-background'}`}>
                      <div className="flex items-center gap-3">
                        {isActive ? (
                          <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                        ) : (
                          <Circle className="w-5 h-5 opacity-40" />
                        )}
                        <span className={`font-bold ${isActive ? 'text-primary-foreground' : 'text-foreground'}`}>{time}</span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Payment Method Section */}
          <motion.div variants={fadeUp} className="bg-secondary/30 border border-border/50 rounded-[2rem] p-6 lg:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-6 border-b border-border/50">
              <h2 className="font-bold text-xl flex items-center gap-3 text-foreground">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                  <CreditCard className="w-5 h-5" />
                </div>
                شیوه پرداخت
              </h2>
            </div>
            
            <div className="space-y-4">
              {paymentMethods.map((method) => {
                const isActive = selectedPayment === method.id
                return (
                  <motion.div 
                    key={method.id}
                    whileHover={{ scale: 1.01, x: -4 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedPayment(method.id)}
                    className="relative cursor-pointer"
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activePayment"
                        className="absolute inset-0 bg-primary/5 border-2 border-primary rounded-2xl shadow-[0_8px_20px_rgba(var(--primary),0.1)]"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    <div className={`relative flex items-center p-5 rounded-2xl border-2 transition-colors duration-300 ${isActive ? 'border-transparent' : 'border-border/60 bg-background/50 hover:border-primary/40 hover:bg-background'}`}>
                      <div className="flex items-center gap-4 w-full">
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'border-2 border-muted-foreground/30 text-transparent'}`}>
                          <Check className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <span className={`font-black block text-lg ${isActive ? 'text-primary' : 'text-foreground'}`}>
                            {method.title}
                          </span>
                          <span className={`text-sm mt-1 block font-medium ${isActive ? 'text-primary/70' : 'text-muted-foreground'}`}>
                            {method.subtitle}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

        </div>

        {/* Order Summary - Glassmorphic floating card */}
        <motion.div variants={slideInLeft} className="w-full lg:w-[400px] shrink-0 relative z-10">
          <div className="sticky top-28 w-full rounded-[2.5rem] p-6 lg:p-8 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
            
            {/* Ambient background glow for the card */}
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-white/60 to-transparent dark:from-white/5 pointer-events-none" />

            <div className="relative z-10">
              <h3 className="text-xl font-black mb-6 pb-6 border-b border-border/50 text-foreground">رسید پرداخت</h3>
              
              <div className="space-y-4 mb-8 text-base">
                <div className="flex justify-between items-center text-muted-foreground font-medium">
                  <span>مبلغ کل کالاها</span>
                  <span className="text-foreground font-bold">{cartItemsTotal.toLocaleString("fa-IR")} تومان</span>
                </div>
                <div className="flex justify-between items-center text-rose-500 font-bold bg-rose-500/10 p-3 rounded-xl">
                  <span>تخفیف</span>
                  <span>{totalDiscount.toLocaleString("fa-IR")} تومان</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground font-medium">
                  <span>هزینه ارسال</span>
                  <span className="text-foreground font-bold">{shippingCost.toLocaleString("fa-IR")} تومان</span>
                </div>
                
                <div className="flex justify-between items-end pt-6 border-t border-border/50 mt-6">
                  <span className="font-black text-lg text-foreground">مبلغ قابل پرداخت</span>
                  <div className="text-left">
                    <span className="font-black text-3xl lg:text-4xl text-primary block tracking-tighter">
                      {(finalPrice + shippingCost).toLocaleString("fa-IR")}
                    </span>
                    <span className="text-sm font-bold text-muted-foreground">تومان</span>
                  </div>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button onClick={handleCheckout} disabled={checkingOut || loading} size="lg" className="w-full text-lg font-black rounded-[1.25rem] h-16 shadow-[0_15px_40px_-10px_rgba(var(--primary),0.6)] hover:shadow-[0_20px_50px_-10px_rgba(var(--primary),0.8)] transition-all bg-primary hover:bg-primary/90 text-primary-foreground relative overflow-hidden group border-b-4 border-primary/20 active:border-b-0 active:mt-1">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-6 h-6" />
                    {checkingOut ? 'در حال ثبت...' : 'پرداخت و ثبت نهایی'}
                  </span>
                  <div className="absolute inset-0 -translate-x-[150%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                </Button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="mt-6 p-4 bg-secondary/50 rounded-2xl flex items-start gap-3 border border-border/30"
              >
                <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
                <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                  پرداخت شما از طریق درگاه‌های امن بانکی انجام می‌شود. تمامی اطلاعات شما نزد ما <span className="font-bold text-foreground">محفوظ</span> است.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
