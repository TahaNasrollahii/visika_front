import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Camera, Send, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t mt-16 pt-16 pb-8 md:pb-16 mb-16 md:mb-0">
      <div className="container mx-auto px-4 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Brand & Info */}
          <div className="space-y-4">
            <div className="flex mb-4">
              <div className="relative w-32 h-32 md:w-80 md:h-28 shrink-0">
                <Image src="/newlogo.png" alt="ویزیکا" fill className="hidden md:block object-contain object-right" unoptimized />
                <Image src="/mobile_logo.png" alt="ویزیکا" fill className="block md:hidden object-contain object-right" unoptimized />
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ویزیکا، سوپرمارکت آنلاین شما برای خریدی آسان، سریع و مطمئن. ما بهترین و تازه‌ترین محصولات را با کمترین زمان به دست شما می‌رسانیم تا تجربه‌ای متفاوت از خرید روزانه داشته باشید.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Camera className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Send className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="font-bold text-lg mb-6">دسترسی سریع</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">درباره ویزیکا</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">تماس با ما</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">سوالات متداول</Link></li>
              <li><Link href="/rules" className="text-sm text-muted-foreground hover:text-primary transition-colors">قوانین و مقررات</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">حریم خصوصی</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="font-bold text-lg mb-6">خدمات مشتریان</h3>
            <ul className="space-y-3">
              <li><Link href="/tracking" className="text-sm text-muted-foreground hover:text-primary transition-colors">پیگیری سفارش</Link></li>
              <li><Link href="/return" className="text-sm text-muted-foreground hover:text-primary transition-colors">رویه بازگرداندن کالا</Link></li>
              <li><Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors">شرایط ارسال</Link></li>
              <li><Link href="/payment" className="text-sm text-muted-foreground hover:text-primary transition-colors">شیوه‌های پرداخت</Link></li>
            </ul>
          </div>

          {/* Contact & App */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg mb-6">ارتباط با ما</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground leading-relaxed">تهران، میدان ونک، خیابان ملاصدرا، پلاک ۱۲، طبقه ۳</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground font-medium">۰۲۱-۸۸۸۸۸۸۸۸</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">info@vzika.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-right">
            کلیه حقوق این وب‌سایت متعلق به فروشگاه آنلاین ویزیکا می‌باشد. © ۱۴۰۳
          </p>
          <div className="flex gap-2">
            {/* Trust Badges Placeholders */}
            <div className="w-16 h-16 bg-white rounded-lg border flex items-center justify-center text-[10px] text-muted-foreground font-medium">ای‌نماد</div>
            <div className="w-16 h-16 bg-white rounded-lg border flex items-center justify-center text-[10px] text-muted-foreground font-medium">ساماندهی</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
