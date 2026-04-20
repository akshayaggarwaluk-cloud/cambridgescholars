// CMS Admin edge function
// Self-contained admin auth + CRUD using `cms_admin_accounts`.
// - login: verify email/password, return signed JWT (HS256)
// - whoami / all CRUD: verify Bearer JWT issued by this function
// - manage_admins: list/create/update/delete admin accounts (admin-only)
//
// All writes use the service role key. Never trust the client.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { create, verify, getNumericDate } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-admin-token, x-client-info, apikey, content-type",
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

// ─── JWT helpers ────────────────────────────────────────────────
const JWT_SECRET_RAW = Deno.env.get("CMS_ADMIN_JWT_SECRET") || "dev-secret-change-me";

let cachedKey: CryptoKey | null = null;
async function getKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey;
  cachedKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(JWT_SECRET_RAW),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  return cachedKey;
}

interface AdminClaims {
  sub: string;       // admin id
  email: string;
  exp: number;
}

async function issueToken(adminId: string, email: string): Promise<string> {
  const key = await getKey();
  return await create(
    { alg: "HS256", typ: "JWT" },
    {
      sub: adminId,
      email,
      exp: getNumericDate(60 * 60 * 12), // 12 hours
    },
    key,
  );
}

async function verifyToken(token: string): Promise<AdminClaims | null> {
  try {
    const key = await getKey();
    const payload = await verify(token, key);
    return payload as unknown as AdminClaims;
  } catch (e) {
    console.error("[cms-admin] token verify failed:", e);
    return null;
  }
}

async function requireAdmin(req: Request): Promise<AdminClaims | Response> {
  const token =
    req.headers.get("x-admin-token") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "Missing admin token" }, 401);
  const claims = await verifyToken(token);
  if (!claims) return json({ error: "Invalid or expired admin session" }, 401);

  // Confirm the account still exists & is active
  const { data, error } = await supabaseAdmin
    .from("cms_admin_accounts")
    .select("id, is_active")
    .eq("id", claims.sub)
    .maybeSingle();
  if (error || !data || !data.is_active) {
    return json({ error: "Admin account disabled or removed" }, 403);
  }
  return claims;
}

// ─── Main handler ───────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = req.method === "GET" ? {} : await req.json().catch(() => ({}));
    const action: string = body.action || new URL(req.url).searchParams.get("action") || "";

    // ─── Public: login ────────────────────────────────────────
    if (action === "login") {
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      if (!email || !password) return json({ error: "Email and password are required" }, 400);

      const { data: account, error } = await supabaseAdmin
        .from("cms_admin_accounts")
        .select("id, email, password_hash, is_active, name")
        .ilike("email", email)
        .maybeSingle();

      if (error || !account) return json({ error: "Invalid email or password" }, 401);
      if (!account.is_active) return json({ error: "This admin account is disabled" }, 403);

      const ok = await bcrypt.compare(password, account.password_hash);
      if (!ok) return json({ error: "Invalid email or password" }, 401);

      // best-effort: update last_login_at
      await supabaseAdmin
        .from("cms_admin_accounts")
        .update({ last_login_at: new Date().toISOString() })
        .eq("id", account.id);

      const token = await issueToken(account.id, account.email);
      return json({
        token,
        admin: { id: account.id, email: account.email, name: account.name },
      });
    }

    // ─── Everything below requires a valid admin token ────────
    const claimsOrResp = await requireAdmin(req);
    if (claimsOrResp instanceof Response) return claimsOrResp;
    const claims = claimsOrResp;

    switch (action) {
      case "whoami":
        return json({ ok: true, admin: { id: claims.sub, email: claims.email } });

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

      // ─── Admin account management ────────────────────────────
      case "list_admins": {
        const { data, error } = await supabaseAdmin
          .from("cms_admin_accounts")
          .select("id, email, name, is_active, last_login_at, created_at")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return json({ data });
      }
      case "create_admin": {
        const email = String(body.email || "").trim().toLowerCase();
        const password = String(body.password || "");
        if (!email || !password) return json({ error: "Email and password are required" }, 400);
        if (password.length < 8) return json({ error: "Password must be at least 8 characters" }, 400);

        const password_hash = await bcrypt.hash(password);
        const { data, error } = await supabaseAdmin
          .from("cms_admin_accounts")
          .insert({
            email,
            password_hash,
            name: body.name ?? null,
            is_active: body.is_active ?? true,
          })
          .select("id, email, name, is_active, created_at")
          .single();
        if (error) {
          if (error.code === "23505") return json({ error: "An admin with that email already exists" }, 409);
          throw error;
        }
        return json({ data });
      }
      case "update_admin": {
        if (!body.id) return json({ error: "Missing id" }, 400);
        const patch: Record<string, unknown> = {};
        if ("name" in body) patch.name = body.name;
        if ("is_active" in body) patch.is_active = body.is_active;
        if ("email" in body) patch.email = String(body.email).trim().toLowerCase();
        if (body.password) {
          if (String(body.password).length < 8) {
            return json({ error: "Password must be at least 8 characters" }, 400);
          }
          patch.password_hash = await bcrypt.hash(String(body.password));
        }
        const { data, error } = await supabaseAdmin
          .from("cms_admin_accounts")
          .update(patch)
          .eq("id", body.id)
          .select("id, email, name, is_active, last_login_at, created_at")
          .single();
        if (error) throw error;
        return json({ data });
      }
      case "delete_admin": {
        if (!body.id) return json({ error: "Missing id" }, 400);
        if (body.id === claims.sub) {
          return json({ error: "You cannot delete your own admin account" }, 400);
        }
        const { error } = await supabaseAdmin
          .from("cms_admin_accounts")
          .delete()
          .eq("id", body.id);
        if (error) throw error;
        return json({ ok: true });
      }

      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (e) {
    console.error("[cms-admin] error:", e);
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
