"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/shared/ProductCard";

export function HotOffers({ hotOffers }: { hotOffers: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Drag scrolling logic
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let accumulated = 0;
    const autoScroll = () => {
      if (scrollRef.current && !isHovered && !isDragging) {
        accumulated += 0.5; 
        if (Math.abs(accumulated) >= 1) {
           // Use scrollBy for more reliable cross-browser scrolling behavior
           scrollRef.current.scrollBy({ left: -1 }); 
           accumulated = 0;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };
    
    animationFrameId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current!.offsetLeft);
    setScrollLeft(scrollRef.current!.scrollLeft);
  };
  const handleMouseLeave = () => {
    setIsDragging(false);
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current!.scrollLeft = scrollLeft - walk;
  };

  const scrollPrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  return (
    <section className="container mx-auto px-4 lg:px-8">
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-gradient-to-br from-primary to-primary/80 rounded-[2rem] p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row items-center lg:items-stretch gap-6 lg:gap-8 overflow-hidden relative shadow-2xl shadow-primary/20 border border-primary/10"
      >
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

        {/* Intro Block (Right Side in RTL) */}
        <div className="w-full lg:w-48 shrink-0 flex flex-col items-center justify-center text-white text-center space-y-4 lg:space-y-6 py-2 relative z-10">
          <div className="space-y-2">
            <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold tracking-wider shadow-sm">
              پیشنهاد ویژه
            </span>
            <h2 className="text-3xl md:text-4xl font-black leading-tight drop-shadow-md">
              شگفت‌انگیز
            </h2>
            <p className="text-white/90 font-medium text-sm md:text-base">
              تخفیف‌های بی‌نظیر امروز
            </p>
          </div>
          
          {/* Animated percentage badge */}
          <div className="relative group cursor-pointer my-2 lg:my-4">
            <div className="absolute inset-0 bg-white/30 blur-xl rounded-full scale-110 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-yellow-400 to-yellow-200 rounded-full flex items-center justify-center shadow-xl border-4 border-white/40 transform group-hover:-translate-y-2 group-hover:rotate-12 transition-all duration-300">
              <span className="text-3xl md:text-4xl font-black text-primary drop-shadow-sm">%</span>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden lg:flex items-center gap-2">
            <button 
              onClick={scrollPrev}
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300 shadow-lg hover:-translate-y-1"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={scrollNext}
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300 shadow-lg hover:-translate-y-1"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <Link href="/offers" className="hidden lg:flex items-center gap-2 text-white hover:text-yellow-200 font-bold text-lg group transition-colors mt-2">
            مشاهده همه
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1.5 transition-transform" />
          </Link>
        </div>

        {/* Cards Carousel */}
        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex-1 w-full overflow-x-auto flex gap-3 md:gap-4 pb-4 pt-2 lg:py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} items-stretch relative z-10 px-2`}
        >
          {hotOffers.map((product) => (
            <div key={product.id} className="w-[160px] md:w-[190px] shrink-0 group/card pointer-events-none">
              <div className="h-full transform group-hover/card:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-white/10 pointer-events-auto">
                <div className="bg-white rounded-3xl p-1 shadow-xl h-full relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 h-full">
                    <ProductCard product={product} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* View All Card */}
          <div className="w-[140px] md:w-[170px] shrink-0 flex items-stretch py-1 pointer-events-none">
            <Link href="/offers" className="pointer-events-auto flex flex-col items-center justify-center w-full h-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-300 rounded-3xl border border-white/20 hover:border-white/40 text-white gap-4 group shadow-lg min-h-[220px]">
              <div className="w-16 h-16 rounded-full bg-white text-primary flex items-center justify-center group-hover:scale-110 group-hover:-translate-x-2 transition-all duration-300 shadow-xl">
                <ChevronLeft className="w-8 h-8" />
              </div>
              <div className="space-y-1 text-center">
                <span className="font-bold text-xl block">مشاهده همه</span>
                <span className="text-sm text-white/70">تخفیف‌ها و پیشنهادها</span>
              </div>
            </Link>
          </div>
        </div>
        
      </div>
    </section>
  );
}
