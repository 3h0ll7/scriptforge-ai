import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BarChart3, Clapperboard, FileText, Home, Languages, LogOut, Menu, Moon, Plus, Settings, Sparkles, Sun, Wand2, X, Zap } from "lucide-react";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { hasActiveProSubscription } from "@/lib/subscription";

interface SidebarProps { mobileOpen: boolean; onMobileOpenChange: (open: boolean) => void; }

export default function Sidebar({ mobileOpen, onMobileOpenChange }: SidebarProps) {
  const { theme, setTheme, language, setLanguage, t } = useAppSettings();
  const { user, profile, usage, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isPro = hasActiveProSubscription(profile);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    let active = true;
    if (!user) { setHistoryCount(0); return () => { active = false; }; }
    import("@/integrations/supabase/client").then(({ supabase }) => {
      supabase.from("generation_history").select("id", { count: "exact", head: true }).eq("user_id", user.id).then(({ count }) => {
        if (active) setHistoryCount(typeof count === "number" ? count : 0);
      });
    });
    return () => { active = false; };
  }, [user]);

  const navItems = useMemo(() => [
    { href: "/", label: t("home"), icon: Home },
    { href: "/#script-form", label: t("new_script"), icon: Plus },
    { href: "/#script-output", label: t("results"), icon: FileText },
  ], [t]);

  const workspaceItems = [
    { href: "/#script-form", label: "Script Studio", icon: Clapperboard },
    { href: "/#script-output", label: "Video Prompt", icon: Wand2 },
    { href: "/settings", label: t("settings"), icon: Settings },
  ];

  const activeFor = (href: string) => href.startsWith("/#") ? location.pathname === "/" : location.pathname === href;
  const go = (href: string) => {
    onMobileOpenChange(false);
    if (!href.includes("#")) { navigate(href); return; }
    const hash = href.split("#")[1];
    if (location.pathname !== "/") navigate("/");
    window.setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" }), location.pathname === "/" ? 10 : 140);
  };
  const handleSignOut = async () => { await signOut(); onMobileOpenChange(false); navigate("/"); };

  const railClass = mobileOpen ? "translate-x-0" : (language === "ar" ? "translate-x-[calc(100%+28px)] lg:translate-x-0" : "-translate-x-[calc(100%+28px)] lg:translate-x-0");
  return <>
    {mobileOpen && <button aria-label="Close navigation" onClick={() => onMobileOpenChange(false)} className="fixed inset-0 z-[65] bg-black/15 backdrop-blur-[2px] lg:hidden" />}
    <aside className={`fixed inset-y-4 start-4 z-[70] flex w-[248px] flex-col rounded-[28px] border border-card/75 bg-card/96 p-4 shadow-card backdrop-blur-xl transition-transform duration-300 lg:inset-y-5 lg:start-5 ${railClass}`}>
      <div className="flex items-center justify-between px-2 pb-4">
        <Link to="/" onClick={() => onMobileOpenChange(false)} className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow"><Zap className="h-5 w-5" /></span>
          <span><span className="block text-[17px] font-extrabold tracking-[-.03em] text-foreground">ScriptForge<span className="text-[#8b9a8e]">.</span></span><span className="mt-1 block text-[10px] font-medium uppercase tracking-[.22em] text-muted-foreground">AI workspace</span></span>
        </Link>
        <button aria-label="Close" onClick={() => onMobileOpenChange(false)} className="rounded-xl p-2 text-muted-foreground hover:bg-[#efeee9] lg:hidden"><X className="h-4 w-4" /></button>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-border bg-card/75 p-2 shadow-card">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-secondary"><Sparkles className="h-4 w-4" /></div>
        <div className="min-w-0"><div className="text-[11px] font-semibold text-foreground">{isPro ? "Pro workspace" : "Free workspace"}</div><div className="truncate text-[10px] text-muted-foreground">{isPro ? "Unlimited generation" : `${usage?.generation_count ?? 0} / 5 used this month`}</div></div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto pe-1">
        {navItems.map(({ href, label, icon: Icon }) => <button key={label} onClick={() => go(href)} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-all ${activeFor(href) ? "bg-accent font-semibold text-foreground" : "font-medium text-[#656d67] hover:bg-accent hover:text-foreground"}`}><Icon className="h-[17px] w-[17px]" /><span>{label}</span></button>)}
        <div className="px-3 pb-2 pt-7 text-[10px] font-bold uppercase tracking-[.22em] text-muted-foreground">{t("workspace")}</div>
        {workspaceItems.map(({ href, label, icon: Icon }) => <button key={label} onClick={() => go(href)} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all ${activeFor(href) ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}><Icon className="h-[17px] w-[17px]" /><span>{label}</span></button>)}
        <div className="mt-5 rounded-2xl border border-border bg-muted p-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground"><BarChart3 className="h-4 w-4" /><span>Usage overview</span></div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border"><div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${isPro ? 100 : Math.min(100, ((usage?.generation_count ?? 0) / 5) * 100)}%` }} /></div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground"><span>{isPro ? "Unlimited" : `${usage?.generation_count ?? 0} of 5`}</span><span>{historyCount} total scripts</span></div>
        </div>
      </nav>

      <div className="mt-3 border-t border-border pt-3">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card/80 px-2.5 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-accent">{theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}{theme === "light" ? "Dark" : "Light"}</button>
          <button onClick={() => setLanguage(language === "en" ? "ar" : "en")} className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card/80 px-2.5 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-accent"> <Languages className="h-4 w-4" />{language === "en" ? "ع" : "EN"}</button>
        </div>
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-card/70 p-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-foreground">{(profile?.full_name || profile?.email || "S").slice(0,1).toUpperCase()}</div>
          <div className="min-w-0 flex-1"><div className="truncate text-[12px] font-semibold text-foreground">{profile?.full_name || "Creator"}</div><div className="truncate text-[10px] text-muted-foreground">{profile?.email || "Sign in to sync"}</div></div>
          {user ? <button onClick={handleSignOut} className="rounded-xl p-2 text-muted-foreground hover:bg-[#efeee9]" title={t("sign_out")}><LogOut className="h-4 w-4" /></button> : <Button size="sm" variant="glow" className="h-8 rounded-xl px-3 text-[11px]" onClick={() => { onMobileOpenChange(false); navigate("/auth"); }}>{t("sign_in")}</Button>}
        </div>
      </div>
    </aside>
    <button onClick={() => onMobileOpenChange(true)} className="fixed start-4 top-4 z-[60] flex h-11 w-11 items-center justify-center rounded-2xl border border-card/70 bg-card/90 shadow-card lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5 text-foreground" /></button>
  </>;
}
