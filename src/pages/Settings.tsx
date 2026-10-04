import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CreditCard, Globe, History, LogOut, Moon, Settings as SettingsIcon, Sun, User } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useAppSettings } from "@/hooks/useAppSettings";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { hasActiveProSubscription } from "@/lib/subscription";

interface HistoryItem { id:string; topic:string; platform:string; created_at:string; }

export default function Settings() {
  const { user, profile, usage, signOut } = useAuth();
  const { theme, setTheme, language, setLanguage, t } = useAppSettings();
  const navigate=useNavigate();
  const [mobileNavOpen,setMobileNavOpen]=useState(false);
  const [history,setHistory]=useState<HistoryItem[]>([]);

  useEffect(()=>{
    if(!user){navigate("/auth");return;}
    supabase.from("generation_history").select("id,topic,platform,created_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(20)
      .then(({data})=>{if(data)setHistory(data as HistoryItem[])});
  },[user,navigate]);

  if(!user||!profile)return null;
  const isPro=hasActiveProSubscription(profile);

  const signOutAndGo=async()=>{await signOut();navigate("/")};

  return <div className="min-h-screen bg-background p-0 lg:p-5">
    <Sidebar mobileOpen={mobileNavOpen} onMobileOpenChange={setMobileNavOpen}/>
    <main className="min-h-[calc(100vh-2.5rem)] overflow-hidden rounded-[30px] border border-card/80 bg-muted shadow-card lg:ms-[270px]">
      <div className="mx-auto max-w-[1180px] px-4 md:px-7">
        <TopBar/>
        <motion.section initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="pb-12">
          <div className="mb-7"><p className="text-[10px] font-bold uppercase tracking-[.28em] text-muted-foreground">Workspace settings</p><h1 className="mt-2 text-4xl font-extrabold tracking-[-.045em] text-foreground">{t("settings")}</h1><p className="mt-2 text-sm text-muted-foreground">Tune your workspace, account and subscription preferences.</p></div>

          <div className="grid gap-5 xl:grid-cols-2">
            <div className="rounded-[28px] border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-secondary"><Globe className="h-4 w-4"/></div><div><div className="text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">{t("preferences")}</div><div className="mt-1 text-base font-bold text-foreground">Appearance & language</div></div></div>
              <div className="mt-6 space-y-5">
                <div><label className="text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">{t("theme")}</label><div className="mt-2 flex gap-2"><button onClick={()=>setTheme("light")} className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold \${theme==="light"?"border-primary bg-primary text-primary-foreground":"border-input bg-card/75 text-muted-foreground"}`}><Sun className="h-4 w-4"/>{t("light")}</button><button onClick={()=>setTheme("dark")} className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold \${theme==="dark"?"border-primary bg-primary text-primary-foreground":"border-input bg-card/75 text-muted-foreground"}`}><Moon className="h-4 w-4"/>{t("dark")}</button></div></div>
                <div><label className="text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">{t("app_language")}</label><div className="mt-2 flex gap-2"><button onClick={()=>setLanguage("en")} className={`rounded-2xl border px-4 py-2.5 text-xs font-bold \${language==="en"?"border-primary bg-primary text-primary-foreground":"border-input bg-card/75 text-muted-foreground"}`}>English</button><button onClick={()=>setLanguage("ar")} className={`rounded-2xl border px-4 py-2.5 text-xs font-bold \${language==="ar"?"border-primary bg-primary text-primary-foreground":"border-input bg-card/75 text-muted-foreground"}`}>العربية</button></div></div>
              </div>
            </div>

            <div className="rounded-[28px] border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-secondary"><User className="h-4 w-4"/></div><div><div className="text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">{t("account")}</div><div className="mt-1 text-base font-bold text-foreground">Profile</div></div></div>
              <div className="mt-6 rounded-2xl bg-muted p-4"><div className="text-xs font-semibold text-muted-foreground">{t("name")}</div><div className="mt-1 text-sm font-bold text-foreground">{profile.full_name||"Creator"}</div><div className="mt-4 text-xs font-semibold text-muted-foreground">{t("email")}</div><div className="mt-1 truncate text-sm font-medium text-foreground">{profile.email}</div></div>
              <Button variant="outline" size="sm" className="mt-4 rounded-2xl" onClick={signOutAndGo}><LogOut className="h-4 w-4"/>{t("sign_out")}</Button>
            </div>

            <div className="rounded-[28px] border border-border bg-card p-6 shadow-card xl:col-span-2">
              <div className="flex flex-wrap items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-secondary"><CreditCard className="h-4 w-4"/></div><div><div className="text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">{t("subscription")}</div><div className="mt-1 text-base font-bold text-foreground">{isPro?"Pro plan":"Free plan"}</div></div><span className="ms-auto rounded-full bg-accent px-3 py-1.5 text-[10px] font-bold text-secondary">{isPro?"ACTIVE":"FREE"}</span></div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-border bg-card/75 p-4"><div className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">Usage</div><div className="mt-1 text-2xl font-bold text-foreground">{isPro?"∞":`\${usage?.generation_count??0}/5`}</div><div className="text-xs text-muted-foreground">scripts this month</div></div>
                <div className="rounded-2xl border border-border bg-card/75 p-4"><div className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">Status</div><div className="mt-2 text-sm font-bold text-foreground">{isPro?"Unlimited":"Starter access"}</div><div className="mt-1 text-xs text-muted-foreground">{isPro&&profile.subscription_end_date?`\${t("active_until")} \${format(new Date(profile.subscription_end_date),"MMM d, yyyy")`:"Upgrade whenever you need more capacity."}</div></div>
                <div className="flex items-center justify-between rounded-2xl bg-primary p-4 text-primary-foreground"><div><div className="text-[10px] uppercase tracking-[.15em] text-primary-foreground/45">Plan</div><div className="mt-1 text-sm font-bold">{isPro?"Pro":"Free"}</div></div>{!isPro&&<button onClick={()=>navigate("/pricing")} className="rounded-xl bg-primary-foreground px-3 py-2 text-[11px] font-bold text-primary-foreground">Upgrade</button>}</div>
              </div>
            </div>

            <div className="rounded-[28px] border border-border bg-card p-6 shadow-card xl:col-span-2">
              <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-secondary"><History className="h-4 w-4"/></div><div><div className="text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">{t("script_history")}</div><div className="mt-1 text-base font-bold text-foreground">Recent generations</div></div></div>
              <div className="mt-5 divide-y divide-[#eeeae2]">{history.length===0?<p className="py-5 text-sm text-muted-foreground">{t("no_scripts")}</p>:history.map(item=><div key={item.id} className="flex items-center justify-between gap-4 py-3"><div className="min-w-0"><div className="truncate text-sm font-semibold text-foreground">{item.topic}</div><div className="mt-1 text-[11px] capitalize text-muted-foreground">{item.platform}</div></div><span className="shrink-0 text-[11px] text-muted-foreground">{format(new Date(item.created_at),"MMM d, yyyy")}</span></div>)}</div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  </div>;
}
