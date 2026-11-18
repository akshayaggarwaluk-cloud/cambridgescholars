import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowUp, Loader2, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
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
  deleteUser,
  type FolderAccess,
  folderLabel,
  formatDateTime,
  formatRelative,
  getIndexStats,
  getSession,
  InternalApiError,
  type InternalUser,
  listUsers,
  updateUser,
  type UserUpdate,
} from "../api";
import { useFolders } from "../useFolders";

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

  const remove = useMutation({
    mutationFn: (u: InternalUser) => deleteUser(u.id),
    onSuccess: (_, u) => {
      // Drop the row straight away rather than waiting for a refetch.
      queryClient.setQueryData<InternalUser[]>(["internal-users"], (prev) => prev?.filter((x) => x.id !== u.id));
      toast.success(`${u.name} has been deleted.`);
    },
    onError: (err) => {
      if (err instanceof InternalApiError && err.status === 400) toast.error("You cannot delete your own account");
      else toast.error(err instanceof Error ? err.message : "Could not delete user.");
    },
    onSettled: () => setConfirming(null),
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
              <TableHead className="w-[90px]">Admin</TableHead>
              <TableHead className="w-[150px]">Last login</TableHead>
              <TableHead className="w-[190px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((u) => {
              const isSelf = currentUserId != null && String(u.id) === currentUserId;
              return (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="whitespace-nowrap">{u.name}</span>
                      {isSelf && <span className="text-xs text-muted-foreground">(you)</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {u.is_admin ? (
                        <Chip title="Admins can open and upload to every folder">
                          All folders <ArrowUp className="h-3 w-3 ml-0.5" aria-label="can upload" />
                        </Chip>
                      ) : u.permissions.length === 0 ? (
                        <span className="text-xs text-muted-foreground">None</span>
                      ) : (
                        u.permissions.map((p) => (
                          <Chip key={p.folder} title={p.can_upload ? "Can view and upload" : "View only"}>
                            {folderLabel(p.folder)}
                            {p.can_upload && <ArrowUp className="h-3 w-3 ml-0.5" aria-label="can upload" />}
                          </Chip>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{u.is_admin && <Chip tone="brand">Admin</Chip>}</TableCell>
                  <TableCell className="text-muted-foreground" title={formatDateTime(u.last_login, "")}>
                    {formatRelative(u.last_login, "Never")}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="quiet" className="gap-1.5" onClick={() => setEditing(u)}>
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="quiet"
                        className="gap-1.5 text-destructive hover:text-destructive"
                        disabled={isSelf}
                        title={isSelf ? "You cannot delete your own account" : undefined}
                        onClick={() => setConfirming(u)}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </Button>
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

      <AlertDialog open={confirming !== null} onOpenChange={(o) => !o && !remove.isPending && setConfirming(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {confirming?.name}? This cannot be undone.</AlertDialogTitle>
            <AlertDialogDescription>
              {confirming?.email} will be removed permanently, along with their folder access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={remove.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={remove.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (confirming) remove.mutate(confirming);
              }}
            >
              {remove.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
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
  permissions: FolderAccess[];
}

const emptyForm: UserForm = { name: "", email: "", password: "", is_admin: false, permissions: [] };

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
  const folders = useFolders();

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      user
        ? { name: user.name, email: user.email, password: "", is_admin: user.is_admin, permissions: user.permissions }
        : emptyForm,
    );
  }, [open, user]);

  const set = <K extends keyof UserForm>(key: K, value: UserForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined, form: undefined }));
  };

  // Every folder from GET /folders, plus any the user already has that the
  // list doesn't include, so saving never silently drops a permission.
  const allFolders = [
    ...(folders.data ?? []).map((f) => f.folder),
    ...form.permissions.map((p) => p.folder).filter((f) => !folders.data?.some((x) => x.folder === f)),
  ];
  const permissionFor = (folder: string) => form.permissions.find((p) => p.folder === folder);
  const setAccess = (folder: string, on: boolean) =>
    set(
      "permissions",
      on
        ? [...form.permissions.filter((p) => p.folder !== folder), { folder, can_upload: false }]
        : form.permissions.filter((p) => p.folder !== folder),
    );
  const setUpload = (folder: string, on: boolean) =>
    set(
      "permissions",
      form.permissions.map((p) => (p.folder === folder ? { ...p, can_upload: on } : p)),
    );
  // Saved in the same order as the folder list.
  const orderedPermissions = () =>
    allFolders.map((f) => permissionFor(f)).filter((p): p is FolderAccess => !!p);

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
          permissions: orderedPermissions(),
        });
        toast.success(`${form.name.trim()} has been added.`);
      } else {
        const update: UserUpdate = {
          name: form.name.trim(),
          is_admin: form.is_admin,
          permissions: orderedPermissions(),
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

  const allSelected = allFolders.length > 0 && allFolders.every((f) => permissionFor(f));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !saving && onClose()}>
      <DialogContent className="max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto">
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

          <div className="space-y-3 rounded-md border border-border p-3">
            <ToggleRow
              id="user-admin"
              label="Administrator"
              hint="Can manage users and view index stats. Admins can open and upload to every folder."
              checked={form.is_admin}
              disabled={isSelf}
              onChange={(v) => set("is_admin", v)}
            />
            {isSelf && <p className="text-xs text-muted-foreground">You can't remove your own admin access.</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Folder permissions</Label>
              {allFolders.length > 0 && (
                <button
                  type="button"
                  className="text-xs text-[#1a3e6f] hover:underline"
                  onClick={() =>
                    set(
                      "permissions",
                      allSelected
                        ? []
                        : allFolders.map((f) => permissionFor(f) ?? { folder: f, can_upload: false }),
                    )
                  }
                >
                  {allSelected ? "Clear all" : "Give access to all"}
                </button>
              )}
            </div>
            <div className="rounded-md border border-border divide-y divide-border">
              <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Access</span>
                <span>Upload</span>
              </div>
              {folders.isLoading && (
                <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading folders…
                </div>
              )}
              {folders.isError && (
                <p className="px-3 py-3 text-sm text-destructive">Could not load folders. Close and reopen to try again.</p>
              )}
              {allFolders.map((f) => {
                const perm = permissionFor(f);
                return (
                  <div key={f} className="flex items-center justify-between gap-3 px-3 py-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer min-w-0">
                      <Checkbox checked={!!perm} onCheckedChange={(c) => setAccess(f, c === true)} />
                      <span className="truncate">{folderLabel(f)}</span>
                    </label>
                    <Switch
                      checked={!!perm?.can_upload}
                      disabled={!perm}
                      onCheckedChange={(v) => setUpload(f, v)}
                      aria-label={`Allow uploads to ${folderLabel(f)}`}
                    />
                  </div>
                );
              })}
            </div>
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

function Chip({
  children,
  tone = "default",
  title,
}: {
  children: React.ReactNode;
  tone?: "default" | "brand";
  title?: string;
}) {
  const tones = {
    default: "bg-[#eef2f8] text-[#1a3e6f]",
    brand: "bg-[#1a3e6f] text-white",
  };
  return <span title={title} className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
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
