import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Download, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { adminApi, type CmsProposalDetailExt } from "@/services/cmsService";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "received", label: "Received" },
  { value: "under_review", label: "Under review" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
];

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function statusColor(status: string) {
  const s = status.toLowerCase();
  if (s.includes("accept")) return "bg-green-100 text-green-800";
  if (s.includes("review")) return "bg-blue-100 text-blue-800";
  if (s.includes("receiv")) return "bg-yellow-100 text-yellow-800";
  if (s.includes("reject") || s.includes("withdraw")) return "bg-red-100 text-red-800";
  return "bg-muted text-muted-foreground";
}

function formatBytes(n?: number | null) {
  if (!n || n <= 0) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export default function AdminProposalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const proposalId = Number(id);

  const [detail, setDetail] = useState<CmsProposalDetailExt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!Number.isFinite(proposalId)) {
      setError("Invalid proposal id");
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const d = await adminApi.getProposalById(proposalId);
        if (!cancelled) {
          setDetail(d);
          setStatus(d.status);
          setNotes(d.review_notes || "");
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load proposal");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [proposalId]);

  const save = async () => {
    if (!detail) return;
    setSaving(true);
    try {
      const payload: { status?: string; review_notes?: string } = {};
      if (status && status !== detail.status) payload.status = status;
      if ((notes || "") !== (detail.review_notes || "")) payload.review_notes = notes;
      if (Object.keys(payload).length === 0) {
        toast.info("No changes to save");
        return;
      }
      const res = await adminApi.updateProposal(proposalId, payload);
      setDetail({
        ...detail,
        status: res.status,
        review_notes: res.review_notes,
        reviewed_at: res.reviewed_at,
        reviewed_by: res.reviewed_by,
        updated_at: res.updated_at,
      });
      toast.success("Proposal updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update proposal");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading proposal…
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="space-y-4">
        <Link to="/admin/proposal-submissions" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to proposals
        </Link>
        <div className="border border-red-200 bg-red-50 text-red-800 p-4 text-sm">
          {error || "Proposal not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate("/admin/proposal-submissions")}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to proposals
        </button>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-baskerville text-3xl text-foreground mb-1">{detail.reference_number}</h1>
            <p className="text-muted-foreground text-sm">
              Submitted {formatDate(detail.submitted_at)}
              {" · "}
              <span className={`inline-block px-2 py-0.5 text-xs uppercase tracking-wider ${statusColor(detail.status)}`}>
                {detail.status.replace(/_/g, " ")}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Review controls */}
      <Section title="Review">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Status</span>
            <Select value={status} onValueChange={setStatus} disabled={saving}>
              <SelectTrigger className="h-9 w-[200px] rounded-none text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {detail.reviewed_at && (
              <span className="text-xs text-muted-foreground">
                Last reviewed {formatDate(detail.reviewed_at)}
                {detail.reviewed_by ? ` by ${detail.reviewed_by}` : ""}
              </span>
            )}
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
              Review notes
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="rounded-none"
              placeholder="Internal notes (visible to admins only)"
            />
          </div>
          <div>
            <Button
              onClick={save}
              disabled={saving}
              className="rounded-none uppercase tracking-wider text-xs"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save changes
            </Button>
          </div>
        </div>
      </Section>

      {/* Files */}
      <Section title={`Files${detail.files?.length ? ` (${detail.files.length})` : ""}`}>
        {!detail.files || detail.files.length === 0 ? (
          <div className="px-4 py-6 text-sm text-muted-foreground">No files uploaded.</div>
        ) : (
          <table className="w-full text-xs">
            <thead className="bg-[#f4f3ec] text-left text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-3 py-2">File</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Size</th>
                <th className="px-3 py-2">Uploaded</th>
                <th className="px-3 py-2">Scan</th>
                <th className="px-3 py-2 text-right">Download</th>
              </tr>
            </thead>
            <tbody>
              {detail.files.map((f) => (
                <tr key={f.id} className="border-t border-border">
                  <td className="px-3 py-2 text-foreground break-all">{f.file_name}</td>
                  <td className="px-3 py-2 text-muted-foreground">{f.file_type || "—"}</td>
                  <td className="px-3 py-2 text-muted-foreground">{formatBytes(f.file_size_bytes)}</td>
                  <td className="px-3 py-2 text-muted-foreground">{formatDate(f.uploaded_at)}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {f.virus_scanned
                      ? (f.virus_scan_result === "clean"
                          ? <span className="text-green-700">Clean</span>
                          : <span className="text-red-700">{f.virus_scan_result || "Flagged"}</span>)
                      : <span className="text-yellow-700">Pending</span>}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {f.download_url ? (
                      <a
                        href={f.download_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-accent hover:underline"
                      >
                        <Download className="h-3.5 w-3.5 mr-1" /> Download
                      </a>
                    ) : <span className="text-muted-foreground">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      {/* Submission sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        {detail.book && <JsonSection title="Book" value={detail.book} />}
        {detail.description && <JsonSection title="Description" value={detail.description} />}
        {detail.marketing && <JsonSection title="Marketing" value={detail.marketing} />}
        {detail.manuscript && <JsonSection title="Manuscript" value={detail.manuscript} />}
        {detail.mailing && <JsonSection title="Mailing" value={detail.mailing} />}
        {detail.agreement && <JsonSection title="Agreement" value={detail.agreement} />}
      </div>

      {detail.authors && detail.authors.length > 0 && (
        <Section title={`Authors (${detail.authors.length})`}>
          <div className="divide-y divide-border">
            {detail.authors.map((a, i) => (
              <div key={i} className="p-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Author {i + 1}{i === 0 ? " · lead" : ""}
                </div>
                <pre className="text-xs whitespace-pre-wrap break-all text-foreground bg-[#f4f3ec]/40 p-3 border border-border">
{JSON.stringify(a, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </Section>
      )}

      {detail.s3_folder && (
        <p className="text-xs text-muted-foreground">S3 folder: <code className="font-mono">{detail.s3_folder}</code></p>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-border bg-white">
      <header className="px-4 py-2.5 border-b border-border bg-[#f4f3ec]">
        <h2 className="font-baskerville text-sm text-foreground uppercase tracking-wider">{title}</h2>
      </header>
      <div>{children}</div>
    </section>
  );
}

function JsonSection({ title, value }: { title: string; value: unknown }) {
  return (
    <Section title={title}>
      <pre className="text-xs whitespace-pre-wrap break-all text-foreground p-4">
{JSON.stringify(value, null, 2)}
      </pre>
    </Section>
  );
}