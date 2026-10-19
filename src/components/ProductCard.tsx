"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Perfume } from "@/data/perfumes";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Eye, Star, Sparkles, Check, ShieldCheck } from "lucide-react";

interface ProductCardProps {
  perfume: Perfume;
  onOpenQuickView: (perfume: Perfume) => void;
}

export function ProductCard({ perfume, onOpenQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  const [addedEffect, setAddedEffect] = useState(false);

  const handleAddToCart = () => {
    addToCart(perfume, 1);
    setAddedEffect(true);
    setTimeout(() => setAddedEffect(false), 1800);
  };

  return (
    <div className="group relative flex flex-col bg-[#111116] border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300 hover:shadow-[0_10px_35px_rgba(0,0,0,0.85)]">
      {/* Visual Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-950">
        <Image
          src={perfume.image}
          alt={perfume.nameAr}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badge */}
        {perfume.badge && (
          <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-[#D4AF37] text-black font-bold text-[10px] tracking-wider uppercase shadow-md">
            {perfume.badge}
          </div>
        )}

        {/* Gender / Type Pill */}
        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full glass-luxury text-[#F3E5AB] text-[10px] font-medium tracking-wider">
          {perfume.genderAr} • {perfume.volumeMl}ml
        </div>

        {/* Quick View Floating Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => onOpenQuickView(perfume)}
            className="px-4 py-2.5 rounded-full glass-luxury border border-[#D4AF37]/60 text-white hover:text-[#F3E5AB] hover:border-[#D4AF37] text-xs font-semibold tracking-wider uppercase transition-all duration-200 transform translate-y-3 group-hover:translate-y-0 flex items-center gap-2 shadow-xl"
            aria-label={`نظرة سريعة على ${perfume.nameAr}`}
          >
            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>نظرة سريعة والهرم العطري</span>
          </button>
        </div>
      </div>

      {/* Content & Details */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#D4AF37] tracking-wider font-semibold text-xs">
              {perfume.concentration}
            </span>
            <div className="flex items-center gap-1 text-amber-300/90 text-xs">
              <Star className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
              <span className="font-semibold">{perfume.rating}</span>
              <span className="text-zinc-500 text-[10px]">({perfume.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif text-2xl text-white font-medium mb-1.5 group-hover:text-[#F3E5AB] transition-colors">
            {perfume.nameAr}
          </h3>

          {/* Subtitle / Tagline */}
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
            {perfume.taglineAr}
          </p>

          {/* Key Fragrance Notes Chips */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {perfume.topNotes.slice(0, 2).map((note, i) => (
              <span
                key={i}
                className="text-[11px] px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300"
              >
                {note}
              </span>
            ))}
            {perfume.baseNotes.slice(0, 1).map((note, i) => (
              <span
                key={`base-${i}`}
                className="text-[11px] px-2.5 py-0.5 rounded bg-zinc-900/60 border border-zinc-800/60 text-zinc-400"
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        <div>
          {/* Golden Guarantee notice */}
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/90 mb-4 bg-emerald-950/30 border border-emerald-900/40 px-2.5 py-1 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>تشمل عينة 2 مل مجانية للضمان الذهبي</span>
          </div>

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
            <div>
              {perfume.comparePrice && (
                <span className="text-[10px] text-zinc-500 line-through block">
                  {perfume.comparePrice} ج.م
                </span>
              )}
              <span className="text-xl font-bold text-[#F3E5AB] font-serif">
                {perfume.price.toLocaleString()} ج.م
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className={`min-h-[44px] px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 shadow-lg ${
                addedEffect
                  ? "bg-emerald-500 text-white"
                  : "bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:scale-[1.02]"
              }`}
              aria-label={`إضافة ${perfume.nameAr} إلى حقيبة التسوق`}
            >
              {addedEffect ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تمت الإضافة!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>أضف للسلة (COD)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
