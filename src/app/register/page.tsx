"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Sparkles, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { appLink } from "@/lib/paths";

export default function RegisterPage() {
  const router = useRouter();
  const { registerWithEmail, loginWithGoogle, user } = useCart();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMsg("يرجى ملء كافة الحقول الإلزامية.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("كلمة المرور وتأكيد كلمة المرور غير متطابقين.");
      return;
    }

    if (phone && !/^01[0125][0-9]{8}$/.test(phone.trim())) {
      setErrorMsg("رقم الهاتف المصري غير صحيح (مثال: 01018995002).");
      return;
    }

    setLoading(true);
    const { error, needsEmailConfirmation } = await registerWithEmail(email, password, fullName, phone);
    setLoading(false);

    if (error) {
      setErrorMsg(error.message || "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.");
    } else if (needsEmailConfirmation) {
      setSuccessMsg("تم إنشاء الحساب. راجع بريدك الإلكتروني واضغط رابط التأكيد، ثم سجّل الدخول من صفحة الدخول.");
    } else {
      setSuccessMsg("تم إنشاء الحساب بنجاح! جاري التوجيه...");
      setTimeout(() => {
        router.push(appLink("/"));
      }, 700);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setErrorMsg("");
    const { error } = await loginWithGoogle();
    setLoading(false);
    if (error) {
      setErrorMsg(error.message || "تعذر التسجيل عبر Google.");
    } else {
      router.push(appLink("/"));
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
        <h1 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-2">إنشاء حساب جديد</h1>
        <p className="text-stone-400 text-xs sm:text-sm font-light">انضم لدائرة سين الخاصة واستمتع بتجربة اقتناء عطرية استثنائية</p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-[#161413] border border-[#C58652]/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleSignup}
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
          <span>التسجيل السريع عبر Google</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-[#24201D] w-full" />
          <span className="bg-[#161413] px-3 text-[11px] text-stone-500 uppercase tracking-wider whitespace-nowrap">
            أو عبر البريد الإلكتروني
          </span>
          <div className="border-t border-[#24201D] w-full" />
        </div>

        {/* Alerts */}
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
              الاسم الكامل *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="أحمد محمد"
                className="w-full bg-[#0C0B0A] border border-[#24201D] focus:border-[#C58652] rounded-xl px-4 py-3 text-xs text-white placeholder-stone-600 focus:outline-none transition-colors pr-10"
              />
              <User className="w-4 h-4 text-stone-500 absolute right-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">
              رقم الموبايل (اختياري لتأكيد الشحن)
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01018995002"
                dir="ltr"
                className="w-full bg-[#0C0B0A] border border-[#24201D] focus:border-[#C58652] rounded-xl px-4 py-3 text-xs text-white placeholder-stone-600 focus:outline-none transition-colors pl-10"
              />
              <Phone className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">
              البريد الإلكتروني *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                dir="ltr"
                className="w-full bg-[#0C0B0A] border border-[#24201D] focus:border-[#C58652] rounded-xl px-4 py-3 text-xs text-white placeholder-stone-600 focus:outline-none transition-colors pl-10"
              />
              <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">
              كلمة المرور (6 أحرف على الأقل) *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                className="w-full bg-[#0C0B0A] border border-[#24201D] focus:border-[#C58652] rounded-xl px-4 py-3 text-xs text-white placeholder-stone-600 focus:outline-none transition-colors pl-10 pr-10"
              />
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">
              تأكيد كلمة المرور *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                className="w-full bg-[#0C0B0A] border border-[#24201D] focus:border-[#C58652] rounded-xl px-4 py-3 text-xs text-white placeholder-stone-600 focus:outline-none transition-colors pl-10"
              />
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3.5 rounded-xl bg-gradient-to-r from-[#E4C7A8] via-[#D8B28C] to-[#C58652] text-[#0C0B0A] font-semibold text-xs tracking-wider uppercase shadow-lg hover:shadow-[0_0_30px_rgba(197,134,82,0.35)] active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب مجاني"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center text-xs text-stone-400 space-y-3 font-light">
          <p>
            لديك حساب بالفعل؟{" "}
            <Link
              href={appLink("/login")}
              className="text-[#E4C7A8] hover:underline font-medium"
            >
              تسجيل الدخول
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
      </div>

      {/* Security Note */}
      <div className="mt-8 flex items-center gap-2 text-xs text-stone-500 font-light">
        <ShieldCheck className="w-4 h-4 text-[#C58652]" strokeWidth={1.5} />
        <span>حسابات آمنة ومحمية ببروتوكولات التشفير القياسية</span>
      </div>
    </div>
  );
}
