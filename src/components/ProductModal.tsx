"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Perfume } from "@/data/perfumes";
import { useCart } from "@/context/CartContext";
import { X, Star, ShoppingBag, Check, ShieldCheck, Gift, Sparkles, Phone } from "lucide-react";

interface ProductModalProps {
  perfume: Perfume | null;
  onClose: () => void;
}

export function ProductModal({ perfume, onClose }: ProductModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!perfume) return null;

  const totalPrice = perfume.price * quantity;

  const handleAdd = () => {
    addToCart(perfume, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-4xl bg-[#111116] border border-[#D4AF37]/50 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] max-h-[94vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#D4AF37] transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Visual Column */}
        <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto min-h-[300px] md:min-h-full bg-zinc-950 flex items-center justify-center p-6 border-b md:border-b-0 md:border-l border-zinc-800">
          <Image
            src={perfume.image}
            alt={perfume.nameAr}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {perfume.badge && (
            <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#D4AF37] text-black font-bold text-[10px] tracking-wider uppercase shadow-lg">
              {perfume.badge}
            </span>
          )}

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-zinc-300 glass-luxury px-4 py-2 rounded-xl">
            <span>{perfume.concentration} (20% زيوت نادرة)</span>
            <span className="text-[#D4AF37] font-semibold">{perfume.volumeMl}ml</span>
          </div>
        </div>

        {/* Details & Sensory Profile Column */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto max-h-[60vh] md:max-h-[94vh]">
          {/* Header */}
          <div className="flex items-center gap-1.5 text-xs text-amber-300/90 mb-1">
            <Star className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
            <span className="font-bold">{perfume.rating}</span>
            <span className="text-zinc-500">({perfume.reviewsCount} تقييم موثق)</span>
          </div>

          <h2 className="font-serif text-3xl text-white font-medium mb-1">
            {perfume.nameAr}
          </h2>
          <p className="text-xs text-[#D4AF37] font-medium tracking-wide mb-4">
            {perfume.taglineAr}
          </p>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6 font-light">
            {perfume.descriptionAr}
          </p>

          {/* Olfactory Pyramid */}
          <div className="mb-6 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>الهرم العطري والمكونات النقية</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-zinc-500 font-medium block mb-0.5">القمة العطرية (Top Notes):</span>
                <span className="text-zinc-200">{perfume.topNotes.join(" • ")}</span>
              </div>
              <div>
                <span className="text-zinc-500 font-medium block mb-0.5">قلب العطر (Heart Notes):</span>
                <span className="text-zinc-200">{perfume.heartNotes.join(" • ")}</span>
              </div>
              <div>
                <span className="text-zinc-500 font-medium block mb-0.5">القاعدة والثبات (Base Notes):</span>
                <span className="text-zinc-200">{perfume.baseNotes.join(" • ")}</span>
              </div>
            </div>
          </div>

          {/* Sillage & Longevity */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/60 text-xs">
            <div>
              <span className="text-zinc-500 block mb-0.5">الفوحان والانتشار:</span>
              <span className="text-zinc-200 font-medium">{perfume.sillage}</span>
            </div>
            <div>
              <span className="text-zinc-500 block mb-0.5">ثبات العطر:</span>
              <span className="text-zinc-200 font-medium">{perfume.longevity}</span>
            </div>
          </div>

          {/* Golden Guarantee notice */}
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs mb-6">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>الضمان الذهبي 100% مرفق مع الزجاجة:</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-normal">
              ستحصل على عينة 2 مل مجانية لتجربتها أولاً. في حال لم ينل العطر إعجابك، يمكنك استرجاع الزجاجة الـ 50 مل المغلقة واسترداد كامل أموالك فوراً.
            </p>
          </div>

          {/* Quantity and Price */}
          <div className="flex items-center justify-between gap-4 mb-6">
            {/* Quantity Counter */}
            <div className="flex items-center border border-zinc-800 rounded-xl bg-zinc-900/60 px-3 py-1.5">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white font-bold"
                aria-label="تقليل الكمية"
              >
                -
              </button>
              <span className="w-8 text-center text-sm font-semibold text-white">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white font-bold"
                aria-label="زيادة الكمية"
              >
                +
              </button>
            </div>

            {/* Total Price */}
            <div className="text-start">
              <span className="text-[10px] text-zinc-500 uppercase block">الإجمالي (الدفع عند الاستلام):</span>
              <span className="font-serif text-2xl font-bold text-[#F3E5AB]">
                {totalPrice.toLocaleString()} ج.م
              </span>
            </div>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleAdd}
            className={`w-full min-h-[48px] py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg mb-4 ${
              added
                ? "bg-emerald-500 text-white"
                : "bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-[1.01]"
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>تمت الإضافة لحقيبة التسوق بنجاح!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>إضافة إلى حقيبة الطلب (الدفع عند الاستلام)</span>
              </>
            )}
          </button>

          {/* Contact Support */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 pt-3 border-t border-zinc-800">
            <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>طلب مساعدة هاتفية: </span>
            <a href="tel:01018995002" className="text-[#F3E5AB] font-mono font-bold hover:underline">
              01018995002
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
