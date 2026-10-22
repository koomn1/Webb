"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Clock3,
  MapPin,
  Package,
  RefreshCw,
  ShieldCheck,
  Truck,
  XCircle,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useCart, StoredOrder } from "@/context/CartContext";
import { appLink } from "@/lib/paths";

const STATUS_STEPS: {
  key: Exclude<StoredOrder["status"], "CANCELLED">;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  { key: "PENDING", label: "قيد المراجعة", description: "استلمنا طلبك ونراجعه الآن", icon: Clock3 },
  { key: "CONFIRMED", label: "تم التأكيد", description: "تم تأكيد الطلب وتجهيزه", icon: Check },
  { key: "SHIPPED", label: "خرج للتوصيل", description: "الطلب في طريقه إلى عنوانك", icon: Truck },
  { key: "DELIVERED", label: "تم التسليم", description: "نتمنى أن تستمتع بتجربتك", icon: Package },
];

const statusIndex = (status: StoredOrder["status"]) =>
  STATUS_STEPS.findIndex((step) => step.key === status);

const statusLabel = (status: StoredOrder["status"]) =>
  STATUS_STEPS.find((step) => step.key === status)?.label || "تم تحديث الطلب";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

function OrderTimeline({ status }: { status: StoredOrder["status"] }) {
  if (status === "CANCELLED") {
    return (
      <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4 text-rose-200 flex items-start gap-3">
        <XCircle className="w-5 h-5 mt-0.5 shrink-0" strokeWidth={1.5} />
        <div>
          <p className="font-semibold text-sm">تم إلغاء الطلب</p>
          <p className="text-xs text-rose-200/70 mt-1">لو محتاج مساعدة، تواصل مع فريق سين.</p>
        </div>
      </div>
    );
  }

  const activeIndex = statusIndex(status);
  return (
    <div className="relative grid grid-cols-4 gap-2 pt-2">
      <div className="absolute top-6 right-[12.5%] left-[12.5%] h-px bg-[#3a332d]" />
      <div
        className="absolute top-6 right-[12.5%] h-px bg-gradient-to-l from-[#E4C7A8] to-[#C58652] transition-all"
        style={{ width: `${Math.max(0, activeIndex) * 25}%` }}
      />
      {STATUS_STEPS.map((step, index) => {
        const Icon = step.icon;
        const complete = index <= activeIndex;
        return (
          <div key={step.key} className="relative z-10 text-center">
            <div
              className={`mx-auto w-9 h-9 rounded-full flex items-center justify-center border transition-colors ${
                complete
                  ? "bg-gradient-to-br from-[#E4C7A8] to-[#C58652] border-[#E4C7A8] text-[#0C0B0A]"
                  : "bg-[#171412] border-[#3a332d] text-[#736d65]"
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.7} />
            </div>
            <p className={`text-[10px] sm:text-xs mt-3 ${complete ? "text-[#F5E4D2]" : "text-[#736d65]"}`}>
              {step.label}
            </p>
            <p className="hidden sm:block text-[10px] text-[#736d65] mt-1 leading-relaxed">{step.description}</p>
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }: { order: StoredOrder }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="rounded-3xl border border-[#2B2724] bg-[#161412]/90 overflow-hidden shadow-xl">
      <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2B2724]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#E4C7A8]/10 border border-[#E4C7A8]/20 flex items-center justify-center">
            <Package className="w-5 h-5 text-[#E4C7A8]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs text-[#8f887f]">رقم الطلب</p>
            <h2 className="font-mono text-[#F5E4D2] tracking-wider mt-1">{order.id}</h2>
          </div>
        </div>
        <div className="sm:text-left">
          <p className="text-xs text-[#8f887f]">تاريخ الطلب</p>
          <p className="text-xs text-[#ECE5DA] mt-1">{formatDate(order.createdAt)}</p>
        </div>
        <div className="sm:text-left">
          <p className="text-xs text-[#8f887f]">الإجمالي</p>
          <p className="text-lg text-[#E4C7A8] font-semibold mt-1">{order.total.toLocaleString("ar-EG")} ج.م</p>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        <OrderTimeline status={order.status} />

        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-2xl bg-[#0f0e0d] border border-[#25221F] p-4 flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[#C58652] mt-0.5 shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-[#8f887f] mb-1">عنوان التوصيل</p>
              <p className="text-[#ECE5DA] leading-relaxed">{order.governorate} — {order.address}</p>
            </div>
          </div>
          <div className="rounded-2xl bg-[#0f0e0d] border border-[#25221F] p-4 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-[#C58652] mt-0.5 shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-[#8f887f] mb-1">طريقة الدفع</p>
              <p className="text-[#ECE5DA]">الدفع عند الاستلام</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="w-full flex items-center justify-between text-xs text-[#E4C7A8] hover:text-white border-t border-[#2B2724] pt-4"
        >
          <span>{expanded ? "إخفاء تفاصيل المنتجات" : `عرض المنتجات (${order.items.length})`}</span>
          <ArrowLeft className={`w-4 h-4 transition-transform ${expanded ? "-rotate-90" : "rotate-0"}`} strokeWidth={1.5} />
        </button>

        {expanded && (
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={`${item.name}-${index}`} className="flex items-center justify-between gap-4 rounded-xl bg-[#0f0e0d] border border-[#25221F] px-4 py-3 text-xs">
                <div>
                  <p className="text-[#F5E4D2]">{item.name}</p>
                  <p className="text-[#736d65] mt-1">الكمية: {item.quantity}</p>
                </div>
                <p className="text-[#E4C7A8] whitespace-nowrap">{(item.price * item.quantity).toLocaleString("ar-EG")} ج.م</p>
              </div>
            ))}
            <div className="flex items-center justify-between text-xs text-[#8f887f] pt-2">
              <span>المنتجات</span><span>{order.subtotal.toLocaleString("ar-EG")} ج.م</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#8f887f]">
              <span>الشحن</span><span>{order.shippingFee === 0 ? "مجاني" : `${order.shippingFee.toLocaleString("ar-EG")} ج.م`}</span>
            </div>
            {order.discountCode && (
              <div className="flex items-center justify-between text-xs text-[#8EBBA0]">
                <span>خصم {order.discountCode}</span><span>-{(order.discountAmount || 0).toLocaleString("ar-EG")} ج.م</span>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function MyProductsPage() {
  const { user, orders, refreshOrders } = useCart();
  const [refreshing, setRefreshing] = useState(false);
  const previousStatuses = useRef<Record<string, StoredOrder["status"]>>({});

  useEffect(() => {
    if (!user) return;
    void refreshOrders();
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      void Notification.requestPermission();
    }
    const interval = window.setInterval(() => void refreshOrders(), 30000);
    return () => window.clearInterval(interval);
    // refreshOrders is provided by the client context and intentionally omitted
    // because its identity changes whenever cart state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!user || orders.length === 0) return;
    const nextStatuses: Record<string, StoredOrder["status"]> = {};
    for (const order of orders) {
      const previous = previousStatuses.current[order.id];
      nextStatuses[order.id] = order.status;
      if (!previous || previous === order.status || typeof window === "undefined" || !("Notification" in window)) continue;
      if (Notification.permission === "granted") {
        new Notification(`تحديث الطلب ${order.id}`, {
          body: `حالة طلبك الآن: ${statusLabel(order.status)}`,
          icon: "/images/sen_monogram.svg",
          tag: `order-${order.id}-${order.status}`,
        });
      }
    }
    previousStatuses.current = nextStatuses;
  }, [orders, user]);

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [orders]
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshOrders();
    setRefreshing(false);
  };

  return (
    <main className="min-h-screen bg-[#0C0B0A] text-[#FAF8F5]" dir="rtl">
      <Navbar onOpenFinder={() => {}} />
      <div className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div>
              <p className="text-[#C58652] text-[10px] tracking-[0.28em] uppercase mb-3">حساب سين</p>
              <h1 className="font-serif text-3xl sm:text-5xl text-[#F5E4D2]">منتجاتي</h1>
              <p className="text-[#8f887f] text-sm mt-3">تابع طلباتك وتفاصيل التوصيل من مكان واحد.</p>
            </div>
            {user && (
              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                className="self-start sm:self-auto inline-flex items-center gap-2 rounded-full border border-[#3a332d] px-4 py-2.5 text-xs text-[#E4C7A8] hover:border-[#E4C7A8]/60 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} strokeWidth={1.5} />
                تحديث الحالة
              </button>
            )}
          </header>

          {!user ? (
            <section className="rounded-3xl border border-[#3a332d] bg-[#161412] p-8 sm:p-12 text-center">
              <Package className="w-10 h-10 text-[#E4C7A8] mx-auto mb-5" strokeWidth={1.3} />
              <h2 className="font-serif text-2xl text-[#F5E4D2]">سجّل دخولك لمتابعة طلباتك</h2>
              <p className="text-sm text-[#8f887f] mt-3 max-w-md mx-auto leading-7">بعد تسجيل الدخول ستجد كل طلباتك، المنتجات الموجودة فيها، وحالة التوصيل خطوة بخطوة.</p>
              <Link href={appLink("/login")} className="inline-flex items-center gap-2 mt-7 rounded-full bg-gradient-to-r from-[#E4C7A8] to-[#C58652] px-6 py-3 text-xs font-bold text-[#0C0B0A]">
                تسجيل الدخول <ArrowLeft className="w-4 h-4" strokeWidth={1.7} />
              </Link>
            </section>
          ) : sortedOrders.length === 0 ? (
            <section className="rounded-3xl border border-[#3a332d] bg-[#161412] p-8 sm:p-12 text-center">
              <Package className="w-10 h-10 text-[#8f887f] mx-auto mb-5" strokeWidth={1.3} />
              <h2 className="font-serif text-2xl text-[#F5E4D2]">لا توجد طلبات مرتبطة بحسابك بعد</h2>
              <p className="text-sm text-[#8f887f] mt-3">اختار عطرك الأول، وسنضعه هنا مع تحديثات التوصيل.</p>
              <Link href={appLink("/shop")} className="inline-flex items-center gap-2 mt-7 rounded-full border border-[#E4C7A8]/40 px-6 py-3 text-xs text-[#E4C7A8] hover:bg-[#E4C7A8]/10">
                اكتشف التشكيلة <ArrowLeft className="w-4 h-4" strokeWidth={1.7} />
              </Link>
            </section>
          ) : (
            <div className="space-y-6">
              {sortedOrders.map((order) => <OrderCard key={order.id} order={order} />)}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
