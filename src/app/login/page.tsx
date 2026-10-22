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
      }, 700);
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
      }, 700);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#FAF8F5] flex flex-col justify-center items-center px-4 py-16 relative overflow-hidden select-none">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C58652]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">
        <Link href={appLink("/")} className="inline-flex items-center gap-2.5 group mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E4C7A8] to-[#C58652] flex items-center justify-center text-[#0C0B0A] font-serif font-medium text-lg shadow-lg group-hover:scale-105 transition-transform">
            S
          </div>
          <span className="font-serif text-2xl tracking-[0.2em] font-light text-white">
            سين <span className="text-[#C58652] font-semibold">PARFUMS</span>
          </span>
        </Link>
        <h1 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-2">تسجيل الدخول</h1>
        <p className="text-stone-400 text-xs sm:text-sm font-light">مرحباً بك مجدداً في SÈN Parfums</p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-[#161413] border border-[#C58652]/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
        {user ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#688A75]/15 text-[#8EBBA0] flex items-center justify-center mx-auto text-2xl font-bold border border-[#688A75]/30">
              <CheckCircle className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-lg font-medium text-white">أنت مسجل الدخول بالفعل</h3>
            <p className="text-xs text-stone-400 font-mono">{user.email}</p>
            <div className="pt-4 flex flex-col gap-3">
              {isSuperAdmin && (
                <Link
                  href={appLink("/admin/dashboard")}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E4C7A8] via-[#D8B28C] to-[#C58652] text-[#0C0B0A] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:brightness-105 transition-all"
                >
                  لوحة تحكم السوبر أدمن
                </Link>
              )}
              <Link
                href={appLink("/")}
                className="w-full py-3 rounded-xl bg-[#0C0B0A] border border-[#24201D] text-stone-300 font-medium text-xs hover:border-[#C58652]/40 transition-colors"
              >
                العودة للتشكيلة الرئيسية
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#0C0B0A] hover:bg-[#24201D] border border-[#24201D] hover:border-[#C58652]/40 text-stone-200 text-xs font-medium flex items-center justify-center gap-3 transition-all shadow-md mb-6 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>تسجيل الدخول عبر Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-[#24201D] w-full" />
              <span className="bg-[#161413] px-3 text-[11px] text-stone-500 uppercase tracking-wider whitespace-nowrap">
                أو بالبريد الإلكتروني
              </span>
              <div className="border-t border-[#24201D] w-full" />
            </div>

            {/* Error / Success Alerts */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs leading-relaxed">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-[#688A75]/15 border border-[#688A75]/40 text-[#8EBBA0] text-xs leading-relaxed">
                {successMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
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
                    className="w-full bg-[#0C0B0A] border border-[#24201D] focus:border-[#C58652] rounded-xl px-4 py-3 text-xs text-white placeholder-stone-600 focus:outline-none transition-colors pl-11"
                  />
                  <Mail className="w-4 h-4 text-stone-500 absolute left-4 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
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
                    className="w-full bg-[#0C0B0A] border border-[#24201D] focus:border-[#C58652] rounded-xl px-4 py-3 text-xs text-white placeholder-stone-600 focus:outline-none transition-colors pl-11 pr-11"
                  />
                  <Lock className="w-4 h-4 text-stone-500 absolute left-4 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-[#E4C7A8] via-[#D8B28C] to-[#C58652] text-[#0C0B0A] font-semibold text-xs tracking-wider uppercase shadow-lg hover:shadow-[0_0_30px_rgba(197,134,82,0.35)] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {loading ? "جاري التحقق..." : "دخول إلى الحساب"}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center text-xs text-stone-400 space-y-3 font-light">
              <p>
                ليس لديك حساب بعد؟{" "}
                <Link
                  href={appLink("/register")}
                  className="text-[#E4C7A8] hover:underline font-medium"
                >
                  إنشاء حساب جديد
                </Link>
              </p>
              <div>
                <Link
                  href={appLink("/")}
                  className="text-stone-500 hover:text-stone-300 inline-flex items-center gap-1 transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>العودة للرئيسية</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Security Note */}
      <div className="mt-8 flex items-center gap-2 text-xs text-stone-500 font-light">
        <ShieldCheck className="w-4 h-4 text-[#C58652]" strokeWidth={1.5} />
        <span>بيانات مشفرة ومؤمنة بالكامل وفق أعلى المعايير القياسية</span>
      </div>
    </div>
  );
}
