import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Mail, ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { adminApi, type CmsContactMessageDetail } from "@/services/cmsService";

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

export default function AdminContactMessageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<CmsContactMessageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    adminApi
      .getContactMessage(id)
      .then((res) => { if (active) setData(res); })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : "Failed to load message";
        if (active) setError(msg);
        toast.error(msg);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading message…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => navigate("/admin/contact-submissions")}
          className="rounded-none uppercase tracking-wider text-xs"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="border border-red-200 bg-red-50 text-red-800 p-4 text-sm">
          {error || "Message not found"}
        </div>
      </div>
    );
  }

  const mailtoHref = `mailto:${data.email}?subject=${encodeURIComponent(
    `Re: ${data.subject || data.subject_name || "Your enquiry"}${data.ticket_id ? ` [${data.ticket_id}]` : ""}`,
  )}`;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link
            to="/admin/contact-submissions"
            className="inline-flex items-center text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to messages
          </Link>
          <h1 className="font-baskerville text-3xl text-foreground">
            {data.subject || data.subject_name || "Contact message"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {data.ticket_id || `#${data.id}`} · received {formatDate(data.created_at)}
          </p>
        </div>
        <a href={mailtoHref}>
          <Button className="rounded-none uppercase tracking-wider text-xs">
            <Mail className="h-4 w-4 mr-2" /> Reply by email
          </Button>
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="border border-border p-5 bg-white">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Message</div>
            <div className="whitespace-pre-wrap text-foreground text-sm leading-relaxed">
              {data.message}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="border border-border p-5 bg-white space-y-3 text-sm">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">From</div>
            <div>
              <div className="text-foreground font-medium">{data.name || "—"}</div>
              <a href={`mailto:${data.email}`} className="text-accent hover:underline break-all">
                {data.email}
              </a>
            </div>

            <div className="pt-2 border-t border-border">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Subject category</div>
              <div className="text-foreground">
                {data.subject_name || "—"}
                {data.subject_id ? <span className="text-muted-foreground"> (id {data.subject_id})</span> : null}
              </div>
            </div>

            <div className="pt-2 border-t border-border flex items-center gap-2">
              {data.recaptcha_verified ? (
                <>
                  <ShieldCheck className="h-4 w-4 text-green-700" />
                  <span className="text-xs text-green-800">reCAPTCHA verified</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="h-4 w-4 text-amber-700" />
                  <span className="text-xs text-amber-800">reCAPTCHA not verified</span>
                </>
              )}
            </div>
          </div>

          <div className="border border-border p-5 bg-white space-y-2 text-xs">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Technical</div>
            <div>
              <span className="text-muted-foreground">IP address: </span>
              <span className="text-foreground break-all">{data.ip_address || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">User-agent: </span>
              <span className="text-foreground break-all">{data.user_agent || "—"}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}