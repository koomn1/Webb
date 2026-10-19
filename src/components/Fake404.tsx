"use client";

import React from "react";
import Link from "next/link";
import { appLink } from "@/lib/paths";
import { Compass, Home } from "lucide-react";

export function Fake404() {
  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#FAF8F5] flex flex-col items-center justify-center px-4 py-16 text-center relative overflow-hidden select-none">
      {/* Subtle background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C58652]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-[#161413] border border-[#24201D] flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Compass className="w-8 h-8 text-[#C58652] animate-pulse" strokeWidth={1.5} />
        </div>

        <div className="font-serif text-7xl sm:text-8xl font-light tracking-widest text-[#24201D] mb-2">
          404
        </div>

        <h1 className="font-serif text-xl sm:text-2xl font-medium text-white mb-3">
          عذراً، الصفحة غير متاحة
        </h1>

        <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-8 font-light max-w-sm mx-auto">
          يبدو أن الرابط الذي حاولت الوصول إليه غير صحيح، أو تم نقله، أو ليس لديك صلاحية لعرضه.
        </p>

        <Link
          href={appLink("/")}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#E4C7A8] via-[#D8B28C] to-[#C58652] text-[#0C0B0A] font-semibold text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <Home className="w-4 h-4" strokeWidth={1.5} />
          <span>العودة للواجهة الرئيسية</span>
        </Link>
      </div>
    </div>
  );
}
