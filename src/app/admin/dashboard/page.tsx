"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart, StoredOrder } from "@/context/CartContext";
import { PERFUMES } from "@/data/perfumes";
import {
  Users,
  ShoppingBag,
  Package,
  TrendingUp,
  Search,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  MessageCircle,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  Phone,
  Lock,
  LogIn,
  AlertTriangle,
} from "lucide-react";
import { fetchRealActiveVisitorsCount, SUPER_ADMIN_EMAIL } from "@/lib/supabase";
import { appLink } from "@/lib/paths";

export default function AdminDashboardPage() {
  const { orders, updateOrderStatus, refreshOrders, user, isSuperAdmin } = useCart();

  const [activeVisitors, setActiveVisitors] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Poll real active visitors count every 15 seconds
  useEffect(() => {
    let isMounted = true;
    const fetchVisitors = async () => {
      const count = await fetchRealActiveVisitorsCount();
      if (isMounted) setActiveVisitors(count);
    };

    fetchVisitors();
    const interval = setInterval(fetchVisitors, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshOrders();
    const count = await fetchRealActiveVisitorsCount();
    setActiveVisitors(count);
    setIsRefreshing(false);
  };

  // Calculate REAL Metrics from actual orders in Supabase
  const totalRevenue = orders.reduce((sum, o) => {
    return o.status !== "CANCELLED" ? sum + o.total : sum;
  }, 0);

  const pendingOrdersCount = orders.filter((o) => o.status === "PENDING").length;
  const confirmedOrdersCount = orders.filter((o) => o.status === "CONFIRMED" || o.status === "SHIPPED").length;

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone.includes(searchTerm) ||
      o.governorate.includes(searchTerm);

    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Access Denied Screen if user is NOT Super Admin
  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-[#08080A] text-[#FCFBFA] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full glass-dark border border-rose-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-6 border border-rose-500/30">
            <Lock className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">منطقة محمية — دخول مقيد</h1>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            لوحة تحكم السوبر أدمن مخصصة حصرياً لمدير النظام الرئيسي:
            <span className="block font-mono text-[#D4AF37] font-semibold mt-1">
              {SUPER_ADMIN_EMAIL}
            </span>
          </p>

          {user ? (
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 mb-6">
              أنت مسجل الدخول حالياً بحساب:
              <span className="block text-white font-medium mt-1">{user.email}</span>
            </div>
          ) : null}

          <div className="space-y-3">
            <Link
              href={appLink("/login")}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg"
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول كـ Super Admin</span>
            </Link>

            <Link
              href={appLink("/")}
              className="w-full py-3 rounded-xl bg-zinc-900 text-zinc-300 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
            >
              <span>العودة للمتجر الرئيسي</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Super Admin Authorized View
  return (
    <div className="min-h-screen bg-[#08080A] text-[#FCFBFA] p-4 sm:p-6 lg:p-8">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>متصل بقاعدة بيانات Supabase الحية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            لوحة تحكم السوبر أدمن — <span className="text-gradient-gold">SÈN Parfums</span>
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            مرحباً بك، {user?.email} • جميع البيانات والإيرادات والزوار حقيقية ومحدثة لحظياً
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>تحديث فوري</span>
          </button>
          <Link
            href={appLink("/")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-bold text-xs flex items-center gap-1.5 shadow-md hover:brightness-110 transition-all"
          >
            <span>زيارة المتجر</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Real Statistics Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-8">
        {/* Real Live Visitors */}
        <div className="glass-dark border border-zinc-800 hover:border-[#D4AF37]/40 rounded-2xl p-6 transition-all shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-zinc-400 font-semibold">المتواجدين الآن في الموقع</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Users className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mb-1">{activeVisitors}</div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            زوار حقيقيين نشطين آخر 5 دقائق
          </p>
        </div>

        {/* Real Revenue */}
        <div className="glass-dark border border-zinc-800 hover:border-[#D4AF37]/40 rounded-2xl p-6 transition-all shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-zinc-400 font-semibold">إجمالي الإيرادات الحقيقية</span>
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#D4AF37] mb-1">
            {totalRevenue.toLocaleString("ar-EG")} ج.م
          </div>
          <p className="text-[11px] text-zinc-400">من إجمالي الطلبات غير الملغاة</p>
        </div>

        {/* Real Total Orders */}
        <div className="glass-dark border border-zinc-800 hover:border-[#D4AF37]/40 rounded-2xl p-6 transition-all shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-zinc-400 font-semibold">إجمالي الطلبات (COD)</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mb-1">{orders.length}</div>
          <p className="text-[11px] text-zinc-400">{confirmedOrdersCount} طلب مؤكد / قيد الشحن</p>
        </div>

        {/* Pending Orders */}
        <div className="glass-dark border border-zinc-800 hover:border-[#D4AF37]/40 rounded-2xl p-6 transition-all shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-zinc-400 font-semibold">طلبات جديدة معلقة</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400 mb-1">{pendingOrdersCount}</div>
          <p className="text-[11px] text-zinc-400">تحتاج لتأكيد هاتفي مع العميل</p>
        </div>
      </div>

      {/* Orders Management Table */}
      <div className="max-w-7xl mx-auto glass-dark border border-zinc-800 rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">إدارة طلبات الدفع عند الاستلام</h2>
            <p className="text-xs text-zinc-400 mt-1">
              تحديث الحالات فورياً والتواصل مع العملاء بنقرة واحدة عبر واتساب
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="بحث برقم الطلب، العميل، الموبايل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 pr-9 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37] w-64"
              />
              <Search className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="ALL">جميع الحالات ({orders.length})</option>
              <option value="PENDING">جديد (معلق)</option>
              <option value="CONFIRMED">تم التأكيد</option>
              <option value="SHIPPED">قيد الشحن</option>
              <option value="DELIVERED">تم التسليم</option>
              <option value="CANCELLED">ملغي</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-zinc-400">
            <Package className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">لا توجد طلبات مسجلة بعد</h3>
            <p className="text-xs text-zinc-500 mb-6">
              بمجرد قيام أي عميل بطلب عطر عبر الموقع سيظهر هنا فوراً بكل تفاصيله
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-zinc-900/60 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">رقم الطلب</th>
                  <th className="py-3 px-4 font-semibold">العميل</th>
                  <th className="py-3 px-4 font-semibold">المحافظة والعنوان</th>
                  <th className="py-3 px-4 font-semibold">المنتجات المطلوبة</th>
                  <th className="py-3 px-4 font-semibold">الإجمالي</th>
                  <th className="py-3 px-4 font-semibold">الحالة</th>
                  <th className="py-3 px-4 font-semibold text-center">إجراءات سريعة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredOrders.map((order) => {
                  const whatsappMsg = encodeURIComponent(
                    `مرحباً أستاذ ${order.customerName}، معك دار SÈN Parfums بخصوص طلبك رقم [${order.id}] بقيمة ${order.total} ج.م مع الضمان الذهبي. نود تأكيد عنوان الشحن: ${order.governorate} - ${order.address}.`
                  );
                  const cleanPhone = order.phone.replace(/^0/, "20");

                  return (
                    <tr key={order.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-[#F3E5AB]">
                        {order.id}
                        <span className="block text-[10px] text-zinc-500 font-sans">
                          {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-white">{order.customerName}</div>
                        <div className="text-[11px] text-zinc-400 font-mono" dir="ltr">
                          {order.phone}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-zinc-200 font-medium">{order.governorate}</div>
                        <div className="text-[11px] text-zinc-400 truncate max-w-[200px]" title={order.address}>
                          {order.address}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          {order.items.map((item, i) => (
                            <div key={i} className="text-zinc-300">
                              {item.name} × <span className="font-bold text-white">{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-4 font-bold text-white">
                        {order.total.toLocaleString("ar-EG")} ج.م
                        <span className="block text-[10px] text-zinc-400 font-normal">دفع عند الاستلام</span>
                      </td>

                      <td className="py-4 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold focus:outline-none border ${
                            order.status === "CONFIRMED"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                              : order.status === "SHIPPED"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                              : order.status === "DELIVERED"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : order.status === "CANCELLED"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          <option value="PENDING">معلق (جديد)</option>
                          <option value="CONFIRMED">تم التأكيد</option>
                          <option value="SHIPPED">قيد الشحن</option>
                          <option value="DELIVERED">تم التسليم</option>
                          <option value="CANCELLED">ملغي</option>
                        </select>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${whatsappMsg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/30 text-xs font-semibold transition-colors"
                          title="محادثة واتساب مباشرة مع العميل"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>واتساب</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Real Inventory Status */}
      <div className="max-w-7xl mx-auto glass-dark border border-zinc-800 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">المخزون الفعلي للمنتجات</h2>
          <span className="text-xs text-zinc-400">تحديث كميات العطور المتاحة للبيع</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PERFUMES.map((perfume) => (
            <div
              key={perfume.id}
              className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between"
            >
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">{perfume.nameAr}</h4>
                <p className="text-xs text-[#D4AF37] font-semibold">{perfume.price} ج.م</p>
                <p className="text-[11px] text-zinc-400 mt-1">{perfume.genderAr}</p>
              </div>

              <div className="text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                  متوفر للطلب
                </span>
                <div className="text-[11px] text-zinc-500 mt-1 text-center">شحن فوري</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
