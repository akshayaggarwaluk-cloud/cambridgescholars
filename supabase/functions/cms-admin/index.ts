// CMS Admin edge function
// Verifies a CSP access token by calling the upstream profile endpoint,
// checks the user's email against the cms_admins allowlist, and performs
// privileged CRUD on cms_hero_slides and cms_news_articles using the
// service role key.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const CSP_API_BASE =
  Deno.env.get("CSP_API_BASE") ||
  "https://api.cambridgescholars.com/api/website";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-csp-token, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function verifyCspUser(cspToken: string): Promise<string | null> {
  try {
    const res = await fetch(`${CSP_API_BASE}/account/profile`, {
      headers: { Authorization: `Bearer ${cspToken}` },
    });
    if (!res.ok) return null;
    const body = await res.json();
    const data = body?.data || body;
    const email: string | undefined = data?.email || data?.user?.email;
    return email ? email.toLowerCase() : null;
  } catch (e) {
    console.error("[cms-admin] verifyCspUser failed:", e);
    return null;
  }
}

async function isAdmin(email: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("cms_admins")
    .select("id")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  if (error) {
    console.error("[cms-admin] isAdmin query failed:", error);
    return false;
  }
  return !!data;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const cspToken =
      req.headers.get("x-csp-token") ||
      req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

    if (!cspToken) return json({ error: "Missing token" }, 401);

    const email = await verifyCspUser(cspToken);
    if (!email) return json({ error: "Invalid CSP session" }, 401);

    const allowed = await isAdmin(email);
    if (!allowed) return json({ error: "Not an admin", email }, 403);

    const body = req.method === "GET" ? {} : await req.json().catch(() => ({}));
    const action: string = body.action || new URL(req.url).searchParams.get("action") || "whoami";

    switch (action) {
      // ─── Auth check ──────────────────────────────────────────
      case "whoami":
        return json({ ok: true, email, admin: true });

      // ─── Hero slides ─────────────────────────────────────────
      case "list_hero": {
        const { data, error } = await supabaseAdmin
          .from("cms_hero_slides")
          .select("*")
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false });
        if (error) throw error;
        return json({ data });
      }
      case "create_hero": {
        const { data, error } = await supabaseAdmin
          .from("cms_hero_slides")
          .insert({
            title: body.title,
            subtitle: body.subtitle ?? null,
            quote: body.quote ?? null,
            reviewer_name: body.reviewer_name ?? null,
            reviewer_position: body.reviewer_position ?? null,
            cover_image: body.cover_image ?? null,
            link_url: body.link_url ?? null,
            display_order: body.display_order ?? 0,
            is_published: body.is_published ?? true,
          })
          .select()
          .single();
        if (error) throw error;
        return json({ data });
      }
      case "update_hero": {
        if (!body.id) return json({ error: "Missing id" }, 400);
        const patch: Record<string, unknown> = {};
        for (const k of [
          "title", "subtitle", "quote", "reviewer_name", "reviewer_position",
          "cover_image", "link_url", "display_order", "is_published",
        ]) if (k in body) patch[k] = body[k];
        const { data, error } = await supabaseAdmin
          .from("cms_hero_slides")
          .update(patch)
          .eq("id", body.id)
          .select()
          .single();
        if (error) throw error;
        return json({ data });
      }
      case "delete_hero": {
        if (!body.id) return json({ error: "Missing id" }, 400);
        const { error } = await supabaseAdmin
          .from("cms_hero_slides")
          .delete()
          .eq("id", body.id);
        if (error) throw error;
        return json({ ok: true });
      }

      // ─── News articles ───────────────────────────────────────
      case "list_news": {
        const { data, error } = await supabaseAdmin
          .from("cms_news_articles")
          .select("*")
          .order("published_at", { ascending: false });
        if (error) throw error;
        return json({ data });
      }
      case "create_news": {
        if (!body.slug || !body.title) {
          return json({ error: "slug and title are required" }, 400);
        }
        const { data, error } = await supabaseAdmin
          .from("cms_news_articles")
          .insert({
            slug: body.slug,
            title: body.title,
            excerpt: body.excerpt ?? null,
            content: body.content ?? null,
            cover_image: body.cover_image ?? null,
            category: body.category ?? null,
            author: body.author ?? null,
            published_at: body.published_at || new Date().toISOString(),
            is_published: body.is_published ?? true,
          })
          .select()
          .single();
        if (error) throw error;
        return json({ data });
      }
      case "update_news": {
        if (!body.id) return json({ error: "Missing id" }, 400);
        const patch: Record<string, unknown> = {};
        for (const k of [
          "slug", "title", "excerpt", "content", "cover_image",
          "category", "author", "published_at", "is_published",
        ]) if (k in body) patch[k] = body[k];
        const { data, error } = await supabaseAdmin
          .from("cms_news_articles")
          .update(patch)
          .eq("id", body.id)
          .select()
          .single();
        if (error) throw error;
        return json({ data });
      }
      case "delete_news": {
        if (!body.id) return json({ error: "Missing id" }, 400);
        const { error } = await supabaseAdmin
          .from("cms_news_articles")
          .delete()
          .eq("id", body.id);
        if (error) throw error;
        return json({ ok: true });
      }

      // ─── Image upload (base64) ───────────────────────────────
      case "upload_image": {
        const { filename, content_type, base64 } = body;
        if (!filename || !base64) return json({ error: "Missing filename or base64" }, 400);
        const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        const path = `${Date.now()}-${filename.replace(/[^\w.\-]/g, "_")}`;
        const { error: upErr } = await supabaseAdmin.storage
          .from("cms-media")
          .upload(path, bytes, {
            contentType: content_type || "application/octet-stream",
            upsert: false,
          });
        if (upErr) throw upErr;
        const { data: pub } = supabaseAdmin.storage.from("cms-media").getPublicUrl(path);
        return json({ url: pub.publicUrl, path });
      }

      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (e) {
    console.error("[cms-admin] error:", e);
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
