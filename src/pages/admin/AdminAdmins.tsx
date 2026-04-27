import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Save, X, Power, KeyRound } from "lucide-react";
import { adminApi, adminSession, type CmsAdminAccount } from "@/services/cmsService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface NewAdminState {
  email: string;
  name: string;
  password: string;
}

interface PasswordResetState {
  id: string;
  email: string;
  password: string;
}

export default function AdminAdmins() {
  const currentUserId = adminSession.getUser()?.id;
  const [admins, setAdmins] = useState<CmsAdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<NewAdminState | null>(null);
  const [resetPwd, setResetPwd] = useState<PasswordResetState | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = async () => {
    setLoading(true);
    try {
      setAdmins(await adminApi.listAdmins());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  const create = async () => {
    if (!creating) return;
    if (!creating.email.trim()) return toast.error("Email is required");
    if (creating.password.length < 8) return toast.error("Password must be at least 8 characters");
    setBusy(true);
    try {
      await adminApi.createAdmin({
        email: creating.email.trim(),
        password: creating.password,
        name: creating.name.trim() || undefined,
      });
      toast.success("Admin created");
      setCreating(null);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create admin");
    } finally {
      setBusy(false);
    }
  };

  const toggleActive = async (a: CmsAdminAccount) => {
    if (String(a.id) === String(currentUserId)) return toast.error("You cannot disable your own account");
    try {
      await adminApi.updateAdmin({ id: String(a.id), is_active: !a.is_active });
      toast.success(a.is_active ? "Admin disabled" : "Admin enabled");
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  const remove = async (a: CmsAdminAccount) => {
    if (String(a.id) === String(currentUserId)) return toast.error("You cannot delete your own account");
    if (!confirm(`Delete admin ${a.email}? This cannot be undone.`)) return;
    try {
      await adminApi.deleteAdmin(String(a.id));
      toast.success("Admin deleted");
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const submitPasswordReset = async () => {
    if (!resetPwd) return;
    if (resetPwd.password.length < 8) return toast.error("Password must be at least 8 characters");
    setBusy(true);
    try {
      await adminApi.updateAdmin({ id: resetPwd.id, password: resetPwd.password });
      toast.success(`Password updated for ${resetPwd.email}`);
      setResetPwd(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-baskerville text-3xl text-foreground">Admins</h1>
          <p className="text-muted-foreground text-sm">
            Anyone listed here can sign in to the CMS at <code className="font-mono text-xs">/admin</code>.
          </p>
        </div>
        {!creating && !resetPwd && (
          <Button
            onClick={() => setCreating({ email: "", name: "", password: "" })}
            className="bg-accent hover:bg-accent/90"
          >
            <Plus className="h-4 w-4 mr-1" /> New admin
          </Button>
        )}
      </div>

      {creating && (
        <div className="border border-border p-6 space-y-4 bg-[#fafafa]">
          <div className="flex items-center justify-between">
            <h2 className="font-baskerville text-xl text-foreground">New admin</h2>
            <Button variant="ghost" size="sm" onClick={() => setCreating(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Field label="Email">
            <input
              type="email"
              value={creating.email}
              onChange={(e) => setCreating({ ...creating, email: e.target.value })}
              className="w-full border border-border px-3 py-2 text-sm bg-background"
              placeholder="admin@example.com"
            />
          </Field>

          <Field label="Name (optional)">
            <input
              type="text"
              value={creating.name}
              onChange={(e) => setCreating({ ...creating, name: e.target.value })}
              className="w-full border border-border px-3 py-2 text-sm bg-background"
            />
          </Field>

          <Field label="Temporary password (≥ 8 characters)">
            <input
              type="text"
              value={creating.password}
              onChange={(e) => setCreating({ ...creating, password: e.target.value })}
              className="w-full border border-border px-3 py-2 text-sm bg-background font-mono"
              placeholder="Share securely with the new admin"
            />
          </Field>

          <div className="flex gap-2 pt-2">
            <Button onClick={create} disabled={busy} className="bg-accent hover:bg-accent/90">
              {busy ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
              Create
            </Button>
            <Button variant="outline" onClick={() => setCreating(null)}>Cancel</Button>
          </div>
        </div>
      )}

      {resetPwd && (
        <div className="border border-border p-6 space-y-4 bg-[#fafafa]">
          <div className="flex items-center justify-between">
            <h2 className="font-baskerville text-xl text-foreground">
              Reset password for {resetPwd.email}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setResetPwd(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Field label="New password (≥ 8 characters)">
            <input
              type="text"
              value={resetPwd.password}
              onChange={(e) => setResetPwd({ ...resetPwd, password: e.target.value })}
              className="w-full border border-border px-3 py-2 text-sm bg-background font-mono"
            />
          </Field>

          <div className="flex gap-2 pt-2">
            <Button onClick={submitPasswordReset} disabled={busy} className="bg-accent hover:bg-accent/90">
              {busy ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
              Update password
            </Button>
            <Button variant="outline" onClick={() => setResetPwd(null)}>Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin inline" /> Loading…
        </div>
      ) : admins.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground border border-dashed border-border">
          No admins yet.
        </div>
      ) : (
        <div className="space-y-2">
          {admins.map((a) => (
            <div
              key={a.id}
              className="border border-border p-4 flex items-center gap-4 flex-wrap"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-baskerville text-base text-foreground">{a.email}</span>
                  {a.id === currentUserId && (
                    <span className="text-xs uppercase tracking-wider px-2 py-0.5 bg-accent/10 text-accent">
                      You
                    </span>
                  )}
                  {!a.is_active && (
                    <span className="text-xs uppercase tracking-wider px-2 py-0.5 bg-muted text-muted-foreground">
                      Disabled
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {a.name ? `${a.name} · ` : ""}
                  Created {new Date(a.created_at).toLocaleDateString()}
                  {a.last_login_at ? ` · Last login ${new Date(a.last_login_at).toLocaleString()}` : " · Never signed in"}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  title="Reset password"
                  onClick={() => setResetPwd({ id: String(a.id), email: a.email, password: "" })}
                >
                  <KeyRound className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  title={a.is_active ? "Disable" : "Enable"}
                  onClick={() => toggleActive(a)}
                  disabled={String(a.id) === String(currentUserId)}
                >
                  <Power className={`h-4 w-4 ${a.is_active ? "" : "text-muted-foreground"}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  title="Delete"
                  onClick={() => remove(a)}
                  disabled={String(a.id) === String(currentUserId)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-nav uppercase tracking-wider text-foreground">{label}</label>
      {children}
    </div>
  );
}
