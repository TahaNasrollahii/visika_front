"use client"
import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import api from "@/lib/api"
import { Package, Plus, X, Upload, Check, Edit, Trash2, Tag } from "lucide-react"
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
  const [editingProductId, setEditingProductId] = useState<number | null>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    discount_price: "",
    description: "",
    stock: "0",
    category: ""
  })
  const [features, setFeatures] = useState([{ title: "", value: "" }])
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

  const handleOpenAddModal = () => {
    setEditingProductId(null)
    setFormData({
      title: "", price: "", discount_price: "", description: "", stock: "0", category: ""
    })
    setFeatures([{ title: "", value: "" }])
    setImage(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (product: any) => {
    setEditingProductId(product.id)
    setFormData({
      title: product.title || "",
      price: product.price ? String(product.price) : "",
      discount_price: product.discount_price ? String(product.discount_price) : "",
      description: product.description || "",
      stock: product.stock ? String(product.stock) : "0",
      category: product.category || ""
    })
    
    if (product.features && product.features.length > 0) {
      setFeatures(product.features.map((f: any) => ({ title: f.title, value: f.value })))
    } else {
      setFeatures([{ title: "", value: "" }])
    }
    setImage(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("آیا از حذف این محصول اطمینان دارید؟")) {
      try {
        await api.delete(`/vendor/products/${id}/`)
        toast.success("محصول با موفقیت حذف شد")
        fetchProducts()
      } catch (err) {
        toast.error("خطا در حذف محصول")
      }
    }
  }

  const handleFeatureChange = (index: number, field: 'title' | 'value', value: string) => {
    const newFeatures = [...features]
    newFeatures[index][field] = value
    setFeatures(newFeatures)
  }

  const addFeature = () => {
    setFeatures([...features, { title: "", value: "" }])
  }

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index)
    setFeatures(newFeatures)
  }

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
    
    // Add features
    const validFeatures = features.filter(f => f.title.trim() !== "" && f.value.trim() !== "")
    if (validFeatures.length > 0) {
      data.append("features_data", JSON.stringify(validFeatures))
    } else {
        data.append("features_data", "[]") // Explicitly send empty to clear on edit
    }

    try {
      if (editingProductId) {
        await api.patch(`/vendor/products/${editingProductId}/`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        toast.success("محصول با موفقیت ویرایش شد")
      } else {
        await api.post("/vendor/products/", data, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        toast.success("محصول جدید با موفقیت اضافه شد")
      }
      setIsModalOpen(false)
      fetchProducts()
    } catch (err) {
      toast.error(editingProductId ? "خطا در ویرایش محصول" : "خطا در ایجاد محصول")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md rounded-3xl p-8 shadow-sm min-h-[500px] relative">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black flex items-center gap-2">
          <Package className="w-6 h-6 text-primary" />
          مدیریت محصولات
        </h2>
        <Button onClick={handleOpenAddModal} className="gap-2 rounded-xl h-10 px-4 font-bold shadow-md hover:shadow-lg transition-shadow">
          <Plus className="w-4 h-4" />
          افزودن محصول جدید
        </Button>
      </div>

      {loading ? (
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-secondary/50 rounded-3xl" />
          <div className="h-64 bg-secondary/50 rounded-3xl" />
          <div className="h-64 bg-secondary/50 rounded-3xl" />
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
            <div key={p.id} className="group bg-white dark:bg-zinc-900 border border-border/50 hover:border-primary/30 p-4 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col gap-4 relative overflow-hidden">
              
              {/* Hover Actions */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onClick={() => handleOpenEditModal(p)} className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur shadow-sm p-2 rounded-full text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(p.id)} className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur shadow-sm p-2 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {p.image_url ? (
                <div className="w-full h-48 rounded-2xl overflow-hidden bg-secondary/10 relative">
                  <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {p.discount_price && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                      تخفیف
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-48 bg-secondary/10 rounded-2xl flex items-center justify-center">
                  <Package className="w-12 h-12 opacity-10" />
                </div>
              )}
              
              <div className="flex-1 flex flex-col">
                <h3 className="font-bold text-lg line-clamp-1 mb-1">{p.title}</h3>
                
                <div className="flex items-center gap-1 text-muted-foreground text-xs mb-3">
                    <Tag className="w-3 h-3" />
                    <span>{categories.find(c => c.id === p.category)?.title || "بدون دسته بندی"}</span>
                </div>

                <div className="mt-auto flex flex-col gap-1">
                    {p.discount_price ? (
                        <>
                            <span className="text-muted-foreground line-through text-xs">{p.price.toLocaleString("fa-IR")} تومان</span>
                            <span className="text-primary font-black text-lg">{p.discount_price.toLocaleString("fa-IR")} تومان</span>
                        </>
                    ) : (
                        <span className="text-primary font-black text-lg">{p.price.toLocaleString("fa-IR")} تومان</span>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for adding/editing product */}
      {isModalOpen && typeof document !== 'undefined' ? createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 w-full max-w-3xl rounded-3xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/20">
                <h3 className="text-xl font-bold">{editingProductId ? "ویرایش محصول" : "افزودن محصول جدید"}</h3>
                <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                >
                <X className="w-5 h-5 text-muted-foreground" />
                </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6">
                <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                {/* Features Section */}
                <div className="bg-secondary/10 p-5 rounded-2xl border border-border/50">
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-bold">ویژگی‌های برجسته</label>
                        <Button type="button" variant="outline" size="sm" onClick={addFeature} className="h-8 rounded-lg text-xs gap-1">
                            <Plus className="w-3 h-3" />
                            افزودن ویژگی
                        </Button>
                    </div>
                    
                    <div className="space-y-3">
                        {features.map((feature, index) => (
                            <div key={index} className="flex gap-3 items-center">
                                <Input 
                                    placeholder="عنوان (مثال: وزن)" 
                                    className="flex-1"
                                    value={feature.title}
                                    onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                                />
                                <Input 
                                    placeholder="مقدار (مثال: ۱ کیلوگرم)" 
                                    className="flex-1"
                                    value={feature.value}
                                    onChange={(e) => handleFeatureChange(index, 'value', e.target.value)}
                                />
                                <button type="button" onClick={() => removeFeature(index)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {features.length === 0 && (
                            <p className="text-xs text-muted-foreground text-center py-2">هیچ ویژگی ثبت نشده است.</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">توضیحات تکمیلی</label>
                    <Textarea 
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})} 
                        placeholder="توضیحات خود را اینجا بنویسید..."
                        rows={3}
                        className="resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">تصویر محصول</label>
                    <div className="border-2 border-dashed border-primary/20 bg-primary/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-primary/10 transition-colors cursor-pointer relative overflow-hidden group">
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={e => e.target.files && setImage(e.target.files[0])}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        {image ? (
                            <div className="flex flex-col items-center text-primary gap-2 z-0">
                                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg">
                                    <Check className="w-6 h-6" />
                                </div>
                                <span className="font-bold text-sm mt-2 line-clamp-1 px-4">{image.name}</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-primary/60 gap-3 z-0 group-hover:text-primary transition-colors">
                                <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-sm">
                                    <Upload className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-sm">برای انتخاب تصویر کلیک کنید</p>
                                    <p className="text-xs opacity-70">PNG, JPG حداکثر ۵ مگابایت</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border bg-secondary/10 flex justify-end gap-3 mt-auto">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>انصراف</Button>
                <Button type="submit" form="productForm" disabled={submitting} className="font-bold shadow-md rounded-xl px-8">
                  {submitting ? "در حال ثبت..." : (editingProductId ? "ذخیره تغییرات" : "ثبت محصول")}
                </Button>
            </div>
            
          </div>
        </div>
      , document.body) : null}
    </div>
  )
}
