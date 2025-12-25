import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, requestHuman } = await req.json();
    console.log("Received chat request:", { messageCount: messages?.length, requestHuman });

    if (!messages || !Array.isArray(messages)) {
      throw new Error("Messages array is required");
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // If user requests human support, return escalation message
    if (requestHuman) {
      console.log("User requested human support escalation");
      return new Response(JSON.stringify({
        message: "I've notified our support team about your request. A human agent will be with you shortly. In the meantime, you can continue chatting with me or check our FAQ page for common questions. Our support hours are Monday-Friday, 9 AM - 6 PM EST.",
        escalated: true,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // System prompt for the bookstore AI assistant
    const systemPrompt = `You are a friendly and helpful customer support assistant for Biblioscape, an online bookstore. 

Your role is to:
- Answer questions about orders, shipping, returns, and refunds
- Help customers find books and provide recommendations
- Explain our eBook and hardcover options
- Assist with account-related questions
- Provide information about publishing with Biblioscape

Key information:
- Free shipping on orders over $35
- 30-day return policy for books in original condition
- eBooks are 40% cheaper than hardcover versions
- eBooks available in EPUB and PDF formats
- Authors can publish through our platform with competitive royalties

Always be polite, concise, and helpful. If you cannot help with something or the customer seems frustrated, suggest connecting them with a human support agent.

Keep responses friendly but professional, and under 150 words unless detailed explanation is needed.`;

    const response = await fetch(LOVABLE_AI_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received successfully");

    const aiMessage = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that. Please try again.";

    return new Response(JSON.stringify({
      message: aiMessage,
      escalated: false,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("Error in live-chat function:", errorMessage);
    return new Response(JSON.stringify({ 
      error: errorMessage,
      message: "I'm having trouble connecting right now. Please try again or contact us at support@biblioscape.com" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
