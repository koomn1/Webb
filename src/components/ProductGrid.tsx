"use client";

import React, { useState } from "react";
import { PERFUMES, Perfume } from "@/data/perfumes";
import { ProductCard } from "./ProductCard";
import { Sparkles, SlidersHorizontal, RotateCcw } from "lucide-react";

export function ProductGrid({ onOpenQuickView }: { onOpenQuickView: (perfume: Perfume) => void }) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filters = [
    { id: "all", label: "كافة العطور والخيارات" },
    { id: "Homme", label: "عطور رجالية (Zeste)" },
    { id: "Femme", label: "عطور نسائية (Aura)" },
    { id: "Duo", label: "باقة الثنائي (وفر 150 ج.م)" },
  ];

  const filteredPerfumes =
    activeFilter === "all"
      ? PERFUMES
      : PERFUMES.filter((p) => p.gender === activeFilter);

  return (
    <section id="products" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>المجموعة الأساسية • SÈN PARFUMS</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal mb-4">
          عطور فاخرة تمنحك الثقة والجاذبية
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
          تم تركيب عطور SÈN بأجود الزيوت العطرية النقية لضمان ثبات وفوحان فائق يدوم طوال اليوم. مع عينة تجريبية 2 مل مجانية مع كل زجاجة للضمان الذهبي، والدفع عند الاستلام بعد المعاينة.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 text-xs sm:text-sm">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActiveFilter(filter.id)}
            className={`min-h-[44px] px-5 py-2.5 rounded-full font-medium transition-all duration-200 shrink-0 ${
              activeFilter === filter.id
                ? "bg-[#D4AF37] text-black font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                : "glass-luxury text-zinc-400 hover:text-white hover:border-zinc-700"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Grid of Perfumes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPerfumes.map((perfume) => (
          <ProductCard
            key={perfume.id}
            perfume={perfume}
            onOpenQuickView={onOpenQuickView}
          />
        ))}
      </div>
    </section>
  );
}
