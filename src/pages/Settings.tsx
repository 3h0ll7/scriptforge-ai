import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, CreditCard, History, LogOut, User } from "lucide-react";
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
            Settings
          </h2>

          {/* Account */}
          <div className="rounded-3xl bg-card p-6 shadow-card mb-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <User className="w-4 h-4" /> Account
            </div>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="text-foreground">{profile.email}</span>
              </div>
              {profile.full_name && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="text-foreground">{profile.full_name}</span>
                </div>
              )}
            </div>
            <Button variant="destructive" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-1" /> Sign Out
            </Button>
          </div>

          {/* Plan */}
          <div className="rounded-3xl bg-card p-6 shadow-card mb-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <CreditCard className="w-4 h-4" /> Subscription
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-lg text-sm font-bold ${isPro ? "gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                {isPro ? "Pro" : "Free"}
              </span>
            </div>
            {isPro && profile.subscription_end_date && (
              <p className="text-sm text-muted-foreground">
                Active until {format(new Date(profile.subscription_end_date), "MMM d, yyyy")}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {usage?.generation_count ?? 0} scripts generated this month
            </p>
            {!isPro && (
              <Button variant="glow" size="sm" className="rounded-full" onClick={() => navigate("/pricing")}>
                Upgrade to Pro
              </Button>
            )}
          </div>

          {/* History */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <History className="w-4 h-4" /> Script History
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">No scripts generated yet.</p>
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
