"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
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
  PlusCircle,
  Check,
  Filter,
  DollarSign,
  AlertCircle,
  Tag,
  Percent,
  Edit3,
  Trash2,
  Copy,
  Sparkles,
  Layers,
  Code,
  CheckCheck,
  Eye,
  ExternalLink,
} from "lucide-react";
import {
  fetchRealActiveVisitorsCount,
  saveOrderToSupabase,
  SupabaseDiscountCode,
} from "@/lib/supabase";
import { appLink, asset } from "@/lib/paths";
import { Fake404 } from "@/components/Fake404";

// Preset image choices for easy addition/editing
const PRESET_IMAGES = [
  { label: "سِيان زيست (Zeste)", url: "/images/zeste.webp" },
  { label: "سِيان أورا (Aura)", url: "/images/aura.webp" },
  { label: "باقة الثنائي (Duo Bundle)", url: "/images/duo_bundle.webp" },
  { label: "ستايل رجالي فخم (Lifestyle Men)", url: "/images/lifestyle_man.webp" },
  { label: "ستايل نسائي راقي (Lifestyle Women)", url: "/images/lifestyle_woman.webp" },
  { label: "الهرم العطري - قمة (Scent Top)", url: "/images/scent_top.webp" },
  { label: "الهرم العطري - قلب (Scent Heart)", url: "/images/scent_heart.webp" },
  { label: "الهرم العطري - قاعدة (Scent Base)", url: "/images/scent_base.webp" },
];

export default function AdminDashboardPage() {
  const {
    orders,
    updateOrderStatus,
    refreshOrders,
    user,
    isSuperAdmin,
    products,
    updateProduct,
    addProduct,
    deleteProduct,
    refreshProducts,
    discountCodes,
    createDiscountCode,
    deleteDiscountCode,
    toggleDiscountCode,
    refreshDiscountCodes,
  } = useCart();

  const [activeTab, setActiveTab] = useState<"orders" | "products" | "discounts" | "sql">("orders");
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
  const [manualPerfume, setManualPerfume] = useState<string>("sen-zeste");
  const [manualQuantity, setManualQuantity] = useState(1);
  const [manualNotes, setManualNotes] = useState("");
  const [manualSubmitting, setManualSubmitting] = useState(false);

  // Product Editing Modal State
  const [editingPerfume, setEditingPerfume] = useState<Perfume | null>(null);
  const [editNameAr, setEditNameAr] = useState("");
  const [editNameEn, setEditNameEn] = useState("");
  const [editPrice, setEditPrice] = useState(650);
  const [editComparePrice, setEditComparePrice] = useState<number | undefined>(undefined);
  const [editTaglineAr, setEditTaglineAr] = useState("");
  const [editGenderAr, setEditGenderAr] = useState("رجالي");
  const [editGender, setEditGender] = useState<"Homme" | "Femme" | "Duo">("Homme");
  const [editImage, setEditImage] = useState("/images/zeste.webp");
  const [editDescriptionAr, setEditDescriptionAr] = useState("");
  const [editTopNotes, setEditTopNotes] = useState("");
  const [editHeartNotes, setEditHeartNotes] = useState("");
  const [editBaseNotes, setEditBaseNotes] = useState("");
  const [isProductSaving, setIsProductSaving] = useState(false);

  // New Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newNameAr, setNewNameAr] = useState("");
  const [newNameEn, setNewNameEn] = useState("");
  const [newPrice, setNewPrice] = useState(650);
  const [newComparePrice, setNewComparePrice] = useState<number | undefined>(undefined);
  const [newTaglineAr, setNewTaglineAr] = useState("");
  const [newGenderAr, setNewGenderAr] = useState("رجالي");
  const [newGender, setNewGender] = useState<"Homme" | "Femme" | "Duo">("Homme");
  const [newImage, setNewImage] = useState("/images/zeste.webp");
  const [newDescriptionAr, setNewDescriptionAr] = useState("");
  const [newTopNotes, setNewTopNotes] = useState("");
  const [newHeartNotes, setNewHeartNotes] = useState("");
  const [newBaseNotes, setNewBaseNotes] = useState("");
  const [isNewProductSaving, setIsNewProductSaving] = useState(false);

  // New Discount Code State
  const [showAddDiscountModal, setShowAddDiscountModal] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newDiscountType, setNewDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [newDiscountValue, setNewDiscountValue] = useState(15);
  const [newMinOrderAmount, setNewMinOrderAmount] = useState(500);
  const [newMaxUses, setNewMaxUses] = useState(100);
  const [isDiscountSaving, setIsDiscountSaving] = useState(false);

  // SQL Copy Feedback State
  const [copiedSql, setCopiedSql] = useState(false);

  // Auth delay to prevent flash of 404
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
    await Promise.all([
      refreshOrders(),
      refreshProducts(),
      refreshDiscountCodes(),
      fetchRealActiveVisitorsCount().then((c) => setActiveVisitors(c)),
    ]);
    setIsRefreshing(false);
  };

  // Metrics Calculations
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
    const headers = ["رقم الطلب", "التاريخ", "العميل", "الموبايل", "المحافظة", "العنوان", "المنتجات", "الإجمالي", "كود الخصم", "الحالة"];
    const rows = orders.map((o) => [
      o.id,
      new Date(o.createdAt).toLocaleDateString("ar-EG"),
      `"${o.customerName}"`,
      `"${o.phone}"`,
      `"${o.governorate}"`,
      `"${o.address?.replace(/"/g, '""') || ""}"`,
      `"${o.items.map((i) => `${i.name} (x${i.quantity})`).join(" + ")}"`,
      o.total,
      o.discountCode ? `"${o.discountCode}"` : "بدون",
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
    const selectedP = products.find((p) => p.id === manualPerfume) || products[0] || PERFUMES[0];
    const price = selectedP.price;
    const subtotal = price * manualQuantity;
    const shipping = selectedP.id.includes("bundle") || selectedP.id.includes("duo") ? 0 : 50;
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

  // Open Edit Product Modal
  const openEditModal = (p: Perfume) => {
    setEditingPerfume(p);
    setEditNameAr(p.nameAr);
    setEditNameEn(p.nameEn || p.name);
    setEditPrice(p.price);
    setEditComparePrice(p.comparePrice);
    setEditTaglineAr(p.taglineAr || "");
    setEditGenderAr(p.genderAr || "رجالي");
    setEditGender(p.gender || "Homme");
    setEditImage(p.image);
    setEditDescriptionAr(p.descriptionAr || "");
    setEditTopNotes(p.topNotes?.join(", ") || "");
    setEditHeartNotes(p.heartNotes?.join(", ") || "");
    setEditBaseNotes(p.baseNotes?.join(", ") || "");
  };

  // Save Product Updates
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPerfume) return;
    setIsProductSaving(true);

    const topArr = editTopNotes.split(/[,،]+/).map((s) => s.trim()).filter(Boolean);
    const heartArr = editHeartNotes.split(/[,،]+/).map((s) => s.trim()).filter(Boolean);
    const baseArr = editBaseNotes.split(/[,،]+/).map((s) => s.trim()).filter(Boolean);

    await updateProduct(editingPerfume.id, {
      nameAr: editNameAr.trim(),
      nameEn: editNameEn.trim(),
      name: editNameEn.trim() || editNameAr.trim(),
      price: Number(editPrice),
      comparePrice: editComparePrice ? Number(editComparePrice) : undefined,
      taglineAr: editTaglineAr.trim(),
      gender: editGender,
      genderAr: editGenderAr.trim(),
      image: editImage.trim(),
      descriptionAr: editDescriptionAr.trim(),
      topNotes: topArr,
      heartNotes: heartArr,
      baseNotes: baseArr,
    });

    setIsProductSaving(false);
    setEditingPerfume(null);
  };

  // Add New Product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameAr || !newPrice) return;
    setIsNewProductSaving(true);

    const slug = `sen-${newNameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-") || Date.now()}`;
    const topArr = newTopNotes.split(/[,،]+/).map((s) => s.trim()).filter(Boolean);
    const heartArr = newHeartNotes.split(/[,،]+/).map((s) => s.trim()).filter(Boolean);
    const baseArr = newBaseNotes.split(/[,،]+/).map((s) => s.trim()).filter(Boolean);

    await addProduct({
      id: slug,
      name: newNameEn.trim() || newNameAr.trim(),
      nameEn: newNameEn.trim() || newNameAr.trim(),
      nameAr: newNameAr.trim(),
      gender: newGender,
      genderAr: newGenderAr.trim(),
      taglineAr: newTaglineAr.trim() || "توليفة نيش استثنائية من دار SÈN",
      taglineEn: newNameEn.trim(),
      price: Number(newPrice),
      comparePrice: newComparePrice ? Number(newComparePrice) : undefined,
      volumeMl: 50,
      concentration: "Extrait de Parfum",
      oilPct: 20,
      topNotes: topArr.length > 0 ? topArr : ["برغموت إيطالي", "حمضيات نضرة"],
      heartNotes: heartArr.length > 0 ? heartArr : ["توابل دافئة", "زهور نقية"],
      baseNotes: baseArr.length > 0 ? baseArr : ["خشب الأرز", "عنبر ومسك"],
      sillage: "فوحان هائل ومؤثر",
      longevity: "ثبات يتجاوز 14 ساعة",
      image: newImage.trim(),
      descriptionAr: newDescriptionAr.trim() || "توليفة عطرية صُنعت بعناية لتعكس الرقي والأصالة الفرنسية.",
      descriptionEn: newDescriptionAr.trim(),
      rating: 4.9,
      reviewsCount: 1,
      stockQuantity: 50,
      inStock: true,
    });

    setIsNewProductSaving(false);
    setShowAddProductModal(false);
    setNewNameAr("");
    setNewNameEn("");
    setNewPrice(650);
    setNewComparePrice(undefined);
    setNewTaglineAr("");
    setNewDescriptionAr("");
    setNewTopNotes("");
    setNewHeartNotes("");
    setNewBaseNotes("");
  };

  // Add New Discount Code
  const handleCreateDiscountCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newDiscountValue) return;
    setIsDiscountSaving(true);

    const formattedCode = newCode.trim().toUpperCase().replace(/\s+/g, "");
    await createDiscountCode({
      code: formattedCode,
      discount_type: newDiscountType,
      discount_value: Number(newDiscountValue),
      min_order_amount: Number(newMinOrderAmount || 0),
      max_uses: Number(newMaxUses || 100),
      current_uses: 0,
      is_active: true,
    });

    setIsDiscountSaving(false);
    setShowAddDiscountModal(false);
    setNewCode("");
    setNewDiscountValue(15);
  };

  // Copy SQL script to clipboard
  const handleCopySql = () => {
    const sqlCode = `-- SÈN Haute Parfumerie - Products & Discount Codes Migration
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    tagline_ar TEXT,
    gender TEXT DEFAULT 'Unisex',
    gender_ar TEXT DEFAULT 'للجنسين',
    price NUMERIC(10, 2) NOT NULL DEFAULT 650.00,
    original_price NUMERIC(10, 2),
    image TEXT NOT NULL,
    description_ar TEXT,
    volume_ml INTEGER NOT NULL DEFAULT 50,
    concentration TEXT NOT NULL DEFAULT 'Extrait de Parfum',
    top_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
    heart_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
    base_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
    sillage TEXT NOT NULL DEFAULT 'فوحان استثنائي',
    longevity TEXT NOT NULL DEFAULT 'ثبات يفوق 14 ساعة',
    badge TEXT,
    rating NUMERIC(2, 1) DEFAULT 4.9,
    reviews_count INTEGER DEFAULT 120,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.discount_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('PERCENTAGE', 'FIXED')),
    discount_value NUMERIC(10, 2) NOT NULL,
    min_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    max_discount_amount NUMERIC(10, 2),
    is_active BOOLEAN NOT NULL DEFAULT true,
    max_uses INTEGER,
    current_uses INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin All Products" ON public.products FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Discounts" ON public.discount_codes FOR SELECT USING (true);
CREATE POLICY "Admin All Discounts" ON public.discount_codes FOR ALL USING (true) WITH CHECK (true);`;

    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
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
            مرحباً، <span className="text-[#E4C7A8] font-mono">{user?.email}</span> • تحكم شامل في الطلبات، كتالوج العطور، وأكواد الخصم
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAddOrderModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/50 transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>طلب يدوي</span>
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

      {/* Main Feature Tabs Navigation */}
      <div className="max-w-7xl mx-auto my-6 flex items-center gap-2 border-b border-zinc-800/80 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
            activeTab === "orders"
              ? "bg-[#C58652] text-[#0C0B0A] shadow-lg shadow-[#C58652]/20"
              : "bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>إدارة الطلبات ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
            activeTab === "products"
              ? "bg-[#C58652] text-[#0C0B0A] shadow-lg shadow-[#C58652]/20"
              : "bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>كتالوج العطور والأسعار ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("discounts")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
            activeTab === "discounts"
              ? "bg-[#C58652] text-[#0C0B0A] shadow-lg shadow-[#C58652]/20"
              : "bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>أكواد الخصم والعروض ({discountCodes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("sql")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
            activeTab === "sql"
              ? "bg-[#C58652] text-[#0C0B0A] shadow-lg shadow-[#C58652]/20"
              : "bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
        >
          <Code className="w-4 h-4" />
          <span>ربط سوبابيز (SQL Migration)</span>
        </button>
      </div>

      {/* Real Statistics Overview Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">
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

      {/* ===================================================================== */}
      {/* TAB 1: ORDERS MANAGEMENT */}
      {/* ===================================================================== */}
      {activeTab === "orders" && (
        <>
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
                            {order.discountCode && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 mt-1 rounded bg-[#C58652]/20 text-[#E4C7A8] text-[9px] font-mono">
                                <Tag className="w-2.5 h-2.5" />
                                {order.discountCode} (-{order.discountAmount || 0} ج.م)
                              </span>
                            )}
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
        </>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: PRODUCTS CATALOG & PRICING MANAGEMENT */}
      {/* ===================================================================== */}
      {activeTab === "products" && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-dark border border-zinc-800 rounded-3xl p-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C58652]" />
                <span>كتالوج العطور والمنتجات الحية</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                تعديل أسماء العطور، الأسعار الأصلية وأسعار الخصم، الأوصاف، الهرم العطري والصور بكل سهولة مع المزامنة مع سوبابيز
              </p>
            </div>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E4C7A8] via-[#D8B28C] to-[#C58652] text-[#0C0B0A] font-bold text-xs flex items-center gap-2 shadow-lg hover:brightness-105 transition-all self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة عطر جديد للكتالوج</span>
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => {
              const hasDiscount = p.comparePrice && p.comparePrice > p.price;
              const discountPct = hasDiscount
                ? Math.round(((p.comparePrice! - p.price) / p.comparePrice!) * 100)
                : 0;

              return (
                <div
                  key={p.id}
                  className="glass-dark border border-zinc-800 hover:border-[#C58652]/40 rounded-3xl p-5 flex flex-col justify-between transition-all group shadow-xl"
                >
                  <div>
                    {/* Top image & badges */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-zinc-900 border border-zinc-800">
                      <Image
                        src={p.image.startsWith("http") || p.image.startsWith("/") ? p.image : asset(p.image)}
                        alt={p.nameAr}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white border border-white/10">
                          {p.genderAr} • {p.volumeMl}ml
                        </span>
                        {hasDiscount && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/90 text-white font-bold text-[10px]">
                            خصم {discountPct}%
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-2.5 left-2.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md ${
                            p.inStock
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                          }`}
                        >
                          {p.inStock ? "متوفر للطلب" : "نفذت الكمية"}
                        </span>
                      </div>
                    </div>

                    {/* Titles & Prices */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-base font-bold text-white">{p.nameAr}</h3>
                        <span className="text-xs text-zinc-400 font-serif">{p.nameEn || p.name}</span>
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-bold text-[#E4C7A8] whitespace-nowrap">
                          {p.price} <span className="text-xs text-[#C58652]">ج.م</span>
                        </div>
                        {hasDiscount && (
                          <div className="text-xs text-zinc-500 line-through">
                            {p.comparePrice} ج.م
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tagline */}
                    <p className="text-xs text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
                      {p.taglineAr}
                    </p>

                    {/* Olfactory Pyramid Summary */}
                    <div className="space-y-1.5 py-3 border-y border-zinc-800/80 mb-4 text-[11px]">
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <span className="text-[#C58652] font-semibold shrink-0">القمة:</span>
                        <span className="text-zinc-400 truncate">{p.topNotes?.join(" • ") || "حمضيات"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <span className="text-[#C58652] font-semibold shrink-0">القلب:</span>
                        <span className="text-zinc-400 truncate">{p.heartNotes?.join(" • ") || "توابل وزهور"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <span className="text-[#C58652] font-semibold shrink-0">القاعدة:</span>
                        <span className="text-zinc-400 truncate">{p.baseNotes?.join(" • ") || "أخشاب وعنبر"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="flex-1 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-zinc-700"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#C58652]" />
                      <span>تعديل العطر والخصم</span>
                    </button>

                    <button
                      onClick={() => updateProduct(p.id, { inStock: !p.inStock })}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        p.inStock
                          ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30"
                          : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      }`}
                      title={p.inStock ? "إيقاف التوفر" : "تفعيل التوفر"}
                    >
                      {p.inStock ? "إيقاف" : "تفعيل"}
                    </button>

                    {!["sen-zeste", "sen-aura", "sen-duo-bundle"].includes(p.id) && (
                      <button
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من حذف ${p.nameAr} من الكتالوج؟`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                        title="حذف العطر"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: DISCOUNT CODES & PROMOTIONS ENGINE */}
      {/* ===================================================================== */}
      {activeTab === "discounts" && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-dark border border-zinc-800 rounded-3xl p-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#C58652]" />
                <span>محرك أكواد الخصم والعروض الترويجية</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                أنشئ كوبونات خصم بنسبة مئوية أو مبلغ ثابت بالجنيه، وحدد الحد الأدنى للطلب وأقصى عدد استخدامات
              </p>
            </div>
            <button
              onClick={() => setShowAddDiscountModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E4C7A8] via-[#D8B28C] to-[#C58652] text-[#0C0B0A] font-bold text-xs flex items-center gap-2 shadow-lg hover:brightness-105 transition-all self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إنشاء كود خصم جديد</span>
            </button>
          </div>

          {/* Discount Codes Table */}
          <div className="glass-dark border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4 font-semibold">كود الخصم</th>
                    <th className="py-3 px-4 font-semibold">قيمة الخصم</th>
                    <th className="py-3 px-4 font-semibold">الحد الأدنى للطلب</th>
                    <th className="py-3 px-4 font-semibold">الاستخدامات</th>
                    <th className="py-3 px-4 font-semibold">الحالة</th>
                    <th className="py-3 px-4 font-semibold text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {discountCodes.map((codeItem) => (
                    <tr key={codeItem.code} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-base text-[#E4C7A8] flex items-center gap-2">
                        <span>{codeItem.code}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(codeItem.code);
                            alert(`تم نسخ الكود: ${codeItem.code}`);
                          }}
                          className="p-1 rounded text-zinc-500 hover:text-white"
                          title="نسخ الكود"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {codeItem.discount_type === "PERCENTAGE" ? (
                          <span className="text-emerald-400">{codeItem.discount_value}% خصم</span>
                        ) : (
                          <span className="text-emerald-400">{codeItem.discount_value} ج.م خصم ثابت</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300">
                        {codeItem.min_order_amount > 0 ? `${codeItem.min_order_amount} ج.م` : "بدون حد أدنى"}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400 font-mono">
                        {codeItem.current_uses || 0} / {codeItem.max_uses ? codeItem.max_uses : "غير محدود"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            codeItem.is_active
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : "bg-zinc-800 text-zinc-400 border-zinc-700"
                          }`}
                        >
                          {codeItem.is_active ? "نشط وفعال" : "معطل"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => toggleDiscountCode(codeItem.code)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                              codeItem.is_active
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                            }`}
                          >
                            {codeItem.is_active ? "تعطيل" : "تفعيل"}
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف كود الخصم ${codeItem.code}؟`)) {
                                deleteDiscountCode(codeItem.code);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                            title="حذف الكود"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: SUPABASE SETUP SCRIPT */}
      {/* ===================================================================== */}
      {activeTab === "sql" && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="glass-dark border border-zinc-800 rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-[#C58652]" />
                  <span>سكربت تجهيز جداول المنتجات والأكواد في سوبابيز</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  إذا لم تكن قد أنشأت جدولي `products` و `discount_codes` في مشروع Supabase بعد، انسخ هذا الكود والصقه في الـ SQL Editor
                </p>
              </div>

              <button
                onClick={handleCopySql}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E4C7A8] via-[#D8B28C] to-[#C58652] text-[#0C0B0A] font-bold text-xs flex items-center gap-2 shadow-lg hover:brightness-105 transition-all self-start sm:self-auto"
              >
                {copiedSql ? (
                  <>
                    <CheckCheck className="w-4 h-4 text-emerald-950" />
                    <span>تم النسخ بنجاح!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>نسخ كود الـ SQL بنقرة واحدة</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto max-h-96 leading-relaxed" dir="ltr">
              <pre>{`-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    tagline_ar TEXT,
    gender TEXT DEFAULT 'Unisex',
    gender_ar TEXT DEFAULT 'للجنسين',
    price NUMERIC(10, 2) NOT NULL DEFAULT 650.00,
    original_price NUMERIC(10, 2),
    image TEXT NOT NULL,
    description_ar TEXT,
    volume_ml INTEGER NOT NULL DEFAULT 50,
    concentration TEXT NOT NULL DEFAULT 'Extrait de Parfum',
    top_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
    heart_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
    base_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
    sillage TEXT NOT NULL DEFAULT 'فوحان استثنائي',
    longevity TEXT NOT NULL DEFAULT 'ثبات يفوق 14 ساعة',
    badge TEXT,
    rating NUMERIC(2, 1) DEFAULT 4.9,
    reviews_count INTEGER DEFAULT 120,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create Discount Codes Table
CREATE TABLE IF NOT EXISTS public.discount_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('PERCENTAGE', 'FIXED')),
    discount_value NUMERIC(10, 2) NOT NULL,
    min_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    max_discount_amount NUMERIC(10, 2),
    is_active BOOLEAN NOT NULL DEFAULT true,
    max_uses INTEGER,
    current_uses INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Security & Row Level Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin All Products" ON public.products FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Discounts" ON public.discount_codes FOR SELECT USING (true);
CREATE POLICY "Admin All Discounts" ON public.discount_codes FOR ALL USING (true) WITH CHECK (true);`}</pre>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: EDIT PRODUCT MODAL */}
      {/* ===================================================================== */}
      {editingPerfume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-[#0f0f14] border border-[#C58652]/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-8">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#C58652]" />
                <span>تعديل بيانات العطر: {editingPerfume.nameAr}</span>
              </h3>
              <button
                onClick={() => setEditingPerfume(null)}
                className="w-8 h-8 rounded-full bg-zinc-900 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">الاسم بالعربية *</label>
                  <input
                    type="text"
                    required
                    value={editNameAr}
                    onChange={(e) => setEditNameAr(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#C58652]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">الاسم بالإنجليزية</label>
                  <input
                    type="text"
                    value={editNameEn}
                    onChange={(e) => setEditNameEn(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#C58652]"
                  />
                </div>
              </div>

              {/* Pricing & Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <div>
                  <label className="block text-[#E4C7A8] font-semibold mb-1">سعر البيع الحالي (ج.م) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:border-[#C58652]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">السعر الأصلي قبل الخصم (ج.م - اختياري)</label>
                  <input
                    type="number"
                    placeholder="مثال: 750 (ليظهر مشطوباً كخصم)"
                    value={editComparePrice || ""}
                    onChange={(e) => setEditComparePrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#C58652]"
                  />
                </div>
              </div>

              {/* Tagline & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">الفئة / التصنيف *</label>
                  <select
                    value={editGenderAr}
                    onChange={(e) => {
                      setEditGenderAr(e.target.value);
                      if (e.target.value === "رجالي") setEditGender("Homme");
                      else if (e.target.value === "نسائي") setEditGender("Femme");
                      else setEditGender("Duo");
                    }}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#C58652]"
                  >
                    <option value="رجالي">رجالي (Homme)</option>
                    <option value="نسائي">نسائي (Femme)</option>
                    <option value="للجنسين">للجنسين (Duo)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">الشعار القصير (Tagline)</label>
                  <input
                    type="text"
                    value={editTaglineAr}
                    onChange={(e) => setEditTaglineAr(e.target.value)}
                    placeholder="مثال: سطوة الانتعاش الإيطالي..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#C58652]"
                  />
                </div>
              </div>

              {/* Image Picker */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">صورة العطر</label>
                <div className="flex gap-2">
                  <select
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#C58652]"
                  >
                    {PRESET_IMAGES.map((img) => (
                      <option key={img.url} value={img.url}>
                        {img.label} ({img.url})
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="أو اكتب رابط مخصص: /images/example.webp أو https://..."
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-zinc-400 focus:outline-none focus:border-[#C58652]"
                />
              </div>

              {/* Olfactory Pyramid */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                <span className="font-semibold text-[#E4C7A8] block">الهرم العطري (مفصول بفاصلة)</span>
                <div>
                  <label className="block text-zinc-400 mb-1">قمة العطر (Top Notes)</label>
                  <input
                    type="text"
                    value={editTopNotes}
                    onChange={(e) => setEditTopNotes(e.target.value)}
                    placeholder="برغموت إيطالي, يوسفي صقلي..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#C58652]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">قلب العطر (Heart Notes)</label>
                  <input
                    type="text"
                    value={editHeartNotes}
                    onChange={(e) => setEditHeartNotes(e.target.value)}
                    placeholder="سكر مكرمل, توت العليق..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#C58652]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">قاعدة العطر (Base Notes)</label>
                  <input
                    type="text"
                    value={editBaseNotes}
                    onChange={(e) => setEditBaseNotes(e.target.value)}
                    placeholder="خشب الأرز, جلد مدبوغ, باتشولي..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#C58652]"
                  />
                </div>
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">الوصف الكامل للعطر</label>
                <textarea
                  rows={3}
                  value={editDescriptionAr}
                  onChange={(e) => setEditDescriptionAr(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#C58652]"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  disabled={isProductSaving}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#E4C7A8] via-[#D8B28C] to-[#C58652] text-[#0C0B0A] font-bold text-xs shadow-lg hover:brightness-105 disabled:opacity-50"
                >
                  {isProductSaving ? "جاري الحفظ في سوبابيز..." : "حفظ التعديلات"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPerfume(null)}
                  className="px-5 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: ADD NEW PRODUCT MODAL */}
      {/* ===================================================================== */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-[#0f0f14] border border-[#C58652]/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-8">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#C58652]" />
                <span>إضافة عطر جديد لدار SÈN</span>
              </h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="w-8 h-8 rounded-full bg-zinc-900 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">الاسم بالعربية *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: سِيان نوار (SÈN Noir)"
                    value={newNameAr}
                    onChange={(e) => setNewNameAr(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#C58652]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">الاسم بالإنجليزية</label>
                  <input
                    type="text"
                    placeholder="مثال: SÈN Noir"
                    value={newNameEn}
                    onChange={(e) => setNewNameEn(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#C58652]"
                  />
                </div>
              </div>

              {/* Pricing & Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <div>
                  <label className="block text-[#E4C7A8] font-semibold mb-1">سعر البيع (ج.م) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:border-[#C58652]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">السعر الأصلي قبل الخصم (ج.م - اختياري)</label>
                  <input
                    type="number"
                    placeholder="مثال: 800"
                    value={newComparePrice || ""}
                    onChange={(e) => setNewComparePrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#C58652]"
                  />
                </div>
              </div>

              {/* Tagline & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">الفئة / التصنيف *</label>
                  <select
                    value={newGenderAr}
                    onChange={(e) => {
                      setNewGenderAr(e.target.value);
                      if (e.target.value === "رجالي") setNewGender("Homme");
                      else if (e.target.value === "نسائي") setNewGender("Femme");
                      else setNewGender("Duo");
                    }}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#C58652]"
                  >
                    <option value="رجالي">رجالي (Homme)</option>
                    <option value="نسائي">نسائي (Femme)</option>
                    <option value="للجنسين">للجنسين (Duo)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">الشعار القصير (Tagline)</label>
                  <input
                    type="text"
                    value={newTaglineAr}
                    onChange={(e) => setNewTaglineAr(e.target.value)}
                    placeholder="سطوة الحضور والغموض الشرقي الآسر"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#C58652]"
                  />
                </div>
              </div>

              {/* Image Picker */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">صورة العطر</label>
                <select
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#C58652]"
                >
                  {PRESET_IMAGES.map((img) => (
                    <option key={img.url} value={img.url}>
                      {img.label} ({img.url})
                    </option>
                  ))}
                </select>
              </div>

              {/* Olfactory Pyramid */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                <span className="font-semibold text-[#E4C7A8] block">الهرم العطري (مفصول بفاصلة)</span>
                <div>
                  <label className="block text-zinc-400 mb-1">قمة العطر (Top Notes)</label>
                  <input
                    type="text"
                    value={newTopNotes}
                    onChange={(e) => setNewTopNotes(e.target.value)}
                    placeholder="هيل أسود, زعفران إيراني, برغموت"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#C58652]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">قلب العطر (Heart Notes)</label>
                  <input
                    type="text"
                    value={newHeartNotes}
                    onChange={(e) => setNewHeartNotes(e.target.value)}
                    placeholder="عود مدخن, ورد دمشقي, قهوة"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#C58652]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">قاعدة العطر (Base Notes)</label>
                  <input
                    type="text"
                    value={newBaseNotes}
                    onChange={(e) => setNewBaseNotes(e.target.value)}
                    placeholder="عنبر رمادي, باتشولي, مسك نقي"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#C58652]"
                  />
                </div>
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">الوصف الكامل للعطر</label>
                <textarea
                  rows={3}
                  value={newDescriptionAr}
                  onChange={(e) => setNewDescriptionAr(e.target.value)}
                  placeholder="صيغ هذا العطر ليعكس الهيبة والوقار..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#C58652]"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  disabled={isNewProductSaving}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#E4C7A8] via-[#D8B28C] to-[#C58652] text-[#0C0B0A] font-bold text-xs shadow-lg hover:brightness-105 disabled:opacity-50"
                >
                  {isNewProductSaving ? "جاري الإضافة لقاعدة البيانات..." : "إضافة العطر فورياً"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-5 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: ADD DISCOUNT CODE MODAL */}
      {/* ===================================================================== */}
      {showAddDiscountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f0f14] border border-[#C58652]/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#C58652]" />
                <span>إنشاء كود خصم جديد</span>
              </h3>
              <button
                onClick={() => setShowAddDiscountModal(false)}
                className="w-8 h-8 rounded-full bg-zinc-900 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDiscountCode} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">رمز الكوبون (الكود) *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: EID20 أو VIP100"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white font-mono uppercase tracking-wider focus:outline-none focus:border-[#C58652]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">نوع الخصم *</label>
                  <select
                    value={newDiscountType}
                    onChange={(e) => setNewDiscountType(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#C58652]"
                  >
                    <option value="PERCENTAGE">نسبة مئوية (%)</option>
                    <option value="FIXED">مبلغ ثابت (ج.م)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    {newDiscountType === "PERCENTAGE" ? "نسبة الخصم (%) *" : "قيمة الخصم (ج.م) *"}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newDiscountValue}
                    onChange={(e) => setNewDiscountValue(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:border-[#C58652]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">الحد الأدنى للطلب (ج.م)</label>
                  <input
                    type="number"
                    min={0}
                    value={newMinOrderAmount}
                    onChange={(e) => setNewMinOrderAmount(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#C58652]"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">أقصى عدد مرات استخدام</label>
                  <input
                    type="number"
                    min={1}
                    value={newMaxUses}
                    onChange={(e) => setNewMaxUses(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#C58652]"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  disabled={isDiscountSaving}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#E4C7A8] via-[#D8B28C] to-[#C58652] text-[#0C0B0A] font-bold text-xs shadow-lg hover:brightness-105 disabled:opacity-50"
                >
                  {isDiscountSaving ? "جاري الإنشاء في سوبابيز..." : "إنشاء الكوبون فورياً"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddDiscountModal(false)}
                  className="px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 4: MANUAL ORDER CREATION */}
      {/* ===================================================================== */}
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
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nameAr} ({p.price} ج.م)
                      </option>
                    ))}
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
