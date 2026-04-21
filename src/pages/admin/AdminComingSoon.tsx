import { Construction } from "lucide-react";

export default function AdminComingSoon({ title, description }: { title: string; description?: string }) {
  return (
    <div className="space-y-4">
      <h1 className="font-baskerville text-2xl sm:text-3xl">{title}</h1>
      <div className="border border-dashed border-border p-12 text-center text-muted-foreground">
        <Construction className="h-8 w-8 mx-auto mb-3 text-accent" />
        <p className="font-medium text-foreground mb-1">This section is coming next</p>
        {description && <p className="text-sm">{description}</p>}
      </div>
    </div>
  );
}