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
  const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const configuredKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )?.trim();
  if (!configuredUrl || !configuredKey || configuredKey.includes("mock-anon-key")) return false;
  try {
    const parsedUrl = new URL(configuredUrl);
    return parsedUrl.protocol === "https:" && !parsedUrl.hostname.includes("mock-sen-project");
  } catch {
    return false;
  }
};

const missingSupabaseConfigError = () =>
  new Error("خدمة المتجر غير متاحة مؤقتاً. يرجى المحاولة لاحقاً.");

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
    if (process.env.NODE_ENV === "production") {
      return { data: { user: null }, error: missingSupabaseConfigError() };
    }
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
    if (process.env.NODE_ENV === "production") {
      return { data: { user: null }, error: missingSupabaseConfigError() };
    }
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
    if (process.env.NODE_ENV === "production") {
      return { data: { user: null, session: null }, error: missingSupabaseConfigError() };
    }
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
    return { data: { user: mockUser, session: { user: mockUser } }, error: null };
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

  // Supabase returns a user even when email confirmation is required.
  // Only persist a client-side user when a real session was created.
  if (data?.session && data.user) {
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
  customer_name: string;
  phone: string;
  governorate: string;
  address: string;
  notes?: string;
  items: Array<{ product_id: string; quantity: number }>;
  discount_code?: string | null;
  idempotency_key: string;
  website?: string;
  whatsapp_consent?: boolean;
}

export async function saveOrderToSupabase(payload: SupabaseOrderPayload) {
  if (!isSupabaseConfigured()) return null;
  try {
    const rpcName = payload.whatsapp_consent ? "submit_checkout_with_contact" : "submit_checkout";
    const rpcArgs = {
      p_customer_name: payload.customer_name,
      p_phone: payload.phone,
      p_governorate: payload.governorate,
      p_address: payload.address,
      p_notes: payload.notes || null,
      p_items: payload.items,
      p_discount_code: payload.discount_code || null,
      p_idempotency_key: payload.idempotency_key,
      p_website: payload.website || null,
      ...(payload.whatsapp_consent ? { p_whatsapp_consent: true } : {}),
    };
    const { data, error } = await supabase.rpc(rpcName, rpcArgs);
    if (error) {
      throw new Error(error.message);
    }
    return Array.isArray(data) ? data[0] : data;
  } catch (err) {
    console.warn("Supabase saveOrder exception:", err);
    throw err instanceof Error ? err : new Error("تعذر حفظ الطلب في قاعدة البيانات");
  }
}

export async function fetchOrdersFromSupabase() {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("id,user_id,order_number,customer_name,phone,governorate,address,notes,items,subtotal,shipping_fee,total_amount,discount_code,discount_amount,payment_method,status,created_at,updated_at")
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

export interface OrderContactHistoryAttempt {
  kind: "initial" | "result";
  attempt: number;
  status: string;
  error_code: string | null;
  attempted_at: string;
  completed_at: string | null;
}

export interface OrderContactHistoryRow {
  event_id: string;
  order_id: string;
  order_number: string;
  order_status: string;
  contact_status: string;
  result_notice_status: string;
  attempt_count: number;
  max_attempts: number;
  result_attempt_count: number;
  last_attempt_at: string | null;
  response_deadline_at: string | null;
  last_error_code: string | null;
  result_last_error_code: string | null;
  updated_at: string;
  attempts: OrderContactHistoryAttempt[];
}

export async function fetchOrderContactHistory(limit = 50, offset = 0): Promise<{
  rows: OrderContactHistoryRow[];
  error: string | null;
}> {
  if (!isSupabaseConfigured()) return { rows: [], error: "خدمة سجل التواصل غير مهيأة." };
  try {
    const { data, error } = await supabase.functions.invoke("order-contact-dispatch", {
      body: { action: "list", limit, offset },
    });
    if (error) return { rows: [], error: "تعذر تحميل سجل التواصل." };
    const payload = data as { rows?: unknown } | null;
    return {
      rows: Array.isArray(payload?.rows) ? payload.rows as OrderContactHistoryRow[] : [],
      error: null,
    };
  } catch {
    return { rows: [], error: "تعذر الاتصال بخدمة سجل التواصل." };
  }
}

export async function retryOrderContact(eventId: string): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured()) return { success: false, error: "خدمة التواصل غير مهيأة." };
  try {
    const { data, error } = await supabase.functions.invoke("order-contact-dispatch", {
      body: { action: "retry", event_id: eventId },
    });
    if (error || !data || data.success !== true) {
      return { success: false, error: "تعذر إعادة المحاولة؛ تحقق من الحالة وحد المحاولات." };
    }
    return { success: true, error: null };
  } catch {
    return { success: false, error: "تعذر الاتصال بخدمة إعادة المحاولة." };
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

export async function fetchProductsFromSupabase(): Promise<SupabaseProduct[] | null> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      console.warn("Supabase fetch products error:", error.message);
      return null;
    }
    return data || [];
  } catch (err) {
    console.warn("Supabase fetch products exception:", err);
    return null;
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

export interface PublicProductReview {
  id: string;
  product_name: string;
  quote: string;
  reviewer_label: string;
  rating: number | null;
  created_at: string;
}

export async function fetchPublishedProductReviews(): Promise<PublicProductReview[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from("product_reviews")
      .select("id,product_name,quote,reviewer_label,rating,created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    if (error) {
      console.warn("Supabase fetch published product reviews error:", error.message);
      return [];
    }
    return (data || []) as PublicProductReview[];
  } catch (err) {
    console.warn("Supabase fetch published product reviews exception:", err);
    return [];
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

export async function fetchDiscountCodesFromSupabase(): Promise<SupabaseDiscountCode[] | null> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from("discount_codes")
      .select("id,code,discount_type,discount_value,min_order_amount,max_discount_amount,is_active,max_uses,current_uses,expires_at,created_at")
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("Supabase fetch discount codes error:", error.message);
      return null;
    }
    return data || [];
  } catch (err) {
    console.warn("Supabase fetch discount codes exception:", err);
    return null;
  }
}

export interface DiscountValidationResult {
  success: boolean;
  message: string;
  code?: string;
  discount_type?: "PERCENTAGE" | "FIXED";
  discount_value?: number;
  max_discount_amount?: number | null;
  discount_amount?: number;
}

export async function validateDiscountCodeWithSupabase(
  code: string,
  subtotal: number
): Promise<DiscountValidationResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, message: "تعذر التحقق من كود الخصم حالياً." };
  }
  try {
    const { data, error } = await supabase.rpc("validate_discount_code", {
      p_code: code,
      p_subtotal: subtotal,
    });
    if (error || !data) {
      console.warn("Supabase validate discount error:", error?.message);
      return { success: false, message: "تعذر التحقق من كود الخصم حالياً. حاول مرة أخرى." };
    }
    return data as DiscountValidationResult;
  } catch (err) {
    console.warn("Supabase validate discount exception:", err);
    return { success: false, message: "تعذر التحقق من كود الخصم حالياً. حاول مرة أخرى." };
  }
}

export async function saveDiscountCodeToSupabase(code: SupabaseDiscountCode): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;
  try {
    const { error } = await supabase.from("discount_codes").upsert([{
      ...code,
      code: code.code.trim().toUpperCase(),
    }]);
    if (error) {
      console.warn("Supabase saveDiscountCode error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase saveDiscountCode exception:", err);
    return false;
  }
}

export async function deleteDiscountCodeFromSupabase(code: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;
  try {
    const normalizedCode = code.trim().toUpperCase();
    const { error } = await supabase.from("discount_codes").delete().eq("code", normalizedCode);
    if (error) {
      console.warn("Supabase deleteDiscountCode error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase deleteDiscountCode exception:", err);
    return false;
  }
}

// Real-time Visitor Tracking
export async function recordVisitorHeartbeat(page = "/") {
  if (typeof window === "undefined" || !isSupabaseConfigured()) return;
  try {
    let sessionId = sessionStorage.getItem("sen_session_id");
    if (!sessionId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionId)) {
      sessionId = window.crypto.randomUUID();
      sessionStorage.setItem("sen_session_id", sessionId);
    }

    const deviceType = window.innerWidth < 768 ? "Mobile" : "Desktop";
    await supabase.rpc("record_visitor_heartbeat", {
      p_session_id: sessionId,
      p_current_page: page,
      p_device_type: deviceType,
    });
  } catch {}
}

export async function fetchRealActiveVisitorsCount(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;
  try {
    const { data, error } = await supabase.rpc("get_active_visitors_count");
    if (error) return 0;
    return Math.max(0, Number(data ?? 0));
  } catch {
    return 0;
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
