import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CSP Website Auth API
const AUTH_API_BASE =
  Deno.env.get("AUTH_API_BASE") ||
  "https://api.cambridgescholars.com/api/website/auth";
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") || "*";

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ── Rate limiting ───────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
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

// ── Validation helpers ───────────────────────────────────────────
function isValidEmail(email: unknown): boolean {
  if (typeof email !== "string" || email.length > 255) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(value: unknown, max = 255): string {
  if (typeof value !== "string") return "";
  return value.slice(0, max).trim();
}

const VALID_ENDPOINTS = ["register", "login", "refresh", "logout"] as const;
type Endpoint = (typeof VALID_ENDPOINTS)[number];

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

    const rawBody = await req.json().catch(() => ({} as Record<string, unknown>));
    const endpoint = typeof rawBody?.endpoint === "string" ? rawBody.endpoint : null;

    if (!endpoint || !VALID_ENDPOINTS.includes(endpoint as Endpoint)) {
      return jsonResponse({ error: "Invalid or missing endpoint" }, 400);
    }

    const { endpoint: _ignored, ...body } = rawBody as Record<string, unknown>;
    const ep = endpoint as Endpoint;

    // ── Per-endpoint validation & forwarding ───────────────────
    let upstreamBody: Record<string, unknown> = {};

    if (ep === "register") {
      const email = sanitize(body.email);
      const password = typeof body.password === "string" ? body.password : "";
      const first_name = sanitize(body.first_name, 100);
      const last_name = sanitize(body.last_name, 100);

      if (!isValidEmail(email)) {
        return jsonResponse({ error: "Invalid email format" }, 400);
      }
      if (password.length < 8 || password.length > 128) {
        return jsonResponse(
          { error: "Password must be between 8 and 128 characters" },
          400
        );
      }
      if (!first_name || !last_name) {
        return jsonResponse({ error: "First name and last name are required" }, 400);
      }
      upstreamBody = { email, password, first_name, last_name };
    } else if (ep === "login") {
      const email = sanitize(body.email);
      const password = typeof body.password === "string" ? body.password : "";
      if (!isValidEmail(email)) {
        return jsonResponse({ error: "Invalid email format" }, 400);
      }
      if (!password) {
        return jsonResponse({ error: "Password is required" }, 400);
      }
      upstreamBody = { email, password };
    } else if (ep === "refresh") {
      const refresh_token =
        typeof body.refresh_token === "string" ? body.refresh_token : "";
      if (!refresh_token) {
        return jsonResponse({ error: "Refresh token is required" }, 400);
      }
      upstreamBody = { refresh_token };
    } else if (ep === "logout") {
      // No body required upstream
      upstreamBody = {};
    }

    console.log(`[auth-proxy] ${ep} from ${clientIP}`);

    const upstreamRes = await fetch(`${AUTH_API_BASE}/${ep}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(upstreamBody),
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
    console.error("[auth-proxy] error:", error);
    return jsonResponse(
      { error: "Authentication service temporarily unavailable" },
      500
    );
  }
});

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
