import React from "react"
import Image from "next/image"
import { ShoppingBag } from "lucide-react"

export default function Loading() {
  return (
    <>
      <div className="min-h-[100vh]" />
      <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-background/90 backdrop-blur-md animate-in fade-in duration-300">
        <div className="relative flex flex-col items-center">
        {/* Animated Rings */}
        <div className="absolute inset-0 -m-8 border-[3px] border-primary/20 rounded-full animate-[spin_3s_linear_infinite]" />
        <div className="absolute inset-0 -m-4 border-[3px] border-t-primary border-r-primary border-b-transparent border-l-transparent rounded-full animate-[spin_1.5s_linear_infinite]" />
        
        {/* Logo Container */}
        <div className="relative w-48 h-48 bg-background rounded-3xl flex items-center justify-center shadow-xl shadow-primary/30 z-10 animate-bounce overflow-hidden">
          <Image src="/logo.png" alt="در حال بارگذاری..." fill className="object-contain p-1" sizes="192px" priority />
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="mt-12 flex flex-col items-center gap-2">
        <h3 className="text-2xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
          ویزیکا
        </h3>
        <p className="text-sm font-bold text-muted-foreground animate-pulse">
          در حال بارگذاری اطلاعات...
        </p>
      </div>
    </div>
    </>
  )
}
