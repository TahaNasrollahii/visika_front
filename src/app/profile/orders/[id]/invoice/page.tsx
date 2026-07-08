"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Printer, ChevronRight, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { toast } from "sonner"
import Link from "next/link"

export default function InvoicePage() {
  const { id } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [address, setAddress] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, userRes, addressRes] = await Promise.all([
          api.get(`/orders/${id}/`),
          api.get('/users/info/'),
          api.get('/users/addresses/')
        ])
        setOrder(orderRes.data)
        setUser(userRes.data)
        
        if (addressRes.data && addressRes.data.length > 0) {
          const defaultAddr = addressRes.data.find((a: any) => a.is_default) || addressRes.data[0]
          setAddress(defaultAddr)
        }
      } catch (err) {
        toast.error("خطا در دریافت اطلاعات فاکتور")
        router.push("/profile/orders")
      } finally {
        setLoading(false)
      }
    }
    if (id) {
      fetchData()
    }
  }, [id, router])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return <div className="text-center py-20 font-bold text-muted-foreground">در حال بارگذاری فاکتور...</div>
  }

  if (!order) {
    return <div className="text-center py-20 text-rose-500 font-bold">فاکتور یافت نشد.</div>
  }

  const shippingCost = 25000;
  const finalPrice = order.total_amount;
  const totalWithShipping = finalPrice + shippingCost;
  
  const totalQuantity = order.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8 max-w-5xl">
      
      {/* Action Bar (Hidden in Print) */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <Link href="/profile/orders">
          <Button variant="ghost" className="gap-2 font-bold hover:bg-secondary rounded-xl text-gray-600">
            <ChevronRight className="w-5 h-5" />
            بازگشت به سفارش‌ها
          </Button>
        </Link>
        <Button onClick={handlePrint} className="gap-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white shadow-md px-6">
          <Printer className="w-5 h-5" />
          چاپ فاکتور
        </Button>
      </div>

      {/* Invoice Document (Printable) */}
      <div className="bg-white text-gray-900 p-8 sm:p-12 rounded-[2rem] shadow-sm border border-gray-100 print:p-0 print:border-none print:shadow-none w-full" id="print-area">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 print:mb-6 pb-8 print:pb-4 border-b border-gray-100">
          <div className="flex items-center gap-5 mb-6 sm:mb-0">
            <div className="w-16 h-16 print:w-12 print:h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center print:border print:border-gray-200 print:bg-transparent">
               <ShoppingCart className="w-8 h-8 print:w-6 print:h-6" />
            </div>
            <div>
              <h1 className="text-3xl print:text-2xl font-black text-gray-900 tracking-tight">ویزیکا</h1>
              <p className="text-sm print:text-xs font-bold text-gray-400 mt-1 print:mt-0.5">سوپرمارکت آنلاین</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl print:text-xl font-bold text-gray-900 mb-3 print:mb-2">فاکتور فروش</h2>
            <div className="space-y-1.5 print:space-y-1 text-sm print:text-[11px] text-gray-500 font-medium">
              <p className="flex justify-between gap-4"><span>کد سفارش:</span> <span className="font-bold text-gray-900">VZ-{order.id}</span></p>
              <p className="flex justify-between gap-4"><span>تاریخ سفارش:</span> <span className="font-bold text-gray-900">{new Date(order.created_at).toLocaleDateString('fa-IR')}</span></p>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-6 print:gap-4 mb-12 print:mb-6">
          <div className="bg-gray-50/80 p-6 print:p-4 rounded-2xl print:bg-transparent print:border print:border-gray-200">
            <h3 className="text-xs print:text-[10px] font-black text-gray-400 mb-4 print:mb-3 tracking-wider uppercase">اطلاعات فروشنده</h3>
            <div className="space-y-2.5 print:space-y-1.5 text-sm print:text-xs text-gray-700 font-medium">
              <p className="font-bold text-base print:text-sm text-gray-900">فروشگاه اینترنتی ویزیکا</p>
              <p className="flex items-center gap-2"><span className="text-gray-400">شماره اقتصادی:</span> ۱۲۳۴۵۶۷۸۹۰</p>
              <p className="flex items-center gap-2"><span className="text-gray-400">شماره ثبت:</span> ۰۹۸۷۶۵</p>
              <p className="leading-relaxed mt-2 print:mt-1 text-gray-600">تهران، خیابان ولیعصر، تقاطع فاطمی، پلاک ۱</p>
            </div>
          </div>
          <div className="bg-gray-50/80 p-6 print:p-4 rounded-2xl print:bg-transparent print:border print:border-gray-200">
            <h3 className="text-xs print:text-[10px] font-black text-gray-400 mb-4 print:mb-3 tracking-wider uppercase">اطلاعات خریدار</h3>
            <div className="space-y-2.5 print:space-y-1.5 text-sm print:text-xs text-gray-700 font-medium">
              <p className="font-bold text-base print:text-sm text-gray-900">{user?.full_name || "کاربر ویزیکا"}</p>
              <p className="flex items-center gap-2"><span className="text-gray-400">شماره تماس:</span> <span dir="ltr">{user?.phone_number || "---"}</span></p>
              <p className="leading-relaxed mt-2 print:mt-1 text-gray-600">{address?.detail || "آدرسی یافت نشد"}</p>
              <p className="flex items-center gap-2"><span className="text-gray-400">کد پستی:</span> {address?.postal_code || "---"}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-12 print:mb-6 overflow-hidden rounded-2xl border border-gray-100 print:rounded-none print:border-gray-300">
          <table className="w-full text-center text-[11px] print:text-[10px] sm:text-xs">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
              <tr>
                <th className="py-4 print:py-2 px-2 font-bold">ردیف</th>
                <th className="py-4 print:py-2 px-2 font-bold text-right">نام کالا</th>
                <th className="py-4 print:py-2 px-2 font-bold">بهای واحد <span className="text-[9px] font-normal">(تومان)</span></th>
                <th className="py-4 print:py-2 px-2 font-bold">تعداد</th>
                <th className="py-4 print:py-2 px-2 font-bold">بهای کل <span className="text-[9px] font-normal">(تومان)</span></th>
                <th className="py-4 print:py-2 px-2 font-bold">تخفیف</th>
                <th className="py-4 print:py-2 px-2 font-bold">بهای نهایی</th>
                <th className="py-4 print:py-2 px-2 font-bold">ارزش افزوده</th>
                <th className="py-4 print:py-2 px-2 font-bold">مبلغ کل</th>
                <th className="py-4 print:py-2 px-2 font-bold">فروشنده</th>
                <th className="py-4 print:py-2 px-2 font-bold">تاریخ تحویل</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 font-medium divide-y divide-gray-50">
              {order.items?.map((item: any, idx: number) => {
                const unitPrice = item.price;
                const totalPrice = unitPrice * item.quantity;
                return (
                  <tr key={item.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="py-4 print:py-2.5 px-2 text-gray-400">{idx + 1}</td>
                    <td className="py-4 print:py-2.5 px-2 font-bold text-right text-gray-900">{item.product_title}</td>
                    <td className="py-4 print:py-2.5 px-2 text-gray-600">{unitPrice.toLocaleString('fa-IR')}</td>
                    <td className="py-4 print:py-2.5 px-2 text-gray-900 font-bold">{item.quantity}</td>
                    <td className="py-4 print:py-2.5 px-2 text-gray-600">{totalPrice.toLocaleString('fa-IR')}</td>
                    <td className="py-4 print:py-2.5 px-2 text-gray-400">۰</td>
                    <td className="py-4 print:py-2.5 px-2 text-gray-600">{totalPrice.toLocaleString('fa-IR')}</td>
                    <td className="py-4 print:py-2.5 px-2 text-gray-400">۰</td>
                    <td className="py-4 print:py-2.5 px-2 text-gray-900 font-bold">{totalPrice.toLocaleString('fa-IR')}</td>
                    <td className="py-4 print:py-2.5 px-2 text-gray-500 text-[10px] print:text-[8px]">{item.product_brand || 'ویزیکا'}</td>
                    <td className="py-4 print:py-2.5 px-2 text-gray-500 text-[10px] print:text-[8px]">{item.delivery_time || "-"}</td>
                  </tr>
                )
              })}
              
              {/* Shipping Row */}
              <tr className="bg-gray-50/50">
                <td className="py-4 print:py-2.5 px-2 text-gray-400">-</td>
                <td className="py-4 print:py-2.5 px-2 font-bold text-right text-gray-600">هزینه ارسال</td>
                <td className="py-4 print:py-2.5 px-2 text-gray-500">{shippingCost.toLocaleString('fa-IR')}</td>
                <td className="py-4 print:py-2.5 px-2 text-gray-900 font-bold">۱</td>
                <td className="py-4 print:py-2.5 px-2 text-gray-500">{shippingCost.toLocaleString('fa-IR')}</td>
                <td className="py-4 print:py-2.5 px-2 text-gray-400">۰</td>
                <td className="py-4 print:py-2.5 px-2 text-gray-500">{shippingCost.toLocaleString('fa-IR')}</td>
                <td className="py-4 print:py-2.5 px-2 text-gray-400">۰</td>
                <td className="py-4 print:py-2.5 px-2 text-gray-900 font-bold">{shippingCost.toLocaleString('fa-IR')}</td>
                <td className="py-4 print:py-2.5 px-2 text-gray-400 text-[10px] print:text-[8px]">ویزیکا</td>
                <td className="py-4 print:py-2.5 px-2 text-gray-400 text-[10px] print:text-[8px]">-</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Totals & Signature */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-start pt-4 border-t border-gray-100">
          
          {/* Signature */}
          <div className="text-center w-full md:w-48 pt-6 md:pt-4">
             <div className="w-16 h-16 print:w-12 print:h-12 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-3 print:mb-2 print:border print:border-gray-200 print:bg-transparent">
                <ShoppingCart className="w-7 h-7 print:w-5 print:h-5 text-gray-300" />
             </div>
             <p className="text-[11px] print:text-[9px] font-bold text-gray-400 uppercase tracking-widest">مهر و امضای فروشگاه</p>
          </div>

          {/* Totals Box */}
          <div className="w-full md:w-80 bg-gray-50/80 rounded-2xl p-6 print:p-4 print:bg-transparent print:border print:border-gray-200">
            <div className="space-y-4 print:space-y-2 text-sm print:text-xs text-gray-600 font-medium">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">مجموع تعداد اقلام:</span>
                <span className="font-bold text-gray-900">{totalQuantity + 1} عدد</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">جمع کل کالاها:</span>
                <span className="font-bold text-gray-900">{finalPrice.toLocaleString('fa-IR')} تومان</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">هزینه ارسال:</span>
                <span className="font-bold text-gray-900">{shippingCost.toLocaleString('fa-IR')} تومان</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>تخفیف کل:</span>
                <span>۰ تومان</span>
              </div>
              <div className="pt-4 print:pt-2 border-t border-gray-200 flex justify-between items-center">
                <span className="font-black text-gray-900">مبلغ قابل پرداخت:</span>
                <div className="text-left">
                  <span className="text-xl print:text-lg font-black text-blue-600 block leading-none">{totalWithShipping.toLocaleString('fa-IR')}</span>
                  <span className="text-[10px] print:text-[8px] font-bold text-gray-400">تومان</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Footer Note */}
        <div className="mt-16 print:mt-8 text-center text-xs print:text-[10px] font-medium text-gray-400 pb-4 print:pb-0">
          <p>این فاکتور صرفاً جهت اطلاع مشتری صادر شده است.</p>
          <p className="mt-1">ویزیکا - تضمین کیفیت و سرعت | www.vzika.com</p>
        </div>

      </div>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { margin: 1cm; }
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide global layout elements */
          header, footer, aside, nav, .print\\:hidden {
            display: none !important;
          }
          
          /* Add a global zoom to ensure it fits better on one page */
          #print-area {
            zoom: 0.9;
          }
          
          /* Reset container constraints */
          .container {
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Remove borders and backgrounds from profile layout wrapper */
          main > div {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            min-height: 0 !important;
          }
          
          /* Ensure heights auto-adjust to avoid blank pages */
          html, body, main {
            height: auto !important;
            min-height: 0 !important;
          }
        }
      `}} />
    </div>
  )
}
