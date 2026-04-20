import { ChangeEvent, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { adminApi } from "@/services/cmsService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ImageUploadFieldProps {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}

export default function ImageUploadField({ value, onChange, label = "Cover image" }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await adminApi.uploadImage(file);
      onChange(url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-nav uppercase tracking-wider text-foreground">{label}</label>
      <div className="flex items-start gap-4">
        {value ? (
          <img src={value} alt="" className="w-24 h-32 object-cover border border-border" />
        ) : (
          <div className="w-24 h-32 border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
            None
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value || null)}
            placeholder="Image URL"
            className="w-full border border-border px-3 py-2 text-sm bg-background"
          />
          <div className="flex gap-2">
            <label className="cursor-pointer">
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              <Button type="button" variant="outline" size="sm" asChild disabled={uploading}>
                <span className="inline-flex items-center gap-2">
                  {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                  Upload
                </span>
              </Button>
            </label>
            {value && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
