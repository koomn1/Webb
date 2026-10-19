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
  LogIn,
} from "lucide-react";
import { appLink } from "@/lib/paths";

export function Navbar({ onOpenFinder }: { onOpenFinder: () => void }) {
  const { totalItems, setIsOpen, user, isSuperAdmin, logoutUser } = useCart();
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
            <Link
              href={appLink("/")}
              className="hover:text-[#D4AF37] transition-colors relative group py-1"
            >
              الرئيسية
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href={appLink("/shop")}
              className="hover:text-[#D4AF37] transition-colors relative group py-1"
            >
              تشكيلة العطور
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href={appLink("/guarantee")}
              className="hover:text-[#D4AF37] transition-colors relative group py-1 text-[#F3E5AB]"
            >
              الضمان الذهبي
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </Link>
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
            <Link href={appLink("/")} className="inline-block group focus-visible:outline-none">
              <span className="font-serif text-3xl sm:text-4xl tracking-[0.25em] font-normal uppercase text-white transition-colors duration-300 group-hover:text-[#F3E5AB]">
                SÈN
              </span>
              <span className="block text-[9px] tracking-[0.45em] text-[#D4AF37] uppercase font-medium -mt-1">
                Parfums
              </span>
            </Link>
          </div>

          {/* Right Tools: Support phone, Login / Account, Admin (Only for Super Admin), Cart */}
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

            {/* Super Admin Dashboard Button (ONLY visible for Super Admin) */}
            {isSuperAdmin && (
              <Link
                href={appLink("/admin/dashboard")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3E5AB] hover:bg-[#D4AF37]/25 text-xs font-bold transition-all shadow-sm"
                title="لوحة تحكم السوبر أدمن"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">لوحة الأدمن</span>
              </Link>
            )}

            {/* User Account / Login */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-300 hidden sm:inline font-medium">
                  {user.user_metadata?.full_name || user.name || user.email?.split("@")[0]}
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
              <Link
                href={appLink("/login")}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 hover:border-[#D4AF37] text-zinc-300 hover:text-white text-xs transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>دخول</span>
              </Link>
            )}

            {/* Cart Trigger Button */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="relative p-2.5 rounded-full bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 hover:border-[#D4AF37]/60 text-white transition-all shadow-lg hover:scale-105"
              aria-label="حقيبة التسوق"
            >
              <ShoppingBag className="w-4 h-4 text-[#F3E5AB]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#D4AF37] to-[#B38728] text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0A0E] border-b border-zinc-800 px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-semibold">
            <Link
              href={appLink("/")}
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-200 hover:text-[#D4AF37] py-2 border-b border-zinc-900"
            >
              الرئيسية
            </Link>
            <Link
              href={appLink("/shop")}
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-200 hover:text-[#D4AF37] py-2 border-b border-zinc-900"
            >
              تشكيلة العطور (Shop)
            </Link>
            <Link
              href={appLink("/guarantee")}
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F3E5AB] hover:text-[#D4AF37] py-2 border-b border-zinc-900"
            >
              الضمان الذهبي (Golden Guarantee)
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFinder();
              }}
              className="text-right text-[#D4AF37] py-2 border-b border-zinc-900 flex items-center justify-between"
            >
              <span>مستكشف النوتات العطرية</span>
              <Sparkles className="w-4 h-4" />
            </button>
            {isSuperAdmin && (
              <Link
                href={appLink("/admin/dashboard")}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#D4AF37] font-bold py-2 border-b border-zinc-900 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>لوحة تحكم السوبر أدمن</span>
              </Link>
            )}
            {!user && (
              <Link
                href={appLink("/login")}
                onClick={() => setMobileMenuOpen(false)}
                className="text-white py-2 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4 text-[#D4AF37]" />
                <span>تسجيل الدخول / إنشاء حساب</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
