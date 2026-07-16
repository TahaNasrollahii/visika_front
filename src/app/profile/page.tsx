"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { useRouter } from "next/navigation"

export default function ProfileInfoPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    email: ""
  })
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    api.get('/users/info')
      .then(res => {
        setPhone(res.data.phone_number)
        setFormData({
          firstName: res.data.first_name || "",
          lastName: res.data.last_name || "",
          nationalId: res.data.national_id || "",
          email: res.data.email || ""
        })
        setLoading(false)
      })
      .catch(() => {
        toast.error('لطفا وارد شوید')
        router.push('/login')
      })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.patch('/users/info', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        national_id: formData.nationalId,
        email: formData.email
      })
      toast.success("اطلاعات کاربری با موفقیت بروزرسانی شد")
      window.dispatchEvent(new Event("user-updated"))
    } catch (err) {
      toast.error("خطا در بروزرسانی اطلاعات")
    }
  }

  if (loading) return <div>در حال بارگذاری...</div>

  return (
    <div>
      <div className="flex items-center gap-3 mb-8 pb-4 border-b">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">اطلاعات حساب کاربری</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">نام</label>
            <Input 
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">نام خانوادگی</label>
            <Input 
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">کد ملی</label>
            <Input 
              value={formData.nationalId}
              onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
              dir="ltr"
              className="text-left"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">شماره موبایل</label>
            <Input 
              value={phone}
              disabled
              dir="ltr"
              className="text-left bg-secondary/50 cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">ایمیل (اختیاری)</label>
            <Input 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              dir="ltr"
              className="text-left"
            />
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <Button type="submit" size="lg" className="px-8 rounded-xl">
            ثبت و ذخیره تغییرات
          </Button>
        </div>
      </form>
    </div>
  )
}
