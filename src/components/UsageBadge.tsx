import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Infinity, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { hasActiveProSubscription } from "@/lib/subscription";

export default function UsageBadge() {
  const { profile, usage } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!profile) return null;

  const isPro = hasActiveProSubscription(profile);
  const count = usage?.generation_count ?? 0;
  const limit = 5;

  const color = isPro
    ? "chip-pink"
    : count <= 2
    ? "chip-green"
    : count <= 4
    ? "chip-yellow"
    : "chip-pink";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${color}`}
      >
        {isPro ? (
          <>
            <Infinity className="w-3.5 h-3.5" /> Pro
          </>
        ) : (
          <>{count}/{limit}</>
        )}
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-2xl border border-border bg-card p-4 shadow-card space-y-3">
            <p className="text-sm text-foreground font-medium">
              {isPro
                ? "Unlimited scripts — Pro Plan"
                : `${count} of ${limit} free scripts used this month`}
            </p>
            {!isPro && (
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/pricing");
                }}
                className="w-full text-center text-xs font-semibold text-primary-foreground gradient-primary rounded-full py-2 hover:opacity-90 transition-opacity"
              >
                Upgrade to Pro
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
