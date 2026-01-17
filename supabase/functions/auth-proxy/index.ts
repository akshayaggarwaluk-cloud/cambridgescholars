import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// SECURITY: External auth API configuration
// Note: This uses an external API. In production, prefer HTTPS and configure AUTH_API_BASE via secrets
const AUTH_API_BASE = Deno.env.get("AUTH_API_BASE") || "http://54.253.4.186:8001/api/auth";
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") || "*";

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Rate limiting: track requests per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW);

// Input validation helpers
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === "string" && email.length <= 255 && emailRegex.test(email);
}

function sanitizeString(str: unknown, maxLength: number = 500): string {
  if (typeof str !== "string") return "";
  return str.slice(0, maxLength).trim();
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";
    
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);

    // Allow endpoint to be passed either as a query param OR in the JSON body.
    // supabase.functions.invoke() does not support query params, so the client
    // passes endpoint in the body.
    const rawBody = await req.json().catch(() => ({} as Record<string, unknown>));

    const endpointFromQuery = url.searchParams.get("endpoint");
    const endpointFromBody = typeof rawBody?.endpoint === "string" ? rawBody.endpoint : null;
    const endpoint = endpointFromQuery ?? endpointFromBody;

    if (!endpoint) {
      return new Response(
        JSON.stringify({ error: "Missing endpoint parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validEndpoints = [
      "register",
      "login",
      "user-exist",
      "send-otp",
      "validate-otp",
      "forgot-password",
      "reset-password",
    ];

    if (!validEndpoints.includes(endpoint)) {
      return new Response(
        JSON.stringify({ error: "Invalid endpoint" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Remove 'endpoint' from the forwarded body so the upstream API receives only
    // the fields it expects.
    const { endpoint: _ignored, ...body } = rawBody as Record<string, unknown>;

    // Input validation for sensitive endpoints
    if (["register", "login", "user-exist", "send-otp", "forgot-password"].includes(endpoint)) {
      const email = body.email;
      if (email !== undefined && !isValidEmail(String(email))) {
        return new Response(
          JSON.stringify({ error: "Invalid email format" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Password validation for registration and reset
    if (["register", "reset-password"].includes(endpoint)) {
      const password = body.password;
      if (typeof password === "string" && (password.length < 8 || password.length > 128)) {
        return new Response(
          JSON.stringify({ error: "Password must be between 8 and 128 characters" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // OTP validation
    if (["validate-otp", "reset-password"].includes(endpoint)) {
      const otp = body.otp;
      if (typeof otp === "string" && !/^\d{4,8}$/.test(otp)) {
        return new Response(
          JSON.stringify({ error: "Invalid OTP format" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Sanitize string fields to prevent injection
    const sanitizedBody: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "string") {
        sanitizedBody[key] = sanitizeString(value, key === "password" ? 128 : 255);
      } else {
        sanitizedBody[key] = value;
      }
    }

    console.log(`Proxying request to: ${AUTH_API_BASE}/${endpoint} from IP: ${clientIP}`);

    const response = await fetch(`${AUTH_API_BASE}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sanitizedBody),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Auth proxy error:", error);
    // Don't expose internal error details to client
    return new Response(
      JSON.stringify({ error: "Authentication service temporarily unavailable" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
