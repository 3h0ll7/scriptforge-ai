import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAppSettings } from "@/hooks/useAppSettings";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, CreditCard, History, LogOut, User, Sun, Moon, Globe } from "lucide-react";
import { format } from "date-fns";
import { hasActiveProSubscription } from "@/lib/subscription";

interface HistoryItem {
  id: string;
  topic: string;
  platform: string;
  created_at: string;
}

export default function Settings() {
  const { user, profile, usage, signOut, refreshProfile } = useAuth();
  const { theme, setTheme, language, setLanguage, t } = useAppSettings();
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    supabase
      .from("generation_history")
      .select("id, topic, platform, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setHistory(data);
      });
  }, [user, navigate]);

  if (!user || !profile) return null;

  const isPro = hasActiveProSubscription(profile);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="container max-w-3xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-primary" />
            {t("settings")}
          </h2>

          {/* Preferences — Theme & Language */}
          <div className="rounded-3xl bg-card p-6 shadow-card mb-6 space-y-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <Globe className="w-4 h-4" /> {t("preferences")}
            </div>

            {/* Theme Toggle */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground font-medium">{t("theme")}</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    theme === "light"
                      ? "gradient-primary text-primary-foreground shadow-glow"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <Sun className="w-4 h-4" /> {t("light")}
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    theme === "dark"
                      ? "gradient-primary text-primary-foreground shadow-glow"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <Moon className="w-4 h-4" /> {t("dark")}
                </button>
              </div>
            </div>

            {/* Language Toggle */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground font-medium">{t("app_language")}</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage("en")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    language === "en"
                      ? "gradient-primary text-primary-foreground shadow-glow"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {t("english")}
                </button>
                <button
                  onClick={() => setLanguage("ar")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    language === "ar"
                      ? "gradient-primary text-primary-foreground shadow-glow"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {t("arabic")}
                </button>
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="rounded-3xl bg-card p-6 shadow-card mb-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <User className="w-4 h-4" /> {t("account")}
            </div>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("email")}</span>
                <span className="text-foreground">{profile.email}</span>
              </div>
              {profile.full_name && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("name")}</span>
                  <span className="text-foreground">{profile.full_name}</span>
                </div>
              )}
            </div>
            <Button variant="destructive" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-1" /> {t("sign_out")}
            </Button>
          </div>

          {/* Plan */}
          <div className="rounded-3xl bg-card p-6 shadow-card mb-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <CreditCard className="w-4 h-4" /> {t("subscription")}
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-lg text-sm font-bold ${isPro ? "gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                {isPro ? t("pro") : t("free")}
              </span>
            </div>
            {isPro && profile.subscription_end_date && (
              <p className="text-sm text-muted-foreground">
                {t("active_until")} {format(new Date(profile.subscription_end_date), "MMM d, yyyy")}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {usage?.generation_count ?? 0} {t("scripts_generated")}
            </p>
            {!isPro && (
              <Button variant="glow" size="sm" className="rounded-full" onClick={() => navigate("/pricing")}>
                {t("upgrade_to_pro")}
              </Button>
            )}
          </div>

          {/* History */}
          <div className="rounded-3xl bg-card p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <History className="w-4 h-4" /> {t("script_history")}
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("no_scripts")}</p>
            ) : (
              <div className="space-y-2">
                {history.map((h) => (
                  <div key={h.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm text-foreground font-medium">{h.topic}</p>
                      <p className="text-xs text-muted-foreground capitalize">{h.platform}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(h.created_at), "MMM d")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
