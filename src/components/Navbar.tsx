import { Zap, LogIn, Settings, CreditCard, LogOut, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import UsageBadge from "./UsageBadge";
import { useState } from "react";
import { hasActiveProSubscription } from "@/lib/subscription";

export default function Navbar() {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isPro = hasActiveProSubscription(profile);

  return (
    <header className="bg-card/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/50">
      <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="p-2 rounded-2xl gradient-primary">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-foreground tracking-tight">ScriptForge AI</h1>
            <p className="text-xs text-muted-foreground">Video scripts that hook, retain, and convert</p>
          </div>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/pricing"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Pricing
          </Link>

          {!loading && !user && (
            <Link to="/auth">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            </Link>
          )}

          {user && (
            <>
              <UsageBadge />
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-full border border-border bg-card hover:bg-muted transition-colors"
                >
                  <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {(profile?.email || user.email || "U")[0].toUpperCase()}
                  </div>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-2xl border border-border bg-card shadow-card overflow-hidden">
                      <div className="p-3 border-b border-border">
                        <p className="text-sm font-medium text-foreground truncate">
                          {profile?.email || user.email}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {isPro ? "Pro Plan" : "Free Plan"}
                        </p>
                      </div>
                      <div className="p-1">
                        <button
                          onClick={() => { setMenuOpen(false); navigate("/pricing"); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-muted rounded-xl transition-colors"
                        >
                          <CreditCard className="w-4 h-4 text-muted-foreground" />
                          Pricing
                        </button>
                        <button
                          onClick={() => { setMenuOpen(false); navigate("/settings"); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-muted rounded-xl transition-colors"
                        >
                          <Settings className="w-4 h-4 text-muted-foreground" />
                          Settings
                        </button>
                        <button
                          onClick={() => { setMenuOpen(false); handleSignOut(); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-destructive hover:bg-muted rounded-xl transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
