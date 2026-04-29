// Checkout proxy edge function
// Forwards Opayo Pi checkout calls to the Cambridge Scholars upstream API,
// bypassing browser CORS restrictions on api.cambridgescholars.com.
//
// Supported routes (all forwarded to the same upstream paths):
//   GET  /merchant-session-key   → /api/website/checkout/merchant-session-key
//   POST /pay                    → /api/website/checkout/pay
//   POST /3ds-complete           → /api/website/checkout/3ds-complete
//
// The client's `Authorization: Bearer <access_token>` and `X-Cart-Token`
// headers (when present) are passed straight through to the upstream API.

const UPSTREAM_BASE =
  Deno.env.get("CSP_API_BASE") || "https://api.cambridgescholars.com/api/website";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-cart-token, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

interface RouteSpec {
  method: "GET" | "POST";
  upstream: string;
}

const ROUTES: Record<string, RouteSpec> = {
  "merchant-session-key": { method: "GET", upstream: "/checkout/merchant-session-key" },
  "pay": { method: "POST", upstream: "/checkout/pay" },
  "3ds-complete": { method: "POST", upstream: "/checkout/3ds-complete" },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Resolve action from the path segment after the function name,
  // e.g. /functions/v1/checkout-proxy/pay → "pay"
  const url = new URL(req.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const action = segments[segments.length - 1] || "";
  const route = ROUTES[action];

  if (!route) {
    return json({ error: `Unknown action: ${action}` }, 404);
  }
  if (req.method !== route.method) {
    return json({ error: `Method ${req.method} not allowed for ${action}` }, 405);
  }

  // Forward selected headers
  const fwdHeaders: Record<string, string> = {
    "Accept": "application/json",
  };
  const auth = req.headers.get("authorization");
  if (auth) fwdHeaders["Authorization"] = auth;
  const cartToken = req.headers.get("x-cart-token");
  if (cartToken) fwdHeaders["X-Cart-Token"] = cartToken;

  // Build upstream URL — preserve query string (e.g. cart_token fallback)
  let upstreamUrl = `${UPSTREAM_BASE}${route.upstream}`;
  if (url.search) upstreamUrl += url.search;

  const init: RequestInit = { method: route.method, headers: fwdHeaders };

  if (route.method === "POST") {
    const bodyText = await req.text();
    if (bodyText) {
      fwdHeaders["Content-Type"] = "application/json";
      init.body = bodyText;
    }
  }

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(upstreamUrl, init);
  } catch (err) {
    return json(
      {
        error: "Failed to reach payment gateway",
        detail: err instanceof Error ? err.message : String(err),
      },
      502,
    );
  }

  const text = await upstreamRes.text();
  const passHeaders: Record<string, string> = {
    ...corsHeaders,
    "Content-Type": upstreamRes.headers.get("content-type") || "application/json",
  };
  return new Response(text, { status: upstreamRes.status, headers: passHeaders });
});
