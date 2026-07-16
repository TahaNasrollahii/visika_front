"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(119)
  const [canResend, setCanResend] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (step === 2 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && step === 2) {
      setCanResend(true)
    }
    return () => clearInterval(timer)
  }, [step, timeLeft])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    const formatted = `${m}:${s < 10 ? '0' : ''}${s}`
    return formatted.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)])
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length === 11) {
      const currentStep = step
      setStep(2)
      setTimeLeft(119)
      setCanResend(false)

      api.post('/users/otp/request/', { phone_number: phone, action: 'login' })
        .then(() => {
          toast.success("کد تایید با موفقیت ارسال شد")
        })
        .catch((err: any) => {
          setStep(currentStep)
          if (err.response?.status === 404) {
            toast.error(
              <div className="flex flex-col gap-2">
                  <span className="text-sm">کاربری با این شماره یافت نشد.</span>
                  <Link href="/register" className="text-primary text-sm font-bold mt-1 underline">
                      ثبت نام در ویزیکا
                  </Link>
              </div>,
              { duration: 5000 }
            )
          } else {
            toast.error("خطا در ارسال کد تایید")
          }
        })
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length === 4) {
      setLoading(true)
      try {
        await api.post('/users/otp/login/', { phone_number: phone, otp })
        const userRes = await api.get('/users/info')
        toast.success("ورود موفقیت‌آمیز")
        window.dispatchEvent(new Event("user-updated"))
        window.dispatchEvent(new Event("cart-updated"))
        if (userRes.data.role === 'vendor') {
          router.push('/vendor/products')
        } else {
          router.push('/profile')
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          toast.error("کاربری با این شماره یافت نشد. لطفا ثبت‌نام کنید")
          router.push('/register')
        } else {
          toast.error("کد تایید نامعتبر است")
        }
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border rounded-3xl p-8 shadow-sm relative overflow-hidden">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-primary text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-2xl shadow-sm">
            V
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2 text-center">
          {step === 1 ? "ورود به ویزیکا" : "تایید شماره موبایل"}
        </h1>
        <p className="text-sm text-muted-foreground mb-8 text-center">
          {step === 1 
            ? "لطفا شماره موبایل خود را وارد کنید." 
            : `کد تایید به شماره ${phone} ارسال شد.`}
        </p>

        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div className="space-y-2 text-right">
              <label className="text-sm font-semibold">شماره موبایل</label>
              <Input 
                type="tel" 
                placeholder="۰۹۱۲۳۴۵۶۷۸۹" 
                className="text-left text-lg tracking-widest h-14"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                dir="ltr"
                maxLength={11}
              />
            </div>
            <Button size="lg" type="submit" className="w-full text-base font-bold rounded-xl h-14 shadow-md" disabled={phone.length !== 11}>
              ارسال کد تایید
            </Button>

            <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                    حساب کاربری ندارید؟ <Link href="/register" className="text-primary font-semibold hover:underline">ثبت‌نام کنید</Link>
                </p>
            </div>

            <p className="text-xs text-center text-muted-foreground leading-relaxed mt-4">
              ورود شما به معنای پذیرش <Link href="#" className="text-primary underline">شرایط و قوانین</Link> ویزیکا است.
            </p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2 text-right">
              <label className="text-sm font-semibold">کد تایید ۴ رقمی</label>
              <div className="flex gap-2 justify-center" dir="ltr">
                {/* Mock OTP Input - real one uses multiple inputs or specialized library */}
                <Input 
                  type="text" 
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="text-center text-2xl tracking-[1em] h-14 font-bold"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <button type="button" onClick={() => setStep(1)} className="text-primary flex items-center gap-1 hover:underline">
                <ArrowLeft className="w-4 h-4" /> ویرایش شماره
              </button>
              {canResend ? (
                <button type="button" onClick={handleSendOTP} disabled={loading} className="text-primary font-semibold hover:underline">
                  ارسال مجدد کد
                </button>
              ) : (
                <span className="text-muted-foreground">{formatTime(timeLeft)} تا ارسال مجدد</span>
              )}
            </div>

            <Button size="lg" type="submit" className="w-full text-base font-bold rounded-xl h-14 shadow-md">
              تایید و ورود
            </Button>
          </form>
        )}
        
      </div>
    </div>
  )
}
