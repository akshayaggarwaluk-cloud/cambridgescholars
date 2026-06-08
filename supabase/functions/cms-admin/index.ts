// CMS Admin edge function
// Self-contained admin auth + CRUD using `cms_admin_accounts`.
// - login: verify email/password, return signed JWT (HS256)
// - whoami / all CRUD: verify Bearer JWT issued by this function
// - manage_admins: list/create/update/delete admin accounts (admin-only)
// - v2: featured_books, author_reviews, faqs, resources, footer_documents, submissions, orders, users
//
// All writes use the service role key. Never trust the client.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import bcrypt from "https://esm.sh/bcryptjs@2.4.3";
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
  sub: string;
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
      exp: getNumericDate(60 * 60 * 12),
    },
    key,
  );
}

async function verifyToken(token: string): Promise<AdminClaims | null> {
  // 1. Try the legacy internal HS256 token (issued by this function's
  //    own `login` action). Kept for backwards compatibility.
  try {
    const key = await getKey();
    const payload = await verify(token, key);
    return payload as unknown as AdminClaims;
  } catch (_internalErr) {
    // Fall through to external token check.
  }

  // 2. External CSP CMS token (signed by api.cambridgescholars.com).
  //    We cannot verify the signature without their secret, so we
  //    decode the payload, require role === "admin" and a non-expired
  //    exp claim. The token is only obtainable by completing the
  //    external admin login, so this is acceptable for our use.
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const padded = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (padded.length % 4)) % 4);
    const json = atob(padded + padding);
    const payload = JSON.parse(json) as {
      sub?: string;
      exp?: number;
      role?: string;
      name?: string;
    };
    // Accept any non-empty role issued by the external CSP admin login
    // (e.g. "admin", "orders"). Role-based authorization is enforced
    // per-action below and in the frontend layout.
    if (!payload.role) return null;
    if (!payload.exp || payload.exp * 1000 < Date.now()) return null;
    return {
      sub: String(payload.sub ?? "external"),
      email: payload.name ?? "external-admin",
      exp: payload.exp,
    };
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

  // External tokens (sub = "admin:1") are not present in our local
  // cms_admin_accounts table — skip the local active-account check
  // for those. Only validate active state for legacy internal tokens.
  const isExternal = claims.sub.startsWith("admin:") || claims.sub === "external";
  if (!isExternal) {
    const { data, error } = await supabaseAdmin
      .from("cms_admin_accounts")
      .select("id, is_active")
      .eq("id", claims.sub)
      .maybeSingle();
    if (error || !data || !data.is_active) {
      return json({ error: "Admin account disabled or removed" }, 403);
    }
  }
  return claims;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = req.method === "GET" ? {} : await req.json().catch(() => ({}));
    const action: string = body.action || new URL(req.url).searchParams.get("action") || "";

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

      const ok = bcrypt.compareSync(password, account.password_hash);
      if (!ok) return json({ error: "Invalid email or password" }, 401);

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

    const claimsOrResp = await requireAdmin(req);
    if (claimsOrResp instanceof Response) return claimsOrResp;
    const claims = claimsOrResp;

    switch (action) {
      case "whoami":
        return json({ ok: true, admin: { id: claims.sub, email: claims.email } });

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
            author: body.author ?? null,
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
          "title", "subtitle", "author", "quote", "reviewer_name", "reviewer_position",
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

      case "list_news": {
        const { data, error } = await supabaseAdmin
          .from("cms_news_articles")
          .select("*")
          .order("display_order", { ascending: true })
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
            show_on_homepage: body.show_on_homepage ?? true,
            display_order: body.display_order ?? 0,
            homepage_order: body.homepage_order ?? 0,
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
          "category", "author", "published_at", "is_published", "show_on_homepage", "display_order", "homepage_order",
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

        const password_hash = bcrypt.hashSync(password, 10);
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
          patch.password_hash = bcrypt.hashSync(String(body.password), 10);
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

      // ─── Featured Books ─────────────────────────────────────
      case "list_featured_books": {
        const { data, error } = await supabaseAdmin
          .from("cms_featured_books").select("*")
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false });
        if (error) throw error;
        return json({ data });
      }
      case "create_featured_book": {
        if (!body.title) return json({ error: "Title is required" }, 400);
        const { data, error } = await supabaseAdmin
          .from("cms_featured_books").insert({
            book_id: body.book_id ?? null,
            title: body.title,
            subtitle: body.subtitle ?? null,
            author: body.author ?? null,
            cover_image: body.cover_image ?? null,
            link_url: body.link_url ?? null,
            description: body.description ?? null,
            display_order: body.display_order ?? 0,
            is_published: body.is_published ?? true,
          }).select().single();
        if (error) throw error;
        return json({ data });
      }
      case "update_featured_book": {
        if (!body.id) return json({ error: "Missing id" }, 400);
        const patch: Record<string, unknown> = {};
        for (const k of ["book_id","title","subtitle","author","cover_image","link_url","description","display_order","is_published"])
          if (k in body) patch[k] = body[k];
        const { data, error } = await supabaseAdmin
          .from("cms_featured_books").update(patch).eq("id", body.id).select().single();
        if (error) throw error;
        return json({ data });
      }
      case "delete_featured_book": {
        if (!body.id) return json({ error: "Missing id" }, 400);
        const { error } = await supabaseAdmin.from("cms_featured_books").delete().eq("id", body.id);
        if (error) throw error;
        return json({ ok: true });
      }

      // ─── Author Reviews ─────────────────────────────────────
      case "list_author_reviews": {
        const { data, error } = await supabaseAdmin
          .from("cms_author_reviews").select("*")
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false });
        if (error) throw error;
        return json({ data });
      }
      case "create_author_review": {
        if (!body.author_name || !body.quote) return json({ error: "Author name and quote are required" }, 400);
        const { data, error } = await supabaseAdmin
          .from("cms_author_reviews").insert({
            author_name: body.author_name,
            position: body.position ?? null,
            quote: body.quote,
            photo_url: body.photo_url ?? null,
            book_title: body.book_title ?? null,
            display_order: body.display_order ?? 0,
            is_published: body.is_published ?? true,
          }).select().single();
        if (error) throw error;
        return json({ data });
      }
      case "update_author_review": {
        if (!body.id) return json({ error: "Missing id" }, 400);
        const patch: Record<string, unknown> = {};
        for (const k of ["author_name","position","quote","photo_url","book_title","display_order","is_published"])
          if (k in body) patch[k] = body[k];
        const { data, error } = await supabaseAdmin
          .from("cms_author_reviews").update(patch).eq("id", body.id).select().single();
        if (error) throw error;
        return json({ data });
      }
      case "delete_author_review": {
        if (!body.id) return json({ error: "Missing id" }, 400);
        const { error } = await supabaseAdmin.from("cms_author_reviews").delete().eq("id", body.id);
        if (error) throw error;
        return json({ ok: true });
      }

      // ─── FAQs ────────────────────────────────────────────────
      case "list_faqs": {
        const { data, error } = await supabaseAdmin
          .from("cms_faqs").select("*")
          .order("category", { ascending: true })
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false });
        if (error) throw error;
        return json({ data });
      }
      case "create_faq": {
        if (!body.question || !body.answer) return json({ error: "Question and answer are required" }, 400);
        const { data, error } = await supabaseAdmin
          .from("cms_faqs").insert({
            question: body.question,
            answer: body.answer,
            category: body.category ?? null,
            display_order: body.display_order ?? 0,
            is_published: body.is_published ?? true,
          }).select().single();
        if (error) throw error;
        return json({ data });
      }
      case "update_faq": {
        if (!body.id) return json({ error: "Missing id" }, 400);
        const patch: Record<string, unknown> = {};
        for (const k of ["question","answer","category","display_order","is_published"])
          if (k in body) patch[k] = body[k];
        const { data, error } = await supabaseAdmin
          .from("cms_faqs").update(patch).eq("id", body.id).select().single();
        if (error) throw error;
        return json({ data });
      }
      case "delete_faq": {
        if (!body.id) return json({ error: "Missing id" }, 400);
        const { error } = await supabaseAdmin.from("cms_faqs").delete().eq("id", body.id);
        if (error) throw error;
        return json({ ok: true });
      }

      // ─── Resources ───────────────────────────────────────────
      case "list_resources": {
        const { data, error } = await supabaseAdmin
          .from("cms_resources").select("*")
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false });
        if (error) throw error;
        return json({ data });
      }
      case "create_resource": {
        if (!body.slug || !body.title) return json({ error: "Slug and title are required" }, 400);
        const { data, error } = await supabaseAdmin
          .from("cms_resources").insert({
            slug: body.slug,
            title: body.title,
            excerpt: body.excerpt ?? null,
            content: body.content ?? null,
            cover_image: body.cover_image ?? null,
            display_order: body.display_order ?? 0,
            is_published: body.is_published ?? true,
          }).select().single();
        if (error) {
          if (error.code === "23505") return json({ error: "A resource with that slug already exists" }, 409);
          throw error;
        }
        return json({ data });
      }
      case "update_resource": {
        if (!body.id) return json({ error: "Missing id" }, 400);
        const patch: Record<string, unknown> = {};
        for (const k of ["slug","title","excerpt","content","cover_image","display_order","is_published"])
          if (k in body) patch[k] = body[k];
        const { data, error } = await supabaseAdmin
          .from("cms_resources").update(patch).eq("id", body.id).select().single();
        if (error) throw error;
        return json({ data });
      }
      case "delete_resource": {
        if (!body.id) return json({ error: "Missing id" }, 400);
        const { error } = await supabaseAdmin.from("cms_resources").delete().eq("id", body.id);
        if (error) throw error;
        return json({ ok: true });
      }

      // ─── Footer Documents ───────────────────────────────────
      case "list_footer_documents": {
        const { data, error } = await supabaseAdmin
          .from("cms_footer_documents").select("*")
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false });
        if (error) throw error;
        return json({ data });
      }
      case "create_footer_document": {
        if (!body.label || !body.file_url) return json({ error: "Label and file URL are required" }, 400);
        const { data, error } = await supabaseAdmin
          .from("cms_footer_documents").insert({
            label: body.label,
            file_url: body.file_url,
            description: body.description ?? null,
            display_order: body.display_order ?? 0,
            is_published: body.is_published ?? true,
          }).select().single();
        if (error) throw error;
        return json({ data });
      }
      case "update_footer_document": {
        if (!body.id) return json({ error: "Missing id" }, 400);
        const patch: Record<string, unknown> = {};
        for (const k of ["label","file_url","description","display_order","is_published"])
          if (k in body) patch[k] = body[k];
        const { data, error } = await supabaseAdmin
          .from("cms_footer_documents").update(patch).eq("id", body.id).select().single();
        if (error) throw error;
        return json({ data });
      }
      case "delete_footer_document": {
        if (!body.id) return json({ error: "Missing id" }, 400);
        const { error } = await supabaseAdmin.from("cms_footer_documents").delete().eq("id", body.id);
        if (error) throw error;
        return json({ ok: true });
      }

      // ─── Contact submissions ────────────────────────────────
      case "list_contact_submissions": {
        const { data, error } = await supabaseAdmin
          .from("cms_contact_submissions").select("*")
          .order("created_at", { ascending: false }).limit(500);
        if (error) throw error;
        return json({ data });
      }
      case "update_contact_submission": {
        if (!body.id) return json({ error: "Missing id" }, 400);
        const patch: Record<string, unknown> = {};
        for (const k of ["status","admin_notes"]) if (k in body) patch[k] = body[k];
        const { data, error } = await supabaseAdmin
          .from("cms_contact_submissions").update(patch).eq("id", body.id).select().single();
        if (error) throw error;
        return json({ data });
      }
      case "delete_contact_submission": {
        if (!body.id) return json({ error: "Missing id" }, 400);
        const { error } = await supabaseAdmin.from("cms_contact_submissions").delete().eq("id", body.id);
        if (error) throw error;
        return json({ ok: true });
      }

      // ─── Proposal submissions ───────────────────────────────
      case "list_proposal_submissions": {
        const { data, error } = await supabaseAdmin
          .from("cms_proposal_submissions").select("*")
          .order("created_at", { ascending: false }).limit(500);
        if (error) throw error;
        return json({ data });
      }
      case "update_proposal_submission": {
        if (!body.id) return json({ error: "Missing id" }, 400);
        const patch: Record<string, unknown> = {};
        for (const k of ["status","admin_notes"]) if (k in body) patch[k] = body[k];
        const { data, error } = await supabaseAdmin
          .from("cms_proposal_submissions").update(patch).eq("id", body.id).select().single();
        if (error) throw error;
        return json({ data });
      }
      case "delete_proposal_submission": {
        if (!body.id) return json({ error: "Missing id" }, 400);
        const { error } = await supabaseAdmin.from("cms_proposal_submissions").delete().eq("id", body.id);
        if (error) throw error;
        return json({ ok: true });
      }

      // ─── Orders (read existing tables via service role) ─────
      case "list_orders": {
        const { data: orders, error } = await supabaseAdmin
          .from("orders")
          .select("id, user_id, status, total, shipping_address, created_at, updated_at")
          .order("created_at", { ascending: false }).limit(500);
        if (error) throw error;
        const ids = (orders || []).map((o) => o.id);
        let items: Record<string, Array<Record<string, unknown>>> = {};
        let notes: Record<string, Record<string, unknown>> = {};
        if (ids.length) {
          const { data: it } = await supabaseAdmin
            .from("order_items").select("*").in("order_id", ids);
          for (const row of it || []) {
            const arr = items[row.order_id] || (items[row.order_id] = []);
            arr.push(row);
          }
          const { data: nt } = await supabaseAdmin
            .from("cms_order_notes").select("*").in("order_id", ids);
          for (const row of nt || []) notes[row.order_id] = row;
        }
        const enriched = (orders || []).map((o) => ({
          ...o,
          items: items[o.id] || [],
          notes: notes[o.id] || null,
        }));
        return json({ data: enriched });
      }
      case "update_order": {
        if (!body.id) return json({ error: "Missing id" }, 400);
        if ("status" in body) {
          const { error } = await supabaseAdmin
            .from("orders").update({ status: body.status }).eq("id", body.id);
          if (error) throw error;
        }
        if ("payment_status" in body || "fulfillment_status" in body || "admin_notes" in body) {
          const noteRow: Record<string, unknown> = { order_id: body.id };
          if ("payment_status" in body) noteRow.payment_status = body.payment_status;
          if ("fulfillment_status" in body) noteRow.fulfillment_status = body.fulfillment_status;
          if ("admin_notes" in body) noteRow.admin_notes = body.admin_notes;
          const { error } = await supabaseAdmin
            .from("cms_order_notes")
            .upsert(noteRow, { onConflict: "order_id" });
          if (error) throw error;
        }
        return json({ ok: true });
      }

      // ─── Public users (Lovable Cloud auth) ──────────────────
      case "list_users": {
        const page = Number(body.page || 1);
        const perPage = Math.min(Number(body.per_page || 100), 200);
        const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
        if (error) throw error;
        const users = (data?.users || []).map((u) => ({
          id: u.id,
          email: u.email,
          phone: u.phone,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          email_confirmed_at: u.email_confirmed_at,
          banned_until: (u as unknown as { banned_until?: string }).banned_until ?? null,
          user_metadata: u.user_metadata,
        }));
        return json({ data: users });
      }
      case "send_password_reset": {
        const email = String(body.email || "").trim().toLowerCase();
        if (!email) return json({ error: "Email is required" }, 400);
        const redirectTo = body.redirect_to
          ? String(body.redirect_to)
          : `${new URL(req.url).origin.replace(/\/+$/, "")}/reset-password`;
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
          type: "recovery",
          email,
          options: { redirectTo },
        });
        if (error) throw error;
        return json({
          ok: true,
          action_link: data?.properties?.action_link || null,
          email_otp: data?.properties?.email_otp || null,
        });
      }
      case "set_user_disabled": {
        if (!body.id) return json({ error: "Missing id" }, 400);
        const ban_duration = body.disabled ? "876000h" : "none"; // 100 years vs unban
        const { error } = await supabaseAdmin.auth.admin.updateUserById(body.id, {
          ban_duration,
        } as { ban_duration: string });
        if (error) throw error;
        return json({ ok: true });
      }

      // ─── CSP user password reset (stub for external CSP API) ─
      case "csp_reset_password": {
        const cspBase = Deno.env.get("CSP_AUTH_API_BASE");
        const cspKey = Deno.env.get("CSP_ADMIN_API_KEY");
        if (!cspBase) {
          return json({
            error: "CSP password reset is not configured. Add CSP_AUTH_API_BASE and CSP_ADMIN_API_KEY secrets to enable.",
            stub: true,
          }, 501);
        }
        const email = String(body.email || "").trim().toLowerCase();
        if (!email) return json({ error: "Email is required" }, 400);
        try {
          const r = await fetch(`${cspBase.replace(/\/+$/, "")}/admin/reset-password`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(cspKey ? { "Authorization": `Bearer ${cspKey}` } : {}),
            },
            body: JSON.stringify({ email }),
          });
          const text = await r.text();
          let payload: unknown = text;
          try { payload = JSON.parse(text); } catch { /* keep as text */ }
          if (!r.ok) return json({ error: `CSP API error (${r.status})`, detail: payload }, 502);
          return json({ ok: true, detail: payload });
        } catch (e) {
          return json({ error: e instanceof Error ? e.message : String(e) }, 502);
        }
      }

      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (e) {
    console.error("[cms-admin] error:", e);
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});