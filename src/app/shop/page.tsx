"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ProductGrid } from "@/components/ProductGrid";
import { DuoBundleSection } from "@/components/DuoBundleSection";
import { FragranceFinder } from "@/components/FragranceFinder";
import { ProductModal } from "@/components/ProductModal";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { Footer } from "@/components/Footer";
import { PERFUMES, Perfume } from "@/data/perfumes";
import { Sparkles, ShieldCheck, Truck, Compass, ArrowLeft } from "lucide-react";
import { appLink } from "@/lib/paths";

export default function ShopPage() {
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#08080A] text-[#FCFBFA] selection:bg-[#D4AF37]/20 selection:text-[#F3E5AB]">
      {/* Navigation */}
      <Navbar onOpenFinder={() => setIsFinderOpen(true)} />

      {/* Shop Header Banner */}
      <div className="pt-32 pb-14 bg-gradient-to-b from-[#101015] to-[#08080A] border-b border-zinc-900 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>التشكيلة الملكية الحصرية 2026</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            عطور دار <span className="text-gradient-gold">SÈN Parfums</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-400 text-sm sm:text-base leading-relaxed">
            عطور Extrait de Parfum نقية بتركيز 20% زيوت فرنسية أصلية. كل زجاجة تتضمن عينة تجريبية مجانية 2 مل مع الضمان الذهبي والدفع عند الاستلام.
          </p>

          {/* Quick Filter Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsFinderOpen(true)}
              className="px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-[#D4AF37]/30 text-xs text-[#F3E5AB] font-semibold flex items-center gap-2 transition-all hover:scale-105"
            >
              <Compass className="w-4 h-4 text-[#D4AF37]" />
              <span>مرشد الهرم العطري التفاعلي</span>
            </button>
            <Link
              href={appLink("/guarantee")}
              className="px-5 py-2.5 rounded-full bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 font-medium flex items-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>تفاصيل الضمان الذهبي</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Catalog Grid */}
      <main className="py-12">
        <ProductGrid onOpenQuickView={(perfume: Perfume) => setSelectedPerfume(perfume)} />
        
        {/* Duo Bundle Spotlight */}
        <div className="mt-8">
          <DuoBundleSection />
        </div>
      </main>

      {/* Modals & Drawers */}
      <ProductModal
        perfume={selectedPerfume}
        onClose={() => setSelectedPerfume(null)}
      />

      <FragranceFinder
        isOpen={isFinderOpen}
        onClose={() => setIsFinderOpen(false)}
        onSelectPerfume={(perfume: Perfume) => setSelectedPerfume(perfume)}
      />

      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
