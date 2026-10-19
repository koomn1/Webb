"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart, StoredOrder } from "@/context/CartContext";
import { PERFUMES, Perfume } from "@/data/perfumes";
import {
  Users,
  ShoppingBag,
  Package,
  TrendingUp,
  Search,
  Filter,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  MessageCircle,
  Eye,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Phone,
  MapPin,
  ExternalLink,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { orders, updateOrderStatus } = useCart();
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "products" | "live_users">("overview");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [liveVisitors, setLiveVisitors] = useState(16);
  const [productsState, setProductsState] = useState<Perfume[]>(PERFUMES);

  // Simulate subtle real-time fluctuation in live visitors counter
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(8, Math.min(42, prev + delta));
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    const matchesSearch =
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Analytics Calculations
  const totalRevenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter((o) => o.status === "PENDING").length;
  const confirmedOrdersCount = orders.filter((o) => o.status === "CONFIRMED" || o.status === "SHIPPED" || o.status === "DELIVERED").length;
  const confirmationRate = orders.length > 0 ? Math.round((confirmedOrdersCount / orders.length) * 100) : 100;
  const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // WhatsApp quick link generator
  const getWhatsAppLink = (order: StoredOrder) => {
    let cleanPhone = order.phone.replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "2" + cleanPhone; // Egypt country code
    }
    const msg = `مرحباً أستاذ ${order.customerName}، معك دار SÈN Parfums بخصوص طلبك رقم ${order.id} بقيمة ${order.total} ج.م. هل نؤكد شحن الأوردر لحضرتك؟`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  const handleStockChange = (id: string, delta: number) => {
    setProductsState((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stockQuantity: Math.max(0, p.stockQuantity + delta) } : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#07070A] text-zinc-200 font-sans" dir="rtl">
      {/* Top Bar */}
      <header className="border-b border-zinc-800/80 bg-[#0C0C12] sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-serif text-2xl tracking-[0.2em] font-normal text-white uppercase hover:text-[#D4AF37] transition-colors"
            >
              SÈN
            </Link>
            <div className="h-5 w-[1px] bg-zinc-800" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#D4AF37]/15 text-[#F3E5AB] border border-[#D4AF37]/30 font-semibold tracking-wider">
              لوحة التحكم الإدارية (Super Admin)
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Visitors Pulsing Counter */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 font-bold">{liveVisitors}</span>
              <span className="text-zinc-400 hidden sm:inline">عميل يتصفحون المتجر الآن</span>
            </div>

            <Link
              href="/"
              className="text-xs px-3.5 py-1.5 rounded-lg border border-zinc-700 hover:border-[#D4AF37] text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>زيارة المتجر</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 text-xs sm:text-sm font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "overview"
                ? "bg-[#D4AF37] text-black font-bold"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>نظرة عامة ومؤشرات الأداء</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "orders"
                ? "bg-[#D4AF37] text-black font-bold"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>إدارة الطلبات ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-black font-bold text-[10px]">
                {pendingOrdersCount} معلّق
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "products"
                ? "bg-[#D4AF37] text-black font-bold"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>المنتجات والمخزون</span>
          </button>

          <button
            onClick={() => setActiveTab("live_users")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "live_users"
                ? "bg-[#D4AF37] text-black font-bold"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>المتواجدون الآن ({liveVisitors})</span>
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Live Visitors */}
              <div className="p-5 rounded-2xl bg-[#0F0F16] border border-emerald-500/30 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                  <span>المستخدمون النشطون الآن</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="font-serif text-3xl font-bold text-white mb-1">
                  {liveVisitors} <span className="text-sm font-sans font-normal text-emerald-400">متصفح حي</span>
                </div>
                <p className="text-[11px] text-zinc-500">يتنقلون في واجهة العطور وسلة المشتريات</p>
              </div>

              {/* Card 2: Total Revenue */}
              <div className="p-5 rounded-2xl bg-[#0F0F16] border border-zinc-800">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                  <span>إجمالي المبيعات المؤكدة</span>
                  <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="font-serif text-3xl font-bold text-[#F3E5AB] mb-1">
                  {totalRevenue.toLocaleString()} <span className="text-sm font-sans font-normal text-zinc-400">ج.م</span>
                </div>
                <p className="text-[11px] text-zinc-500">الدفع عند الاستلام (COD)</p>
              </div>

              {/* Card 3: Orders Breakdown */}
              <div className="p-5 rounded-2xl bg-[#0F0F16] border border-zinc-800">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                  <span>إجمالي عدد الطلبات</span>
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                </div>
                <div className="font-serif text-3xl font-bold text-white mb-1">
                  {orders.length} <span className="text-sm font-sans font-normal text-zinc-400">طلب</span>
                </div>
                <div className="flex gap-2 text-[11px]">
                  <span className="text-amber-400 font-semibold">{pendingOrdersCount} قيد التأكيد</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-emerald-400 font-semibold">{confirmedOrdersCount} مؤكد</span>
                </div>
              </div>

              {/* Card 4: Confirmation Rate */}
              <div className="p-5 rounded-2xl bg-[#0F0F16] border border-zinc-800">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                  <span>معدل تأكيد الأوردرات</span>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="font-serif text-3xl font-bold text-emerald-400 mb-1">
                  {confirmationRate}%
                </div>
                <p className="text-[11px] text-zinc-500">متوسط قيمة الطلب (AOV): {averageOrderValue.toLocaleString()} ج.م</p>
              </div>
            </div>

            {/* Quick Orders Stream & Stock Health */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders List */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0F0F16] border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg text-white font-medium">أحدث طلبات الدفع عند الاستلام</h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1"
                  >
                    <span>عرض الكل</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.slice(0, 4).map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-[#F3E5AB]">{order.id}</span>
                          <span className="text-xs text-zinc-400">• {order.customerName}</span>
                          <span className="text-[11px] text-zinc-500">({order.governorate})</span>
                        </div>
                        <p className="text-xs text-zinc-300">
                          {order.items.map((i) => `${i.name} (×${i.quantity})`).join(", ")}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-serif font-bold text-sm text-white">
                          {order.total.toLocaleString()} ج.م
                        </span>
                        <a
                          href={getWhatsAppLink(order)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>واتساب</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inventory & Support Contacts */}
              <div className="space-y-6">
                {/* Support info card */}
                <div className="p-6 rounded-2xl bg-[#0F0F16] border border-[#D4AF37]/30">
                  <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-semibold uppercase mb-3">
                    <Sparkles className="w-4 h-4" />
                    <span>بيانات الدعم والتواصل الفني</span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Phone className="w-4 h-4 text-[#D4AF37]" />
                      <a href="tel:01018995002" className="hover:text-white font-mono font-bold">
                        01018995002
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-300">
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <a
                        href="https://wa.me/201018995002"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline font-mono"
                      >
                        واتساب الدعم السريع
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-300">
                      <span className="text-[#D4AF37]">✉</span>
                      <a href="mailto:youssefbadawy5002@gmail.com" className="hover:text-white font-mono">
                        youssefbadawy5002@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Stock alerts */}
                <div className="p-6 rounded-2xl bg-[#0F0F16] border border-zinc-800">
                  <h3 className="font-serif text-base text-white font-medium mb-3">حالة مخزون الزجاجات والعينات</h3>
                  <div className="space-y-3 text-xs">
                    {productsState.map((p) => (
                      <div key={p.id} className="flex items-center justify-between">
                        <span className="text-zinc-300">{p.nameAr}</span>
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded ${
                            p.stockQuantity <= 15
                              ? "bg-red-500/20 text-red-400"
                              : "bg-emerald-500/20 text-emerald-400"
                          }`}
                        >
                          {p.stockQuantity} عبوة
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                      <span className="text-zinc-400">عينات الضمان الذهبي (2ml)</span>
                      <span className="font-mono font-bold text-[#F3E5AB]">140 عينة متوفرة</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0F0F16] border border-zinc-800">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-zinc-500 absolute top-1/2 -translate-y-1/2 right-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم، كود الطلب، أو الموبايل..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pr-9 pl-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#D4AF37]"
                />
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
                {["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                      statusFilter === st
                        ? "bg-[#D4AF37] text-black font-bold"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {st === "ALL" && "الكل"}
                    {st === "PENDING" && "قيد المراجعة"}
                    {st === "CONFIRMED" && "مؤكد"}
                    {st === "SHIPPED" && "تم الشحن"}
                    {st === "DELIVERED" && "تم الاستلام"}
                    {st === "CANCELLED" && "ملغي"}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-2xl bg-[#0F0F16] border border-zinc-800">
              <table className="w-full text-start text-xs">
                <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className="p-4 text-start font-medium">كود الأوردر</th>
                    <th className="p-4 text-start font-medium">بيانات العميل</th>
                    <th className="p-4 text-start font-medium">المحافظة والعنوان</th>
                    <th className="p-4 text-start font-medium">المنتجات</th>
                    <th className="p-4 text-start font-medium">الإجمالي</th>
                    <th className="p-4 text-start font-medium">الحالة</th>
                    <th className="p-4 text-start font-medium">إجراءات سريعة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-[#F3E5AB]">{order.id}</td>
                        <td className="p-4">
                          <div className="font-semibold text-white">{order.customerName}</div>
                          <div className="text-zinc-400 font-mono text-[11px]">{order.phone}</div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-zinc-200 block">{order.governorate}</span>
                          <span className="text-zinc-400 text-[11px] line-clamp-1">{order.address}</span>
                        </td>
                        <td className="p-4">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="text-zinc-300">
                              {it.name} <span className="text-[#D4AF37]">×{it.quantity}</span>
                            </div>
                          ))}
                        </td>
                        <td className="p-4 font-serif font-bold text-white whitespace-nowrap">
                          {order.total.toLocaleString()} ج.م
                          <span className="block text-[10px] text-zinc-500 font-sans font-normal">دفع استلام</span>
                        </td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                              order.status === "PENDING"
                                ? "bg-amber-950/60 border-amber-600/50 text-amber-300"
                                : order.status === "CONFIRMED"
                                ? "bg-blue-950/60 border-blue-600/50 text-blue-300"
                                : order.status === "SHIPPED"
                                ? "bg-purple-950/60 border-purple-600/50 text-purple-300"
                                : order.status === "DELIVERED"
                                ? "bg-emerald-950/60 border-emerald-600/50 text-emerald-300"
                                : "bg-red-950/60 border-red-600/50 text-red-300"
                            }`}
                          >
                            <option value="PENDING">معلّق (PENDING)</option>
                            <option value="CONFIRMED">مؤكد (CONFIRMED)</option>
                            <option value="SHIPPED">تم الشحن (SHIPPED)</option>
                            <option value="DELIVERED">مستلم (DELIVERED)</option>
                            <option value="CANCELLED">ملغي (CANCELLED)</option>
                          </select>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <a
                              href={getWhatsAppLink(order)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                              title="محادثة واتساب سريعة"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                            <a
                              href={`tel:${order.phone}`}
                              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                              title="اتصال هاتفي"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-zinc-500">
                        لا توجد طلبات تطابق معايير البحث الحالية.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS & INVENTORY */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {productsState.map((product) => (
                <div
                  key={product.id}
                  className="p-6 rounded-2xl bg-[#0F0F16] border border-zinc-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#D4AF37] font-semibold">{product.genderAr}</span>
                      <span className="text-xs text-zinc-400 font-mono">{product.volumeMl}ml</span>
                    </div>

                    <h3 className="font-serif text-2xl text-white font-medium mb-1">{product.nameAr}</h3>
                    <p className="text-xs text-zinc-400 mb-4">{product.nameEn}</p>

                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 mb-6 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">السعر للمستهلك:</span>
                        <span className="font-serif font-bold text-[#F3E5AB]">{product.price} ج.م</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">التركيز:</span>
                        <span className="text-zinc-200">{product.concentration} (20% زيوت نادرة)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">عينة الضمان الذهبي:</span>
                        <span className="text-emerald-400 font-semibold">مدمجة مجاناً (2ml)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2 text-xs">
                      <span className="text-zinc-300 font-medium">الكمية بالمخزن:</span>
                      <span className="font-mono text-sm font-bold text-white">
                        {product.stockQuantity} زجاجة
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStockChange(product.id, -1)}
                        className="flex-1 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-bold text-sm"
                      >
                        - 1
                      </button>
                      <button
                        onClick={() => handleStockChange(product.id, +5)}
                        className="flex-1 py-2 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F3E5AB] font-bold text-sm hover:bg-[#D4AF37]/30"
                      >
                        + 5 زجاجات
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: LIVE USERS ANALYTICS */}
        {activeTab === "live_users" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-2xl bg-[#0F0F16] border border-emerald-500/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="font-serif text-2xl text-white font-medium">
                  {liveVisitors} عميل يتصفحون المتجر الآن في هذه اللحظة
                </h3>
              </div>

              {/* Geographic Live breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { region: "القاهرة والجيزة", count: Math.round(liveVisitors * 0.45), pct: "45%" },
                  { region: "الإسكندرية والساحل", count: Math.round(liveVisitors * 0.25), pct: "25%" },
                  { region: "الدلتا والقناة", count: Math.round(liveVisitors * 0.2), pct: "20%" },
                  { region: "الصعيد ومحافظات أخرى", count: Math.round(liveVisitors * 0.1), pct: "10%" },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <span className="text-xs text-zinc-400 block mb-1">{item.region}</span>
                    <span className="font-serif text-2xl font-bold text-white">{item.count} عميل</span>
                    <span className="text-[11px] text-[#D4AF37] block mt-0.5">{item.pct} من الزوار</span>
                  </div>
                ))}
              </div>

              {/* Live Pages Distribution */}
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                الصفحات التي يزورها العملاء حالياً:
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 flex justify-between items-center">
                  <span className="text-zinc-200">الصفحة الرئيسية (Hero & Brand Story)</span>
                  <span className="font-mono text-emerald-400 font-bold">{Math.round(liveVisitors * 0.4)} زائر</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 flex justify-between items-center">
                  <span className="text-zinc-200">صفحة عطر SÈN Zeste (رجالي)</span>
                  <span className="font-mono text-emerald-400 font-bold">{Math.round(liveVisitors * 0.25)} زائر</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 flex justify-between items-center">
                  <span className="text-zinc-200">صفحة عطر SÈN Aura (حريمي)</span>
                  <span className="font-mono text-emerald-400 font-bold">{Math.round(liveVisitors * 0.2)} زائر</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 flex justify-between items-center">
                  <span className="text-zinc-200">شاشة الشراء السريع وسلة الطلب (Checkout)</span>
                  <span className="font-mono text-amber-400 font-bold">{Math.max(1, Math.round(liveVisitors * 0.15))} زائر في مرحلة الشراء</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
