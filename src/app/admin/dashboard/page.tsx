"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useCart, StoredOrder } from "@/context/CartContext";
import { PERFUMES, Perfume } from "@/data/perfumes";
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
  Phone,
  FileSpreadsheet,
  Printer,
  PlusCircle,
  Check,
  Filter,
  DollarSign,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import {
  fetchRealActiveVisitorsCount,
  saveOrderToSupabase,
  SUPER_ADMIN_EMAIL,
} from "@/lib/supabase";
import { appLink } from "@/lib/paths";
import { Fake404 } from "@/components/Fake404";

export default function AdminDashboardPage() {
  const { orders, updateOrderStatus, refreshOrders, user, isSuperAdmin } = useCart();

  const [activeVisitors, setActiveVisitors] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [governorateFilter, setGovernorateFilter] = useState<string>("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Manual Order Creation Modal State
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualGov, setManualGov] = useState("القاهرة");
  const [manualAddress, setManualAddress] = useState("");
  const [manualPerfume, setManualPerfume] = useState<string>("zeste");
  const [manualQuantity, setManualQuantity] = useState(1);
  const [manualNotes, setManualNotes] = useState("");
  const [manualSubmitting, setManualSubmitting] = useState(false);

  // Product Stock Overrides State (Local & Session)
  const [stockStatus, setStockStatus] = useState<Record<string, boolean>>({
    zeste: true,
    aura: true,
    "bundle-duo": true,
  });

  // Short delay to avoid flickering while checking auth session from Supabase
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAuthChecking(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Poll real active visitors count every 15 seconds
  useEffect(() => {
    if (!isSuperAdmin) return;
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
  }, [isSuperAdmin]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshOrders();
    const count = await fetchRealActiveVisitorsCount();
    setActiveVisitors(count);
    setIsRefreshing(false);
  };

  // Real Metrics Calculations
  const stats = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== "CANCELLED");
    const totalRev = validOrders.reduce((sum, o) => sum + o.total, 0);
    const deliveredRev = orders
      .filter((o) => o.status === "DELIVERED")
      .reduce((sum, o) => sum + o.total, 0);
    const pendingCount = orders.filter((o) => o.status === "PENDING").length;
    const confirmedCount = orders.filter((o) => o.status === "CONFIRMED").length;
    const shippedCount = orders.filter((o) => o.status === "SHIPPED").length;
    const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;
    const cancelledCount = orders.filter((o) => o.status === "CANCELLED").length;
    const aov = validOrders.length > 0 ? Math.round(totalRev / validOrders.length) : 0;

    return {
      totalRevenue: totalRev,
      deliveredRevenue: deliveredRev,
      pendingCount,
      confirmedCount,
      shippedCount,
      deliveredCount,
      cancelledCount,
      totalOrders: orders.length,
      averageOrderValue: aov,
    };
  }, [orders]);

  // Unique governorates for filter
  const uniqueGovs = useMemo(() => {
    const govs = new Set<string>();
    orders.forEach((o) => {
      if (o.governorate) govs.add(o.governorate.trim());
    });
    return Array.from(govs);
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.phone.includes(searchTerm) ||
        o.governorate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.address && o.address.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
      const matchesGov = governorateFilter === "ALL" || o.governorate === governorateFilter;

      return matchesSearch && matchesStatus && matchesGov;
    });
  }, [orders, searchTerm, statusFilter, governorateFilter]);

  // CSV Export for Logistics & Delivery
  const exportOrdersCSV = () => {
    if (orders.length === 0) return;
    const headers = ["رقم الطلب", "التاريخ", "العميل", "الموبايل", "المحافظة", "العنوان", "المنتجات", "الإجمالي", "الحالة"];
    const rows = orders.map((o) => [
      o.id,
      new Date(o.createdAt).toLocaleDateString("ar-EG"),
      `"${o.customerName}"`,
      `"${o.phone}"`,
      `"${o.governorate}"`,
      `"${o.address?.replace(/"/g, '""') || ""}"`,
      `"${o.items.map((i) => `${i.name} (x${i.quantity})`).join(" + ")}"`,
      o.total,
      o.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SEN_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Create Manual Phone/WhatsApp Order
  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualPhone || !manualAddress) return;

    setManualSubmitting(true);
    const selectedP = PERFUMES.find((p) => p.id === manualPerfume) || PERFUMES[0];
    const price = selectedP.id === "bundle-duo" ? 1150 : 650;
    const subtotal = price * manualQuantity;
    const shipping = selectedP.id === "bundle-duo" ? 0 : 50;
    const total = subtotal + shipping;
    const orderNum = `SEN-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: StoredOrder = {
      id: orderNum,
      customerName: manualName.trim(),
      phone: manualPhone.trim(),
      governorate: manualGov,
      address: manualAddress.trim(),
      notes: manualNotes.trim() ? `[طلب يدوي] ${manualNotes.trim()}` : "[طلب يدوي هاتف/واتساب]",
      items: [
        {
          name: selectedP.nameAr,
          quantity: manualQuantity,
          price: price,
        },
      ],
      subtotal,
      shippingFee: shipping,
      total,
      paymentMethod: "COD",
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
    };

    // Save to Supabase
    await saveOrderToSupabase({
      order_number: newOrder.id,
      customer_name: newOrder.customerName,
      phone: newOrder.phone,
      governorate: newOrder.governorate,
      address: newOrder.address,
      notes: newOrder.notes,
      items: newOrder.items,
      subtotal: newOrder.subtotal,
      shipping_fee: newOrder.shippingFee,
      total_amount: newOrder.total,
      payment_method: "COD",
      status: "CONFIRMED",
    });

    await refreshOrders();
    setManualSubmitting(false);
    setShowAddOrderModal(false);
    setManualName("");
    setManualPhone("");
    setManualAddress("");
    setManualNotes("");
  };

  // Toggle Stock Availability
  const toggleStock = (perfumeId: string) => {
    setStockStatus((prev) => ({
      ...prev,
      [perfumeId]: !prev[perfumeId],
    }));
  };

  // =========================================================================
  // STRICT SECURITY CHECK: Deflect unauthorized visitors with Fake 404
  // =========================================================================
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#0C0B0A] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#C58652] border-t-transparent animate-spin" />
      </div>
    );
  }

  // If visitor is NOT Super Admin, deflect with fake 404 (does NOT leak that dashboard exists)
  if (!isSuperAdmin) {
    return <Fake404 />;
  }

  // =========================================================================
  // SUPER ADMIN AUTHORIZED VIEW
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#FAF8F5] p-3 sm:p-6 lg:p-8 select-text">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>متصل بقاعدة بيانات Supabase الحية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <span>لوحة تحكم السوبر أدمن</span>
            <span className="text-gradient-gold font-serif">SÈN Parfums</span>
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            مرحباً، <span className="text-[#E4C7A8] font-mono">{user?.email}</span> • تحكم كامل في الطلبات، المخزون، والبيانات الحية
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAddOrderModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/50 transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>إضافة طلب يدوي</span>
          </button>

          <button
            onClick={exportOrdersCSV}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 flex items-center gap-1.5 transition-colors"
            title="تصدير بيانات الطلبات لملف Excel/CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>تصدير Excel</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#C58652]" : ""}`} />
            <span>تحديث</span>
          </button>

          <Link
            href={appLink("/")}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E4C7A8] via-[#D8B28C] to-[#C58652] text-[#0C0B0A] font-semibold text-xs flex items-center gap-1.5 shadow-md hover:brightness-105 transition-all"
          >
            <span>زيارة المتجر</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Real Statistics Overview Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 my-6 sm:my-8">
        {/* Real Live Visitors */}
        <div className="glass-dark border border-zinc-800 hover:border-[#C58652]/40 rounded-2xl p-4 sm:p-5 transition-all shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] sm:text-xs text-zinc-400 font-semibold">المتواجدين الآن</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Users className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mb-0.5">{activeVisitors}</div>
          <p className="text-[10px] sm:text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            زوار حقيقيين نشطين
          </p>
        </div>

        {/* Real Total Revenue */}
        <div className="glass-dark border border-zinc-800 hover:border-[#C58652]/40 rounded-2xl p-4 sm:p-5 transition-all shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] sm:text-xs text-zinc-400 font-semibold">إجمالي الإيرادات</span>
            <div className="w-8 h-8 rounded-lg bg-[#C58652]/10 text-[#E4C7A8] flex items-center justify-center border border-[#C58652]/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#E4C7A8] mb-0.5">
            {stats.totalRevenue.toLocaleString("ar-EG")} <span className="text-xs">ج.م</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-zinc-400">
            تم تحصيل: {stats.deliveredRevenue.toLocaleString("ar-EG")} ج.م
          </p>
        </div>

        {/* Real Total Orders */}
        <div className="glass-dark border border-zinc-800 hover:border-[#C58652]/40 rounded-2xl p-4 sm:p-5 transition-all shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] sm:text-xs text-zinc-400 font-semibold">إجمالي الطلبات (COD)</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mb-0.5">{stats.totalOrders}</div>
          <p className="text-[10px] sm:text-[11px] text-blue-400">
            متوسط الطلب: {stats.averageOrderValue} ج.م
          </p>
        </div>

        {/* Orders Pending Confirmation */}
        <div className="glass-dark border border-zinc-800 hover:border-[#C58652]/40 rounded-2xl p-4 sm:p-5 transition-all shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] sm:text-xs text-zinc-400 font-semibold">طلبات جديدة معلقة</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mb-0.5">{stats.pendingCount}</div>
          <p className="text-[10px] sm:text-[11px] text-zinc-400">تحتاج لتأكيد الشحن</p>
        </div>
      </div>

      {/* Orders Filter Tabs */}
      <div className="max-w-7xl mx-auto mb-4 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
            statusFilter === "ALL"
              ? "bg-[#C58652] text-[#0C0B0A] shadow-md"
              : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          الكل ({stats.totalOrders})
        </button>
        <button
          onClick={() => setStatusFilter("PENDING")}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
            statusFilter === "PENDING"
              ? "bg-amber-500 text-black font-bold shadow-md"
              : "bg-zinc-900 text-zinc-400 hover:text-amber-400"
          }`}
        >
          جديد معلق ({stats.pendingCount})
        </button>
        <button
          onClick={() => setStatusFilter("CONFIRMED")}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
            statusFilter === "CONFIRMED"
              ? "bg-blue-500 text-white font-bold shadow-md"
              : "bg-zinc-900 text-zinc-400 hover:text-blue-400"
          }`}
        >
          تم التأكيد ({stats.confirmedCount})
        </button>
        <button
          onClick={() => setStatusFilter("SHIPPED")}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
            statusFilter === "SHIPPED"
              ? "bg-purple-500 text-white font-bold shadow-md"
              : "bg-zinc-900 text-zinc-400 hover:text-purple-400"
          }`}
        >
          جاري الشحن ({stats.shippedCount})
        </button>
        <button
          onClick={() => setStatusFilter("DELIVERED")}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
            statusFilter === "DELIVERED"
              ? "bg-emerald-500 text-black font-bold shadow-md"
              : "bg-zinc-900 text-zinc-400 hover:text-emerald-400"
          }`}
        >
          تم التسليم ({stats.deliveredCount})
        </button>
        <button
          onClick={() => setStatusFilter("CANCELLED")}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
            statusFilter === "CANCELLED"
              ? "bg-rose-500 text-white font-bold shadow-md"
              : "bg-zinc-900 text-zinc-400 hover:text-rose-400"
          }`}
        >
          ملغي ({stats.cancelledCount})
        </button>
      </div>

      {/* Orders Management Table */}
      <div className="max-w-7xl mx-auto glass-dark border border-zinc-800 rounded-3xl p-4 sm:p-6 mb-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>إدارة طلبات الدفع عند الاستلام</span>
              <span className="text-xs text-zinc-400 font-normal">({filteredOrders.length} طلب معروض)</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial">
              <input
                type="text"
                placeholder="بحث برقم الطلب، الاسم، الهاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 pr-9 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C58652] w-full sm:w-64"
              />
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Governorate Filter */}
            {uniqueGovs.length > 0 && (
              <select
                value={governorateFilter}
                onChange={(e) => setGovernorateFilter(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#C58652]"
              >
                <option value="ALL">كافة المحافظات</option>
                {uniqueGovs.map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Table Content */}
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-zinc-400">
            <Package className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">لا توجد طلبات مطابقة</h3>
            <p className="text-xs text-zinc-500">
              لم يتم العثور على أي طلبات تطابق معايير البحث أو التصفية الحالية.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-zinc-900/60 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-3.5 font-semibold">رقم الطلب</th>
                  <th className="py-3 px-3.5 font-semibold">بيانات العميل</th>
                  <th className="py-3 px-3.5 font-semibold">العنوان والمحافظة</th>
                  <th className="py-3 px-3.5 font-semibold">المنتجات المطلوبة</th>
                  <th className="py-3 px-3.5 font-semibold">المبلغ (COD)</th>
                  <th className="py-3 px-3.5 font-semibold">حالة الطلب</th>
                  <th className="py-3 px-3.5 font-semibold text-center">إجراءات سريعة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredOrders.map((order) => {
                  const cleanPhone = order.phone.replace(/^0/, "20");
                  const whatsappMsg = encodeURIComponent(
                    `مرحباً أستاذ ${order.customerName}، معك دار SÈN Parfums بخصوص طلبك رقم [${order.id}] بقيمة ${order.total} ج.م مع الضمان الذهبي. نود تأكيد عنوان الشحن: ${order.governorate} - ${order.address}.`
                  );

                  return (
                    <tr key={order.id} className="hover:bg-zinc-900/40 transition-colors">
                      {/* Order Number */}
                      <td className="py-3.5 px-3.5 font-mono font-bold text-[#E4C7A8] whitespace-nowrap">
                        {order.id}
                        <span className="block text-[10px] text-zinc-500 font-sans mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-3.5">
                        <div className="font-bold text-white text-xs">{order.customerName}</div>
                        <div className="text-[11px] text-zinc-400 font-mono" dir="ltr">
                          {order.phone}
                        </div>
                        {order.notes && (
                          <div className="text-[10px] text-amber-400/80 italic mt-0.5">
                            ملاحظة: {order.notes}
                          </div>
                        )}
                      </td>

                      {/* Address */}
                      <td className="py-3.5 px-3.5">
                        <div className="text-zinc-200 font-semibold">{order.governorate}</div>
                        <div
                          className="text-[11px] text-zinc-400 truncate max-w-[180px] sm:max-w-[220px]"
                          title={order.address}
                        >
                          {order.address}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-3.5">
                        <div className="space-y-0.5">
                          {order.items.map((item, i) => (
                            <div key={i} className="text-zinc-300">
                              {item.name} ×{" "}
                              <span className="font-bold text-white bg-zinc-800 px-1.5 py-0.2 rounded text-[10px]">
                                {item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <div className="font-bold text-white text-sm">
                          {order.total.toLocaleString("ar-EG")}{" "}
                          <span className="text-[10px] text-[#C58652]">ج.م</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 block">دفع عند الاستلام</span>
                      </td>

                      {/* Status Selector */}
                      <td className="py-3.5 px-3.5">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold focus:outline-none border cursor-pointer ${
                            order.status === "CONFIRMED"
                              ? "bg-blue-500/15 text-blue-400 border-blue-500/40"
                              : order.status === "SHIPPED"
                              ? "bg-purple-500/15 text-purple-400 border-purple-500/40"
                              : order.status === "DELIVERED"
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40"
                              : order.status === "CANCELLED"
                              ? "bg-rose-500/15 text-rose-400 border-rose-500/40"
                              : "bg-amber-500/15 text-amber-400 border-amber-500/40"
                          }`}
                        >
                          <option value="PENDING">معلق (جديد)</option>
                          <option value="CONFIRMED">تم التأكيد</option>
                          <option value="SHIPPED">قيد الشحن</option>
                          <option value="DELIVERED">تم التسليم</option>
                          <option value="CANCELLED">ملغي</option>
                        </select>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* WhatsApp Button */}
                          <a
                            href={`https://wa.me/${cleanPhone}?text=${whatsappMsg}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366]/25 border border-[#25D366]/30 transition-colors"
                            title="محادثة واتساب سريعة لتأكيد الطلب"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          {/* Direct Phone Call */}
                          <a
                            href={`tel:${order.phone}`}
                            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                            title="اتصال هاتفي مباشر بالعميل"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Stock & Catalog Management */}
      <div className="max-w-7xl mx-auto glass-dark border border-zinc-800 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">التحكم في توفر العطور والمخزون</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              يمكنك إيقاف أو تفعيل استقبال الطلبات على أي عطر فورياً بنقرة زر
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {PERFUMES.map((perfume) => {
            const isAvailable = stockStatus[perfume.id] ?? true;
            return (
              <div
                key={perfume.id}
                className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between transition-all hover:border-zinc-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">{perfume.nameAr}</h4>
                    <span className="text-xs text-[#E4C7A8] font-semibold">{perfume.price} ج.م</span>
                    <span className="block text-[10px] text-zinc-500 mt-0.5">{perfume.genderAr} • 50ml</span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      isAvailable
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                    }`}
                  >
                    {isAvailable ? "متوفر للبيع" : "نفذت الكمية"}
                  </span>
                </div>

                <button
                  onClick={() => toggleStock(perfume.id)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all border ${
                    isAvailable
                      ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30"
                      : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  }`}
                >
                  {isAvailable ? "تغيير إلى: نفذت الكمية" : "تغيير إلى: متاح للطلب"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Order Modal */}
      {showAddOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f0f14] border border-[#C58652]/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#C58652]" />
                <span>إضافة طلب هاتف / واتساب يدوي</span>
              </h3>
              <button
                onClick={() => setShowAddOrderModal(false)}
                className="w-8 h-8 rounded-full bg-zinc-900 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">اسم العميل *</label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="محمد أحمد"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#C58652]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">رقم الموبايل *</label>
                <input
                  type="tel"
                  required
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  placeholder="01018995002"
                  dir="ltr"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#C58652]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">المحافظة *</label>
                  <select
                    value={manualGov}
                    onChange={(e) => setManualGov(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#C58652]"
                  >
                    <option value="القاهرة">القاهرة</option>
                    <option value="الجيزة">الجيزة</option>
                    <option value="الإسكندرية">الإسكندرية</option>
                    <option value="الدقهلية">الدقهلية</option>
                    <option value="الشرقية">الشرقية</option>
                    <option value="الغربية">الغربية</option>
                    <option value="المنوفية">المنوفية</option>
                    <option value="القليوبية">القليوبية</option>
                    <option value="البحيرة">البحيرة</option>
                    <option value="أسيوط">أسيوط</option>
                    <option value="سوهاج">سوهاج</option>
                    <option value="محافظة أخرى">محافظة أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">العطر المختار *</label>
                  <select
                    value={manualPerfume}
                    onChange={(e) => setManualPerfume(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#C58652]"
                  >
                    <option value="zeste">سِيان زيست (رجالي - 650 ج.م)</option>
                    <option value="aura">سِيان أورا (حريمي - 650 ج.م)</option>
                    <option value="bundle-duo">باقة الثنائي (زيست + أورا - 1150 ج.م)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">العنوان بالتفصيل *</label>
                <textarea
                  required
                  rows={2}
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder="الشارع، رقم العمارة، الشقة، علامة مميزة..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-[#C58652]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">ملاحظات إضافية (اختياري)</label>
                <input
                  type="text"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="مثال: يفضل التسليم بعد العصر"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-[#C58652]"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  disabled={manualSubmitting}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#E4C7A8] via-[#D8B28C] to-[#C58652] text-[#0C0B0A] font-semibold text-xs shadow-lg hover:brightness-105 disabled:opacity-50"
                >
                  {manualSubmitting ? "جاري الحفظ في الداتابيز..." : "حفظ الطلب وتأكيده"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddOrderModal(false)}
                  className="px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
