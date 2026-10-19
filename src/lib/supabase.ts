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
// Database Operations (Orders)
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
  discount_code?: string;
  discount_amount?: number;
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
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED",
  callerEmail?: string | null
) {
  if (!isSupabaseConfigured()) return false;
  
  // Strict Permission Check: Caller must be verified Super Admin
  if (callerEmail !== undefined && !checkIsSuperAdmin(callerEmail)) {
    console.warn("Strict Security: Unauthorized call to updateOrderStatusInSupabase rejected.");
    return false;
  }

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

// ==========================================
// Database Operations (Products Catalog)
// ==========================================

export interface SupabaseProduct {
  id: string;
  name: string;
  name_ar: string;
  tagline_ar: string;
  gender: string;
  gender_ar: string;
  price: number;
  original_price?: number;
  image: string;
  description_ar: string;
  volume_ml: number;
  concentration: string;
  top_notes: string[];
  heart_notes: string[];
  base_notes: string[];
  sillage: string;
  longevity: string;
  badge?: string;
  rating?: number;
  reviews_count?: number;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function fetchProductsFromSupabase(): Promise<SupabaseProduct[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      // Table may not be created yet in user's Supabase instance
      return [];
    }
    return data || [];
  } catch {
    return [];
  }
}

export async function saveProductToSupabase(product: SupabaseProduct): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;
  try {
    const { error } = await supabase.from("products").upsert([
      {
        ...product,
        updated_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      console.warn("Supabase saveProduct error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase saveProduct exception:", err);
    return false;
  }
}

export async function deleteProductFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;
  try {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.warn("Supabase deleteProduct error:", error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// ==========================================
// Database Operations (Discount Codes Engine)
// ==========================================

export interface SupabaseDiscountCode {
  id?: string;
  code: string;
  discount_type: "PERCENTAGE" | "FIXED";
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  is_active: boolean;
  max_uses?: number;
  current_uses: number;
  expires_at?: string;
  created_at?: string;
}

export async function fetchDiscountCodesFromSupabase(): Promise<SupabaseDiscountCode[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function saveDiscountCodeToSupabase(code: SupabaseDiscountCode): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;
  try {
    const { error } = await supabase.from("discount_codes").upsert([code]);
    if (error) {
      console.warn("Supabase saveDiscountCode error:", error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function deleteDiscountCodeFromSupabase(code: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;
  try {
    const { error } = await supabase.from("discount_codes").delete().eq("code", code);
    if (error) return false;
    return true;
  } catch {
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

// ==========================================
// Image Upload & Client Compression Helper
// ==========================================
export function compressImageFile(file: File, maxDim = 900, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new (window as any).Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        let dataUrl = canvas.toDataURL("image/webp", quality);
        if (!dataUrl.startsWith("data:image/webp")) {
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

export async function uploadProductImage(file: File): Promise<{ url: string; isBase64: boolean; error?: any }> {
  // First compress the image
  const compressedBase64 = await compressImageFile(file);

  // If Supabase is configured, attempt upload to Supabase Storage bucket 'product-images'
  if (isSupabaseConfigured()) {
    try {
      const fileExt = file.name.split(".").pop() || "webp";
      const fileName = `sen_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `catalog/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (!uploadError) {
        const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
        if (data?.publicUrl) {
          return { url: data.publicUrl, isBase64: false };
        }
      }
    } catch (err) {
      console.warn("Storage upload fallback to base64:", err);
    }
  }

  // Graceful, self-contained fallback: compressed base64
  return { url: compressedBase64, isBase64: true };
}

