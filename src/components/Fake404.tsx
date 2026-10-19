"use client";

import React from "react";
import Link from "next/link";
import { appLink } from "@/lib/paths";
import { Compass, Home } from "lucide-react";

export function Fake404() {
  return (
    <div className="min-h-screen bg-[#08080A] text-[#FCFBFA] flex flex-col items-center justify-center px-4 py-16 text-center relative overflow-hidden select-none">
      {/* Subtle background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Compass className="w-8 h-8 text-[#D4AF37]/80 animate-pulse" />
        </div>

        <div className="font-serif text-7xl sm:text-8xl font-black tracking-widest text-zinc-700/60 mb-2">
          404
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">
          عذراً، الصفحة غير موجودة
        </h1>

        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-8 font-light max-w-sm mx-auto">
          يبدو أن الرابط الذي حاولت الوصول إليه غير صحيح، أو تم حذفه، أو لم يعد متاحاً في المتجر.
        </p>

        <Link
          href={appLink("/")}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>العودة للصفحة الرئيسية</span>
        </Link>
      </div>
    </div>
  );
}
