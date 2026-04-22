import { useEffect, useRef } from "react";
import { Bold, Italic, Underline, Type } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  rows?: number;
}

const FONT_SIZES = [
  { label: "Small", value: "1" },
  { label: "Normal", value: "3" },
  { label: "Large", value: "5" },
  { label: "X-Large", value: "6" },
  { label: "Huge", value: "7" },
];

const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Sans Serif", value: "Arial, sans-serif" },
  { label: "Monospace", value: "Courier New, monospace" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
];

const FONT_WEIGHTS = [
  { label: "Normal", value: "normal" },
  { label: "Bold", value: "bold" },
  { label: "Light", value: "300" },
  { label: "Medium", value: "500" },
  { label: "Semi-Bold", value: "600" },
  { label: "Extra-Bold", value: "800" },
];

export default function RichTextEditor({ value, onChange, rows = 10 }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = (command: string, val?: string) => {
    document.execCommand(command, false, val);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
    editorRef.current?.focus();
  };

  const applyFontWeight = (weight: string) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    span.style.fontWeight = weight;
    try {
      span.appendChild(range.extractContents());
      range.insertNode(span);
      sel.removeAllRanges();
      if (editorRef.current) onChange(editorRef.current.innerHTML);
    } catch {
      // ignore
    }
    editorRef.current?.focus();
  };

  const handleInput = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");

    if (html) {
      // Strip background colors and other unwanted styles from pasted HTML
      const temp = document.createElement("div");
      temp.innerHTML = html;

      const cleanNode = (node: Element) => {
        // Remove background-related styles
        const el = node as HTMLElement;
        if (el.style) {
          el.style.backgroundColor = "";
          el.style.background = "";
        }
        // Remove bgcolor attribute
        el.removeAttribute("bgcolor");
        // Remove class attributes that may carry styling
        el.removeAttribute("class");
        // Recurse
        Array.from(el.children).forEach((child) => cleanNode(child as Element));
      };

      Array.from(temp.children).forEach((child) => cleanNode(child as Element));
      document.execCommand("insertHTML", false, temp.innerHTML);
    } else if (text) {
      document.execCommand("insertText", false, text);
    }

    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  return (
    <div className="border border-border bg-background">
      <div className="flex items-center gap-1 flex-wrap border-b border-border p-2 bg-[#fafafa]">
        <select
          onChange={(e) => {
            if (e.target.value) exec("fontName", e.target.value);
            e.target.value = "";
          }}
          className="border border-border px-2 py-1 text-xs bg-background"
          defaultValue=""
          title="Font style"
        >
          <option value="" disabled>Font style</option>
          {FONT_FAMILIES.map((f) => (
            <option key={f.label} value={f.value}>{f.label}</option>
          ))}
        </select>

        <select
          onChange={(e) => {
            if (e.target.value) exec("fontSize", e.target.value);
            e.target.value = "";
          }}
          className="border border-border px-2 py-1 text-xs bg-background"
          defaultValue=""
          title="Text size"
        >
          <option value="" disabled>Text size</option>
          {FONT_SIZES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <select
          onChange={(e) => {
            if (e.target.value) applyFontWeight(e.target.value);
            e.target.value = "";
          }}
          className="border border-border px-2 py-1 text-xs bg-background"
          defaultValue=""
          title="Font weight"
        >
          <option value="" disabled>Font weight</option>
          {FONT_WEIGHTS.map((w) => (
            <option key={w.value} value={w.value}>{w.label}</option>
          ))}
        </select>

        <div className="w-px h-5 bg-border mx-1" />

        <button
          type="button"
          onClick={() => exec("bold")}
          className="p-1.5 hover:bg-muted border border-transparent hover:border-border"
          title="Bold"
        >
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("italic")}
          className="p-1.5 hover:bg-muted border border-transparent hover:border-border"
          title="Italic"
        >
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("underline")}
          className="p-1.5 hover:bg-muted border border-transparent hover:border-border"
          title="Underline"
        >
          <Underline className="h-3.5 w-3.5" />
        </button>

        <div className="w-px h-5 bg-border mx-1" />

        <button
          type="button"
          onClick={() => exec("removeFormat")}
          className="p-1.5 hover:bg-muted border border-transparent hover:border-border text-xs"
          title="Clear formatting"
        >
          <Type className="h-3.5 w-3.5" />
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        className="px-3 py-2 text-sm focus:outline-none prose prose-sm max-w-none"
        style={{ minHeight: `${rows * 1.5}rem` }}
        suppressContentEditableWarning
      />
    </div>
  );
}