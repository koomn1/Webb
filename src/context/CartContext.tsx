"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Perfume, PERFUMES } from "@/data/perfumes";
import {
  signInWithGoogle,
  signInWithEmailPassword,
  signUpWithEmailPassword,
  signOut,
  supabase,
  saveOrderToSupabase,
  updateOrderStatusInSupabase,
  fetchOrdersFromSupabase,
  fetchProductsFromSupabase,
  saveProductToSupabase,
  deleteProductFromSupabase,
  fetchDiscountCodesFromSupabase,
  saveDiscountCodeToSupabase,
  deleteDiscountCodeFromSupabase,
  SupabaseProduct,
  SupabaseDiscountCode,
  isSupabaseConfigured,
  checkIsSuperAdmin,
  recordVisitorHeartbeat,
} from "@/lib/supabase";
import { appLink, asset } from "@/lib/paths";

export interface CartItem {
  id: string; // perfumeId
  perfume: Perfume;
  quantity: number;
  unitPrice: number;
}

export interface StoredOrder {
  id: string; // e.g. "SEN-1049"
  customerName: string;
  phone: string;
  governorate: string;
  address: string;
  notes?: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  discountCode?: string;
  discountAmount?: number;
  paymentMethod: "COD";
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
}

export interface AppliedDiscount {
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  amount: number;
}

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  language: "ar" | "en";
  user: any | null;
  isSuperAdmin: boolean;
  orders: StoredOrder[];
  products: Perfume[];
  discountCodes: SupabaseDiscountCode[];
  appliedDiscount: AppliedDiscount | null;
  subtotal: number;
  discountAmount: number;
  totalAfterDiscount: number;
  totalItems: number;
  addToCart: (perfume: Perfume, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setLanguage: (lang: "ar" | "en") => void;
  loginWithGoogle: () => Promise<{ error: any }>;
  loginWithEmail: (email: string, pass: string) => Promise<{ error: any }>;
  registerWithEmail: (email: string, pass: string, name: string, phone?: string) => Promise<{ error: any; needsEmailConfirmation: boolean }>;
  logoutUser: () => Promise<void>;
  createOrder: (orderData: Omit<StoredOrder, "id" | "status" | "createdAt" | "paymentMethod">) => Promise<StoredOrder>;
  updateOrderStatus: (orderId: string, status: StoredOrder["status"]) => Promise<void>;
  refreshOrders: () => Promise<void>;
  // Dynamic Product Management (Supabase + Local)
  updateProduct: (id: string, updates: Partial<Perfume>) => Promise<boolean>;
  addProduct: (newPerfume: Omit<Perfume, "slug">) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  refreshProducts: () => Promise<void>;
  // Discount Engine
  applyDiscountCode: (codeString: string) => { success: boolean; message: string; discountAmount?: number };
  removeDiscountCode: () => void;
  createDiscountCode: (newCode: SupabaseDiscountCode) => Promise<boolean>;
  deleteDiscountCode: (code: string) => Promise<boolean>;
  toggleDiscountCode: (code: string) => Promise<boolean>;
  refreshDiscountCodes: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Initial fallback discount codes
const DEFAULT_DISCOUNT_CODES: SupabaseDiscountCode[] = [
  {
    code: "SEN10",
    discount_type: "PERCENTAGE",
    discount_value: 10,
    min_order_amount: 500,
    is_active: true,
    current_uses: 12,
    max_uses: 500,
  },
  {
    code: "VIP50",
    discount_type: "FIXED",
    discount_value: 50,
    min_order_amount: 600,
    is_active: true,
    current_uses: 28,
    max_uses: 200,
  },
  {
    code: "ROYAL15",
    discount_type: "PERCENTAGE",
    discount_value: 15,
    min_order_amount: 1000,
    is_active: true,
    current_uses: 5,
    max_uses: 100,
  },
];

// Helper to convert DB SupabaseProduct to App Perfume
function toAppPerfume(sp: SupabaseProduct): Perfume {
  return {
    id: sp.id,
    slug: sp.id,
    name: sp.name,
    nameEn: sp.name,
    nameAr: sp.name_ar,
    gender: sp.gender as any,
    genderAr: sp.gender_ar,
    taglineAr: sp.tagline_ar,
    taglineEn: sp.tagline_ar,
    price: Number(sp.price),
    comparePrice: sp.original_price ? Number(sp.original_price) : undefined,
    volumeMl: sp.volume_ml,
    concentration: sp.concentration,
    oilPct: 20,
    topNotes: Array.isArray(sp.top_notes) ? sp.top_notes : [],
    heartNotes: Array.isArray(sp.heart_notes) ? sp.heart_notes : [],
    baseNotes: Array.isArray(sp.base_notes) ? sp.base_notes : [],
    sillage: sp.sillage,
    longevity: sp.longevity,
    image: sp.image.startsWith("http") || sp.image.startsWith("/") || sp.image.startsWith("data:") ? sp.image : asset(sp.image),
    descriptionAr: sp.description_ar,
    descriptionEn: sp.description_ar,
    rating: sp.rating ? Number(sp.rating) : 4.9,
    reviewsCount: sp.reviews_count ? Number(sp.reviews_count) : 120,
    badge: sp.badge,
    stockQuantity: 50,
    inStock: sp.is_available,
  };
}

// Helper to convert Perfume to SupabaseProduct
function toDbProduct(p: Perfume): SupabaseProduct {
  return {
    id: p.id,
    name: p.name,
    name_ar: p.nameAr,
    tagline_ar: p.taglineAr,
    gender: p.gender,
    gender_ar: p.genderAr,
    price: p.price,
    original_price: p.comparePrice,
    image: p.image,
    description_ar: p.descriptionAr,
    volume_ml: p.volumeMl,
    concentration: p.concentration,
    top_notes: p.topNotes,
    heart_notes: p.heartNotes,
    base_notes: p.baseNotes,
    sillage: p.sillage,
    longevity: p.longevity,
    badge: p.badge,
    rating: p.rating,
    reviews_count: p.reviewsCount,
    is_available: p.inStock,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [user, setUser] = useState<any | null>(null);
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [products, setProducts] = useState<Perfume[]>(PERFUMES);
  const [discountCodes, setDiscountCodes] = useState<SupabaseDiscountCode[]>(DEFAULT_DISCOUNT_CODES);
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);

  const isSuperAdmin = checkIsSuperAdmin(user?.email);

  // Load dynamic products from Supabase + localStorage
  const loadDynamicProducts = async () => {
    let baseList = [...PERFUMES];

    // Check localStorage overrides first
    try {
      const localCustom = localStorage.getItem("sen_custom_products");
      if (localCustom) {
        const parsed: Perfume[] = JSON.parse(localCustom);
        if (Array.isArray(parsed) && parsed.length > 0) {
          baseList = parsed;
        }
      }
    } catch {}

    // Then check Supabase
    if (isSupabaseConfigured()) {
      try {
        const sbProducts = await fetchProductsFromSupabase();
        if (sbProducts && sbProducts.length > 0) {
          const mapped = sbProducts.map(toAppPerfume);
          setProducts(mapped);
          try {
            localStorage.setItem("sen_custom_products", JSON.stringify(mapped));
          } catch {}
          return;
        }
      } catch {}
    }

    setProducts(baseList);
  };

  // Load discount codes from Supabase + localStorage
  const loadDiscountCodes = async () => {
    let list = [...DEFAULT_DISCOUNT_CODES];
    try {
      const savedCodes = localStorage.getItem("sen_discount_codes");
      if (savedCodes) {
        list = JSON.parse(savedCodes);
      }
    } catch {}

    if (isSupabaseConfigured()) {
      try {
        const sbCodes = await fetchDiscountCodesFromSupabase();
        // An empty array is a valid database result: all codes may have been deleted.
        // Only keep local fallback data when the database request itself failed (null).
        if (sbCodes !== null) {
          list = sbCodes;
          try {
            localStorage.setItem("sen_discount_codes", JSON.stringify(sbCodes));
          } catch {}
        }
      } catch {}
    }

    setDiscountCodes(list);
  };

  const loadRealOrders = async () => {
    if (isSupabaseConfigured()) {
      const sbOrders = await fetchOrdersFromSupabase();
      if (sbOrders) {
        const formatted: StoredOrder[] = sbOrders.map((o: any) => ({
          id: o.order_number,
          customerName: o.customer_name,
          phone: o.phone,
          governorate: o.governorate,
          address: o.address,
          notes: o.notes,
          items: Array.isArray(o.items) ? o.items : [],
          subtotal: Number(o.subtotal || 0),
          shippingFee: Number(o.shipping_fee || 0),
          total: Number(o.total_amount || 0),
          discountCode: o.discount_code,
          discountAmount: o.discount_amount ? Number(o.discount_amount) : undefined,
          paymentMethod: "COD",
          status: o.status || "PENDING",
          createdAt: o.created_at,
        }));
        setOrders(formatted);
        return;
      }
    }

    try {
      const savedOrders = localStorage.getItem("sen_orders");
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    loadDynamicProducts();
    loadDiscountCodes();

    // Load active discount from session
    try {
      const savedDisc = sessionStorage.getItem("sen_applied_discount");
      if (savedDisc) setAppliedDiscount(JSON.parse(savedDisc));
    } catch {}

    // Check admin orders
    if (typeof window !== "undefined" && window.location.pathname.includes("/admin")) {
      loadRealOrders();
    }

    // Heartbeat
    setTimeout(() => {
      recordVisitorHeartbeat(window.location.pathname);
    }, 100);
    const heartbeatInterval = setInterval(() => {
      recordVisitorHeartbeat(window.location.pathname);
    }, 60000);

    // Auth
    if (isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          try {
            const savedUser = localStorage.getItem("sen_auth_user");
            if (savedUser) setUser(JSON.parse(savedUser));
          } catch {}
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          localStorage.setItem("sen_auth_user", JSON.stringify(session.user));
        } else {
          localStorage.removeItem("sen_auth_user");
        }
      });

      return () => {
        clearInterval(heartbeatInterval);
        authListener.subscription.unsubscribe();
      };
    } else {
      try {
        const savedUser = localStorage.getItem("sen_auth_user");
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch {}

      const handleAuthChange = () => {
        try {
          const u = localStorage.getItem("sen_auth_user");
          setUser(u ? JSON.parse(u) : null);
        } catch {}
      };
      window.addEventListener("sen_auth_change", handleAuthChange);
      return () => {
        clearInterval(heartbeatInterval);
        window.removeEventListener("sen_auth_change", handleAuthChange);
      };
    }
  }, []);

  useEffect(() => {
    if (user || isSuperAdmin) {
      loadRealOrders();
    }
  }, [user, isSuperAdmin]);

  // Scoped Cart
  const getCartKey = (u?: any | null) => {
    if (u?.email) return `sen_cart_${u.email.trim().toLowerCase()}`;
    if (u?.id) return `sen_cart_${u.id}`;
    return "sen_cart_guest";
  };

  useEffect(() => {
    const key = getCartKey(user);
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setCart(JSON.parse(saved));
      } else if (user) {
        const guestCart = localStorage.getItem("sen_cart_guest") || localStorage.getItem("sen_cart");
        if (guestCart) {
          const parsed = JSON.parse(guestCart);
          setCart(parsed);
          localStorage.setItem(key, guestCart);
        } else {
          setCart([]);
        }
      } else {
        const guestCart = localStorage.getItem("sen_cart_guest") || localStorage.getItem("sen_cart");
        if (guestCart) setCart(JSON.parse(guestCart));
        else setCart([]);
      }
    } catch {
      setCart([]);
    }
  }, [user]);

  useEffect(() => {
    const key = getCartKey(user);
    try {
      localStorage.setItem(key, JSON.stringify(cart));
      if (!user) localStorage.setItem("sen_cart", JSON.stringify(cart));
    } catch {}
  }, [cart, user]);

  useEffect(() => {
    try {
      localStorage.setItem("sen_orders", JSON.stringify(orders));
    } catch {}
  }, [orders]);

  const addToCart = (perfume: Perfume, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === perfume.id);
      if (existing) {
        return prev.map((item) =>
          item.id === perfume.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id: perfume.id, perfume, quantity, unitPrice: perfume.price }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    const key = getCartKey(user);
    try {
      localStorage.removeItem(key);
    } catch {}
  };

  // Subtotal & Discounts Calculation
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (!appliedDiscount || subtotal <= 0) return 0;
    if (appliedDiscount.type === "PERCENTAGE") {
      const calculated = Math.round((subtotal * appliedDiscount.value) / 100);
      return calculated;
    }
    return Math.min(subtotal, appliedDiscount.value);
  }, [appliedDiscount, subtotal]);

  const totalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Discount Codes Engine
  const applyDiscountCode = (codeString: string) => {
    const clean = codeString.trim().toUpperCase();
    if (!clean) {
      return { success: false, message: "يرجى كتابة كود الخصم أولاً." };
    }

    const matched = discountCodes.find(
      (c) => c.code.toUpperCase() === clean && c.is_active
    );

    if (!matched) {
      return { success: false, message: "كود الخصم غير صحيح أو انتهت صلاحيته." };
    }

    if (matched.max_uses !== undefined && matched.max_uses !== null && matched.current_uses >= matched.max_uses) {
      return { success: false, message: "كود الخصم استنفد عدد مرات الاستخدام المتاح." };
    }

    if (matched.min_order_amount && subtotal < matched.min_order_amount) {
      return {
        success: false,
        message: `الحد الأدنى لتطبيق هذا الكود هو ${matched.min_order_amount} ج.م (مجموعك الحالي: ${subtotal} ج.م)`,
      };
    }

    let calculatedDiscount = 0;
    if (matched.discount_type === "PERCENTAGE") {
      calculatedDiscount = Math.round((subtotal * matched.discount_value) / 100);
    } else {
      calculatedDiscount = Math.min(subtotal, matched.discount_value);
    }

    const discObj: AppliedDiscount = {
      code: matched.code,
      type: matched.discount_type,
      value: matched.discount_value,
      amount: calculatedDiscount,
    };

    setAppliedDiscount(discObj);
    try {
      sessionStorage.setItem("sen_applied_discount", JSON.stringify(discObj));
    } catch {}

    return {
      success: true,
      message:
        matched.discount_type === "PERCENTAGE"
          ? `تم تطبيق كود (${matched.code}) بنجاح! خصم ${matched.discount_value}%`
          : `تم تطبيق كود (${matched.code}) بنجاح! خصم ${matched.discount_value} ج.م`,
      discountAmount: calculatedDiscount,
    };
  };

  const removeDiscountCode = () => {
    setAppliedDiscount(null);
    try {
      sessionStorage.removeItem("sen_applied_discount");
    } catch {}
  };

  const createDiscountCode = async (newCode: SupabaseDiscountCode) => {
    const saved = await saveDiscountCodeToSupabase(newCode);
    if (isSupabaseConfigured() && !saved) return false;
    const updated = [newCode, ...discountCodes.filter((c) => c.code !== newCode.code)];
    setDiscountCodes(updated);
    try {
      localStorage.setItem("sen_discount_codes", JSON.stringify(updated));
    } catch {}
    return true;
  };

  const deleteDiscountCode = async (code: string) => {
    const deleted = await deleteDiscountCodeFromSupabase(code);
    if (isSupabaseConfigured() && !deleted) return false;
    const updated = discountCodes.filter((c) => c.code !== code);
    setDiscountCodes(updated);
    try {
      localStorage.setItem("sen_discount_codes", JSON.stringify(updated));
    } catch {}
    return true;
  };

  const toggleDiscountCode = async (code: string) => {
    const found = discountCodes.find((c) => c.code === code);
    if (!found) return false;
    const toggled = { ...found, is_active: !found.is_active };
    const saved = await saveDiscountCodeToSupabase(toggled);
    if (isSupabaseConfigured() && !saved) return false;
    const updated = discountCodes.map((c) => (c.code === code ? toggled : c));
    setDiscountCodes(updated);
    try {
      localStorage.setItem("sen_discount_codes", JSON.stringify(updated));
    } catch {}
    return true;
  };

  const refreshDiscountCodes = async () => {
    await loadDiscountCodes();
  };

  // Product Management Functions
  const updateProduct = async (id: string, updates: Partial<Perfume>): Promise<boolean> => {
    const updatedList = products.map((p) => {
      if (p.id === id) {
        return { ...p, ...updates };
      }
      return p;
    });

    setProducts(updatedList);
    try {
      localStorage.setItem("sen_custom_products", JSON.stringify(updatedList));
    } catch {}

    const target = updatedList.find((p) => p.id === id);
    if (target) {
      await saveProductToSupabase(toDbProduct(target));
    }
    return true;
  };

  const addProduct = async (newPerfume: Omit<Perfume, "slug">): Promise<boolean> => {
    const fullPerfume: Perfume = {
      ...newPerfume,
      slug: newPerfume.id,
    };
    const updatedList = [fullPerfume, ...products];
    setProducts(updatedList);
    try {
      localStorage.setItem("sen_custom_products", JSON.stringify(updatedList));
    } catch {}

    await saveProductToSupabase(toDbProduct(fullPerfume));
    return true;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    const updatedList = products.filter((p) => p.id !== id);
    setProducts(updatedList);
    try {
      localStorage.setItem("sen_custom_products", JSON.stringify(updatedList));
    } catch {}

    await deleteProductFromSupabase(id);
    return true;
  };

  const refreshProducts = async () => {
    await loadDynamicProducts();
  };

  // Auth Functions
  const loginWithGoogle = async () => {
    const res = await signInWithGoogle();
    if (res.data && "user" in res.data && (res.data as any).user) {
      setUser((res.data as any).user);
    }
    return { error: res.error };
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const res = await signInWithEmailPassword(email, pass);
    if (res.data?.user) setUser(res.data.user);
    return { error: res.error };
  };

  const registerWithEmail = async (email: string, pass: string, name: string, phone?: string) => {
    const res = await signUpWithEmailPassword(email, pass, name, phone);
    const session = "session" in (res.data || {}) ? res.data.session : null;
    if (session?.user) setUser(session.user);
    return {
      error: res.error,
      needsEmailConfirmation: Boolean(res.data?.user && !session),
    };
  };

  const logoutUser = async () => {
    try {
      await signOut();
    } catch {}
    setUser(null);
    try {
      localStorage.removeItem("sen_auth_user");
    } catch {}

    if (typeof window !== "undefined") {
      if (window.location.pathname.includes("/admin")) {
        window.location.href = appLink("/");
      } else {
        window.location.reload();
      }
    }
  };

  const createOrder = async (orderData: Omit<StoredOrder, "id" | "status" | "createdAt" | "paymentMethod">) => {
    const savedOrder = await saveOrderToSupabase({
      customer_name: orderData.customerName,
      phone: orderData.phone,
      governorate: orderData.governorate,
      address: orderData.address,
      notes: orderData.notes,
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
      discount_code: appliedDiscount?.code,
    });
    if (isSupabaseConfigured() && !savedOrder) {
      throw new Error("لم تُرجع قاعدة البيانات رقم الطلب. لم يتم تأكيد الطلب، حاول مرة أخرى.");
    }

    const orderNumber = savedOrder?.order_number || `SEN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: StoredOrder = {
      ...orderData,
      id: orderNumber,
      subtotal: savedOrder ? Number(savedOrder.subtotal) : orderData.subtotal,
      shippingFee: savedOrder ? Number(savedOrder.shipping_fee) : orderData.shippingFee,
      total: savedOrder ? Number(savedOrder.total_amount) : orderData.total,
      discountCode: savedOrder?.discount_code || appliedDiscount?.code,
      discountAmount: savedOrder ? Number(savedOrder.discount_amount || 0) : discountAmount,
      status: savedOrder?.status || "PENDING",
      paymentMethod: "COD",
      createdAt: savedOrder?.created_at || new Date().toISOString(),
    };

    if (savedOrder?.discount_code) {
      setDiscountCodes((prev) => {
        const updated = prev.map((code) =>
          code.code.toUpperCase() === savedOrder.discount_code.toUpperCase()
            ? { ...code, current_uses: code.current_uses + 1 }
            : code
        );
        try {
          localStorage.setItem("sen_discount_codes", JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    removeDiscountCode();
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: StoredOrder["status"]) => {
    if (!isSuperAdmin) {
      console.warn("Strict Security: Only Super Admin can update order status.");
      return;
    }
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    await updateOrderStatusInSupabase(orderId, status, user?.email);
  };

  const refreshOrders = async () => {
    await loadRealOrders();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        language,
        user,
        isSuperAdmin,
        orders,
        products,
        discountCodes,
        appliedDiscount,
        subtotal,
        discountAmount,
        totalAfterDiscount,
        totalItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setIsOpen,
        setLanguage,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logoutUser,
        createOrder,
        updateOrderStatus,
        refreshOrders,
        updateProduct,
        addProduct,
        deleteProduct,
        refreshProducts,
        applyDiscountCode,
        removeDiscountCode,
        createDiscountCode,
        deleteDiscountCode,
        toggleDiscountCode,
        refreshDiscountCodes,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
