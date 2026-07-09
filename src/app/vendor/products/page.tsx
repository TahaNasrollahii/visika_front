"use client"
import React, { useEffect, useState } from "react"
import api from "@/lib/api"
import { Package, Plus, X, Upload, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useCategories } from "@/hooks/useCategories"
import { Textarea } from "@/components/ui/textarea"

export default function VendorProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { categories } = useCategories()
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    discount_price: "",
    description: "",
    stock: "0",
    category: ""
  })
  const [image, setImage] = useState<File | null>(null)

  const fetchProducts = () => {
    setLoading(true)
    api.get("/vendor/products/")
      .then(res => {
        setProducts(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.price) {
      toast.error("لطفا عنوان و قیمت محصول را وارد کنید")
      return
    }

    setSubmitting(true)
    const data = new FormData()
    data.append("title", formData.title)
    data.append("price", formData.price)
    if (formData.description) data.append("description", formData.description)
    if (formData.discount_price) data.append("discount_price", formData.discount_price)
    if (formData.stock) data.append("stock", formData.stock)
    if (formData.category) data.append("category", formData.category)
    if (image) data.append("image", image)

    try {
      await api.post("/vendor/products/", data, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      toast.success("محصول جدید با موفقیت اضافه شد")
      setIsModalOpen(false)
      // Reset form
      setFormData({
        title: "", price: "", discount_price: "", description: "", stock: "0", category: ""
      })
      setImage(null)
      fetchProducts()
    } catch (err) {
      toast.error("خطا در ایجاد محصول")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-950 rounded-3xl p-6 border border-border shadow-sm min-h-[500px] relative">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black flex items-center gap-2">
          <Package className="w-6 h-6 text-primary" />
          مدیریت محصولات
        </h2>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 rounded-xl h-10 px-4 font-bold">
          <Plus className="w-4 h-4" />
          افزودن محصول جدید
        </Button>
      </div>

      {loading ? (
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-16 bg-secondary/50 rounded-xl" />
          <div className="h-16 bg-secondary/50 rounded-xl" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Package className="w-16 h-16 opacity-20 mb-4" />
          <p className="font-bold text-lg">محصولی برای نمایش وجود ندارد</p>
          <p className="text-sm mt-1">شما هنوز هیچ محصولی اضافه نکرده‌اید.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p: any) => (
            <div key={p.id} className="border border-border p-4 rounded-2xl shadow-sm flex flex-col gap-3">
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} className="w-full h-40 object-contain rounded-xl bg-secondary/20" />
              ) : (
                <div className="w-full h-40 bg-secondary/20 rounded-xl flex items-center justify-center">
                  <Package className="w-10 h-10 opacity-20" />
                </div>
              )}
              <h3 className="font-bold line-clamp-1">{p.title}</h3>
              <p className="text-primary font-black text-left">{p.price.toLocaleString("fa-IR")} تومان</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal for adding product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-950 w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-6 left-6 p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
            <h3 className="text-xl font-bold mb-6">افزودن محصول جدید</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">عنوان محصول *</label>
                  <Input 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    placeholder="مثال: شیر پرچرب کاله"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">دسته‌بندی</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">انتخاب کنید...</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">قیمت (تومان) *</label>
                  <Input 
                    type="number"
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})} 
                    placeholder="مثال: 50000"
                    required
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">قیمت با تخفیف (تومان)</label>
                  <Input 
                    type="number"
                    value={formData.discount_price} 
                    onChange={e => setFormData({...formData, discount_price: e.target.value})} 
                    placeholder="اختیاری"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">موجودی انبار</label>
                  <Input 
                    type="number"
                    value={formData.stock} 
                    onChange={e => setFormData({...formData, stock: e.target.value})} 
                    placeholder="مثال: 100"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">توضیحات محصول</label>
                <Textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="توضیحات تکمیلی محصول..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">تصویر محصول</label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-secondary/20 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => e.target.files && setImage(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {image ? (
                    <div className="flex flex-col items-center text-primary gap-2">
                      <Check className="w-8 h-8" />
                      <span className="font-bold text-sm">{image.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground gap-2">
                      <Upload className="w-8 h-8 opacity-50" />
                      <span className="font-medium text-sm">برای آپلود تصویر کلیک کنید</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>انصراف</Button>
                <Button type="submit" disabled={submitting} className="font-bold">
                  {submitting ? "در حال ثبت..." : "ثبت محصول"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
