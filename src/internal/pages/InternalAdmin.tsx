import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, RefreshCw, UserX, UserCheck } from "lucide-react";
import { Button } from "../PortalButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  createUser,
  deactivateUser,
  FOLDERS,
  folderLabel,
  formatDateTime,
  getIndexStats,
  getSession,
  type InternalUser,
  listUsers,
  updateUser,
  type UserUpdate,
} from "../api";

const MIN_PASSWORD_LENGTH = 8;

export default function InternalAdmin() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-foreground">Administration</h1>
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="stats">Index stats</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-4">
          <UsersTab />
        </TabsContent>
        <TabsContent value="stats" className="mt-4">
          <StatsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Users ──────────────────────────────────────────────────────

function UsersTab() {
  const queryClient = useQueryClient();
  const users = useQuery({ queryKey: ["internal-users"], queryFn: listUsers });
  const [editing, setEditing] = useState<InternalUser | "new" | null>(null);
  const [confirming, setConfirming] = useState<InternalUser | null>(null);
  const currentUserId = getSession()?.userId;

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["internal-users"] });

  const deactivate = useMutation({
    mutationFn: (u: InternalUser) => deactivateUser(u.id),
    onSuccess: (_, u) => {
      toast.success(`${u.name} has been deactivated.`);
      refresh();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not deactivate user."),
    onSettled: () => setConfirming(null),
  });

  const reactivate = useMutation({
    mutationFn: (u: InternalUser) => updateUser(u.id, { is_active: true }),
    onSuccess: (_, u) => {
      toast.success(`${u.name} has been reactivated.`);
      refresh();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not reactivate user."),
  });

  const list = users.data ?? [];

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 h-14 border-b border-border">
        <p className="text-sm text-muted-foreground">
          {users.data ? `${list.length} user${list.length === 1 ? "" : "s"}` : " "}
        </p>
        <Button size="sm" className="gap-1.5" onClick={() => setEditing("new")}>
          <Plus className="h-4 w-4" /> Add user
        </Button>
      </div>

      {users.isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-[#1a3e6f]" />
        </div>
      ) : users.isError ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-sm text-destructive">
            {users.error instanceof Error ? users.error.message : "Could not load users."}
          </p>
          <Button variant="quiet" size="sm" onClick={() => users.refetch()}>
            Try again
          </Button>
        </div>
      ) : list.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">No users yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Folders</TableHead>
              <TableHead className="w-[110px]">Status</TableHead>
              <TableHead className="w-[170px]">Last login</TableHead>
              <TableHead className="w-[200px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((u) => {
              const isSelf = currentUserId != null && String(u.id) === currentUserId;
              return (
                <TableRow key={u.id} className={u.is_active ? "" : "bg-muted/30"}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className={`whitespace-nowrap ${u.is_active ? "" : "text-muted-foreground"}`}>{u.name}</span>
                      {u.is_admin && <Chip tone="brand">Admin</Chip>}
                      {isSelf && <span className="text-xs text-muted-foreground">(you)</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {u.folders.length === 0 ? (
                        <span className="text-xs text-muted-foreground">None</span>
                      ) : (
                        u.folders.map((f) => <Chip key={f}>{folderLabel(f)}</Chip>)
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {u.is_active ? <Chip tone="green">Active</Chip> : <Chip tone="grey">Inactive</Chip>}
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">{formatDateTime(u.last_login, "Never")}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="quiet" className="gap-1.5" onClick={() => setEditing(u)}>
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Button>
                      {u.is_active ? (
                        <Button
                          size="sm"
                          variant="quiet"
                          className="gap-1.5 text-destructive hover:text-destructive"
                          disabled={isSelf}
                          title={isSelf ? "You can't deactivate your own account" : undefined}
                          onClick={() => setConfirming(u)}
                        >
                          <UserX className="h-3.5 w-3.5" /> Deactivate
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="quiet"
                          className="gap-1.5"
                          disabled={reactivate.isPending && reactivate.variables?.id === u.id}
                          onClick={() => reactivate.mutate(u)}
                        >
                          <UserCheck className="h-3.5 w-3.5" /> Reactivate
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <UserDialog
        user={editing === "new" ? null : editing}
        open={editing !== null}
        isSelf={editing !== null && editing !== "new" && String(editing.id) === currentUserId}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          refresh();
        }}
      />

      <AlertDialog open={confirming !== null} onOpenChange={(o) => !o && !deactivate.isPending && setConfirming(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate {confirming?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirming?.email} will no longer be able to sign in. Their account and folder access are kept, so you
              can reactivate them later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deactivate.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deactivate.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (confirming) deactivate.mutate(confirming);
              }}
            >
              {deactivate.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface UserForm {
  name: string;
  email: string;
  password: string;
  is_admin: boolean;
  is_active: boolean;
  folders: string[];
}

const emptyForm: UserForm = { name: "", email: "", password: "", is_admin: false, is_active: true, folders: [] };

function UserDialog({
  user,
  open,
  isSelf,
  onClose,
  onSaved,
}: {
  user: InternalUser | null;
  open: boolean;
  isSelf: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = user === null;
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof UserForm | "form", string>>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      user
        ? {
            name: user.name,
            email: user.email,
            password: "",
            is_admin: user.is_admin,
            is_active: user.is_active,
            folders: user.folders.filter((f) => (FOLDERS as readonly string[]).includes(f)),
          }
        : emptyForm,
    );
  }, [open, user]);

  const set = <K extends keyof UserForm>(key: K, value: UserForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined, form: undefined }));
  };

  const toggleFolder = (key: string, on: boolean) =>
    set("folders", on ? FOLDERS.filter((f) => f === key || form.folders.includes(f)) : form.folders.filter((f) => f !== key));

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (isNew) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email address.";
      if (form.password.length < MIN_PASSWORD_LENGTH)
        next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    } else if (form.password && form.password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (isNew) {
        await createUser({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          is_admin: form.is_admin,
          folders: form.folders,
        });
        toast.success(`${form.name.trim()} has been added.`);
      } else {
        const update: UserUpdate = {
          name: form.name.trim(),
          is_admin: form.is_admin,
          is_active: form.is_active,
          folders: form.folders,
        };
        if (form.password) update.password = form.password;
        await updateUser(user.id, update);
        toast.success(`${form.name.trim()} has been updated.`);
      }
      onSaved();
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Could not save user." });
    } finally {
      setSaving(false);
    }
  };

  const allSelected = form.folders.length === FOLDERS.length;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !saving && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isNew ? "Add user" : `Edit ${user?.name}`}</DialogTitle>
          <DialogDescription>
            {isNew ? "Create an account and choose which folders this person can open." : user?.email}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <Field label="Name" htmlFor="user-name" error={errors.name}>
            <Input id="user-name" value={form.name} onChange={(e) => set("name", e.target.value)} autoFocus />
          </Field>
          {isNew && (
            <Field label="Email" htmlFor="user-email" error={errors.email}>
              <Input
                id="user-email"
                type="email"
                autoComplete="off"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </Field>
          )}
          <Field
            label={isNew ? "Password" : "New password"}
            htmlFor="user-password"
            error={errors.password}
            hint={isNew ? `At least ${MIN_PASSWORD_LENGTH} characters.` : "Leave blank to keep the current password."}
          >
            <Input
              id="user-password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
            />
          </Field>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Folder access</Label>
              <button
                type="button"
                className="text-xs text-[#1a3e6f] hover:underline"
                onClick={() => set("folders", allSelected ? [] : [...FOLDERS])}
              >
                {allSelected ? "Clear all" : "Select all"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 rounded-md border border-border p-3">
              {FOLDERS.map((f) => (
                <label key={f} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={form.folders.includes(f)} onCheckedChange={(c) => toggleFolder(f, c === true)} />
                  {folderLabel(f)}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-md border border-border p-3">
            <ToggleRow
              id="user-admin"
              label="Administrator"
              hint="Can manage users and view index stats."
              checked={form.is_admin}
              disabled={isSelf}
              onChange={(v) => set("is_admin", v)}
            />
            {!isNew && (
              <ToggleRow
                id="user-active"
                label="Active"
                hint="Inactive users can't sign in."
                checked={form.is_active}
                disabled={isSelf}
                onChange={(v) => set("is_active", v)}
              />
            )}
            {isSelf && <p className="text-xs text-muted-foreground">You can't remove your own admin access or deactivate yourself.</p>}
          </div>

          {errors.form && (
            <p role="alert" className="text-sm text-destructive">
              {errors.form}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="quiet" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isNew ? "Create user" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Index stats ────────────────────────────────────────────────

function StatsTab() {
  const stats = useQuery({ queryKey: ["internal-index-stats"], queryFn: getIndexStats });
  const rows = stats.data ?? [];
  const total = rows.reduce((n, r) => n + (r.file_count || 0), 0);

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden max-w-3xl">
      <div className="flex items-center justify-between px-4 h-14 border-b border-border">
        <p className="text-sm text-muted-foreground">Files indexed per folder</p>
        <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => stats.refetch()} disabled={stats.isFetching}>
          <RefreshCw className={`h-3.5 w-3.5 ${stats.isFetching ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>
      {stats.isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-[#1a3e6f]" />
        </div>
      ) : stats.isError ? (
        <p className="py-12 text-center text-sm text-destructive">
          {stats.error instanceof Error ? stats.error.message : "Could not load stats."}
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Folder</TableHead>
              <TableHead className="text-right">Files</TableHead>
              <TableHead>Last modified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.folder}>
                <TableCell className="font-medium">
                  {folderLabel(r.folder)}
                  <span className="ml-2 text-xs text-muted-foreground font-normal">{r.folder}</span>
                </TableCell>
                <TableCell className="text-right tabular-nums">{r.file_count.toLocaleString()}</TableCell>
                <TableCell className="text-muted-foreground tabular-nums">{formatDateTime(r.last_modified)}</TableCell>
              </TableRow>
            ))}
            <TableRow className="hover:bg-transparent border-t-2">
              <TableCell className="font-semibold">Total</TableCell>
              <TableCell className="text-right font-semibold tabular-nums">{total.toLocaleString()}</TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  );
}

// ─── Small pieces ───────────────────────────────────────────────

function Chip({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "brand" | "green" | "grey" }) {
  const tones = {
    default: "bg-[#eef2f8] text-[#1a3e6f]",
    brand: "bg-[#1a3e6f] text-white",
    green: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
    grey: "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

function ToggleRow({
  id,
  label,
  hint,
  checked,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <Label htmlFor={id}>{label}</Label>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch id={id} checked={checked} disabled={disabled} onCheckedChange={onChange} />
    </div>
  );
}
