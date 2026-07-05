"use client"

import React, { useState, useEffect } from "react"
import { Filter, ChevronDown, ChevronUp, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"

// --- Helper Components for the Sidebar ---

function Accordion({ title, isOpen, onToggle, children }: { title: string, isOpen: boolean, onToggle: () => void, children: React.ReactNode }) {
  return (
    <div className="border border-border/50 rounded-2xl overflow-hidden bg-background transition-shadow hover:shadow-sm">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-background text-right focus:outline-none"
      >
        <span className="font-bold text-foreground text-sm">{title}</span>
        <div className="w-6 h-6 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-border/50 bg-background/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CustomCheckbox({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group py-2" onClick={(e) => { e.preventDefault(); onChange(); }}>
      <span className={`text-sm transition-colors ${checked ? 'font-bold text-foreground' : 'font-medium text-muted-foreground group-hover:text-foreground'}`}>
        {label}
      </span>
      <div className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-all ${
        checked 
          ? 'bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/30' 
          : 'border-muted-foreground/30 bg-background group-hover:border-primary/50'
      }`}>
        {checked && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
      </div>
    </label>
  )
}

function CustomToggle({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group py-3 px-4 rounded-2xl border border-border/50 bg-background hover:border-primary/30 transition-all hover:shadow-sm" onClick={(e) => { e.preventDefault(); onChange(); }}>
      <span className="text-sm font-bold text-foreground">{label}</span>
      <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${checked ? 'bg-primary shadow-inner shadow-black/10' : 'bg-secondary'}`}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${checked ? 'left-1' : 'left-6'}`} />
      </div>
    </label>
  )
}

// --- Main Sidebar Component ---

export function FiltersSidebar({ brands = [], categories = [], activeCategorySlug = "" }: { brands: string[], categories: any[], activeCategorySlug: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [openSections, setOpenSections] = useState({
    category: true,
    seller: true,
    price: true,
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // URL State
  const activeBrands = searchParams.get('brands') ? searchParams.get('brands')!.split(',') : []
  const onlyDiscounted = searchParams.get('has_discount') === 'true'
  const onlyInStock = searchParams.get('in_stock') === 'true'
  const minPrice = searchParams.get('min_price') || '0'
  const maxPrice = searchParams.get('max_price') || '10000000'

  // Local state for inputs
  const [localMinPrice, setLocalMinPrice] = useState(minPrice)
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice)

  useEffect(() => {
    setLocalMinPrice(minPrice)
    setLocalMaxPrice(maxPrice)
  }, [minPrice, maxPrice])

  const updateQueryParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    params.delete('page') // Reset page on filter change
    router.push(`${pathname}?${params.toString()}`)
  }

  const toggleBrand = (brand: string) => {
    const newBrands = activeBrands.includes(brand)
      ? activeBrands.filter(b => b !== brand)
      : [...activeBrands, brand]
    
    updateQueryParams('brands', newBrands.length > 0 ? newBrands.join(',') : null)
  }

  const handlePriceApply = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('min_price', localMinPrice.replace(/\D/g, ''))
    params.set('max_price', localMaxPrice.replace(/\D/g, ''))
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearAllFilters = () => {
    router.push(pathname)
  }

  return (
    <aside className="w-full lg:w-[300px] shrink-0 space-y-5 sticky top-28 z-10 hidden lg:block">
      
      {/* Header */}
      <div className="flex items-center justify-between px-2 mb-2">
        <h3 className="font-extrabold text-xl flex items-center gap-2 text-foreground tracking-tight">
          <Filter className="w-5 h-5 text-primary" strokeWidth={2.5} />
          فیلترها
        </h3>
        <Button onClick={clearAllFilters} variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 h-8 font-bold text-xs rounded-xl">
          حذف همه
        </Button>
      </div>

      <div className="space-y-4">
        
        {/* Category Accordion */}
        <Accordion title="دسته‌بندی‌ها" isOpen={openSections.category} onToggle={() => toggleSection('category')}>
          <div className="flex flex-col gap-1 pt-2">
            {categories.map((cat, idx) => (
              <React.Fragment key={cat.slug}>
                <Link 
                  href={`/categories/${cat.slug}`}
                  className={`text-right py-2.5 text-sm transition-all flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:ml-2 ${
                    activeCategorySlug === cat.slug 
                      ? "font-extrabold text-primary before:bg-primary" 
                      : "font-medium text-muted-foreground hover:text-foreground before:bg-transparent"
                  }`}
                >
                  {cat.title}
                </Link>
                {idx !== categories.length - 1 && <div className="h-px bg-border/40 ml-4"></div>}
              </React.Fragment>
            ))}
          </div>
        </Accordion>

        {/* Seller Accordion */}
        {brands.length > 0 && (
          <Accordion title="برند" isOpen={openSections.seller} onToggle={() => toggleSection('seller')}>
            <div className="flex flex-col pt-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {brands.map((brand, idx) => (
                <React.Fragment key={brand}>
                  <CustomCheckbox 
                    label={brand} 
                    checked={activeBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)} 
                  />
                  {idx !== brands.length - 1 && <div className="h-px bg-border/40 my-0.5"></div>}
                </React.Fragment>
              ))}
            </div>
          </Accordion>
        )}

        {/* Price Range Accordion */}
        <Accordion title="محدوده قیمت" isOpen={openSections.price} onToggle={() => toggleSection('price')}>
          <div className="pt-4 flex flex-col gap-6">
            
            {/* Input fields */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">از</span>
                <input 
                  type="text" 
                  value={Number(localMinPrice || 0).toLocaleString('fa-IR')}
                  onChange={(e) => setLocalMinPrice(e.target.value.replace(/\D/g, ''))}
                  onBlur={handlePriceApply}
                  onKeyDown={(e) => e.key === 'Enter' && handlePriceApply()}
                  className="w-full bg-secondary/50 border-none rounded-xl h-10 pr-8 pl-12 text-sm font-bold text-center focus:ring-1 focus:ring-primary outline-none" 
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium">تومان</span>
              </div>
              <div className="flex-1 relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">تا</span>
                <input 
                  type="text" 
                  value={Number(localMaxPrice || 0).toLocaleString('fa-IR')}
                  onChange={(e) => setLocalMaxPrice(e.target.value.replace(/\D/g, ''))}
                  onBlur={handlePriceApply}
                  onKeyDown={(e) => e.key === 'Enter' && handlePriceApply()}
                  className="w-full bg-secondary/50 border-none rounded-xl h-10 pr-8 pl-12 text-sm font-bold text-center focus:ring-1 focus:ring-primary outline-none" 
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium">تومان</span>
              </div>
            </div>

          </div>
        </Accordion>

        {/* Independent Toggles */}
        <div className="pt-2 space-y-3">
          <CustomToggle 
            label="فقط تخفیف دارها" 
            checked={onlyDiscounted} 
            onChange={() => updateQueryParams('has_discount', onlyDiscounted ? null : 'true')} 
          />
          <CustomToggle 
            label="فقط کالاهای موجود" 
            checked={onlyInStock} 
            onChange={() => updateQueryParams('in_stock', onlyInStock ? null : 'true')} 
          />
        </div>

      </div>

    </aside>
  )
}
