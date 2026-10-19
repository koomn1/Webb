"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { DuoBundleSection } from "@/components/DuoBundleSection";
import { GoldenGuaranteeSection } from "@/components/GoldenGuaranteeSection";
import { FragranceFinder } from "@/components/FragranceFinder";
import { ProductModal } from "@/components/ProductModal";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { Footer } from "@/components/Footer";
import { Perfume } from "@/data/perfumes";

export default function Home() {
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);

  return (
    <div className="min-h-screen bg-[#08080A] text-[#FCFBFA] flex flex-col selection:bg-[#D4AF37]/20 selection:text-[#F3E5AB]">
      {/* Header Navigation */}
      <Navbar onOpenFinder={() => setIsFinderOpen(true)} />

      {/* Main Experience */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onOpenFinder={() => setIsFinderOpen(true)} />

        {/* Products Grid: SÈN Zeste & Aura */}
        <ProductGrid onOpenQuickView={(p) => setSelectedPerfume(p)} />

        {/* Duo Bundle (Zeste + Aura with 150 EGP discount & free shipping) */}
        <DuoBundleSection />

        {/* Golden Guarantee & 2ml Sample testing */}
        <GoldenGuaranteeSection />
      </main>

      {/* Footer with Support & Admin Shortcut */}
      <Footer />

      {/* Interactive Modals & Drawers */}
      <FragranceFinder
        isOpen={isFinderOpen}
        onClose={() => setIsFinderOpen(false)}
        onSelectPerfume={(p) => setSelectedPerfume(p)}
      />

      <ProductModal
        perfume={selectedPerfume}
        onClose={() => setSelectedPerfume(null)}
      />

      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
}
