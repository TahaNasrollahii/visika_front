"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { MapPin, Clock, CreditCard, ChevronLeft, ShieldCheck, CheckCircle2, Circle, Edit2, Check, Package, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"

export default function CheckoutPage() {
  const { user } = useAuth()
  const [selectedPayment, setSelectedPayment] = useState('online')
  const [cartTotal, setCartTotal] = useState(0)
  const [cartItemsTotal, setCartItemsTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)
  const [addresses, setAddresses] = useState<any[]>([])
  const [defaultAddress, setDefaultAddress] = useState<any>(null)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [newAddress, setNewAddress] = useState({ title: '', detail: '', postal_code: '', is_default: false })
  const [submittingAddress, setSubmittingAddress] = useState(false)

  // Vendor specific delivery times
  const [brands, setBrands] = useState<string[]>([])
  const [selectedDeliveryTimes, setSelectedDeliveryTimes] = useState<Record<string, string>>({})
  // Vendor-specific valid delivery dates computed from delivery rules
  const [vendorDeliveryTimes, setVendorDeliveryTimes] = useState<Record<string, string[]>>({})

  const router = useRouter()

  /**
   * Map JS getDay() (0=Sun) to Persian weekday field names used by VendorDeliveryRule.
   */
  const JS_DAY_TO_FIELD: Record<number, string> = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
  }

  /**
   * Compute the valid delivery dates for a vendor based on their delivery rules.
   */
  const computeDeliveryDates = (rule: {
    preparation_days: number;
    end_of_order_taking_hour: number;
    saturday: boolean; sunday: boolean; monday: boolean;
    tuesday: boolean; wednesday: boolean; thursday: boolean; friday: boolean;
  }): string[] => {
    const now = new Date()
    const currentHour = now.getHours()

    // If the current hour is past the cut-off, preparation starts tomorrow
    let prepStart = new Date(now)
    if (currentHour >= rule.end_of_order_taking_hour) {
      prepStart.setDate(prepStart.getDate() + 1)
    }

    // Earliest delivery is after preparation_days from prepStart
    const earliest = new Date(prepStart)
    earliest.setDate(earliest.getDate() + rule.preparation_days)

    const weekdayAvailability: Record<string, boolean> = {
      saturday: rule.saturday, sunday: rule.sunday, monday: rule.monday,
      tuesday: rule.tuesday, wednesday: rule.wednesday, thursday: rule.thursday,
      friday: rule.friday,
    }

    const dates: string[] = []
    const candidate = new Date(earliest)
    // Scan up to 21 days to find at most 7 valid delivery dates
    for (let i = 0; i < 21 && dates.length < 7; i++) {
      const dayField = JS_DAY_TO_FIELD[candidate.getDay()]
      if (weekdayAvailability[dayField]) {
        const today = new Date(now)
        today.setHours(0, 0, 0, 0)
        const candidateDay = new Date(candidate)
        candidateDay.setHours(0, 0, 0, 0)
        const diffDays = Math.round((candidateDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        const dateStr = new Intl.DateTimeFormat('fa-IR', { month: 'long', day: 'numeric' }).format(candidate)
        let prefix: string
        if (diffDays === 0) prefix = 'امروز'
        else if (diffDays === 1) prefix = 'فردا'
        else prefix = new Intl.DateTimeFormat('fa-IR', { weekday: 'long' }).format(candidate)
        dates.push(`${prefix} (${dateStr})`)
      }
      candidate.setDate(candidate.getDate() + 1)
    }
    return dates
  }

  useEffect(() => {
    if (user?.role === 'vendor') {
      toast.error('فروشندگان امکان دسترسی به این صفحه را ندارند')
      router.push('/')
      return
    }

    const fetchData = async () => {
      try {
        const cartRes = await api.get('/orders/cart/')
        const items = cartRes.data.items || []
        const totalItemsPrice = items.reduce((acc: number, item: any) => acc + (item.product?.price * item.quantity), 0)
        setCartItemsTotal(totalItemsPrice)
        setCartTotal(cartRes.data.total_price)

        // Extract unique brands
        const uniqueBrands: string[] = Array.from(new Set(items.map((item: any) => item.product?.brand || 'بدون برند')))
        setBrands(uniqueBrands)

        // Fetch delivery rules for all vendors in the cart
        const rulesRes = await api.get(`/orders/delivery-info/?brands=${encodeURIComponent(uniqueBrands.join(','))}`)
        const rules = rulesRes.data || {}

        // Default rule for vendors without a configured rule
        const defaultRule = {
          preparation_days: 2, end_of_order_taking_hour: 15,
          saturday: true, sunday: true, monday: true,
          tuesday: true, wednesday: true, thursday: true, friday: false,
        }

        // Compute valid delivery dates for each vendor
        const vendorTimes: Record<string, string[]> = {}
        const initialTimes: Record<string, string> = {}
        uniqueBrands.forEach(brand => {
          const rule = rules[brand] || defaultRule
          const dates = computeDeliveryDates(rule)
          vendorTimes[brand] = dates
          if (dates.length > 0) {
            initialTimes[brand] = dates[0]
          }
        })
        setVendorDeliveryTimes(vendorTimes)
        setSelectedDeliveryTimes(initialTimes)

        // Fetch addresses
        const addrRes = await api.get('/users/addresses/')
        if (addrRes?.data) {
          setAddresses(addrRes.data)
          if (addrRes.data.length > 0) {
            const defaultAddr = addrRes.data.find((a: any) => a.is_default) || addrRes.data[0]
            setDefaultAddress(defaultAddr)
          }
        }
        setLoading(false)
      } catch (err) {
        toast.error("خطا در دریافت سبد خرید")
        router.push('/cart')
      }
    }

    fetchData()
  }, [router])

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/users/addresses/')
      setAddresses(res.data)
      if (res.data.length > 0 && !defaultAddress) {
        const defaultAddr = res.data.find((a: any) => a.is_default) || res.data[0]
        setDefaultAddress(defaultAddr)
      }
    } catch (err) {
      toast.error("خطا در دریافت آدرس‌ها")
    }
  }

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAddress.title || !newAddress.detail) {
      toast.error("لطفا عنوان و جزئیات آدرس را وارد کنید")
      return
    }
    setSubmittingAddress(true)
    try {
      const res = await api.post('/users/addresses/', newAddress)
      setAddresses([res.data, ...addresses.map(a => newAddress.is_default ? { ...a, is_default: false } : a)])
      setDefaultAddress(res.data)
      setShowAddressModal(false)
      setNewAddress({ title: '', detail: '', postal_code: '', is_default: false })
      toast.success("آدرس جدید با موفقیت ثبت شد")
      fetchAddresses()
    } catch (err) {
      toast.error("خطا در ثبت آدرس جدید")
    } finally {
      setSubmittingAddress(false)
    }
  }

  const shippingCost = 25000
  const finalPrice = cartTotal
  const totalDiscount = cartItemsTotal - finalPrice

  const paymentMethods = [
    { id: 'online', title: 'پرداخت اینترنتی', subtitle: 'پرداخت آنلاین با تمامی کارت‌های بانکی' },
    { id: 'cod', title: 'پرداخت در محل', subtitle: 'با دستگاه کارتخوان هنگام تحویل' }
  ]

  const handleCheckout = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!defaultAddress) {
      toast.error("لطفا آدرس خود را ثبت کنید")
      return
    }
    setCheckingOut(true)
    try {
      const res = await api.post('/orders/checkout/', {
        delivery_times: selectedDeliveryTimes
      })
      toast.success("سفارش با موفقیت ثبت شد")
      window.dispatchEvent(new Event("cart-updated"))
      router.push(`/success?order_id=${res.data.id}`)
    } catch (err) {
      toast.error("خطا در ثبت سفارش")
      setCheckingOut(false)
    }
  }

  const handleTimeSelect = (brand: string, time: string) => {
    setSelectedDeliveryTimes(prev => ({ ...prev, [brand]: time }))
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-20 text-center font-bold text-muted-foreground text-lg">در حال بارگذاری اطلاعات پرداخت...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8 min-h-[calc(100vh-200px)] overflow-hidden">
      <div
        className="flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-top-4 duration-500"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <CreditCard className="w-5 h-5" />
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">تکمیل سفارش</h1>
      </div>

      <div
        className="flex flex-col lg:flex-row gap-8 lg:gap-10 animate-in fade-in duration-700"
      >

        {/* Checkout Steps */}
        <div className="flex-1 space-y-8 min-w-0">

          {/* Address Section */}
          <div className="bg-secondary/30 border border-border/50 rounded-[2rem] p-6 lg:p-8 shadow-sm relative overflow-hidden group animate-in slide-in-from-bottom-4 duration-500 fill-mode-both delay-100">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border/50">
                <h2 className="font-bold text-xl flex items-center gap-3 text-foreground">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  آدرس تحویل سفارش
                </h2>
                <Button onClick={() => setShowAddressModal(true)} variant="outline" size="sm" className="rounded-xl border-border/60 hover:bg-background shadow-sm flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Plus className="w-4 h-4" />
                  آدرس جدید
                </Button>
              </div>
              <div className="space-y-4">
                {addresses.length > 0 ? (
                  <div className="grid gap-4">
                    {addresses.map(address => (
                      <div 
                        key={address.id} 
                        onClick={() => setDefaultAddress(address)}
                        className={`cursor-pointer border-2 rounded-2xl p-4 transition-all ${defaultAddress?.id === address.id ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/40'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 flex items-center justify-center w-5 h-5 rounded-full border-2 shrink-0 ${defaultAddress?.id === address.id ? 'border-primary' : 'border-muted-foreground'}`}>
                            {defaultAddress?.id === address.id && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-bold">{address.title}</h3>
                              {address.is_default && <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">پیش‌فرض</span>}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{address.detail}</p>
                            {address.postal_code && <p className="text-xs text-muted-foreground mt-2">کد پستی: {address.postal_code}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl flex items-center justify-between">
                    <span className="font-bold">آدرسی ثبت نشده است.</span>
                    <Button onClick={() => setShowAddressModal(true)} size="sm" className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg">ثبت آدرس</Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Time Section - Per Vendor */}
          <div className="bg-secondary/30 border border-border/50 rounded-[2rem] p-6 lg:p-8 shadow-sm animate-in slide-in-from-bottom-4 duration-500 fill-mode-both delay-200">
            <div className="flex items-center gap-2 mb-6 pb-6 border-b border-border/50">
              <h2 className="font-bold text-xl flex items-center gap-3 text-foreground">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <Clock className="w-5 h-5" />
                </div>
                زمان ارسال کالاها
              </h2>
            </div>

            <div className="space-y-8">
              {brands.map(brand => (
                <div key={brand} className="bg-background rounded-2xl p-5 border border-border/40 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg">ارسال فروشنده: {brand}</h3>
                  </div>

                  <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide snap-x">
                    {(vendorDeliveryTimes[brand] || []).length === 0 ? (
                    <div className="text-sm text-muted-foreground py-4 text-center w-full">
                      زمان ارسالی برای این فروشنده در دسترس نیست.
                    </div>
                  ) : (
                    (vendorDeliveryTimes[brand] || []).map((time, i) => {
                      const isActive = selectedDeliveryTimes[brand] === time
                      return (
                        <div
                          key={i}
                          onClick={() => handleTimeSelect(brand, time)}
                          className="relative cursor-pointer snap-center shrink-0 w-[180px] hover:scale-105 active:scale-95 transition-transform"
                        >
                          {isActive && (
                            <div
                              className="absolute inset-0 bg-primary border-2 border-primary rounded-2xl shadow-[0_4px_15px_rgba(var(--primary),0.2)]"
                            />
                          )}
                          <div className={`relative flex flex-col items-center justify-center p-3 h-[80px] rounded-2xl border-2 transition-colors duration-300 ${isActive ? 'border-transparent text-primary-foreground' : 'border-border/60 bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:bg-secondary/50'}`}>
                            <span className={`font-bold text-[13px] text-center ${isActive ? 'text-primary-foreground' : 'text-foreground'}`}>
                              {time}
                            </span>
                          </div>
                        </div>
                      )
                    })
                  )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-secondary/30 border border-border/50 rounded-[2rem] p-6 lg:p-8 shadow-sm animate-in slide-in-from-bottom-4 duration-500 fill-mode-both delay-300">
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
                  <div
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className="relative cursor-pointer hover:translate-x-[-4px] active:scale-99 transition-transform"
                  >
                    {isActive && (
                      <div
                        className="absolute inset-0 bg-primary/5 border-2 border-primary rounded-2xl shadow-[0_8px_20px_rgba(var(--primary),0.1)]"
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
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[400px] shrink-0 relative z-10 animate-in fade-in slide-in-from-right-8 duration-700 delay-200 fill-mode-both">
          <div className="sticky top-28 w-full rounded-[2.5rem] p-6 lg:p-8 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">

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

              <div className="hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95 transition-transform">
                <Button
                  onClick={handleCheckout} 
                  disabled={checkingOut || loading} 
                  size="lg" 
                  className={`w-full text-lg font-black rounded-[1.25rem] h-16 transition-all relative overflow-hidden group bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_15px_40px_-10px_rgba(var(--primary),0.6)] border-b-4 border-primary/20 active:border-b-0 active:mt-1`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-6 h-6" />
                    {checkingOut ? 'در حال ثبت...' : 'تایید و تکمیل سفارش'}
                  </span>
                  {!checkingOut && (
                    <div className="absolute inset-0 -translate-x-[150%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                  )}
                </Button>
              </div>

              <div className="mt-6 p-4 bg-secondary/50 rounded-2xl flex items-start gap-3 border border-border/30 hover:scale-[1.02] transition-transform">
                <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
                <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                  پرداخت شما از طریق درگاه‌های امن بانکی انجام می‌شود. تمامی اطلاعات شما نزد ما <span className="font-bold text-foreground">محفوظ</span> است.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-lg rounded-3xl border shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">ثبت آدرس جدید</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowAddressModal(false)} className="rounded-full hover:bg-secondary">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <form onSubmit={handleCreateAddress} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">عنوان آدرس (مثلا: خانه، محل کار)</label>
                <Input 
                  value={newAddress.title} 
                  onChange={e => setNewAddress({...newAddress, title: e.target.value})} 
                  placeholder="مثال: خانه" 
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">جزئیات کامل آدرس</label>
                <textarea 
                  value={newAddress.detail}
                  onChange={e => setNewAddress({...newAddress, detail: e.target.value})}
                  placeholder="استان، شهر، خیابان، پلاک، واحد..."
                  className="w-full min-h-[100px] p-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">کد پستی (اختیاری)</label>
                <Input 
                  value={newAddress.postal_code} 
                  onChange={e => setNewAddress({...newAddress, postal_code: e.target.value})} 
                  placeholder="کد پستی ۱۰ رقمی" 
                  className="rounded-xl"
                  dir="ltr"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="is_default" 
                  checked={newAddress.is_default}
                  onChange={e => setNewAddress({...newAddress, is_default: e.target.checked})}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="is_default" className="text-sm font-medium cursor-pointer">
                  انتخاب به عنوان آدرس پیش‌فرض
                </label>
              </div>
              <div className="pt-6">
                <Button type="submit" disabled={submittingAddress} className="w-full rounded-xl h-12 text-base font-bold">
                  {submittingAddress ? 'در حال ثبت...' : 'ثبت آدرس'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
