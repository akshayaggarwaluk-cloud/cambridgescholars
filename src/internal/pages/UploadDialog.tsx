import { FormEvent, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileUp, Loader2, Upload, XCircle } from "lucide-react";
import { Button } from "../PortalButton";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  fallbackNamingExample,
  filenameMatchesRule,
  folderAccept,
  folderLabel,
  formatBytes,
  getNamingRules,
  type UploadHandle,
  type UploadResult,
  uploadFile,
} from "../api";

export default function UploadDialog({
  open,
  onOpenChange,
  folders,
  initialFolder,
  onUploaded,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Folders the user may upload to. */
  folders: string[];
  /** Pre-selected when it is one of `folders`. */
  initialFolder: string;
  onUploaded: (folder: string, filename: string, result: UploadResult) => void;
}) {
  const rules = useQuery({
    queryKey: ["internal-naming-rules"],
    queryFn: getNamingRules,
    staleTime: 30 * 60_000,
    enabled: open,
  });

  const [folder, setFolder] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const uploadRef = useRef<UploadHandle | null>(null);

  useEffect(() => {
    if (!open) return;
    setFolder(folders.includes(initialFolder) ? initialFolder : folders.length === 1 ? folders[0] : "");
    setFile(null);
    setError("");
    setProgress(null);
  }, [open, initialFolder, folders]);

  // Server example when available, else the built-in one; none for folders
  // without a rule.
  const rawExample = folder ? rules.data?.[folder]?.example || fallbackNamingExample(folder) : undefined;
  const example = rawExample?.replace(/\s+/g, " ");
  const nameError =
    folder && file && !filenameMatchesRule(folder, file.name)
      ? `Filename must match: ${example ?? "the folder's naming rule"}`
      : "";
  const uploading = progress !== null;
  const canUpload = !!folder && !!file && !nameError && !uploading;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canUpload || !file) return;
    setError("");
    setProgress(0);
    const handle = uploadFile(folder, file, setProgress);
    uploadRef.current = handle;
    try {
      const res = await handle.promise;
      onUploaded(folder, file.name, res);
      onOpenChange(false);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") setError("Upload cancelled.");
      else setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      uploadRef.current = null;
      setProgress(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !uploading && onOpenChange(o)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload a file</DialogTitle>
          <DialogDescription>The file is stored in the selected folder and appears in the list once uploaded.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="upload-folder">Folder</Label>
            <Select
              value={folder}
              disabled={uploading}
              onValueChange={(v) => {
                setFolder(v);
                setError("");
              }}
            >
              <SelectTrigger id="upload-folder" className="max-w-xs bg-white">
                <SelectValue placeholder="Choose a folder" />
              </SelectTrigger>
              <SelectContent>
                {folders.map((f) => (
                  <SelectItem key={f} value={f}>
                    {folderLabel(f)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="upload-file">File</Label>
            <div className="flex items-center gap-3 min-w-0">
              <label
                className={`inline-flex shrink-0 items-center gap-2 px-4 h-9 rounded-md border border-border bg-white text-sm transition-colors ${
                  folder && !uploading ? "cursor-pointer hover:bg-[#eef2f8] hover:text-[#1a3e6f]" : "opacity-50 cursor-not-allowed"
                }`}
              >
                <FileUp className="h-4 w-4" />
                Choose file
                <input
                  id="upload-file"
                  type="file"
                  className="sr-only"
                  accept={folder ? folderAccept(folder) : undefined}
                  disabled={!folder || uploading}
                  onChange={(e) => {
                    setFile(e.target.files?.[0] ?? null);
                    setError("");
                  }}
                />
              </label>
              <span className="text-sm text-muted-foreground truncate min-w-0">
                {file ? (
                  <>
                    <span className="text-foreground">{file.name}</span> · {formatBytes(file.size)}
                  </>
                ) : folder ? (
                  "No file chosen"
                ) : (
                  "Choose a folder first"
                )}
              </span>
            </div>
            {example && (
              <p className="text-xs text-muted-foreground">
                Required filename format: <span className="font-mono text-foreground">{example}</span>
              </p>
            )}
            {nameError && (
              <p role="alert" className="text-sm text-destructive">
                {nameError}
              </p>
            )}
          </div>

          {uploading && (
            <div className="space-y-1.5" aria-live="polite">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{progress < 100 ? "Uploading…" : "Processing on the server…"}</span>
                <span className="tabular-nums">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-muted [&>div]:bg-[#1a3e6f]" />
            </div>
          )}

          {error && (
            <div role="alert" className="flex gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <XCircle className="h-5 w-5 shrink-0 text-red-600" />
              <p className="min-w-0 break-words">{error}</p>
            </div>
          )}

          <DialogFooter>
            {uploading ? (
              <Button type="button" variant="quiet" onClick={() => uploadRef.current?.abort()}>
                Cancel upload
              </Button>
            ) : (
              <Button type="button" variant="quiet" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            )}
            <Button type="submit" className="gap-1.5" disabled={!canUpload}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? "Uploading…" : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
