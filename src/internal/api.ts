// API client and session handling for the internal employee file portal.

export const INTERNAL_API_BASE =
  import.meta.env.VITE_INTERNAL_API_BASE || "https://api.cambridgescholars.com/api/internal";

export const LOGIN_PATH = "/internal/login";

// ─── Folders ────────────────────────────────────────────────────

// Folder names come from GET /folders and are shown in title case with
// underscores as spaces (dj_mats_decided → "Dj Mats Decided"), so new
// folders need no code change.
export const folderLabel = (key: string): string => key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// ─── Session ────────────────────────────────────────────────────

const TOKEN_KEY = "internal_token";
/** Earlier versions stored the token here; removed on sign-in and sign-out. */
const LEGACY_TOKEN_KEY = "csp_internal_token";
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
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(NAME_KEY, name);
  localStorage.setItem(ADMIN_KEY, String(isAdmin));
}

export function clearSession() {
  try {
    localStorage.removeItem(LEGACY_TOKEN_KEY);
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

/** A folder the current user can open, and whether they may upload to it. */
export interface FolderAccess {
  folder: string;
  can_upload: boolean;
}

/** Folders the current user can see. Admins get every folder, all uploadable. */
export async function getFolders(): Promise<FolderAccess[]> {
  const res = await request<{ data: FolderAccess[] }>("/folders");
  return res.data || [];
}

export interface InternalUser {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  permissions: FolderAccess[];
  last_login: string | null;
  created_at: string | null;
}

export async function listUsers(): Promise<InternalUser[]> {
  const res = await request<{ data: InternalUser[] }>("/users");
  return (res.data || []).map((u) => ({ ...u, permissions: u.permissions ?? [] }));
}

export interface NewUserInput {
  name: string;
  email: string;
  password: string;
  is_admin: boolean;
  permissions: FolderAccess[];
}

export function createUser(input: NewUserInput) {
  return request<{ id: number }>("/users", { method: "POST", body: input });
}

export type UserUpdate = Partial<{
  name: string;
  is_admin: boolean;
  password: string;
  permissions: FolderAccess[];
}>;

export function updateUser(id: number, update: UserUpdate) {
  return request<unknown>(`/users/${id}`, { method: "PUT", body: update });
}

/** Permanently deletes the user. The API answers 400 when deleting yourself. */
export function deleteUser(id: number) {
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

// ─── Uploads ────────────────────────────────────────────────────

export type NamingRules = Record<string, { pattern: string; example: string } | undefined>;

export function getNamingRules() {
  return request<NamingRules>("/files/naming-rules");
}

/** File types the picker offers; folders not listed accept any file. */
const FOLDER_ACCEPT: Record<string, string> = {
  allbooks: ".pdf",
  ebooks: ".pdf",
  samples: ".pdf",
  croppedcovers: ".jpg,.jpeg",
  amazoncroppedcovers: ".jpg,.jpeg",
};

export const folderAccept = (folder: string): string | undefined => FOLDER_ACCEPT[folder];

// Client-side copy of the server's filename rules, checked before uploading.
// Folders without a rule here are left entirely to the server, which
// validates every upload; its 422 message is shown if the two disagree.
const ISBN13 = "97[89]\\d{10}";
const FILENAME_RULES: Record<string, { test: (name: string) => boolean; example: string }> = {
  ebooks: {
    test: (n) => new RegExp(`^${ISBN13}\\.pdf$`).test(n),
    example: "9781234567890.pdf  (13-digit ISBN + .pdf)",
  },
  samples: {
    // Hyphenated ISBN (group lengths vary) that still totals 13 digits.
    test: (n) => {
      const m = n.match(/^(97[89](?:-\d+){3}-\d)-sample(?:_v\d+)?\.pdf$/);
      return !!m && m[1].replace(/-/g, "").length === 13;
    },
    example: "978-1-1234-5678-9-sample.pdf  or  978-1-1234-5678-9-sample_v2.pdf",
  },
  croppedcovers: {
    test: (n) => new RegExp(`^${ISBN13}\\.jpg$`).test(n),
    example: "9781234567890.jpg  (13-digit ISBN + .jpg)",
  },
  amazoncroppedcovers: {
    test: (n) => new RegExp(`^${ISBN13}\\.MAIN\\.jpg$`).test(n),
    example: "9781234567890.MAIN.jpg  (13-digit ISBN + .MAIN.jpg)",
  },
  allbooks: {
    test: (n) => /^[^\s_+/\\]+(?:\+[^\s_+/\\]+)*_(?:paper|hard)_(?:man|ebk)_v\d+\.pdf$/.test(n),
    example: "Title+Of+Book_paper_man_v1.pdf  (binding: paper|hard, type: man|ebk)",
  },
  dj_mats_decided: {
    test: (n) => /\.(jpe?g|pdf|sla)$/i.test(n),
    example: "Any filename ending .jpg, .jpeg, .pdf or .sla",
  },
};

/** Built-in example for a folder, or undefined when it has no client rule. */
export const fallbackNamingExample = (folder: string): string | undefined => FILENAME_RULES[folder]?.example;

/** True when the name passes the folder's rule, or the folder has no rule. */
export const filenameMatchesRule = (folder: string, filename: string) => FILENAME_RULES[folder]?.test(filename) ?? true;

export interface UploadResult {
  ok: true;
  s3_key: string;
  size_bytes: number;
}

export interface UploadHandle {
  promise: Promise<UploadResult>;
  abort: () => void;
}

/**
 * Uploads one file. Uses XMLHttpRequest rather than fetch so `onProgress`
 * can report the percentage sent.
 */
export function uploadFile(folder: string, file: File, onProgress: (percent: number) => void): UploadHandle {
  const xhr = new XMLHttpRequest();
  const promise = new Promise<UploadResult>((resolve, reject) => {
    const session = getSession();
    if (!session) {
      redirectToLogin();
      reject(new InternalApiError(401, "Your session has expired. Please sign in again."));
      return;
    }
    xhr.open("POST", `${INTERNAL_API_BASE}/files/upload`);
    xhr.setRequestHeader("Authorization", `Bearer ${session.token}`);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      let json: { error?: unknown; message?: unknown } & Partial<UploadResult> = {};
      try {
        json = JSON.parse(xhr.responseText || "{}");
      } catch {
        // Non-JSON body; fall through to the status-based message.
      }
      if (xhr.status === 401) {
        redirectToLogin();
        reject(new InternalApiError(401, "Your session has expired. Please sign in again."));
      } else if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ ok: true, s3_key: json.s3_key ?? "", size_bytes: json.size_bytes ?? file.size });
      } else {
        const msg =
          (typeof json.error === "string" && json.error) ||
          (typeof json.message === "string" && json.message) ||
          (xhr.status === 413 ? "The file is too large to upload." : `Upload failed (${xhr.status}).`);
        reject(new InternalApiError(xhr.status, msg));
      }
    };
    xhr.onerror = () => reject(new InternalApiError(0, "Could not reach the server. Check your connection and try again."));
    xhr.onabort = () => reject(new DOMException("Upload cancelled", "AbortError"));

    const form = new FormData();
    form.append("folder", folder);
    form.append("file", file);
    xhr.send(form);
  });
  return { promise, abort: () => xhr.abort() };
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

const relativeFormat = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const RELATIVE_UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

/** "2 hours ago", "yesterday", "just now". */
export function formatRelative(value: string | null | undefined, empty = "—"): string {
  if (!value) return empty;
  const t = new Date(value).getTime();
  if (Number.isNaN(t)) return empty;
  const seconds = (t - Date.now()) / 1000;
  if (Math.abs(seconds) < 45) return "just now";
  for (const [unit, size] of RELATIVE_UNITS) {
    if (Math.abs(seconds) >= size) return relativeFormat.format(Math.round(seconds / size), unit);
  }
  return relativeFormat.format(Math.round(seconds / 60), "minute");
}

export function formatDateTime(value: string | null | undefined, empty = "—"): string {
  if (!value) return empty;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? empty : dateTimeFormat.format(d);
}
