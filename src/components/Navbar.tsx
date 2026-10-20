"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Compass,
} from "lucide-react";
import { appLink, asset } from "@/lib/paths";

export function Navbar({ onOpenFinder }: { onOpenFinder?: () => void }) {
  const { totalItems, setIsOpen, user, isSuperAdmin, logoutUser } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "glass-luxury py-3 shadow-[0_12px_35px_rgba(0,0,0,0.85)] border-b border-[#25221F]"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-[#ABA59C] hover:text-white hover:bg-[#1C1A18] transition-colors"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
            </button>
            <Link
              href={appLink("/finder")}
              className="w-10 h-10 flex items-center justify-center rounded-full text-[#E4C7A8] hover:bg-[#1C1A18] transition-colors"
              title="مستكشف النوتات العطرية"
              aria-label="مستكشف النوتات"
            >
              <Compass className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs tracking-wider uppercase font-medium text-[#ABA59C]">
            <Link
              href={appLink("/")}
              className="hover:text-[#E4C7A8] transition-colors relative group py-1"
            >
              الرئيسية
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#E4C7A8] transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href={appLink("/shop")}
              className="hover:text-[#E4C7A8] transition-colors relative group py-1"
            >
              التشكيلة
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#E4C7A8] transition-all duration-300 group-hover:w-full" />
            </Link>
            {user && (
              <Link
                href={appLink("/my-products")}
                className="hover:text-[#E4C7A8] transition-colors relative group py-1"
              >
                منتجاتي
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#E4C7A8] transition-all duration-300 group-hover:w-full" />
              </Link>
            )}
            <Link
              href={appLink("/duo")}
              className="hover:text-[#E4C7A8] transition-colors relative group py-1 text-[#F5E4D2]"
            >
              باقة الثنائي الملكية
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#E4C7A8] transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href={appLink("/finder")}
              className="hover:text-[#E4C7A8] transition-colors relative group py-1 flex items-center gap-1 text-[#E4C7A8]"
            >
              <Compass className="w-3.5 h-3.5 text-[#C58652]" strokeWidth={1.5} />
              <span>الهرم العطري</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#E4C7A8] transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href={appLink("/guarantee")}
              className="hover:text-[#E4C7A8] transition-colors relative group py-1"
            >
              ميثاق الثقة
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#E4C7A8] transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href={appLink("/about")}
              className="hover:text-[#E4C7A8] transition-colors relative group py-1"
            >
              قصة الدار
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#E4C7A8] transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>

          {/* Central Brand Identity with Transparent Logo */}
          <div className="text-center">
            <Link href={appLink("/")} className="inline-block group focus-visible:outline-none py-1">
              <div className="flex flex-col items-center">
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] font-light uppercase text-white transition-colors duration-300 group-hover:text-[#F5E4D2]">
                  SÈN
                </span>
                <span className="block text-[8px] tracking-[0.45em] text-[#C58652] uppercase font-medium -mt-1">
                  HAUTE PARFUMERIE
                </span>
              </div>
            </Link>
          </div>

          {/* Right Tools: Support phone, Login / Account, Admin (Only for Super Admin), Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Phone Support Direct Hotline */}
            <a
              href="tel:01018995002"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181614] border border-[#2B2724] text-[#ABA59C] hover:text-white hover:border-[#E4C7A8]/40 text-xs font-mono transition-colors"
              title="اتصل بالدعم: 01018995002"
            >
              <Phone className="w-3 h-3 text-[#E4C7A8]" strokeWidth={1.5} />
              <span>01018995002</span>
            </a>

            {/* Super Admin Dashboard Button (ONLY visible for Super Admin) */}
            {isSuperAdmin && (
              <Link
                href={appLink("/admin/dashboard")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#E4C7A8]/15 border border-[#E4C7A8]/40 text-[#F5E4D2] hover:bg-[#E4C7A8]/25 text-xs font-bold transition-all shadow-sm"
                title="لوحة تحكم السوبر أدمن"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#E4C7A8]" strokeWidth={1.5} />
                <span className="hidden sm:inline">لوحة الأدمن</span>
              </Link>
            )}

            {/* User Account / Login */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#ECE5DA] hidden sm:inline font-medium">
                  {user.user_metadata?.full_name || user.name || user.email?.split("@")[0]}
                </span>
                <button
                  type="button"
                  onClick={logoutUser}
                  className="p-2 rounded-full bg-[#181614] border border-[#2B2724] text-[#ABA59C] hover:text-white hover:border-[#C58652]/40 transition-colors"
                  title="تسجيل الخروج (تحديث فوري)"
                >
                  <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <Link
                href={appLink("/login")}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#2B2724] bg-[#181614] hover:border-[#E4C7A8] text-[#ABA59C] hover:text-white text-xs transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-[#E4C7A8]" strokeWidth={1.5} />
                <span>دخول</span>
              </Link>
            )}

            {/* Cart Trigger Button */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="relative p-2.5 rounded-full bg-gradient-to-br from-[#1C1A18] to-[#12100E] border border-[#2B2724] hover:border-[#E4C7A8]/60 text-white transition-all shadow-lg hover:scale-105"
              aria-label="حقيبة التسوق"
            >
              <ShoppingBag className="w-4 h-4 text-[#F5E4D2]" strokeWidth={1.75} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#E4C7A8] to-[#C58652] text-[#0C0B0A] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#12100E] border-b border-[#25221F] px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-semibold">
            <Link
              href={appLink("/")}
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-[#E4C7A8] transition-colors py-1"
            >
              الرئيسية
            </Link>
            <Link
              href={appLink("/shop")}
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#ABA59C] hover:text-[#E4C7A8] transition-colors py-1"
            >
              تشكيلة العطور
            </Link>
            {user && (
              <Link
                href={appLink("/my-products")}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#E4C7A8] hover:text-white transition-colors py-1"
              >
                منتجاتي وتتبع الطلبات
              </Link>
            )}
            <Link
              href={appLink("/duo")}
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F5E4D2] hover:text-[#E4C7A8] transition-colors py-1"
            >
              باقة الثنائي الملكية
            </Link>
            <Link
              href={appLink("/finder")}
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#E4C7A8] hover:text-white transition-colors py-1 flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#C58652]" strokeWidth={1.5} />
              <span>المستشار العطري والهرم</span>
            </Link>
            <Link
              href={appLink("/guarantee")}
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#ABA59C] hover:text-[#E4C7A8] transition-colors py-1"
            >
              ميثاق الثقة والضمان
            </Link>
            <Link
              href={appLink("/about")}
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#ABA59C] hover:text-[#E4C7A8] transition-colors py-1"
            >
              قصة الدار
            </Link>

            {user ? (
              <div className="pt-3 border-t border-[#25221F] flex items-center justify-between">
                <span className="text-xs text-[#ECE5DA]">
                  {user.user_metadata?.full_name || user.email}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logoutUser();
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-[#25221F]">
                <Link
                  href={appLink("/login")}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 rounded-xl bg-gradient-to-r from-[#E4C7A8] to-[#C58652] text-[#0C0B0A] font-bold text-xs"
                >
                  تسجيل الدخول / حساب جديد
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
