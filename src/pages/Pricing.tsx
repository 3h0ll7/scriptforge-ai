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

const freePlan = [
  { text: "5 scripts per month", included: true },
  { text: "YouTube, TikTok, Reels", included: true },
  { text: "Basic hooks and CTAs", included: true },
  { text: "3 title suggestions", included: true },
  { text: "Course & Webinar platforms", included: false },
  { text: "Multi-language support", included: false },
  { text: "Export as PDF/JSON", included: false },
  { text: "Retention strategy analysis", included: false },
];

const proPlan = [
  { text: "Unlimited scripts", included: true },
  { text: "All platforms including Course & Webinar", included: true },
  { text: "Advanced hook types", included: true },
  { text: "B-roll & visual direction", included: true },
  { text: "SEO tags & descriptions", included: true },
  { text: "English + Arabic support", included: true },
  { text: "Export as PDF/JSON", included: true },
  { text: "Retention strategy analysis", included: true },
];

const faqs = [
  { q: "Can I cancel anytime?", a: "Yes, cancel anytime from your account settings." },
  { q: "What payment methods do you accept?", a: "Mastercard, Visa, and all major credit/debit cards worldwide." },
  { q: "When does my billing cycle reset?", a: "Your free script count resets on the 1st of each month." },
  { q: "Do I lose my scripts if I downgrade?", a: "No, all your previously generated scripts remain in your history." },
  
];

export default function Pricing() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
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
            <span className="text-gradient">Simple Pricing</span>
          </h2>
          <p className="text-muted-foreground">Start free, upgrade when you need more power.</p>
        </motion.div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              billingPeriod === "monthly"
                ? "bg-primary/15 border border-primary text-primary"
                : "bg-secondary border border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              billingPeriod === "yearly"
                ? "bg-primary/15 border border-primary text-primary"
                : "bg-secondary border border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            Yearly
            <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-accent/20 text-accent">
              Save {savingsPercent}%
            </span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-8 shadow-card"
          >
            <h3 className="text-xl font-bold text-foreground">Free</h3>
            <p className="text-3xl font-bold text-foreground mt-2">$0<span className="text-sm font-normal text-muted-foreground">/month</span></p>
            <div className="mt-6 space-y-3">
              {freePlan.map((f) => (
                <div key={f.text} className="flex items-center gap-2 text-sm">
                  {f.included ? (
                    <Check className="w-4 h-4 text-primary shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                  )}
                  <span className={f.included ? "text-foreground" : "text-muted-foreground/60"}>{f.text}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-8" disabled={!!user && !isPro}>
              {user && !isPro ? "Current Plan" : "Start Free"}
            </Button>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border-2 border-primary bg-card p-8 shadow-card relative"
          >
            <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full text-xs font-bold gradient-primary text-primary-foreground">
              {billingPeriod === "yearly" ? "Best Value" : "Most Popular"}
            </span>
            <h3 className="text-xl font-bold text-foreground">Pro</h3>
            <div className="mt-2">
              {billingPeriod === "monthly" ? (
                <p className="text-3xl font-bold text-primary">
                  ${monthlyPrice}<span className="text-sm font-normal text-muted-foreground">/month</span>
                </p>
              ) : (
                <div>
                  <p className="text-3xl font-bold text-primary">
                    ${yearlyPrice}<span className="text-sm font-normal text-muted-foreground">/year</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Just ${yearlyMonthly}/mo · <span className="text-accent font-semibold">Save ${monthlyPrice * 12 - yearlyPrice}/year</span>
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 space-y-3">
              {proPlan.map((f) => (
                <div key={f.text} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-foreground">{f.text}</span>
                </div>
              ))}
            </div>
            {isPro ? (
              <Button variant="outline" className="w-full mt-8" disabled>
                Current Plan ✓
              </Button>
            ) : (
              <Button variant="glow" size="lg" className="w-full mt-8" onClick={handleUpgrade} disabled={loadingCheckout}>
                <Zap className="w-4 h-4" />
                {loadingCheckout
                  ? "Loading..."
                  : billingPeriod === "monthly"
                  ? `Upgrade to Pro — $${monthlyPrice}/mo`
                  : `Upgrade to Pro — $${yearlyPrice}/yr`}
              </Button>
            )}
            <div className="flex items-center justify-center gap-2 mt-3 text-muted-foreground">
              <CreditCard className="w-4 h-4" />
              <span className="text-xs">Mastercard & Visa</span>
            </div>
          </motion.div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mt-16">
          <h3 className="text-xl font-bold text-foreground mb-6 text-center">Frequently Asked Questions</h3>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                >
                  {faq.q}
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-muted-foreground">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
