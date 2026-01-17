import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Mock book prices - these are the authoritative prices for static catalog books
const MOCK_BOOK_PRICES: Record<string, number> = {
  "1": 16.99,  // The Midnight Library
  "2": 18.99,  // Atomic Habits
  "3": 14.99,  // Where the Crawdads Sing
  "4": 15.99,  // Educated
  "5": 8.99,   // The Very Hungry Caterpillar
  "6": 22.99,  // Sapiens
  "7": 19.99,  // Project Hail Mary
  "8": 17.99,  // The Psychology of Money
  "9": 89.99,  // Introduction to Algorithms
  "10": 9.99,  // Goodnight Moon
  "11": 13.99, // The Silent Patient
  "12": 16.99, // Thinking, Fast and Slow
};

interface CartItem {
  id: string;
  title: string;
  author: string;
  image: string;
  quantity: number;
  format?: string;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  phone: string;
}

interface CreateOrderRequest {
  items: CartItem[];
  shippingAddress: ShippingAddress;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse and validate request body
    const body: CreateOrderRequest = await req.json();
    
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid items array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!body.shippingAddress) {
      return new Response(
        JSON.stringify({ error: "Missing shipping address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate each item and calculate server-side total
    let calculatedTotal = 0;
    const validatedItems: Array<{
      book_id: string;
      book_title: string;
      book_author: string;
      book_image: string | null;
      price: number;
      quantity: number;
    }> = [];

    for (const item of body.items) {
      // Validate item structure
      if (!item.id || !item.title || !item.author || typeof item.quantity !== "number") {
        return new Response(
          JSON.stringify({ error: `Invalid item structure for item ${item.id}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validate quantity
      if (item.quantity < 1 || item.quantity > 100) {
        return new Response(
          JSON.stringify({ error: `Invalid quantity for item ${item.id}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      let verifiedPrice: number | null = null;

      // Check if it's a mock/static book (IDs 1-12 are string numbers)
      if (MOCK_BOOK_PRICES[item.id]) {
        verifiedPrice = MOCK_BOOK_PRICES[item.id];
      } else {
        // Check if it's a user-published book from database
        const { data: publishedBook, error: bookError } = await supabase
          .from("published_books")
          .select("price, title, author")
          .eq("id", item.id)
          .single();

        if (bookError || !publishedBook) {
          return new Response(
            JSON.stringify({ error: `Book not found: ${item.id}` }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        verifiedPrice = Number(publishedBook.price);
      }

      if (verifiedPrice === null || isNaN(verifiedPrice) || verifiedPrice < 0) {
        return new Response(
          JSON.stringify({ error: `Invalid price for book ${item.id}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      calculatedTotal += verifiedPrice * item.quantity;
      
      validatedItems.push({
        book_id: item.id,
        book_title: item.title.slice(0, 500), // Limit title length
        book_author: item.author.slice(0, 255), // Limit author length
        book_image: item.image ? item.image.slice(0, 1000) : null,
        price: verifiedPrice,
        quantity: item.quantity,
      });
    }

    // Round to 2 decimal places to avoid floating point issues
    calculatedTotal = Math.round(calculatedTotal * 100) / 100;

    console.log(`Creating order for user ${user.id} with server-calculated total: $${calculatedTotal}`);

    // Create the order with server-calculated total
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total: calculatedTotal,
        status: "completed",
        shipping_address: {
          firstName: body.shippingAddress.firstName?.slice(0, 100) || "",
          lastName: body.shippingAddress.lastName?.slice(0, 100) || "",
          address: body.shippingAddress.address?.slice(0, 500) || "",
          city: body.shippingAddress.city?.slice(0, 100) || "",
          zip: body.shippingAddress.zip?.slice(0, 20) || "",
          phone: body.shippingAddress.phone?.slice(0, 20) || "",
        },
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return new Response(
        JSON.stringify({ error: "Failed to create order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create order items
    const orderItems = validatedItems.map((item) => ({
      order_id: order.id,
      ...item,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      // Note: In production, you'd want to rollback the order here
      return new Response(
        JSON.stringify({ error: "Failed to create order items" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Order ${order.id} created successfully with ${validatedItems.length} items`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        order: {
          id: order.id,
          total: calculatedTotal,
          status: order.status,
        }
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Create order error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Failed to process order", message: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
