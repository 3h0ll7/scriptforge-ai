import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ChevronDown } from "lucide-react";

export default function UsageBadge() {
  const { user, usage } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const used = usage?.generations_used ?? 0;
  const limit = usage?.free_limit ?? 5;
  const remaining = usage?.remaining ?? Math.max(limit - used, 0);
  const exhausted = remaining <= 0;

  const color = exhausted ? "chip-pink" : remaining <= 2 ? "chip-yellow" : "chip-green";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${color}`}
      >
        {used}/{limit}
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute end-0 top-full mt-2 z-50 w-64 rounded-2xl border border-border bg-card p-4 shadow-card space-y-2">
            <p className="text-sm font-semibold text-foreground">
              Free generations: {used} / {limit} used
            </p>
            <p className="text-xs text-muted-foreground">Remaining: {remaining} left</p>
            {exhausted && (
              <p className="text-xs font-medium text-primary">
                Your free generations are finished. Upgrade to continue.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
