import { cn } from "@/lib/utils";

export function Tabs({
  tabs,
  value,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-md border border-border bg-elevated p-1" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={value === tab.id}
          className={cn(
            "min-h-9 rounded-sm px-3 text-sm transition-colors",
            value === tab.id ? "bg-surface text-fg" : "text-muted hover:text-fg",
          )}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
