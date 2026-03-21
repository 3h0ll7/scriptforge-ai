import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Infinity, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UsageBadge() {
  const { profile, usage } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!profile) return null;

  const isPro = profile.subscription_tier === "pro";
  const count = usage?.generation_count ?? 0;
  const limit = 5;

  const color = isPro
    ? "text-primary border-primary/40 bg-primary/10"
    : count <= 2
    ? "text-green-400 border-green-400/40 bg-green-400/10"
    : count <= 4
    ? "text-yellow-400 border-yellow-400/40 bg-yellow-400/10"
    : "text-red-400 border-red-400/40 bg-red-400/10";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${color}`}
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
          <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-border bg-card p-4 shadow-card space-y-3">
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
                className="w-full text-center text-xs font-semibold text-primary-foreground gradient-primary rounded-lg py-2 hover:opacity-90 transition-opacity"
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
