import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30;
const RATE_LIMIT_WINDOW = 60 * 1000;

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

// Input validation
const MAX_STRING_LENGTH = 200;

function sanitizeString(str: unknown, maxLength: number = MAX_STRING_LENGTH): string {
  if (typeof str !== "string") return "";
  return str.slice(0, maxLength).trim();
}

function isValidAddressType(type: unknown): type is "billing" | "shipping" {
  return type === "billing" || type === "shipping";
}

function isValidPhone(phone: string): boolean {
  // Allow digits, spaces, +, -, (, ) with reasonable length
  const phoneRegex = /^[\d\s+\-()]{6,25}$/;
  return phoneRegex.test(phone);
}

function isValidPostcode(postcode: string): boolean {
  // Allow alphanumeric with spaces/dashes, 3-15 chars
  const postcodeRegex = /^[A-Za-z0-9\s\-]{3,15}$/;
  return postcodeRegex.test(postcode);
}

interface AddressInput {
  address_type: "billing" | "shipping";
  first_name: string;
  last_name: string;
  company?: string | null;
  country: string;
  street_address: string;
  street_address_2?: string | null;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  is_default?: boolean;
}

function validateAddressInput(input: Record<string, unknown>): { valid: true; data: AddressInput } | { valid: false; error: string } {
  const address_type = input.address_type;
  if (!isValidAddressType(address_type)) {
    return { valid: false, error: "Invalid address type. Must be 'billing' or 'shipping'." };
  }

  const first_name = sanitizeString(input.first_name);
  if (!first_name || first_name.length < 1) {
    return { valid: false, error: "First name is required." };
  }

  const last_name = sanitizeString(input.last_name);
  if (!last_name || last_name.length < 1) {
    return { valid: false, error: "Last name is required." };
  }

  const country = sanitizeString(input.country);
  if (!country || country.length < 2) {
    return { valid: false, error: "Country is required." };
  }

  const street_address = sanitizeString(input.street_address);
  if (!street_address || street_address.length < 3) {
    return { valid: false, error: "Street address is required." };
  }

  const city = sanitizeString(input.city);
  if (!city || city.length < 2) {
    return { valid: false, error: "City is required." };
  }

  const state = sanitizeString(input.state);
  if (!state || state.length < 2) {
    return { valid: false, error: "State is required." };
  }

  const postcode = sanitizeString(input.postcode, 15);
  if (!postcode || !isValidPostcode(postcode)) {
    return { valid: false, error: "Valid postcode is required." };
  }

  const phone = sanitizeString(input.phone, 25);
  if (!phone || !isValidPhone(phone)) {
    return { valid: false, error: "Valid phone number is required." };
  }

  return {
    valid: true,
    data: {
      address_type,
      first_name,
      last_name,
      company: input.company ? sanitizeString(input.company) : null,
      country,
      street_address,
      street_address_2: input.street_address_2 ? sanitizeString(input.street_address_2) : null,
      city,
      state,
      postcode,
      phone,
      is_default: input.is_default === true,
    },
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIP =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user token from Authorization header (external auth token)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token || token.length < 10) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the request body to get action and user_id
    const body = await req.json().catch(() => ({}));
    const action = body.action;
    const user_id = sanitizeString(body.user_id, 100);

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Handle different actions
    switch (action) {
      case "list": {
        const { data, error } = await supabaseAdmin
          .from("addresses")
          .select("*")
          .eq("user_id", user_id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching addresses:", error);
          return new Response(
            JSON.stringify({ error: "Failed to fetch addresses" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ data }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "create": {
        const validation = validateAddressInput(body.address || {});
        if (!validation.valid) {
          return new Response(
            JSON.stringify({ error: validation.error }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data, error } = await supabaseAdmin
          .from("addresses")
          .insert({
            user_id,
            ...validation.data,
          })
          .select()
          .single();

        if (error) {
          console.error("Error creating address:", error);
          return new Response(
            JSON.stringify({ error: "Failed to create address" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ data }),
          { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "update": {
        const addressId = sanitizeString(body.address_id, 50);
        if (!addressId) {
          return new Response(
            JSON.stringify({ error: "Address ID is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Verify the address belongs to this user
        const { data: existingAddress, error: fetchError } = await supabaseAdmin
          .from("addresses")
          .select("id, user_id")
          .eq("id", addressId)
          .single();

        if (fetchError || !existingAddress) {
          return new Response(
            JSON.stringify({ error: "Address not found" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (existingAddress.user_id !== user_id) {
          return new Response(
            JSON.stringify({ error: "Unauthorized - address does not belong to user" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const validation = validateAddressInput(body.address || {});
        if (!validation.valid) {
          return new Response(
            JSON.stringify({ error: validation.error }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data, error } = await supabaseAdmin
          .from("addresses")
          .update({
            first_name: validation.data.first_name,
            last_name: validation.data.last_name,
            company: validation.data.company,
            country: validation.data.country,
            street_address: validation.data.street_address,
            street_address_2: validation.data.street_address_2,
            city: validation.data.city,
            state: validation.data.state,
            postcode: validation.data.postcode,
            phone: validation.data.phone,
          })
          .eq("id", addressId)
          .select()
          .single();

        if (error) {
          console.error("Error updating address:", error);
          return new Response(
            JSON.stringify({ error: "Failed to update address" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ data }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "delete": {
        const addressId = sanitizeString(body.address_id, 50);
        if (!addressId) {
          return new Response(
            JSON.stringify({ error: "Address ID is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Verify the address belongs to this user
        const { data: existingAddress, error: fetchError } = await supabaseAdmin
          .from("addresses")
          .select("id, user_id")
          .eq("id", addressId)
          .single();

        if (fetchError || !existingAddress) {
          return new Response(
            JSON.stringify({ error: "Address not found" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (existingAddress.user_id !== user_id) {
          return new Response(
            JSON.stringify({ error: "Unauthorized - address does not belong to user" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { error } = await supabaseAdmin
          .from("addresses")
          .delete()
          .eq("id", addressId);

        if (error) {
          console.error("Error deleting address:", error);
          return new Response(
            JSON.stringify({ error: "Failed to delete address" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action. Use: list, create, update, delete" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("Address management error:", error);
    return new Response(
      JSON.stringify({ error: "Service temporarily unavailable" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
