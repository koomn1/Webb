import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  buildResultPayload,
  buildTemplatePayload,
  sendWhatsAppMessage,
  type MetaOutboundConfig,
} from "../_shared/meta-client.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info, x-sen-cron-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(payload: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
  });
}

function serviceCredentials() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("service_not_configured");
  return { url: url.replace(/\/$/, ""), key };
}

async function serviceRpc(name: string, args: Record<string, unknown>) {
  const { url, key } = serviceCredentials();
  const result = await fetch(`${url}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: key, Authorization: `Bearer ${key}` },
    body: JSON.stringify(args),
    signal: AbortSignal.timeout(15_000),
  });
  if (!result.ok) {
    console.error("order_contact_rpc_failed", name, result.status);
    throw new Error("database_operation_failed");
  }
  return result.json();
}

async function verifyAdmin(authorization: string | null): Promise<boolean> {
  if (!authorization?.startsWith("Bearer ")) return false;
  const { url, key } = serviceCredentials();
  const accessToken = authorization.slice("Bearer ".length).trim();
  if (!accessToken) return false;
  const userResponse = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: key, Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(10_000),
  });
  if (!userResponse.ok) return false;
  const user = await userResponse.json();
  if (!user || typeof user.id !== "string") return false;

  const profileResponse = await fetch(
    `${url}/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=role&limit=1`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(10_000) },
  );
  if (!profileResponse.ok) return false;
  const profiles = await profileResponse.json();
  return Array.isArray(profiles) && ["admin", "super_admin"].includes(profiles[0]?.role);
}

async function isCronCall(request: Request): Promise<boolean> {
  const token = request.headers.get("x-sen-cron-token");
  if (!token || token.length < 32) return false;
  try {
    return await serviceRpc("verify_order_contact_cron_token", { p_token: token }) === true;
  } catch {
    return false;
  }
}

function providerConfiguration(): MetaOutboundConfig | null {
  const enabled = Deno.env.get("WHATSAPP_ENABLED") === "true";
  const accessToken = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
  const phoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");
  const templateName = Deno.env.get("WHATSAPP_ORDER_TEMPLATE_NAME");
  const templateLanguage = Deno.env.get("WHATSAPP_ORDER_TEMPLATE_LANGUAGE");
  const graphVersion = Deno.env.get("WHATSAPP_GRAPH_API_VERSION");
  if (!enabled || !accessToken || !phoneNumberId || !templateName || !templateLanguage || !graphVersion) return null;
  if (!/^v[0-9]+\.[0-9]+$/.test(graphVersion)) return null;
  return { accessToken, phoneNumberId, templateName, templateLanguage, graphVersion };
}

async function processBatch() {
  await serviceRpc("sweep_order_contact_events", {});
  const config = providerConfiguration();
  const enabled = await serviceRpc("is_order_contact_enabled", {}) === true;
  const ready = Boolean(config) && enabled;
  await serviceRpc("set_order_contact_setup_ready", { p_ready: ready });
  if (!ready || !config) return { processed: 0, configured: Boolean(config), enabled };

  const claimResult = await serviceRpc("claim_order_contact_batch", { p_limit: 10 });
  const claimed = Array.isArray(claimResult) ? claimResult : [];
  let processed = 0;
  for (const entry of claimed) {
    if (!entry || typeof entry.event_id !== "string" || !["initial", "result"].includes(entry.message_kind)) continue;
    const eventId = entry.event_id as string;
    const kind = entry.message_kind as "initial" | "result";
    try {
      const record = await serviceRpc("get_order_contact_message", {
        p_event_id: eventId,
        p_message_kind: kind,
      });
      if (!record || typeof record !== "object" || typeof record.phone_e164 !== "string") {
        await serviceRpc("complete_order_contact_attempt", {
          p_event_id: eventId,
          p_message_kind: kind,
          p_outcome: "failed",
          p_error_code: "contact_payload_unavailable",
        });
        processed += 1;
        continue;
      }
      const payload = kind === "initial" ? buildTemplatePayload(record, config) : buildResultPayload(record);
      const sendResult = await sendWhatsAppMessage(payload, config);
      await serviceRpc("complete_order_contact_attempt", {
        p_event_id: eventId,
        p_message_kind: kind,
        p_outcome: sendResult.outcome,
        p_provider_message_id: sendResult.providerMessageId,
        p_error_code: sendResult.errorCode,
      });
    } catch {
      // A worker failure after send may be ambiguous; don't blindly resend.
      try {
        await serviceRpc("complete_order_contact_attempt", {
          p_event_id: eventId,
          p_message_kind: kind,
          p_outcome: "uncertain",
          p_error_code: "worker_outcome_uncertain",
        });
      } catch {
        console.error("order_contact_attempt_finalize_failed", kind);
      }
    }
    processed += 1;
  }
  return { processed, configured: true, enabled: true };
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405);

  let body: Record<string, unknown> = {};
  try {
    const parsed = await request.json();
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) body = parsed as Record<string, unknown>;
  } catch {
    return jsonResponse({ error: "invalid_json" }, 400);
  }

  const cronAuthorized = await isCronCall(request);
  if (cronAuthorized) {
    if (body.action !== "process") return jsonResponse({ error: "invalid_action" }, 400);
    try {
      return jsonResponse(await processBatch());
    } catch {
      return jsonResponse({ error: "worker_failed" }, 500);
    }
  }

  if (!await verifyAdmin(request.headers.get("authorization"))) {
    return jsonResponse({ error: "unauthorized" }, 401);
  }

  if (body.action === "list") {
    const requestedLimit = Number.isInteger(body.limit) ? Number(body.limit) : 50;
    const requestedOffset = Number.isInteger(body.offset) ? Number(body.offset) : 0;
    try {
      const rows = await serviceRpc("admin_list_order_contact_history", {
        p_limit: Math.min(Math.max(requestedLimit, 1), 100),
        p_offset: Math.max(requestedOffset, 0),
      });
      return jsonResponse({ rows: Array.isArray(rows) ? rows : [] });
    } catch {
      return jsonResponse({ error: "history_load_failed" }, 500);
    }
  }

  if (body.action === "retry") {
    if (typeof body.event_id !== "string" || !/^[0-9a-f-]{36}$/i.test(body.event_id)) {
      return jsonResponse({ error: "invalid_event_id" }, 400);
    }
    try {
      const result = await serviceRpc("request_order_contact_retry", { p_event_id: body.event_id });
      if (!result || typeof result !== "object" || (result as Record<string, unknown>).success !== true) {
        return jsonResponse({ error: "retry_not_allowed", detail: result }, 409);
      }
      return jsonResponse({ success: true, queued: true });
    } catch {
      return jsonResponse({ error: "retry_request_failed" }, 500);
    }
  }

  return jsonResponse({ error: "invalid_action" }, 400);
});
