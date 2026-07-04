"use client"

import React, { useState, useEffect } from "react"
import { MapPin, Plus, Trash2, Edit2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import api from "@/lib/api"

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newAddress, setNewAddress] = useState({ title: '', detail: '', postal_code: '', is_default: false })
  const [submitting, setSubmitting] = useState(false)

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/users/addresses/')
      setAddresses(res.data)
    } catch (err) {
      toast.error("خطا در دریافت آدرس‌ها")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/users/addresses/${id}/`)
      setAddresses(addresses.filter(a => a.id !== id))
      toast.success("آدرس با موفقیت حذف شد")
    } catch (err) {
      toast.error("خطا در حذف آدرس")
    }
  }

  const handleSetDefault = async (id: number) => {
    try {
      await api.post(`/users/addresses/${id}/set_default/`)
      setAddresses(addresses.map(a => ({
        ...a,
        is_default: a.id === id
      })))
      toast.success("آدرس پیش‌فرض تغییر کرد")
    } catch (err) {
      toast.error("خطا در تغییر آدرس پیش‌فرض")
    }
  }

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAddress.title || !newAddress.detail) {
      toast.error("لطفا عنوان و جزئیات آدرس را وارد کنید")
      return
    }
    setSubmitting(true)
    try {
      const res = await api.post('/users/addresses/', newAddress)
      setAddresses([res.data, ...addresses.map(a => newAddress.is_default ? { ...a, is_default: false } : a)])
      setShowModal(false)
      setNewAddress({ title: '', detail: '', postal_code: '', is_default: false })
      toast.success("آدرس جدید با موفقیت ثبت شد")
      fetchAddresses()
    } catch (err) {
      toast.error("خطا در ثبت آدرس جدید")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">آدرس‌های من</h1>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2 rounded-xl h-12 px-6">
          <Plus className="w-5 h-5" /> ثبت آدرس جدید
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-10">در حال بارگذاری...</div>
      ) : (
        <div className="grid gap-6">
          {addresses.map((address) => (
            <div key={address.id} className={`border-2 rounded-2xl p-6 transition-all ${address.is_default ? 'border-primary bg-primary/5 shadow-sm' : 'border-muted hover:border-primary/30'}`}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                
                <div className="flex gap-4">
                  <MapPin className={`w-6 h-6 mt-1 shrink-0 ${address.is_default ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">{address.title}</h3>
                      {address.is_default && (
                        <span className="text-[10px] font-bold bg-primary text-primary-foreground px-2 py-1 rounded-full">پیش‌فرض</span>
                      )}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{address.detail}</p>
                    {address.postal_code && (
                      <p className="text-sm text-muted-foreground mt-2">کد پستی: {address.postal_code}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 md:flex-col lg:flex-row md:w-32 lg:w-auto">
                  {!address.is_default && (
                    <Button variant="outline" size="sm" onClick={() => handleSetDefault(address.id)} className="w-full text-xs">انتخاب به عنوان پیش‌فرض</Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(address.id)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

              </div>
            </div>
          ))}
          
          {addresses.length === 0 && (
            <div className="text-center py-20 bg-secondary/30 rounded-2xl border-2 border-dashed">
              <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-muted-foreground mb-2">هیچ آدرسی ثبت نشده است</h2>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-lg rounded-3xl border shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">ثبت آدرس جدید</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowModal(false)} className="rounded-full hover:bg-secondary">
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
                <Button type="submit" disabled={submitting} className="w-full rounded-xl h-12 text-base font-bold">
                  {submitting ? 'در حال ثبت...' : 'ثبت آدرس'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
