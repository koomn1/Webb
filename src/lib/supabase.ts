import { createClient } from "@supabase/supabase-js";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "mock-anon-key-sen-parfums";

export const isSupabaseConfigured = () => {
  return (
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("mock-sen-project")
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export async function signInWithGoogle() {
  if (!isSupabaseConfigured()) {
    // Graceful fallback for local development if environment variables are not yet configured
    const mockUser = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      email: "youssefbadawy5002@gmail.com",
      name: "عميل دار SéN",
      avatar: "https://lh3.googleusercontent.com/a/default-user",
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("sen_auth_user", JSON.stringify(mockUser));
      window.dispatchEvent(new Event("sen_auth_change"));
    }
    return { data: { user: mockUser }, error: null };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
    },
  });

  return { data, error };
}

export async function signOut() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("sen_auth_user");
    window.dispatchEvent(new Event("sen_auth_change"));
  }
  if (isSupabaseConfigured()) {
    return await supabase.auth.signOut();
  }
  return { error: null };
}

// Database Operations
export interface SupabaseOrderPayload {
  order_number: string;
  customer_name: string;
  phone: string;
  governorate: string;
  address: string;
  notes?: string;
  items: any;
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  payment_method: "COD";
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
}

export async function saveOrderToSupabase(payload: SupabaseOrderPayload) {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from("orders").insert([payload]).select().single();
    if (error) {
      console.warn("Supabase insert order error:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("Supabase saveOrder exception:", err);
    return null;
  }
}

export async function fetchOrdersFromSupabase() {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("Supabase fetch orders error:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn("Supabase fetchOrders exception:", err);
    return [];
  }
}

export async function updateOrderStatusInSupabase(
  orderNumber: string,
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
) {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("order_number", orderNumber);
    if (error) {
      console.warn("Supabase update status error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase updateStatus exception:", err);
    return false;
  }
}
