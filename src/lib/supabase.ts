import { createClient } from "@supabase/supabase-js";

export const SUPER_ADMIN_EMAILS = [
  "yo01009950871@gmail.com",
  "youssefbadawy5002@gmail.com",
];

export const SUPER_ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || "yo01009950871@gmail.com";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock-sen-project.supabase.co";
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

export const checkIsSuperAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return (
    SUPER_ADMIN_EMAILS.some((admin) => admin.toLowerCase() === normalized) ||
    normalized === SUPER_ADMIN_EMAIL.toLowerCase()
  );
};

// ==========================================
// Authentication Methods
// ==========================================

export async function signInWithGoogle() {
  if (!isSupabaseConfigured()) {
    const mockUser = {
      id: "usr_mock",
      email: SUPER_ADMIN_EMAIL,
      name: "يوسف بدوي (السوبر أدمن)",
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

export async function signInWithEmailPassword(email: string, password: string) {
  if (!isSupabaseConfigured()) {
    const mockUser = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      email: email.trim(),
      name: email.split("@")[0],
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("sen_auth_user", JSON.stringify(mockUser));
      window.dispatchEvent(new Event("sen_auth_change"));
    }
    return { data: { user: mockUser }, error: null };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (data?.user && typeof window !== "undefined") {
    localStorage.setItem("sen_auth_user", JSON.stringify(data.user));
    window.dispatchEvent(new Event("sen_auth_change"));
  }

  return { data, error };
}

export async function signUpWithEmailPassword(
  email: string,
  password: string,
  fullName: string,
  phone?: string
) {
  if (!isSupabaseConfigured()) {
    const mockUser = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      email: email.trim(),
      name: fullName.trim(),
      phone,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("sen_auth_user", JSON.stringify(mockUser));
      window.dispatchEvent(new Event("sen_auth_change"));
    }
    return { data: { user: mockUser }, error: null };
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: fullName.trim(),
        phone: phone || "",
      },
    },
  });

  if (data?.user) {
    // Upsert into public.profiles
    await supabase.from("profiles").upsert([
      {
        id: data.user.id,
        email: email.trim(),
        full_name: fullName.trim(),
        phone: phone || "",
        role: checkIsSuperAdmin(email) ? "super_admin" : "customer",
      },
    ]);

    if (typeof window !== "undefined") {
      localStorage.setItem("sen_auth_user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("sen_auth_change"));
    }
  }

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

// ==========================================
// Database Operations (Orders & Visitors)
// ==========================================

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
      .update({ status, updated_at: new Date().toISOString() })
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

// Real-time Visitor Tracking
export async function recordVisitorHeartbeat(page = "/") {
  if (typeof window === "undefined" || !isSupabaseConfigured()) return;
  try {
    let sessionId = sessionStorage.getItem("sen_session_id");
    if (!sessionId) {
      sessionId = "sess_" + Math.random().toString(36).substring(2, 12);
      sessionStorage.setItem("sen_session_id", sessionId);
    }

    await supabase.from("active_visitors").upsert([
      {
        session_id: sessionId,
        current_page: page,
        last_heartbeat: new Date().toISOString(),
      },
    ]);
  } catch {}
}

export async function fetchRealActiveVisitorsCount(): Promise<number> {
  if (!isSupabaseConfigured()) return 1;
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { count, error } = await supabase
      .from("active_visitors")
      .select("*", { count: "exact", head: true })
      .gte("last_heartbeat", fiveMinutesAgo);

    if (error || count === null) return 1;
    return Math.max(1, count);
  } catch {
    return 1;
  }
}
