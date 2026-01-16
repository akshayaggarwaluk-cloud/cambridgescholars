import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const AUTH_API_BASE = "http://54.253.4.186:8001/api/auth";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    console.log(`Proxying request to: ${AUTH_API_BASE}/${endpoint}`);

    const response = await fetch(`${AUTH_API_BASE}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Auth proxy error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Failed to connect to auth service", message: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
