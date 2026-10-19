"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle } from "lucide-react";
import { appLink } from "@/lib/paths";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, loginWithGoogle, user, isSuperAdmin } = useCart();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      setErrorMsg("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    setLoading(true);
    const { error } = await loginWithEmail(email, password);
    setLoading(false);

    if (error) {
      setErrorMsg(error.message || "فشل تسجيل الدخول. يرجى التحقق من بياناتك.");
    } else {
      setSuccessMsg("تم تسجيل الدخول بنجاح! جاري توجيهك...");
      setTimeout(() => {
        router.push(appLink("/"));
      }, 1000);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    const { error } = await loginWithGoogle();
    setLoading(false);
    if (error) {
      setErrorMsg(error.message || "تعذر تسجيل الدخول عبر Google.");
    } else {
      setSuccessMsg("تم تسجيل الدخول بنجاح!");
      setTimeout(() => {
        router.push(appLink("/"));
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080A] text-[#FCFBFA] flex flex-col justify-center items-center px-4 py-16 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">
        <Link href={appLink("/")} className="inline-flex items-center gap-2 group mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] flex items-center justify-center text-black font-black text-xl shadow-lg shadow-[#D4AF37]/20 group-hover:scale-105 transition-transform">
            S
          </div>
          <span className="text-2xl font-black tracking-widest text-gradient-gold">
            SÈN PARFUMS
          </span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">تسجيل الدخول</h1>
        <p className="text-zinc-400 text-sm">مرحباً بك مجدداً في عالم الفخامة والأناقة</p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md glass-dark border border-[#D4AF37]/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
        {user ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold border border-emerald-500/30">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">أنت مسجل الدخول بالفعل</h3>
            <p className="text-sm text-zinc-400">{user.email}</p>
            <div className="pt-4 flex flex-col gap-3">
              {isSuperAdmin && (
                <Link
                  href={appLink("/admin/dashboard")}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all"
                >
                  لوحة تحكم السوبر أدمن
                </Link>
              )}
              <Link
                href={appLink("/")}
                className="w-full py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold text-sm hover:bg-zinc-800 transition-colors"
              >
                العودة للصفحة الرئيسية
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-white text-sm font-semibold flex items-center justify-center gap-3 transition-all hover:border-[#D4AF37]/50 shadow-md mb-6 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              <span>تسجيل الدخول السريع عبر Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-zinc-800 w-full" />
              <span className="bg-[#0e0e12] px-3 text-xs text-zinc-500 uppercase tracking-wider whitespace-nowrap">
                أو بالبريد الإلكتروني
              </span>
              <div className="border-t border-zinc-800 w-full" />
            </div>

            {/* Error / Success Alerts */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs leading-relaxed">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs leading-relaxed">
                {successMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    dir="ltr"
                    className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors pl-11"
                  />
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    dir="ltr"
                    className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors pl-11 pr-11"
                  />
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] text-black font-bold text-sm tracking-wide shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {loading ? "جاري التحقق..." : "دخول إلى الحساب"}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center text-xs text-zinc-400 space-y-3">
              <p>
                ليس لديك حساب بعد؟{" "}
                <Link
                  href={appLink("/register")}
                  className="text-[#D4AF37] hover:underline font-semibold"
                >
                  أنشئ حساباً جديداً مجاناً
                </Link>
              </p>
              <div>
                <Link
                  href={appLink("/")}
                  className="text-zinc-500 hover:text-zinc-300 inline-flex items-center gap-1 transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>العودة للمتجر الرئيسي</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Security Note */}
      <div className="mt-8 flex items-center gap-2 text-xs text-zinc-500">
        <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
        <span>جميع البيانات محمية ومشفرة وفق أعلى معايير أمان Supabase</span>
      </div>
    </div>
  );
}
