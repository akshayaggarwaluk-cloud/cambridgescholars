import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CSP Website Account API
const ACCOUNT_API_BASE =
  Deno.env.get("ACCOUNT_API_BASE") ||
  "https://api.cambridgescholars.com/api/website/account";
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") || "*";

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ── Rate limiting (per-IP) ──────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 60;
const RATE_LIMIT_WINDOW = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) rateLimitMap.delete(ip);
  }
}, RATE_LIMIT_WINDOW);

// ── Helpers ─────────────────────────────────────────────────────
function isValidEmail(email: unknown): boolean {
  if (typeof email !== "string" || email.length > 255) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function sanitize(value: unknown, max = 255): string {
  if (typeof value !== "string") return "";
  return value.slice(0, max).trim();
}
function sanitizeIsbn(value: unknown): string {
  if (typeof value !== "string") return "";
  // Allow digits and X (some ISBN-10 use X as check digit)
  return value.replace(/[^0-9Xx]/g, "").slice(0, 17);
}

const PROFILE_FIELDS = [
  "first_name",
  "last_name",
  "phone",
  "display_name",
] as const;

const ADDRESS_FIELDS = [
  "first_name",
  "last_name",
  "company",
  "address_1",
  "address_2",
  "city",
  "state",
  "postcode",
  "country",
  "email",
  "phone",
] as const;

const ACTIONS = [
  "get_profile",
  "update_profile",
  "change_password",
  "list_orders",
  "get_order",
  "get_wishlist",
  "add_wishlist",
  "remove_wishlist",
  "list_ebooks",
] as const;
type Action = (typeof ACTIONS)[number];

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIP =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";
    if (!checkRateLimit(clientIP)) {
      return jsonResponse({ error: "Too many requests. Please try again later." }, 429);
    }

    // The client must forward the upstream JWT as Authorization: Bearer <access_token>
    const authHeader = req.headers.get("authorization") || "";
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      return jsonResponse({ error: "Missing access token" }, 401);
    }

    const rawBody = await req.json().catch(() => ({} as Record<string, unknown>));
    const action = typeof rawBody?.action === "string" ? rawBody.action : null;
    if (!action || !ACTIONS.includes(action as Action)) {
      return jsonResponse({ error: "Invalid or missing action" }, 400);
    }

    const a = action as Action;
    let upstreamPath = "/profile";
    let upstreamMethod: "GET" | "POST" | "PUT" | "DELETE" = "GET";
    let upstreamBody: Record<string, unknown> | null = null;

    if (a === "get_profile") {
      upstreamPath = "/profile";
      upstreamMethod = "GET";
    } else if (a === "update_profile") {
      upstreamPath = "/profile";
      upstreamMethod = "PUT";
      const body = (rawBody.payload || {}) as Record<string, unknown>;
      const out: Record<string, unknown> = {};

      for (const f of PROFILE_FIELDS) {
        if (typeof body[f] === "string") out[f] = sanitize(body[f]);
      }
      for (const f of ADDRESS_FIELDS) {
        const key = `billing_${f}`;
        if (typeof body[key] === "string") {
          if (f === "email" && body[key]) {
            if (!isValidEmail(body[key])) {
              return jsonResponse({ error: "Invalid billing_email" }, 400);
            }
          }
          out[key] = sanitize(body[key]);
        }
      }
      for (const f of ADDRESS_FIELDS) {
        if (f === "email") continue;
        const key = `shipping_${f}`;
        if (typeof body[key] === "string") out[key] = sanitize(body[key]);
      }

      if (Object.keys(out).length === 0) {
        return jsonResponse({ error: "No valid fields to update" }, 400);
      }
      upstreamBody = out;
    } else if (a === "change_password") {
      upstreamPath = "/password";
      upstreamMethod = "PUT";
      const current_password =
        typeof rawBody.current_password === "string" ? rawBody.current_password : "";
      const new_password =
        typeof rawBody.new_password === "string" ? rawBody.new_password : "";
      if (!current_password) {
        return jsonResponse({ error: "Current password is required" }, 400);
      }
      if (new_password.length < 8 || new_password.length > 128) {
        return jsonResponse(
          { error: "New password must be between 8 and 128 characters" },
          400
        );
      }
      upstreamBody = { current_password, new_password };
    } else if (a === "list_orders") {
      const page = Math.max(1, parseInt(String(rawBody.page ?? "1"), 10) || 1);
      const perPage = Math.min(
        50,
        Math.max(1, parseInt(String(rawBody.per_page ?? "10"), 10) || 10)
      );
      upstreamPath = `/orders?page=${page}&per_page=${perPage}`;
      upstreamMethod = "GET";
    } else if (a === "get_order") {
      const orderId = parseInt(String(rawBody.order_id ?? ""), 10);
      if (!Number.isFinite(orderId) || orderId <= 0) {
        return jsonResponse({ error: "Invalid order_id" }, 400);
      }
      upstreamPath = `/orders/${orderId}`;
      upstreamMethod = "GET";
    } else if (a === "get_wishlist") {
      upstreamPath = "/wishlist";
      upstreamMethod = "GET";
    } else if (a === "add_wishlist") {
      const isbn = sanitizeIsbn(rawBody.isbn);
      if (!isbn) {
        return jsonResponse({ error: "Valid isbn required" }, 400);
      }
      upstreamPath = "/wishlist";
      upstreamMethod = "POST";
      upstreamBody = { isbn };
    } else if (a === "remove_wishlist") {
      const isbn = sanitizeIsbn(rawBody.isbn);
      if (!isbn) {
        return jsonResponse({ error: "Valid isbn required" }, 400);
      }
      upstreamPath = `/wishlist/${isbn}`;
      upstreamMethod = "DELETE";
    } else if (a === "list_ebooks") {
      upstreamPath = "/ebooks";
      upstreamMethod = "GET";
    }

    console.log(`[account-proxy] ${a} ${upstreamMethod} ${upstreamPath} from ${clientIP}`);

    const upstreamRes = await fetch(`${ACCOUNT_API_BASE}${upstreamPath}`, {
      method: upstreamMethod,
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: upstreamBody ? JSON.stringify(upstreamBody) : undefined,
    });

    const text = await upstreamRes.text();
    let data: unknown = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { error: "Invalid upstream response" };
    }
    return jsonResponse(data, upstreamRes.status);
  } catch (error: unknown) {
    console.error("[account-proxy] error:", error);
    return jsonResponse(
      { error: "Account service temporarily unavailable" },
      500
    );
  }
});
