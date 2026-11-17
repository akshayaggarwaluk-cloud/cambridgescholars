import { FormEvent, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, FileUp, Loader2, Upload, XCircle } from "lucide-react";
import { Button } from "../PortalButton";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  fallbackNamingExample,
  filenameMatchesRule,
  FOLDER_ACCEPT,
  FOLDERS,
  type FolderKey,
  folderLabel,
  formatBytes,
  getNamingRules,
  type UploadHandle,
  uploadFile,
} from "../api";

type Result = { kind: "success"; filename: string; size: number; s3Key: string } | { kind: "error"; message: string };

export default function UploadTab() {
  const queryClient = useQueryClient();
  const rules = useQuery({ queryKey: ["internal-naming-rules"], queryFn: getNamingRules, staleTime: 30 * 60_000 });

  const [folder, setFolder] = useState<FolderKey | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const uploadRef = useRef<UploadHandle | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Server example when available, otherwise the built-in copy of the rule.
  const example = folder ? (rules.data?.[folder]?.example || fallbackNamingExample(folder)).replace(/\s+/g, " ") : "";
  const nameError = folder && file && !filenameMatchesRule(folder, file.name) ? `Filename must match: ${example}` : "";
  const uploading = progress !== null;
  const canUpload = !!folder && !!file && !nameError && !uploading;

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canUpload || !folder || !file) return;
    setResult(null);
    setProgress(0);
    const handle = uploadFile(folder, file, setProgress);
    uploadRef.current = handle;
    try {
      const res = await handle.promise;
      setResult({ kind: "success", filename: file.name, size: res.size_bytes, s3Key: res.s3_key });
      clearFile();
      // Refresh file lists that include this folder, and the sidebar counts.
      queryClient.invalidateQueries({
        predicate: (q) =>
          (q.queryKey[0] === "internal-files" && (q.queryKey[1] === folder || q.queryKey[1] === "")) ||
          q.queryKey[0] === "internal-folders",
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setResult({ kind: "error", message: "Upload cancelled." });
      } else {
        setResult({ kind: "error", message: err instanceof Error ? err.message : "Upload failed." });
      }
    } finally {
      uploadRef.current = null;
      setProgress(null);
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white border border-border rounded-lg max-w-2xl" noValidate>
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-base font-semibold text-foreground">Upload a file</h2>
        <p className="text-sm text-muted-foreground">Files are stored in the selected folder and appear in Files once uploaded.</p>
      </div>

      <div className="p-5 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="upload-folder">Folder</Label>
          <Select
            value={folder}
            disabled={uploading}
            onValueChange={(v) => {
              setFolder(v as FolderKey);
              setResult(null);
            }}
          >
            <SelectTrigger id="upload-folder" className="max-w-xs bg-white">
              <SelectValue placeholder="Choose a folder" />
            </SelectTrigger>
            <SelectContent>
              {FOLDERS.map((f) => (
                <SelectItem key={f} value={f}>
                  {folderLabel(f)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="upload-file">File</Label>
          <div className="flex items-center gap-3">
            <label
              className={`inline-flex items-center gap-2 px-4 h-9 rounded-md border border-border bg-white text-sm transition-colors ${
                folder && !uploading ? "cursor-pointer hover:bg-[#eef2f8] hover:text-[#1a3e6f]" : "opacity-50 cursor-not-allowed"
              }`}
            >
              <FileUp className="h-4 w-4" />
              Choose file
              <input
                ref={inputRef}
                id="upload-file"
                type="file"
                className="sr-only"
                accept={folder ? FOLDER_ACCEPT[folder] : undefined}
                disabled={!folder || uploading}
                onChange={(e) => {
                  setFile(e.target.files?.[0] ?? null);
                  setResult(null);
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
          {folder && (
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

        {result?.kind === "success" && (
          <div role="status" className="flex gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <div className="min-w-0">
              <p className="font-medium">
                Uploaded {result.filename} ({formatBytes(result.size)})
              </p>
              {result.s3Key && <p className="text-xs text-emerald-700 break-all">{result.s3Key}</p>}
            </div>
          </div>
        )}
        {result?.kind === "error" && (
          <div role="alert" className="flex gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <XCircle className="h-5 w-5 shrink-0 text-red-600" />
            <p className="min-w-0 break-words">{result.message}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 px-5 py-4 border-t border-border">
        {uploading && (
          <Button type="button" variant="quiet" size="sm" onClick={() => uploadRef.current?.abort()}>
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm" className="gap-1.5" disabled={!canUpload}>
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading…" : "Upload"}
        </Button>
      </div>
    </form>
  );
}
