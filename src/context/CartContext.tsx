"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Perfume, PERFUMES } from "@/data/perfumes";
import {
  signInWithGoogle,
  signOut,
  supabase,
  saveOrderToSupabase,
  updateOrderStatusInSupabase,
  fetchOrdersFromSupabase,
  isSupabaseConfigured,
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
  orders: StoredOrder[];
  addToCart: (perfume: Perfume, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setLanguage: (lang: "ar" | "en") => void;
  loginWithGoogle: () => Promise<void>;
  logoutUser: () => Promise<void>;
  createOrder: (orderData: Omit<StoredOrder, "id" | "status" | "createdAt" | "paymentMethod">) => Promise<StoredOrder>;
  updateOrderStatus: (orderId: string, status: StoredOrder["status"]) => void;
  subtotal: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Initial mock orders to populate the Super Admin Dashboard with realistic data
const INITIAL_MOCK_ORDERS: StoredOrder[] = [
  {
    id: "SEN-1082",
    customerName: "أحمد الشناوي",
    phone: "01098765432",
    governorate: "القاهرة",
    address: "التجمع الخامس - حي النرجس - فيلا 42",
    items: [{ name: "باقة الثنائي الملكية (زيست + أورا)", quantity: 1, price: 1150 }],
    subtotal: 1150,
    shippingFee: 0,
    total: 1150,
    paymentMethod: "COD",
    status: "CONFIRMED",
    createdAt: "2026-10-19T18:40:00Z",
  },
  {
    id: "SEN-1081",
    customerName: "سارة المهندس",
    phone: "01234567890",
    governorate: "الإسكندرية",
    address: "سموحة - شارع فوزي معاذ - عمارة الأطباء",
    items: [{ name: "سِيان أورا (حريمي)", quantity: 1, price: 650 }],
    subtotal: 650,
    shippingFee: 45,
    total: 695,
    paymentMethod: "COD",
    status: "PENDING",
    createdAt: "2026-10-19T19:15:00Z",
  },
  {
    id: "SEN-1080",
    customerName: "محمود بدوي",
    phone: "01123456789",
    governorate: "الجيزة",
    address: "الشيخ زايد - بيفرلي هيلز - مجاورة 3",
    items: [{ name: "سِيان زيست (رجالي)", quantity: 2, price: 650 }],
    subtotal: 1300,
    shippingFee: 0,
    total: 1300,
    paymentMethod: "COD",
    status: "SHIPPED",
    createdAt: "2026-10-19T16:20:00Z",
  },
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [user, setUser] = useState<any | null>(null);
  const [orders, setOrders] = useState<StoredOrder[]>(INITIAL_MOCK_ORDERS);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("sen_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedOrders = localStorage.getItem("sen_orders");
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        localStorage.setItem("sen_orders", JSON.stringify(INITIAL_MOCK_ORDERS));
      }

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
    return () => window.removeEventListener("sen_auth_change", handleAuthChange);
  }, []);

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
    await signInWithGoogle();
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

    // Attempt to persist in Supabase if configured
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
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    await updateOrderStatusInSupabase(orderId, status);
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
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setIsOpen,
        setLanguage,
        loginWithGoogle,
        logoutUser,
        createOrder,
        updateOrderStatus,
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
