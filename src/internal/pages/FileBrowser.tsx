import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  FileArchive,
  FileImage,
  FileText,
  Folder,
  Layers,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { Button } from "../PortalButton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  FOLDERS,
  folderLabel,
  formatBytes,
  formatDateTime,
  getDownloadUrl,
  getSession,
  InternalApiError,
  type InternalFile,
  isFolderKey,
  listFiles,
} from "../api";

const PER_PAGE_OPTIONS = [25, 50, 100];
const SEARCH_DEBOUNCE_MS = 350;

const noRetryOnAuth = (count: number, err: unknown) =>
  !(err instanceof InternalApiError && (err.status === 401 || err.status === 403)) && count < 2;

export default function FileBrowser() {
  const [params, setParams] = useSearchParams();
  const folder = isFolderKey(params.get("folder")) ? params.get("folder")! : "";
  const q = params.get("q") || "";
  const page = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);
  const perPageParam = parseInt(params.get("per_page") || "50", 10);
  const perPage = PER_PAGE_OPTIONS.includes(perPageParam) ? perPageParam : 50;

  const updateParams = (changes: Record<string, string | number | null>) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [k, v] of Object.entries(changes)) {
          if (v === null || v === "" || (k === "page" && v === 1) || (k === "per_page" && v === 50)) next.delete(k);
          else next.set(k, String(v));
        }
        return next;
      },
      { replace: true },
    );
  };

  // Search box is local state, pushed to the URL after a short pause.
  const [searchText, setSearchText] = useState(q);
  useEffect(() => {
    if (searchText.trim() === q) return;
    const t = setTimeout(() => updateParams({ q: searchText.trim() || null, page: 1 }), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const folders = useAccessibleFolders();

  const files = useQuery({
    queryKey: ["internal-files", folder, q, page, perPage],
    queryFn: ({ signal }) => listFiles({ folder: folder || undefined, q: q || undefined, page, per_page: perPage }, signal),
    placeholderData: keepPreviousData,
    retry: noRetryOnAuth,
  });

  const data = files.data;
  const totalPages = Math.max(1, data?.total_pages ?? 1);
  const rangeStart = data && data.total > 0 ? (data.page - 1) * data.per_page + 1 : 0;
  const rangeEnd = data ? Math.min(data.total, rangeStart + data.data.length - 1) : 0;

  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
  const download = async (file: InternalFile) => {
    // Open the tab synchronously, while the click still counts as a user
    // action, so popup blockers allow it; point it at the URL once we have it.
    const win = window.open("", "_blank");
    if (win) {
      win.document.title = "Preparing download…";
      win.document.body.innerHTML =
        '<p style="font-family:system-ui,sans-serif;color:#444;padding:24px">Preparing your download…</p>';
    }
    setDownloadingKey(file.s3_key);
    try {
      const { url } = await getDownloadUrl(file.s3_key);
      if (win && !win.closed) {
        win.opener = null;
        win.location.href = url;
      } else {
        window.open(url, "_blank", "noopener");
      }
    } catch (err) {
      win?.close();
      toast.error(err instanceof Error ? err.message : "Download failed.");
    } finally {
      setDownloadingKey(null);
    }
  };

  const heading = folder ? folderLabel(folder) : "All folders";

  return (
    <div className="flex gap-6 items-start">
      {/* Folder sidebar */}
      <aside className="w-60 shrink-0 bg-white border border-border rounded-lg p-2 sticky top-6">
        <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Folders</p>
        <FolderButton
          active={!folder}
          icon={<Layers className="h-4 w-4" />}
          label="All folders"
          count={folders.data ? folders.data.reduce((n, f) => n + f.count, 0) : undefined}
          onClick={() => updateParams({ folder: null, page: 1 })}
        />
        {folders.isLoading &&
          Array.from({ length: 3 }, (_, i) => <div key={i} className="mx-3 my-2 h-5 rounded bg-muted animate-pulse" />)}
        {folders.data?.map((f) => (
          <FolderButton
            key={f.key}
            active={folder === f.key}
            icon={<Folder className="h-4 w-4" />}
            label={folderLabel(f.key)}
            count={f.count}
            onClick={() => updateParams({ folder: f.key, page: 1 })}
          />
        ))}
        {folders.data && folders.data.length === 0 && (
          <p className="px-3 py-2 text-xs text-muted-foreground">You don't have access to any folders yet.</p>
        )}
      </aside>

      {/* Main panel */}
      <section className="flex-1 min-w-0 space-y-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-foreground whitespace-nowrap">{heading}</h1>
          <div className="relative flex-1 max-w-xl ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={folder ? `Search ${folderLabel(folder)} by filename…` : "Search all folders by filename…"}
              className="pl-9 pr-9 bg-white"
              aria-label="Search files"
            />
            {searchText && (
              <button
                type="button"
                onClick={() => setSearchText("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 h-11 border-b border-border text-sm text-muted-foreground">
            <span>
              {data
                ? data.total > 0
                  ? `Showing ${rangeStart.toLocaleString()}–${rangeEnd.toLocaleString()} of ${data.total.toLocaleString()} files`
                  : "No files"
                : " "}
            </span>
            {files.isFetching && <Loader2 className="h-4 w-4 animate-spin text-[#1a3e6f]" aria-label="Loading" />}
          </div>

          {files.isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#1a3e6f]" />
              <span className="text-sm">Loading files…</span>
            </div>
          ) : files.isError && !data ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-6">
              <p className="text-sm text-destructive">
                {files.error instanceof Error ? files.error.message : "Could not load files."}
              </p>
              <Button variant="quiet" size="sm" onClick={() => files.refetch()}>
                Try again
              </Button>
            </div>
          ) : data && data.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-center px-6">
              <Search className="h-8 w-8 text-muted-foreground/60" />
              <p className="text-sm text-foreground">{q ? `No files match “${q}”.` : "This folder is empty."}</p>
              {q && <p className="text-xs text-muted-foreground">Try a shorter or different part of the filename.</p>}
            </div>
          ) : (
            <div className={files.isFetching && files.isPlaceholderData ? "opacity-60 transition-opacity" : ""}>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead>Filename</TableHead>
                    <TableHead className="w-[160px]">Folder</TableHead>
                    <TableHead className="w-[100px] text-right">Size</TableHead>
                    <TableHead className="w-[180px]">Last modified</TableHead>
                    <TableHead className="w-[130px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileIcon filename={file.filename} />
                          <span className="truncate font-medium text-foreground" title={file.s3_key}>
                            {file.filename}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5 text-muted-foreground">{folderLabel(file.folder)}</TableCell>
                      <TableCell className="py-2.5 text-right tabular-nums text-muted-foreground">
                        {formatBytes(file.size_bytes)}
                      </TableCell>
                      <TableCell className="py-2.5 text-muted-foreground tabular-nums">
                        {formatDateTime(file.last_modified)}
                      </TableCell>
                      <TableCell className="py-2.5 text-right">
                        <Button
                          size="sm"
                          variant="quiet"
                          className="gap-1.5"
                          disabled={downloadingKey === file.s3_key}
                          onClick={() => download(file)}
                        >
                          {downloadingKey === file.s3_key ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Download className="h-3.5 w-3.5" />
                          )}
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {data && data.total > 0 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              perPage={perPage}
              onPage={(p) => {
                updateParams({ page: p });
                window.scrollTo({ top: 0 });
              }}
              onPerPage={(n) => updateParams({ per_page: n, page: 1 })}
            />
          )}
        </div>
      </section>
    </div>
  );
}

// Folders the user can open, with file counts. Tokens don't list folders, so
// each folder is probed with a one-file request: admins see every folder;
// other users see the folders that answer with files.
function useAccessibleFolders() {
  const isAdmin = !!getSession()?.isAdmin;
  return useQuery({
    queryKey: ["internal-folders", isAdmin],
    staleTime: 5 * 60_000,
    queryFn: async () => {
      const results = await Promise.all(
        FOLDERS.map(async (key) => {
          try {
            const res = await listFiles({ folder: key, page: 1, per_page: 1 });
            return { key, count: res.total, ok: true };
          } catch {
            return { key, count: 0, ok: false };
          }
        }),
      );
      return results.filter((r) => (isAdmin ? true : r.ok && r.count > 0)).map(({ key, count }) => ({ key, count }));
    },
  });
}

function FolderButton({
  active,
  icon,
  label,
  count,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-left transition-colors ${
        active ? "bg-[#1a3e6f] text-white" : "text-foreground hover:bg-muted"
      }`}
    >
      <span className={active ? "text-white" : "text-muted-foreground"}>{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && (
        <span className={`text-xs tabular-nums ${active ? "text-white/80" : "text-muted-foreground"}`}>
          {count.toLocaleString()}
        </span>
      )}
    </button>
  );
}

function FileIcon({ filename }: { filename: string }) {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const cls = "h-4 w-4 shrink-0";
  if (["jpg", "jpeg", "png", "gif", "webp", "tif", "tiff"].includes(ext)) return <FileImage className={`${cls} text-emerald-600`} />;
  if (["zip", "rar", "7z"].includes(ext)) return <FileArchive className={`${cls} text-amber-600`} />;
  if (ext === "pdf") return <FileText className={`${cls} text-red-600`} />;
  return <FileText className={`${cls} text-[#1a3e6f]`} />;
}

function Pagination({
  page,
  totalPages,
  perPage,
  onPage,
  onPerPage,
}: {
  page: number;
  totalPages: number;
  perPage: number;
  onPage: (p: number) => void;
  onPerPage: (n: number) => void;
}) {
  const [jump, setJump] = useState(String(page));
  useEffect(() => setJump(String(page)), [page]);

  const go = (p: number) => onPage(Math.min(totalPages, Math.max(1, p)));
  const submitJump = () => {
    const n = parseInt(jump, 10);
    if (Number.isFinite(n)) go(n);
    else setJump(String(page));
  };

  const atStart = page <= 1;
  const atEnd = page >= totalPages;
  const pageLabel = totalPages.toLocaleString();

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 border-t border-border text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span>Rows per page</span>
        <Select value={String(perPage)} onValueChange={(v) => onPerPage(parseInt(v, 10))}>
          <SelectTrigger className="h-8 w-[76px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PER_PAGE_OPTIONS.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={atStart} onClick={() => go(1)} aria-label="First page">
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={atStart} onClick={() => go(page - 1)} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="flex items-center gap-2 px-2 text-muted-foreground">
          Page
          <Input
            value={jump}
            onChange={(e) => setJump(e.target.value.replace(/[^0-9]/g, ""))}
            onBlur={submitJump}
            onKeyDown={(e) => e.key === "Enter" && submitJump()}
            className="h-8 w-16 text-center bg-white"
            inputMode="numeric"
            aria-label="Page number"
          />
          of {pageLabel}
        </span>
        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={atEnd} onClick={() => go(page + 1)} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={atEnd} onClick={() => go(totalPages)} aria-label="Last page">
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
