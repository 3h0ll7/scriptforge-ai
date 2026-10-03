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

  return <div className="min-h-screen bg-[#e9e6df] p-0 lg:p-5">
    <Sidebar mobileOpen={mobileNavOpen} onMobileOpenChange={setMobileNavOpen}/>
    <main className="min-h-[calc(100vh-2.5rem)] overflow-hidden rounded-[30px] border border-white/80 bg-[#eeece7] shadow-[0_24px_70px_rgba(69,59,49,.08)] lg:ms-[270px]">
      <div className="mx-auto max-w-[1180px] px-4 md:px-7">
        <TopBar/>
        <motion.section initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="pb-12">
          <div className="mb-7"><p className="text-[10px] font-bold uppercase tracking-[.28em] text-[#93948e]">Workspace settings</p><h1 className="mt-2 text-4xl font-extrabold tracking-[-.045em] text-[#131915]">{t("settings")}</h1><p className="mt-2 text-sm text-[#6f746f]">Tune your workspace, account and subscription preferences.</p></div>

          <div className="grid gap-5 xl:grid-cols-2">
            <div className="rounded-[28px] border border-[#e4e0d8] bg-[#fbfaf7] p-6 shadow-[0_18px_50px_rgba(73,64,56,.055)]">
              <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef0ea] text-[#5b685e]"><Globe className="h-4 w-4"/></div><div><div className="text-[10px] font-bold uppercase tracking-[.18em] text-[#8f918c]">{t("preferences")}</div><div className="mt-1 text-base font-bold text-[#202721]">Appearance & language</div></div></div>
              <div className="mt-6 space-y-5">
                <div><label className="text-[10px] font-bold uppercase tracking-[.16em] text-[#8d8f8a]">{t("theme")}</label><div className="mt-2 flex gap-2"><button onClick={()=>setTheme("light")} className={\`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold \${theme==="light"?"border-[#26342a] bg-[#1a211c] text-white":"border-[#e7e3db] bg-white/75 text-[#6e746f]"}\`}><Sun className="h-4 w-4"/>{t("light")}</button><button onClick={()=>setTheme("dark")} className={\`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold \${theme==="dark"?"border-[#26342a] bg-[#1a211c] text-white":"border-[#e7e3db] bg-white/75 text-[#6e746f]"}\`}><Moon className="h-4 w-4"/>{t("dark")}</button></div></div>
                <div><label className="text-[10px] font-bold uppercase tracking-[.16em] text-[#8d8f8a]">{t("app_language")}</label><div className="mt-2 flex gap-2"><button onClick={()=>setLanguage("en")} className={\`rounded-2xl border px-4 py-2.5 text-xs font-bold \${language==="en"?"border-[#26342a] bg-[#1a211c] text-white":"border-[#e7e3db] bg-white/75 text-[#6e746f]"}\`}>English</button><button onClick={()=>setLanguage("ar")} className={\`rounded-2xl border px-4 py-2.5 text-xs font-bold \${language==="ar"?"border-[#26342a] bg-[#1a211c] text-white":"border-[#e7e3db] bg-white/75 text-[#6e746f]"}\`}>العربية</button></div></div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#e4e0d8] bg-[#fbfaf7] p-6 shadow-[0_18px_50px_rgba(73,64,56,.055)]">
              <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef0ea] text-[#5b685e]"><User className="h-4 w-4"/></div><div><div className="text-[10px] font-bold uppercase tracking-[.18em] text-[#8f918c]">{t("account")}</div><div className="mt-1 text-base font-bold text-[#202721]">Profile</div></div></div>
              <div className="mt-6 rounded-2xl bg-[#f4f2ed] p-4"><div className="text-xs font-semibold text-[#858984]">{t("name")}</div><div className="mt-1 text-sm font-bold text-[#28302a]">{profile.full_name||"Creator"}</div><div className="mt-4 text-xs font-semibold text-[#858984]">{t("email")}</div><div className="mt-1 truncate text-sm font-medium text-[#3b413c]">{profile.email}</div></div>
              <Button variant="outline" size="sm" className="mt-4 rounded-2xl" onClick={signOutAndGo}><LogOut className="h-4 w-4"/>{t("sign_out")}</Button>
            </div>

            <div className="rounded-[28px] border border-[#e4e0d8] bg-[#fbfaf7] p-6 shadow-[0_18px_50px_rgba(73,64,56,.055)] xl:col-span-2">
              <div className="flex flex-wrap items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef0ea] text-[#5b685e]"><CreditCard className="h-4 w-4"/></div><div><div className="text-[10px] font-bold uppercase tracking-[.18em] text-[#8f918c]">{t("subscription")}</div><div className="mt-1 text-base font-bold text-[#202721]">{isPro?"Pro plan":"Free plan"}</div></div><span className="ms-auto rounded-full bg-[#e8ece7] px-3 py-1.5 text-[10px] font-bold text-[#506055]">{isPro?"ACTIVE":"FREE"}</span></div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-[#ebe7df] bg-white/75 p-4"><div className="text-[10px] uppercase tracking-[.15em] text-[#92948f]">Usage</div><div className="mt-1 text-2xl font-bold text-[#202721]">{isPro?"∞":\`\${usage?.generation_count??0}/5\`}</div><div className="text-xs text-[#8a8d88]">scripts this month</div></div>
                <div className="rounded-2xl border border-[#ebe7df] bg-white/75 p-4"><div className="text-[10px] uppercase tracking-[.15em] text-[#92948f]">Status</div><div className="mt-2 text-sm font-bold text-[#27312a]">{isPro?"Unlimited":"Starter access"}</div><div className="mt-1 text-xs text-[#8a8d88]">{isPro&&profile.subscription_end_date?\`\${t("active_until")} \${format(new Date(profile.subscription_end_date),"MMM d, yyyy")\`:"Upgrade whenever you need more capacity."}</div></div>
                <div className="flex items-center justify-between rounded-2xl bg-[#111a14] p-4 text-white"><div><div className="text-[10px] uppercase tracking-[.15em] text-white/45">Plan</div><div className="mt-1 text-sm font-bold">{isPro?"Pro":"Free"}</div></div>{!isPro&&<button onClick={()=>navigate("/pricing")} className="rounded-xl bg-white px-3 py-2 text-[11px] font-bold text-[#151d17]">Upgrade</button>}</div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#e4e0d8] bg-[#fbfaf7] p-6 shadow-[0_18px_50px_rgba(73,64,56,.055)] xl:col-span-2">
              <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef0ea] text-[#5b685e]"><History className="h-4 w-4"/></div><div><div className="text-[10px] font-bold uppercase tracking-[.18em] text-[#8f918c]">{t("script_history")}</div><div className="mt-1 text-base font-bold text-[#202721]">Recent generations</div></div></div>
              <div className="mt-5 divide-y divide-[#eeeae2]">{history.length===0?<p className="py-5 text-sm text-[#858984]">{t("no_scripts")}</p>:history.map(item=><div key={item.id} className="flex items-center justify-between gap-4 py-3"><div className="min-w-0"><div className="truncate text-sm font-semibold text-[#2a312c]">{item.topic}</div><div className="mt-1 text-[11px] capitalize text-[#92948f]">{item.platform}</div></div><span className="shrink-0 text-[11px] text-[#8c8f8a]">{format(new Date(item.created_at),"MMM d, yyyy")}</span></div>)}</div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  </div>;
}
