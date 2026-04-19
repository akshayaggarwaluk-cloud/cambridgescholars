/**
 * CMS service — wraps the cms-admin edge function.
 * The CSP access token is sent via the X-CSP-Token header so the
 * function can verify the user upstream and check admin allowlist.
 */
import { supabase } from "@/integrations/supabase/client";

export interface CmsHeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  quote: string | null;
  reviewer_name: string | null;
  reviewer_position: string | null;
  cover_image: string | null;
  link_url: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CmsNewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  category: string | null;
  author: string | null;
  published_at: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Public reads (no auth) ─────────────────────────────────────

export async function fetchPublishedHeroSlides(): Promise<CmsHeroSlide[]> {
  const { data, error } = await supabase
    .from("cms_hero_slides")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as CmsHeroSlide[];
}

export async function fetchPublishedNews(): Promise<CmsNewsArticle[]> {
  const { data, error } = await supabase
    .from("cms_news_articles")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data || []) as CmsNewsArticle[];
}

export async function fetchPublishedNewsBySlug(slug: string): Promise<CmsNewsArticle | null> {
  const { data, error } = await supabase
    .from("cms_news_articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) throw error;
  return (data || null) as CmsNewsArticle | null;
}

// ─── Admin calls (via edge function) ────────────────────────────

async function callAdmin<T = unknown>(
  cspToken: string | null,
  body: Record<string, unknown>,
): Promise<T> {
  if (!cspToken) throw new Error("Not signed in");
  const { data, error } = await supabase.functions.invoke("cms-admin", {
    body,
    headers: { "X-CSP-Token": cspToken },
  });
  if (error) {
    // Try to surface the structured error returned by the function
    type ErrCtx = { context?: { body?: string } };
    const ctxBody = (error as ErrCtx).context?.body;
    if (ctxBody) {
      try {
        const parsed = JSON.parse(ctxBody);
        if (parsed?.error) throw new Error(parsed.error);
      } catch {
        /* fall through */
      }
    }
    throw new Error(error.message || "Admin request failed");
  }
  if ((data as { error?: string })?.error) {
    throw new Error((data as { error: string }).error);
  }
  return data as T;
}

export async function checkIsAdmin(cspToken: string | null): Promise<boolean> {
  if (!cspToken) return false;
  try {
    const res = await callAdmin<{ admin?: boolean }>(cspToken, { action: "whoami" });
    return !!res.admin;
  } catch {
    return false;
  }
}

export const adminApi = {
  listHero: (t: string) =>
    callAdmin<{ data: CmsHeroSlide[] }>(t, { action: "list_hero" }).then((r) => r.data),
  createHero: (t: string, payload: Partial<CmsHeroSlide>) =>
    callAdmin<{ data: CmsHeroSlide }>(t, { action: "create_hero", ...payload }).then((r) => r.data),
  updateHero: (t: string, payload: Partial<CmsHeroSlide> & { id: string }) =>
    callAdmin<{ data: CmsHeroSlide }>(t, { action: "update_hero", ...payload }).then((r) => r.data),
  deleteHero: (t: string, id: string) =>
    callAdmin(t, { action: "delete_hero", id }),

  listNews: (t: string) =>
    callAdmin<{ data: CmsNewsArticle[] }>(t, { action: "list_news" }).then((r) => r.data),
  createNews: (t: string, payload: Partial<CmsNewsArticle>) =>
    callAdmin<{ data: CmsNewsArticle }>(t, { action: "create_news", ...payload }).then((r) => r.data),
  updateNews: (t: string, payload: Partial<CmsNewsArticle> & { id: string }) =>
    callAdmin<{ data: CmsNewsArticle }>(t, { action: "update_news", ...payload }).then((r) => r.data),
  deleteNews: (t: string, id: string) =>
    callAdmin(t, { action: "delete_news", id }),

  uploadImage: async (t: string, file: File): Promise<string> => {
    const buf = await file.arrayBuffer();
    let binary = "";
    const bytes = new Uint8Array(buf);
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
    }
    const base64 = btoa(binary);
    const res = await callAdmin<{ url: string }>(t, {
      action: "upload_image",
      filename: file.name,
      content_type: file.type,
      base64,
    });
    return res.url;
  },
};
