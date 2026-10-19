"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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
  isSupabaseConfigured,
  checkIsSuperAdmin,
  recordVisitorHeartbeat,
} from "@/lib/supabase";

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
  paymentMethod: "COD";
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
}

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  language: "ar" | "en";
  user: any | null;
  isSuperAdmin: boolean;
  orders: StoredOrder[];
  addToCart: (perfume: Perfume, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setLanguage: (lang: "ar" | "en") => void;
  loginWithGoogle: () => Promise<{ error: any }>;
  loginWithEmail: (email: string, pass: string) => Promise<{ error: any }>;
  registerWithEmail: (email: string, pass: string, name: string, phone?: string) => Promise<{ error: any }>;
  logoutUser: () => Promise<void>;
  createOrder: (orderData: Omit<StoredOrder, "id" | "status" | "createdAt" | "paymentMethod">) => Promise<StoredOrder>;
  updateOrderStatus: (orderId: string, status: StoredOrder["status"]) => Promise<void>;
  refreshOrders: () => Promise<void>;
  subtotal: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [user, setUser] = useState<any | null>(null);
  const [orders, setOrders] = useState<StoredOrder[]>([]);

  const isSuperAdmin = checkIsSuperAdmin(user?.email);

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
    // 1. Load cart
    try {
      const savedCart = localStorage.getItem("sen_cart");
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch {}

    // 2. Load Real Orders only if on admin page or user is super admin to keep regular pages blazingly fast
    if (typeof window !== "undefined" && window.location.pathname.includes("/admin")) {
      loadRealOrders();
    }

    // 3. Heartbeat for real visitors (runs non-blocking)
    setTimeout(() => {
      recordVisitorHeartbeat(window.location.pathname);
    }, 100);
    const heartbeatInterval = setInterval(() => {
      recordVisitorHeartbeat(window.location.pathname);
    }, 60000);

    // 4. Load Auth User
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
    if (isSuperAdmin) {
      loadRealOrders();
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    try {
      localStorage.setItem("sen_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

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

  const clearCart = () => setCart([]);

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
    if (res.data?.user) setUser(res.data.user);
    return { error: res.error };
  };

  const logoutUser = async () => {
    await signOut();
    setUser(null);
  };

  const createOrder = async (orderData: Omit<StoredOrder, "id" | "status" | "createdAt" | "paymentMethod">) => {
    const orderNumber = `SEN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: StoredOrder = {
      ...orderData,
      id: orderNumber,
      status: "PENDING",
      paymentMethod: "COD",
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Persist in Supabase
    await saveOrderToSupabase({
      order_number: orderNumber,
      customer_name: orderData.customerName,
      phone: orderData.phone,
      governorate: orderData.governorate,
      address: orderData.address,
      notes: orderData.notes,
      items: orderData.items,
      subtotal: orderData.subtotal,
      shipping_fee: orderData.shippingFee,
      total_amount: orderData.total,
      payment_method: "COD",
      status: "PENDING",
    });

    clearCart();
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

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        language,
        user,
        isSuperAdmin,
        orders,
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
        subtotal,
        totalItems,
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
