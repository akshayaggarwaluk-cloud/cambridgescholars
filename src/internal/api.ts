// API client and session handling for the internal employee file portal.

export const INTERNAL_API_BASE =
  import.meta.env.VITE_INTERNAL_API_BASE || "https://api.cambridgescholars.com/api/internal";

export const LOGIN_PATH = "/internal/login";

// ─── Folders ────────────────────────────────────────────────────

export const FOLDERS = ["allbooks", "ebooks", "samples", "croppedcovers", "amazoncroppedcovers"] as const;
export type FolderKey = (typeof FOLDERS)[number];

const FOLDER_LABELS: Record<FolderKey, string> = {
  allbooks: "Full Books",
  ebooks: "eBooks",
  samples: "Sample Chapters",
  croppedcovers: "Covers",
  amazoncroppedcovers: "Amazon Covers",
};

export const folderLabel = (key: string): string => FOLDER_LABELS[key as FolderKey] ?? key;

export const isFolderKey = (v: string | null | undefined): v is FolderKey =>
  !!v && (FOLDERS as readonly string[]).includes(v);

// ─── Session ────────────────────────────────────────────────────

const TOKEN_KEY = "csp_internal_token";
const NAME_KEY = "csp_internal_name";
const ADMIN_KEY = "csp_internal_is_admin";

interface TokenClaims {
  sub?: string;
  admin?: boolean;
  exp?: number;
}

function decodeClaims(token: string): TokenClaims | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "=");
    return JSON.parse(atob(b64)) as TokenClaims;
  } catch {
    return null;
  }
}

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export interface InternalSession {
  token: string;
  name: string;
  isAdmin: boolean;
  userId: string | null;
}

/** The stored session, or null when there is no token or it has expired. */
export function getSession(): InternalSession | null {
  const token = read(TOKEN_KEY);
  if (!token) return null;
  const claims = decodeClaims(token);
  if (!claims) return null;
  if (typeof claims.exp === "number" && claims.exp * 1000 <= Date.now()) return null;
  return {
    token,
    name: read(NAME_KEY) || "",
    // The token is authoritative; the stored flag only covers tokens without the claim.
    isAdmin: typeof claims.admin === "boolean" ? claims.admin : read(ADMIN_KEY) === "true",
    userId: claims.sub ?? null,
  };
}

export function saveSession(token: string, name: string, isAdmin: boolean) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(NAME_KEY, name);
  localStorage.setItem(ADMIN_KEY, String(isAdmin));
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(NAME_KEY);
    localStorage.removeItem(ADMIN_KEY);
  } catch {
    // Storage unavailable; nothing to clear.
  }
}

/** Login URL that returns the user to `path` afterwards. */
export function loginUrl(path?: string): string {
  return path && path.startsWith("/internal") && !path.startsWith(LOGIN_PATH)
    ? `${LOGIN_PATH}?next=${encodeURIComponent(path)}`
    : LOGIN_PATH;
}

function redirectToLogin() {
  clearSession();
  const here = window.location.pathname + window.location.search;
  window.location.replace(loginUrl(here));
}

// ─── Requests ───────────────────────────────────────────────────

export class InternalApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "InternalApiError";
    this.status = status;
  }
}

async function request<T>(
  path: string,
  init: { method?: string; body?: unknown; auth?: boolean; signal?: AbortSignal } = {},
): Promise<T> {
  const { method = "GET", body, auth = true, signal } = init;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const session = getSession();
    if (!session) {
      redirectToLogin();
      throw new InternalApiError(401, "Your session has expired. Please sign in again.");
    }
    headers.Authorization = `Bearer ${session.token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${INTERNAL_API_BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    throw new InternalApiError(0, "Could not reach the server. Check your connection and try again.");
  }

  if (res.status === 401 && auth) {
    redirectToLogin();
    throw new InternalApiError(401, "Your session has expired. Please sign in again.");
  }

  const text = await res.text();
  let json: unknown = undefined;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = undefined;
    }
  }

  if (!res.ok) {
    const obj = (json ?? {}) as { error?: unknown; message?: unknown };
    const msg =
      (typeof obj.error === "string" && obj.error) ||
      (typeof obj.message === "string" && obj.message) ||
      (res.status === 403 ? "You don't have permission to do that." : `Request failed (${res.status}).`);
    throw new InternalApiError(res.status, msg);
  }
  return json as T;
}

// ─── Endpoints ──────────────────────────────────────────────────

export interface LoginResponse {
  token: string;
  name: string;
  is_admin: boolean;
}

export function login(email: string, password: string) {
  return request<LoginResponse>("/auth/login", { method: "POST", body: { email, password }, auth: false });
}

export interface InternalFile {
  id: number;
  folder: string;
  s3_key: string;
  filename: string;
  size_bytes: number;
  last_modified: string;
}

export interface FileListResponse {
  data: InternalFile[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export function listFiles(
  params: { folder?: string; q?: string; page?: number; per_page?: number },
  signal?: AbortSignal,
) {
  const qs = new URLSearchParams();
  if (params.folder) qs.set("folder", params.folder);
  if (params.q) qs.set("q", params.q);
  qs.set("page", String(params.page ?? 1));
  qs.set("per_page", String(params.per_page ?? 50));
  return request<FileListResponse>(`/files?${qs}`, { signal });
}

export function getDownloadUrl(key: string) {
  return request<{ url: string; expires_in: number }>(`/files/download?key=${encodeURIComponent(key)}`);
}

export interface InternalUser {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  folders: string[];
  last_login: string | null;
  created_at: string | null;
}

export async function listUsers(): Promise<InternalUser[]> {
  const res = await request<{ data: InternalUser[] }>("/users");
  return res.data || [];
}

export interface NewUserInput {
  name: string;
  email: string;
  password: string;
  is_admin: boolean;
  folders: string[];
}

export function createUser(input: NewUserInput) {
  return request<{ id: number }>("/users", { method: "POST", body: input });
}

export type UserUpdate = Partial<{
  name: string;
  is_admin: boolean;
  is_active: boolean;
  password: string;
  folders: string[];
}>;

export function updateUser(id: number, update: UserUpdate) {
  return request<unknown>(`/users/${id}`, { method: "PUT", body: update });
}

export function deactivateUser(id: number) {
  return request<unknown>(`/users/${id}`, { method: "DELETE" });
}

export interface FolderStat {
  folder: string;
  file_count: number;
  last_modified: string | null;
}

export async function getIndexStats(): Promise<FolderStat[]> {
  const res = await request<{ data: FolderStat[] }>("/index/stats");
  return res.data || [];
}

// ─── Formatting ─────────────────────────────────────────────────

export function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null || !Number.isFinite(bytes)) return "—";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let v = bytes / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(1)} ${units[i]}`;
}

const dateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDateTime(value: string | null | undefined, empty = "—"): string {
  if (!value) return empty;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? empty : dateTimeFormat.format(d);
}
