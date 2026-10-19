"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  Sparkles,
  Phone,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";

export function Navbar({ onOpenFinder }: { onOpenFinder: () => void }) {
  const { totalItems, setIsOpen, user, loginWithGoogle, logoutUser } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "glass-luxury py-3 shadow-[0_10px_30px_rgba(0,0,0,0.85)] border-b border-[#26262F]"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Mobile menu trigger */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={onOpenFinder}
              className="w-10 h-10 flex items-center justify-center rounded-full text-[#D4AF37] hover:bg-zinc-800/60 transition-colors"
              title="مستكشف النوتات العطرية"
              aria-label="مستكشف النوتات"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs tracking-wider uppercase font-medium text-zinc-300">
            <a
              href="#products"
              className="hover:text-[#D4AF37] transition-colors relative group py-1"
            >
              عطور SÈN
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </a>
            <a
              href="#bundle"
              className="hover:text-[#D4AF37] transition-colors relative group py-1"
            >
              باقة الثنائي الملكية
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </a>
            <a
              href="#guarantee"
              className="hover:text-[#D4AF37] transition-colors relative group py-1 text-[#F3E5AB]"
            >
              الضمان الذهبي
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </a>
            <button
              type="button"
              onClick={onOpenFinder}
              className="flex items-center gap-1.5 text-[#E6C687] hover:text-white transition-colors uppercase tracking-wider relative group py-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>مستكشف النوتات</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </button>
          </nav>

          {/* Central Brand Identity */}
          <div className="text-center">
            <Link href="/" className="inline-block group focus-visible:outline-none">
              <span className="font-serif text-3xl sm:text-4xl tracking-[0.25em] font-normal uppercase text-white transition-colors duration-300 group-hover:text-[#F3E5AB]">
                SÈN
              </span>
              <span className="block text-[9px] tracking-[0.45em] text-[#D4AF37] uppercase font-medium -mt-1">
                Parfums
              </span>
            </Link>
          </div>

          {/* Right Tools: Support phone, Google Login, Admin, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Phone Support Direct Hotline */}
            <a
              href="tel:01018995002"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#D4AF37]/50 text-xs font-mono transition-colors"
              title="اتصل بالدعم: 01018995002"
            >
              <Phone className="w-3 h-3 text-[#D4AF37]" />
              <span>01018995002</span>
            </a>

            {/* Google Authentication via Supabase */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-300 hidden sm:inline font-medium">
                  {user.name || "العميل"}
                </span>
                <button
                  type="button"
                  onClick={logoutUser}
                  className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={loginWithGoogle}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 hover:border-[#D4AF37] text-zinc-300 hover:text-white text-xs transition-colors"
                title="تسجيل الدخول بجوجل عبر سوبابيز"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="hidden sm:inline">دخول Google</span>
              </button>
            )}

            {/* Admin Dashboard shortcut */}
            <Link
              href="/admin/dashboard"
              className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors"
              title="لوحة تحكم السوبر أدمن"
            >
              <LayoutDashboard className="w-4 h-4" />
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-[#D4AF37]/50 text-[#F3E5AB] hover:border-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all"
              aria-label="حقيبة التسوق"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-[#D4AF37] text-black font-bold text-[10px] shadow-lg animate-scale">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-luxury border-t border-zinc-800 px-6 py-6 mt-3 animate-fadeIn">
          <div className="flex flex-col gap-4 text-sm font-medium">
            <a
              href="#products"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-200 hover:text-[#D4AF37] py-2 border-b border-zinc-800/60"
            >
              عطور SÈN (زيست وأورا)
            </a>
            <a
              href="#bundle"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-200 hover:text-[#D4AF37] py-2 border-b border-zinc-800/60"
            >
              باقة الثنائي الملكية (خصم 150 ج.م)
            </a>
            <a
              href="#guarantee"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F3E5AB] py-2 border-b border-zinc-800/60 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>الضمان الذهبي وعينة الـ 2ml</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFinder();
              }}
              className="flex items-center justify-between text-[#E6C687] py-2 text-start"
            >
              <span>مستكشف النوتات العطرية</span>
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </button>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span>الدعم السريع عبر الهاتف:</span>
              <a href="tel:01018995002" className="text-[#D4AF37] font-mono font-bold">
                01018995002
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
