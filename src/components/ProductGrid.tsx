"use client";

import React, { useState } from "react";
import { PERFUMES, Perfume } from "@/data/perfumes";
import { ProductCard } from "./ProductCard";
import { Sparkles } from "lucide-react";

export function ProductGrid({ onOpenQuickView }: { onOpenQuickView: (perfume: Perfume) => void }) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filters = [
    { id: "all", label: "جميع الإبداعات" },
    { id: "Homme", label: "عطور رجالية (Zeste)" },
    { id: "Femme", label: "عطور نسائية (Aura)" },
    { id: "Duo", label: "باقة الثنائي الملكية (وفر 150 ج.م)" },
  ];

  const filteredPerfumes =
    activeFilter === "all"
      ? PERFUMES
      : PERFUMES.filter((p) => p.gender === activeFilter);

  return (
    <section id="products" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C1A18] border border-[#E4C7A8]/30 text-[#E4C7A8] text-xs font-semibold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#E4C7A8]" strokeWidth={1.5} />
          <span>التشكيلة الأيقونية • ÉDITION LIMITÉE</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal mb-4">
          توليفاتٌ عطرية <span className="champagne-gradient-text italic font-serif">تحكي قصة تميزك</span>
        </h2>
        <p className="text-sm sm:text-base text-[#ABA59C] font-light leading-relaxed">
          صيغت بتركيز 20% Extrait de Parfum من أندر الزيوت الفرنسية النقية لضمان ثبات ملكي يتجاوز 14 ساعة وفوحان ساحر. استلم شحنتك، جرّب العينة المرفقة أولاً في منزلك، وادفع عند الاستلام.
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
                ? "bg-gradient-to-r from-[#E4C7A8] via-[#F5E4D2] to-[#C58652] text-[#0C0B0A] font-bold shadow-[0_0_25px_rgba(228,199,168,0.3)]"
                : "glass-luxury text-[#ABA59C] hover:text-white border-[#2B2724]"
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
