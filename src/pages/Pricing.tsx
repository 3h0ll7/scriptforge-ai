import { motion } from "framer-motion";
import { Check, X, Zap, CreditCard, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { hasActiveProSubscription } from "@/lib/subscription";
import { useAppSettings } from "@/hooks/useAppSettings";

const freePlanKeys = [
  { key: "feat_5_scripts", included: true },
  { key: "feat_yt_tt_reels", included: true },
  { key: "feat_basic_hooks", included: true },
  { key: "feat_3_titles", included: true },
  { key: "feat_course_webinar", included: false },
  { key: "feat_multi_lang", included: false },
  { key: "feat_export", included: false },
  { key: "feat_retention", included: false },
];

const proPlanKeys = [
  { key: "feat_unlimited", included: true },
  { key: "feat_all_platforms", included: true },
  { key: "feat_advanced_hooks", included: true },
  { key: "feat_broll", included: true },
  { key: "feat_seo", included: true },
  { key: "feat_en_ar", included: true },
  { key: "feat_export", included: true },
  { key: "feat_retention", included: true },
];

const faqKeys = [
  { q: "faq_cancel_q", a: "faq_cancel_a" },
  { q: "faq_payment_q", a: "faq_payment_a" },
  { q: "faq_billing_q", a: "faq_billing_a" },
  { q: "faq_downgrade_q", a: "faq_downgrade_a" },
];

export default function Pricing() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { t } = useAppSettings();
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const isPro = hasActiveProSubscription(profile);
  const monthlyPrice = 3;
  const yearlyPrice = 24;
  const yearlyMonthly = (yearlyPrice / 12).toFixed(0);
  const savingsPercent = Math.round((1 - yearlyPrice / (monthlyPrice * 12)) * 100);

  const handleUpgrade = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setLoadingCheckout(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { billing_period: billingPeriod },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Checkout URL not available yet. Please contact support.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to start checkout");
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="container max-w-5xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gradient">{t("simple_pricing")}</span>
          </h2>
          <p className="text-muted-foreground">{t("pricing_subtitle")}</p>
        </motion.div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              billingPeriod === "monthly"
                ? "chip-pink"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {t("monthly")}
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
              billingPeriod === "yearly"
                ? "chip-blue"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {t("yearly")}
            <span className="px-2 py-0.5 rounded-full text-xs font-bold chip-yellow">
              {t("save")} {savingsPercent}%
            </span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-card p-8 shadow-card"
          >
            <h3 className="text-xl font-bold text-foreground">{t("free")}</h3>
            <p className="text-3xl font-bold text-foreground mt-2">$0<span className="text-sm font-normal text-muted-foreground">{t("per_month")}</span></p>
            <div className="mt-6 space-y-3">
              {freePlanKeys.map((f) => (
                <div key={f.key} className="flex items-center gap-2 text-sm">
                  {f.included ? (
                    <Check className="w-4 h-4 text-primary shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                  )}
                  <span className={f.included ? "text-foreground" : "text-muted-foreground/60"}>{t(f.key)}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-8 rounded-full" disabled={!!user && !isPro}>
              {user && !isPro ? t("current_plan") : t("start_free")}
            </Button>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl bg-card p-8 shadow-card ring-2 ring-primary relative"
          >
            <span className="absolute -top-3 left-6 px-4 py-1 rounded-full text-xs font-bold gradient-primary text-primary-foreground">
              {billingPeriod === "yearly" ? t("best_value") : t("most_popular")}
            </span>
            <h3 className="text-xl font-bold text-foreground">{t("pro")}</h3>
            <div className="mt-2">
              {billingPeriod === "monthly" ? (
                <p className="text-3xl font-bold text-primary">
                  ${monthlyPrice}<span className="text-sm font-normal text-muted-foreground">{t("per_month")}</span>
                </p>
              ) : (
                <div>
                  <p className="text-3xl font-bold text-primary">
                    ${yearlyPrice}<span className="text-sm font-normal text-muted-foreground">{t("per_year")}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("just")} ${yearlyMonthly}{t("mo")} · <span className="text-accent font-semibold">{t("save")} ${monthlyPrice * 12 - yearlyPrice}{t("per_year")}</span>
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 space-y-3">
              {proPlanKeys.map((f) => (
                <div key={f.key} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-foreground">{t(f.key)}</span>
                </div>
              ))}
            </div>
            {isPro ? (
              <Button variant="outline" className="w-full mt-8" disabled>
                {t("current_plan")} ✓
              </Button>
            ) : (
              <Button variant="glow" size="lg" className="w-full mt-8 rounded-full" onClick={handleUpgrade} disabled={loadingCheckout}>
                <Zap className="w-4 h-4" />
                {loadingCheckout
                  ? t("loading")
                  : billingPeriod === "monthly"
                  ? `${t("upgrade_to_pro_btn")} — $${monthlyPrice}${t("mo")}`
                  : `${t("upgrade_to_pro_btn")} — $${yearlyPrice}${t("yr")}`}
              </Button>
            )}
            <div className="flex items-center justify-center gap-2 mt-3 text-muted-foreground">
              <CreditCard className="w-4 h-4" />
              <span className="text-xs">{t("mastercard_visa")}</span>
            </div>
          </motion.div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mt-16">
          <h3 className="text-xl font-bold text-foreground mb-6 text-center">{t("faq_title")}</h3>
          <div className="space-y-2">
            {faqKeys.map((faq, i) => (
              <div key={i} className="rounded-2xl bg-card overflow-hidden shadow-card">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                >
                  {t(faq.q)}
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-muted-foreground">{t(faq.a)}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}