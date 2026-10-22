import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  extractWhatsAppUpdates,
  getButtonDecision,
  isRetryableProviderHttpStatus,
  isWhatsAppOptOut,
  verifyMetaSignature,
} from "../supabase/functions/_shared/order-contact";
import {
  buildResultPayload,
  buildTemplatePayload,
  sendWhatsAppMessage,
  type MetaOutboundConfig,
} from "../supabase/functions/_shared/meta-client";

const appSecret = "local-test-secret-only";
const signatureFor = (body: string) =>
  `sha256=${createHmac("sha256", appSecret).update(body, "utf8").digest("hex")}`;
const metaConfig: MetaOutboundConfig = {
  accessToken: "test-token-never-sent",
  phoneNumberId: "phone-number-id",
  templateName: "sen_order_confirmation",
  templateLanguage: "ar_EG",
  graphVersion: "v26.0",
};
const orderRecord = {
  phone_e164: "201012345678",
  customer_name: "عميل الاختبار",
  order_number: "SEN-123",
  items_summary: "Amber × 2",
  total_amount: 1250,
  order_status: "CONFIRMED",
};

describe("Meta webhook signature", () => {
  it("accepts the valid raw-body HMAC and rejects modifications", async () => {
    const rawBody = '{"object":"whatsapp_business_account","entry":[]}';
    expect(await verifyMetaSignature(rawBody, signatureFor(rawBody), appSecret)).toBe(true);
    expect(await verifyMetaSignature(`${rawBody} `, signatureFor(rawBody), appSecret)).toBe(false);
    expect(await verifyMetaSignature(rawBody, "sha1=abc", appSecret)).toBe(false);
    expect(await verifyMetaSignature(rawBody, null, appSecret)).toBe(false);
  });
});

describe("WhatsApp webhook parsing", () => {
  it("extracts an inbound template quick-reply and keeps its exact context ID", () => {
    const payload = {
      object: "whatsapp_business_account",
      entry: [{
        changes: [{
          field: "messages",
          value: {
            metadata: { phone_number_id: "phone-number-id" },
            messages: [{
              id: "wamid.incoming",
              from: "+201012345678",
              type: "button",
              context: { id: "wamid.original" },
              button: { payload: "تأكيد الطلب", text: "تأكيد الطلب" },
            }],
          },
        }],
      }],
    };
    const updates = extractWhatsAppUpdates(payload);
    expect(updates).toHaveLength(1);
    expect(updates[0]).toMatchObject({ kind: "incoming", phoneNumberId: "phone-number-id" });
    if (updates[0]?.kind === "incoming") {
      expect((updates[0].message.context as Record<string, unknown>).id).toBe("wamid.original");
      expect(getButtonDecision(updates[0].message)).toBe("CONFIRMED");
    }
  });

  it("parses provider statuses separately from customer messages", () => {
    const payload = {
      object: "whatsapp_business_account",
      entry: [{ changes: [{
        field: "messages",
        value: {
          metadata: { phone_number_id: "phone-number-id" },
          statuses: [{ id: "wamid.sent", status: "delivered" }],
        },
      }] }],
    };
    expect(extractWhatsAppUpdates(payload)).toEqual([{
      kind: "status",
      phoneNumberId: "phone-number-id",
      status: { id: "wamid.sent", status: "delivered" },
    }]);
    expect(extractWhatsAppUpdates({ object: "other", entry: [] })).toEqual([]);
  });

  it("accepts only the two order buttons as decisions", () => {
    expect(getButtonDecision({ type: "button", button: { payload: "تأكيد الطلب", text: "تأكيد الطلب" } })).toBe("CONFIRMED");
    expect(getButtonDecision({ type: "button", button: { payload: "إلغاء الطلب", text: "إلغاء الطلب" } })).toBe("CANCELLED");
    expect(getButtonDecision({ type: "text", text: { body: "تأكيد الطلب" } })).toBeNull();
    expect(getButtonDecision({ type: "button", button: { payload: "نعم", text: "نعم" } })).toBeNull();
  });
});

describe("outbound Meta message contract", () => {
  it("builds the configured Utility template with exact quick-reply payloads", () => {
    const payload = buildTemplatePayload(orderRecord, metaConfig);
    expect(payload).toMatchObject({ messaging_product: "whatsapp", to: "201012345678", type: "template" });
    expect(payload.template.name).toBe("sen_order_confirmation");
    expect(payload.template.language.code).toBe("ar_EG");
    expect(payload.template.components[0]?.type).toBe("body");
    expect(payload.template.components[1]).toMatchObject({
      type: "button", sub_type: "quick_reply", index: "0",
      parameters: [{ type: "payload", payload: "تأكيد الطلب" }],
    });
    expect(payload.template.components[2]).toMatchObject({
      type: "button", sub_type: "quick_reply", index: "1",
      parameters: [{ type: "payload", payload: "إلغاء الطلب" }],
    });
  });

  it("builds a result message only from the persisted order outcome", () => {
    expect(buildResultPayload(orderRecord)).toMatchObject({
      type: "text",
      text: { body: expect.stringContaining("تم تأكيد طلبك رقم SEN-123") },
    });
    expect(buildResultPayload({ ...orderRecord, order_status: "CANCELLED" }).text.body)
      .toContain("تم إلغاء طلبك رقم SEN-123");
  });

  it("handles accepted, rate-limited, permanent, ambiguous, and network failures safely", async () => {
    const fetchResponse = (status: number, body: unknown): typeof fetch =>
      async () => new Response(JSON.stringify(body), { status });
    const payload = buildTemplatePayload(orderRecord, metaConfig);

    expect(await sendWhatsAppMessage(payload, metaConfig, fetchResponse(200, { messages: [{ id: "wamid.accepted" }] })))
      .toEqual({ outcome: "sent", errorCode: null, providerMessageId: "wamid.accepted" });
    expect(await sendWhatsAppMessage(payload, metaConfig, fetchResponse(429, { error: { code: 130429 } })))
      .toEqual({ outcome: "retryable", errorCode: "130429", providerMessageId: null });
    expect(await sendWhatsAppMessage(payload, metaConfig, fetchResponse(400, { error: { code: 100 } })))
      .toEqual({ outcome: "failed", errorCode: "100", providerMessageId: null });
    expect(await sendWhatsAppMessage(payload, metaConfig, fetchResponse(200, { messages: [] })))
      .toEqual({ outcome: "uncertain", errorCode: "provider_missing_message_id", providerMessageId: null });

    const networkFailure: typeof fetch = async () => { throw new Error("simulated timeout"); };
    expect(await sendWhatsAppMessage(payload, metaConfig, networkFailure))
      .toEqual({ outcome: "uncertain", errorCode: "provider_timeout_uncertain", providerMessageId: null });
  });
});

describe("contact preferences and bounded retries", () => {
  it("recognizes exact opt-out commands without treating order cancellation as opt-out", () => {
    expect(isWhatsAppOptOut({ type: "text", text: { body: "STOP" } })).toBe(true);
    expect(isWhatsAppOptOut({ type: "text", text: { body: "إيقاف الرسائل" } })).toBe(true);
    expect(isWhatsAppOptOut({ type: "text", text: { body: "مش عايز رسائل" } })).toBe(true);
    expect(isWhatsAppOptOut({ type: "text", text: { body: "إلغاء الطلب" } })).toBe(false);
    expect(isWhatsAppOptOut({ type: "text", text: { body: "عايز أوقف الطلب" } })).toBe(false);
  });

  it("retries only known temporary HTTP failures", () => {
    expect(isRetryableProviderHttpStatus(429)).toBe(true);
    expect(isRetryableProviderHttpStatus(503)).toBe(true);
    expect(isRetryableProviderHttpStatus(400)).toBe(false);
    expect(isRetryableProviderHttpStatus(200)).toBe(false);
  });
});
