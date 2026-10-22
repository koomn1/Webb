import { getSafeProviderErrorCode, isRetryableProviderHttpStatus } from "./order-contact.ts";

export type MetaOutboundConfig = {
  accessToken: string;
  phoneNumberId: string;
  templateName: string;
  templateLanguage: string;
  graphVersion: string;
};

export type ContactMessageRecord = Record<string, unknown>;
export type SendOutcome = "sent" | "retryable" | "failed" | "uncertain";
export type SendResult = {
  outcome: SendOutcome;
  errorCode: string | null;
  providerMessageId: string | null;
};

function escapeText(value: unknown, maxLength: number): string {
  return String(value ?? "").replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function buildTemplatePayload(record: ContactMessageRecord, config: MetaOutboundConfig) {
  const orderSummary = escapeText(record.items_summary, 700);
  const amount = Number(record.total_amount);
  const totalText = Number.isFinite(amount) ? amount.toFixed(2) : "";
  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: escapeText(record.phone_e164, 20),
    type: "template",
    template: {
      name: config.templateName,
      language: { code: config.templateLanguage },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: escapeText(record.customer_name, 80) || "عميلنا العزيز" },
            { type: "text", text: escapeText(record.order_number, 40) },
            { type: "text", text: orderSummary || "طلب متجر SÈN" },
            { type: "text", text: totalText },
          ],
        },
        {
          type: "button",
          sub_type: "quick_reply",
          index: "0",
          parameters: [{ type: "payload", payload: "تأكيد الطلب" }],
        },
        {
          type: "button",
          sub_type: "quick_reply",
          index: "1",
          parameters: [{ type: "payload", payload: "إلغاء الطلب" }],
        },
      ],
    },
  };
}

export function buildResultPayload(record: ContactMessageRecord) {
  const orderNumber = escapeText(record.order_number, 40);
  const status = record.order_status === "CONFIRMED" ? "تأكيد" : "إلغاء";
  const amount = Number(record.total_amount);
  const amountText = Number.isFinite(amount) ? ` بقيمة ${amount.toFixed(2)} ج.م` : "";
  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: escapeText(record.phone_e164, 20),
    type: "text",
    text: { preview_url: false, body: `تم ${status} طلبك رقم ${orderNumber}${amountText}. شكرًا لتواصلك مع SÈN.` },
  };
}

export async function sendWhatsAppMessage(
  payload: Record<string, unknown>,
  config: MetaOutboundConfig,
  fetchImpl: typeof fetch = fetch,
): Promise<SendResult> {
  const url = `https://graph.facebook.com/${config.graphVersion}/${encodeURIComponent(config.phoneNumberId)}/messages`;
  try {
    const response = await fetchImpl(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${config.accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20_000),
    });
    let body: unknown = null;
    try {
      body = await response.json();
    } catch {}
    if (!response.ok) {
      return {
        outcome: isRetryableProviderHttpStatus(response.status) ? "retryable" : "failed",
        errorCode: getSafeProviderErrorCode(body) || `http_${response.status}`,
        providerMessageId: null,
      };
    }
    const messageId = typeof body === "object" && body !== null &&
        Array.isArray((body as { messages?: unknown }).messages)
      ? (body as { messages: Array<{ id?: unknown }> }).messages[0]?.id
      : null;
    if (typeof messageId !== "string" || !messageId) {
      return { outcome: "uncertain", errorCode: "provider_missing_message_id", providerMessageId: null };
    }
    return { outcome: "sent", errorCode: null, providerMessageId: messageId };
  } catch {
    // Do not automatically repeat an ambiguous timeout; the provider may have accepted the message.
    return { outcome: "uncertain", errorCode: "provider_timeout_uncertain", providerMessageId: null };
  }
}
