import React from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://visika-back.vercel.app'}/products/categories/`, { cache: "no-store" })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : (data.results || [])
  } catch (error) {
    return []
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories()
  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">دسته‌بندی‌های ویزیکا</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category: any) => (
          <Link 
            key={category.id} 
            href={`/categories/${category.slug}`}
            className="group flex items-center justify-between p-6 bg-secondary/30 hover:bg-secondary rounded-2xl border transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-sm ${category.color}`}>
                {category.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{category.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">نمایش همه محصولات</p>
              </div>
            </div>
            <ChevronLeft className="text-muted-foreground w-6 h-6 group-hover:text-primary transition-colors group-hover:-translate-x-1" />
          </Link>
        ))}
      </div>
    </div>
  )
}
