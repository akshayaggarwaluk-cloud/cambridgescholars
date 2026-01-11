import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

// Simple in-memory rate limiting (per IP, per minute)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX_REQUESTS = 20; // 20 requests per minute
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  entry.count++;
  return true;
}

// Input validation constants
const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_TOTAL_CONTENT_LENGTH = 10000;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'anonymous';
    
    if (!checkRateLimit(clientIP)) {
      console.log("Rate limit exceeded for:", clientIP);
      return new Response(JSON.stringify({
        error: 'Rate limit exceeded',
        message: "You're sending too many messages. Please wait a moment before trying again."
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { messages, requestHuman } = body;
    console.log("Received chat request:", { messageCount: messages?.length, requestHuman });

    // Validate messages array exists
    if (!messages || !Array.isArray(messages)) {
      throw new Error("Messages array is required");
    }

    // Validate message count
    if (messages.length > MAX_MESSAGES) {
      return new Response(JSON.stringify({
        error: 'Too many messages',
        message: "Your conversation is too long. Please start a new chat session."
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate individual messages
    let totalContentLength = 0;
    for (const msg of messages) {
      if (!msg || typeof msg !== 'object') {
        return new Response(JSON.stringify({
          error: 'Invalid message format',
          message: "There was an issue with your message format. Please try again."
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (!msg.role || !['user', 'assistant', 'system'].includes(msg.role)) {
        return new Response(JSON.stringify({
          error: 'Invalid message role',
          message: "There was an issue with your message. Please try again."
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const content = msg.content || '';
      if (typeof content !== 'string') {
        return new Response(JSON.stringify({
          error: 'Invalid message content',
          message: "There was an issue with your message content. Please try again."
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (content.length > MAX_MESSAGE_LENGTH) {
        return new Response(JSON.stringify({
          error: 'Message too long',
          message: `Your message is too long. Please keep messages under ${MAX_MESSAGE_LENGTH} characters.`
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      totalContentLength += content.length;
    }

    // Check total content length
    if (totalContentLength > MAX_TOTAL_CONTENT_LENGTH) {
      return new Response(JSON.stringify({
        error: 'Conversation too large',
        message: "Your conversation history is too large. Please start a new chat session."
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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
      error: 'Internal error',
      message: "I'm having trouble connecting right now. Please try again or contact us at support@biblioscape.com" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
