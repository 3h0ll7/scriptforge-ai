import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAppSettings } from "@/hooks/useAppSettings";

export default function ResetPassword(){
  const [password,setPassword]=useState(""),[loading,setLoading]=useState(false),[ready,setReady]=useState(false);
  const navigate=useNavigate();const{t}=useAppSettings();
  useEffect(()=>{const{data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{if(event==="PASSWORD_RECOVERY"||session)setReady(true)});supabase.auth.getSession().then(({data:{session}})=>{if(session)setReady(true)});return()=>subscription.unsubscribe()},[]);
  const handleSubmit=async(e:React.FormEvent)=>{e.preventDefault();setLoading(true);try{const{error}=await supabase.auth.updateUser({password});if(error)throw error;toast.success(t("password_updated"));navigate("/",{replace:true})}catch(err){toast.error(err instanceof Error?err.message:"Failed to update password")}finally{setLoading(false)}};
  return <div className="min-h-screen bg-background px-4 py-8"><div className="mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center"><motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} className="w-full max-w-md rounded-[30px] border border-card/80 bg-card p-7 shadow-card sm:p-9">
    <button onClick={()=>navigate("/")} className="mb-8 flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4"/>{t("back_to_home")}</button>
    <div className="mb-7 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Zap className="h-5 w-5"/></div><div><div className="text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">ScriptForge AI</div><h1 className="mt-1 text-2xl font-extrabold text-foreground">{t("reset_password")}</h1></div></div>
    {!ready?<p className="text-sm text-muted-foreground">{t("please_wait")}</p>:<form onSubmit={handleSubmit} className="space-y-4"><div className="relative"><Lock className="absolute start-3.5 top-3.5 h-4 w-4 text-muted-foreground"/><input type="password" placeholder={t("new_password")} value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} className="w-full rounded-2xl border border-input bg-card/85 ps-10 pe-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-4 focus:ring-ring/10"/></div><Button type="submit" variant="glow" size="lg" className="h-12 w-full rounded-2xl" disabled={loading}>{loading?t("please_wait"):t("update_password")}</Button></form>}
  </motion.div></div></div>;
}
