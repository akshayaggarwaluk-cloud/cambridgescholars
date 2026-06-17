import { useEffect, useState } from "react";
import { fetchPolicyPageBySlug, type CmsPolicyPage } from "@/services/cmsService";

/**
 * Loads an editable policy page (Privacy, Cookies, Terms, etc.) from CMS.
 * Returns `null` while loading, or the page row when fetched.
 * If content is empty, callers should fall back to the page's static markup.
 */
export function usePolicyPage(slug: string) {
  const [page, setPage] = useState<CmsPolicyPage | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPolicyPageBySlug(slug)
      .then((p) => { if (!cancelled) { setPage(p); setLoaded(true); } })
      .catch(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, [slug]);

  const hasCustom = !!(page?.content && page.content.trim().length > 0);
  return { page, loaded, hasCustom };
}