import { motion } from "framer-motion";
import { Check, ChevronDown, CreditCard, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useAppSettings } from "@/hooks/useAppSettings";
import { supabase } from "@/integrations/supabase/client";
import { hasActiveProSubscription } from "@/lib/subscription";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

const freePlanKeys=["feat_5_scripts","feat_yt_tt_reels","feat_basic_hooks","feat_3_titles"];
const proPlanKeys=["feat_unlimited","feat_all_platforms","feat_advanced_hooks","feat_broll","feat_seo","feat_en_ar","feat_export","feat_retention"];
const faqKeys=[["faq_cancel_q","faq_cancel_a"],["faq_payment_q","faq_payment_a"],["faq_billing_q","faq_billing_a"],["faq_downgrade_q","faq_downgrade_a"]];

export default function Pricing(){
  const {user,profile}=useAuth(); const {t}=useAppSettings(); const navigate=useNavigate();
  const [mobileNavOpen,setMobileNavOpen]=useState(false);
  const [billingPeriod,setBillingPeriod]=useState<"monthly"|"yearly">("monthly");
  const [loadingCheckout,setLoadingCheckout]=useState(false);
  const [openFaq,setOpenFaq]=useState<number|null>(null);
  const isPro=hasActiveProSubscription(profile); const monthlyPrice=3; const yearlyPrice=24; const savingsPercent=Math.round((1-yearlyPrice/(monthlyPrice*12))*100);
  const handleUpgrade=async()=>{if(!user){navigate("/auth");return;}setLoadingCheckout(true);try{const {data,error}=await supabase.functions.invoke("create-checkout",{body:{billing_period:billingPeriod}});if(error)throw error;if(data?.url)window.location.href=data.url;else toast.error("Checkout URL not available yet. Please contact support.");}catch(err:any){toast.error(err.message||"Failed to start checkout");}finally{setLoadingCheckout(false)}};
  return <div className="min-h-screen bg-background p-0 lg:p-5">
    <Sidebar mobileOpen={mobileNavOpen} onMobileOpenChange={setMobileNavOpen}/>
    <main className="min-h-[calc(100vh-2.5rem)] overflow-hidden rounded-[30px] border border-card/80 bg-muted shadow-card lg:ms-[270px]">
      <div className="mx-auto max-w-[1180px] px-4 md:px-7"><TopBar/>
        <section className="pb-14">
          <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="mb-8"><p className="text-[10px] font-bold uppercase tracking-[.28em] text-muted-foreground">Plans & billing</p><h1 className="mt-2 text-4xl font-extrabold tracking-[-.045em] text-foreground">{t("simple_pricing")}</h1><p className="mt-2 text-sm text-muted-foreground">{t("pricing_subtitle")}</p></motion.div>
          <div className="mb-7 flex items-center gap-2 rounded-full border border-border bg-card/70 p-1 w-fit"><button onClick={()=>setBillingPeriod("monthly")} className={`rounded-full px-4 py-2 text-xs font-bold \${billingPeriod==="monthly"?"bg-primary text-primary-foreground":"text-muted-foreground"}`}>{t("monthly")}</button><button onClick={()=>setBillingPeriod("yearly")} className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold \${billingPeriod==="yearly"?"bg-primary text-primary-foreground":"text-muted-foreground"}`}>{t("yearly")}<span className="rounded-full bg-accent px-2 py-0.5 text-[9px] text-secondary">{t("save")} {savingsPercent}%</span></button></div>

          <div className="grid gap-5 lg:grid-cols-2">
            <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} className="rounded-[28px] border border-border bg-card p-6 shadow-card">
              <div className="text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">Starter</div><h2 className="mt-2 text-2xl font-extrabold text-foreground">{t("free")}</h2><div className="mt-2 text-4xl font-extrabold text-foreground">$0<span className="text-xs font-medium text-muted-foreground">{t("per_month")}</span></div>
              <div className="mt-6 space-y-3">{freePlanKeys.map(key=><div key={key} className="flex items-center gap-2 text-sm text-[#4b514c]"><Check className="h-4 w-4 text-secondary"/>{t(key)}</div>)}</div>
              <Button variant="outline" className="mt-7 w-full rounded-2xl" disabled={!!user&&!isPro}>{user&&!isPro?t("current_plan"):t("start_free")}</Button>
            </motion.div>

            <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:.08}} className="relative rounded-[28px] border border-primary bg-primary p-6 text-primary-foreground shadow-glow">
              <span className="absolute -top-3 start-6 rounded-full bg-primary-foreground px-3 py-1 text-[10px] font-bold text-primary">{billingPeriod==="yearly"?t("best_value"):t("most_popular")}</span>
              <div className="text-[10px] font-bold uppercase tracking-[.18em] text-primary-foreground/45">Creator plan</div><h2 className="mt-2 text-2xl font-extrabold">{t("pro")}</h2>
              {billingPeriod==="monthly"?<div className="mt-2 text-4xl font-extrabold">$3<span className="text-xs font-medium text-primary-foreground/45">{t("per_month")}</span></div>:<div className="mt-2"><div className="text-4xl font-extrabold">$24<span className="text-xs font-medium text-primary-foreground/45">{t("per_year")}</span></div><div className="mt-1 text-xs text-primary-foreground/55">{t("just")} $2{t("mo")} · {t("save")} $12{t("per_year")}</div></div>}
              <div className="mt-6 space-y-3">{proPlanKeys.map(key=><div key={key} className="flex items-center gap-2 text-sm text-primary-foreground/80"><Check className="h-4 w-4 text-primary-foreground"/>{t(key)}</div>)}</div>
              {isPro?<Button variant="outline" className="mt-7 w-full rounded-2xl border-primary-foreground/15 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/10" disabled>{t("current_plan")} ✓</Button>:<Button className="mt-7 h-12 w-full rounded-2xl bg-primary-foreground text-[#131a15] hover:bg-card/90" onClick={handleUpgrade} disabled={loadingCheckout}><Zap className="h-4 w-4"/>{loadingCheckout?t("loading"):billingPeriod==="monthly"?`\${t("upgrade_to_pro_btn")} — $3\${t("mo")}`:`\${t("upgrade_to_pro_btn")} — $24\${t("yr")}`}</Button>}
              <div className="mt-3 flex items-center justify-center gap-2 text-primary-foreground/45"><CreditCard className="h-4 w-4"/><span className="text-[10px]">{t("mastercard_visa")}</span></div>
            </motion.div>
          </div>

          <div className="mt-12 max-w-3xl"><h2 className="mb-4 text-xl font-bold text-foreground">{t("faq_title")}</h2><div className="space-y-2">{faqKeys.map(([q,a],i)=><div key={q} className="overflow-hidden rounded-2xl border border-border bg-card"><button className="flex w-full items-center justify-between px-5 py-4 text-sm font-semibold text-foreground" onClick={()=>setOpenFaq(openFaq===i?null:i)}>{t(q)}<ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform \${openFaq===i?"rotate-180":""}`}/></button>{openFaq===i&&<div className="px-5 pb-4 text-sm leading-6 text-muted-foreground">{t(a)}</div>}</div>)}</div></div>
        </section>
      </div>
    </main>
  </div>;
}
