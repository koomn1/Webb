import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  extractWhatsAppUpdates,
  getButtonDecision,
  isWhatsAppOptOut,
  verifyMetaSignature,
} from "../_shared/order-contact.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-hub-signature-256",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function response(body: string, status = 200, contentType = "text/plain; charset=utf-8") {
  return new Response(body, { status, headers: { ...corsHeaders, "Content-Type": contentType } });
}

function requireServiceConfig() {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) throw new Error("service_not_configured");
  return { url: url.replace(/\/$/, ""), serviceKey };
}

async function callServiceRpc(name: string, args: Record<string, unknown>) {
  const { url, serviceKey } = requireServiceConfig();
  const result = await fetch(`${url}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
    body: JSON.stringify(args),
    signal: AbortSignal.timeout(10_000),
  });
  if (!result.ok) {
    // Never log webhook body, phone number, or provider credentials.
    console.error("order_contact_rpc_failed", name, result.status);
    throw new Error("database_operation_failed");
  }
  return result.json();
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const verifyToken = Deno.env.get("WHATSAPP_WEBHOOK_VERIFY_TOKEN");
  if (request.method === "GET") {
    if (!verifyToken) return response("Webhook not configured", 503);
    const url = new URL(request.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    if (mode === "subscribe" && token === verifyToken && challenge) return response(challenge);
    return response("Forbidden", 403);
  }

  if (request.method !== "POST") return response("Method not allowed", 405);
  const appSecret = Deno.env.get("META_APP_SECRET");
  if (!appSecret) return response("Webhook not configured", 503);

  const rawBody = await request.text();
  const signatureValid = await verifyMetaSignature(
    rawBody,
    request.headers.get("x-hub-signature-256"),
    appSecret,
  );
  if (!signatureValid) return response("Invalid signature", 401);

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return response("Invalid JSON", 400);
  }

  const expectedPhoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");
  if (!expectedPhoneNumberId) return response("Webhook not configured", 503);
  const updates = extractWhatsAppUpdates(payload);

  try {
    for (const update of updates) {
      if (update.phoneNumberId !== expectedPhoneNumberId) {
        console.warn("order_contact_webhook_wrong_phone_number_id");
        continue;
      }

      if (update.kind === "status") {
        const messageId = typeof update.status.id === "string" ? update.status.id : "";
        const providerStatus = typeof update.status.status === "string" ? update.status.status : "";
        if (!messageId || !["sent", "delivered", "read", "failed"].includes(providerStatus)) continue;
        let errorCode: string | null = null;
        if (Array.isArray(update.status.errors) && update.status.errors.length > 0) {
          const firstError = update.status.errors[0];
          if (typeof firstError === "object" && firstError !== null && "code" in firstError) {
            const code = (firstError as { code?: unknown }).code;
            if (typeof code === "number" && Number.isSafeInteger(code)) errorCode = String(code);
          }
        }
        await callServiceRpc("update_order_contact_delivery", {
          p_provider_message_id: messageId,
          p_provider_status: providerStatus,
          p_error_code: errorCode,
        });
        continue;
      }

      const message = update.message;
      const messageId = typeof message.id === "string" ? message.id : "";
      const fromPhone = typeof message.from === "string" ? message.from : "";
      if (!messageId || !fromPhone) continue;

      if (isWhatsAppOptOut(message)) {
        await callServiceRpc("record_order_contact_opt_out", {
          p_message_id: messageId,
          p_from_phone: fromPhone,
        });
        continue;
      }

      const decision = getButtonDecision(message);
      const context = typeof message.context === "object" && message.context !== null
        ? message.context as Record<string, unknown>
        : {};
      const contextualMessageId = typeof context.id === "string" ? context.id : "";
      const button = typeof message.button === "object" && message.button !== null
        ? message.button as Record<string, unknown>
        : {};
      const buttonLabel = typeof button.payload === "string"
        ? button.payload
        : typeof button.text === "string"
        ? button.text
        : "";

      if (decision && contextualMessageId && buttonLabel) {
        const result = await callServiceRpc("apply_order_contact_reply", {
          p_message_id: messageId,
          p_context_message_id: contextualMessageId,
          p_from_phone: fromPhone,
          p_button_label: buttonLabel,
        });
        if (result && typeof result === "object" && result.reason === "pending_context") {
          return response("Temporary processing error", 503);
        }
      }
      // Other messages are ignored; no order state is inferred from free text.
    }
  } catch {
    return response("Temporary processing error", 500);
  }

  return response("EVENT_RECEIVED", 200);
});
