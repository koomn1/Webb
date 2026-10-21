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
    <div className="min-h-screen bg-[#0C0B0A] text-[#FAF8F5] selection:bg-[#C58652]/20 selection:text-[#E4C7A8]">
      {/* Navigation */}
      <Navbar onOpenFinder={() => setIsFinderOpen(true)} />

      {/* Shop Header Banner */}
      <div className="pt-32 pb-16 bg-gradient-to-b from-[#161413] to-[#0C0B0A] border-b border-[#24201D] relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-[#C58652]/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161413] border border-[#C58652]/30 text-[#E4C7A8] text-xs font-medium uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C58652]" strokeWidth={1.5} />
            <span>التوليفات الحصرية • SÈN Haute Parfumerie</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-white tracking-tight mb-4">
            توليفات دار <span className="champagne-gradient-text">SÈN Paris • Le Caire</span>
          </h1>
          <p className="max-w-2xl mx-auto text-stone-400 text-sm sm:text-base leading-relaxed font-light">
            عطور Eau de Parfum Intense بتركيز 20%. كل زجاجة تتضمن عينة استكشافية 2 مل مجاناً مع ميثاق الثقة والدفع عند الاستلام.
          </p>

          {/* Quick Filter Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsFinderOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#161413] hover:bg-[#24201D] border border-[#C58652]/30 text-xs text-[#E4C7A8] font-medium flex items-center gap-2 transition-all hover:scale-105"
            >
              <Compass className="w-4 h-4 text-[#C58652]" strokeWidth={1.5} />
              <span>المستشار العطري التفاعلي</span>
            </button>
            <Link
              href={appLink("/guarantee")}
              className="px-5 py-2.5 rounded-full bg-[#161413]/60 hover:bg-[#161413] border border-[#24201D] text-xs text-stone-300 font-light flex items-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-[#8EBBA0]" strokeWidth={1.5} />
              <span>ميثاق الثقة والأمان</span>
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
