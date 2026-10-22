export const ORDER_CONFIRM_LABEL = "تأكيد الطلب";
export const ORDER_CANCEL_LABEL = "إلغاء الطلب";

export type ButtonDecision = "CONFIRMED" | "CANCELLED";

export type WhatsAppUpdate =
  | {
      kind: "incoming";
      phoneNumberId: string;
      message: Record<string, unknown>;
    }
  | {
      kind: "status";
      phoneNumberId: string;
      status: Record<string, unknown>;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function verifyMetaSignature(
  rawBody: string,
  signatureHeader: string | null,
  appSecret: string,
): Promise<boolean> {
  if (!signatureHeader?.startsWith("sha256=") || !appSecret) return false;
  const providedHex = signatureHeader.slice("sha256=".length).toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(providedHex)) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(appSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody)),
  );
  const expectedHex = Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("");
  if (providedHex.length !== expectedHex.length) return false;

  // Constant-time comparison for equal-length values.
  let difference = 0;
  for (let index = 0; index < expectedHex.length; index += 1) {
    difference |= expectedHex.charCodeAt(index) ^ providedHex.charCodeAt(index);
  }
  return difference === 0;
}

export function extractWhatsAppUpdates(payload: unknown): WhatsAppUpdate[] {
  if (!isRecord(payload) || payload.object !== "whatsapp_business_account") return [];
  const updates: WhatsAppUpdate[] = [];
  const entries = Array.isArray(payload.entry) ? payload.entry : [];

  for (const entry of entries) {
    if (!isRecord(entry) || !Array.isArray(entry.changes)) continue;
    for (const change of entry.changes) {
      if (!isRecord(change) || change.field !== "messages" || !isRecord(change.value)) continue;
      const value = change.value;
      const metadata = isRecord(value.metadata) ? value.metadata : {};
      const phoneNumberId = typeof metadata.phone_number_id === "string" ? metadata.phone_number_id : "";
      if (!phoneNumberId) continue;

      if (Array.isArray(value.statuses)) {
        for (const status of value.statuses) {
          if (isRecord(status)) updates.push({ kind: "status", phoneNumberId, status });
        }
      }
      if (Array.isArray(value.messages)) {
        for (const message of value.messages) {
          if (isRecord(message)) updates.push({ kind: "incoming", phoneNumberId, message });
        }
      }
    }
  }
  return updates;
}

export function getButtonDecision(message: Record<string, unknown>): ButtonDecision | null {
  if (message.type !== "button" || !isRecord(message.button)) return null;
  const label = typeof message.button.payload === "string"
    ? message.button.payload
    : typeof message.button.text === "string"
    ? message.button.text
    : "";
  if (label === ORDER_CONFIRM_LABEL) return "CONFIRMED";
  if (label === ORDER_CANCEL_LABEL) return "CANCELLED";
  return null;
}

function normalizeOptOutText(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[\p{P}\p{S}]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("ar-EG");
}

const OPT_OUT_PHRASES = new Set([
  "stop",
  "unsubscribe",
  "إيقاف",
  "اوقف",
  "توقف",
  "إيقاف الرسائل",
  "ايقاف الرسائل",
  "إلغاء الرسائل",
  "الغاء الرسائل",
  "إلغاء التواصل",
  "الغاء التواصل",
  "عدم التواصل",
  "وقف رسائل",
  "وقف الرسائل",
  "لا أريد رسائل",
  "لا اريد رسائل",
  "مش عايز رسائل",
  "مش عايزة رسائل",
  "ما تبعتليش رسائل",
  "متبعتش رسائل",
]);

export function isWhatsAppOptOut(message: Record<string, unknown>): boolean {
  if (message.type !== "text" || !isRecord(message.text) || typeof message.text.body !== "string") {
    return false;
  }
  return OPT_OUT_PHRASES.has(normalizeOptOutText(message.text.body));
}

export function getTextBody(message: Record<string, unknown>): string | null {
  if (message.type !== "text" || !isRecord(message.text) || typeof message.text.body !== "string") {
    return null;
  }
  return message.text.body;
}

export function getSafeProviderErrorCode(body: unknown): string | null {
  if (!isRecord(body) || !isRecord(body.error)) return null;
  const code = body.error.code;
  if (typeof code === "number" && Number.isSafeInteger(code)) return String(code);
  if (typeof code === "string" && /^[A-Za-z0-9_.-]{1,80}$/.test(code)) return code;
  return null;
}

export function isRetryableProviderHttpStatus(status: number): boolean {
  return status === 429 || status >= 500;
}
