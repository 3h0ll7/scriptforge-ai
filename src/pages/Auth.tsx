import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Mail, User, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useAppSettings } from "@/hooks/useAppSettings";

export default function Auth() {
  const [isLogin,setIsLogin]=useState(true),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[fullName,setFullName]=useState(""),[loading,setLoading]=useState(false);
  const navigate=useNavigate(); const {user}=useAuth(); const {t}=useAppSettings();
  useEffect(()=>{if(user)navigate("/",{replace:true})},[user,navigate]);
  const handleEmailAuth=async(e:React.FormEvent)=>{e.preventDefault();setLoading(true);try{if(isLogin){const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;toast.success(t("welcome_back_toast"));navigate("/")}else{const {error}=await supabase.auth.signUp({email,password,options:{data:{full_name:fullName},emailRedirectTo:window.location.origin}});if(error)throw error;toast.success(t("check_email"))}}catch(err:any){toast.error(err.message||"Authentication failed")}finally{setLoading(false)}};
  const handleForgotPassword=async()=>{if(!email){toast.error(t("email_address"));return;}const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${window.location.origin}/reset-password`});if(error)toast.error(error.message);else toast.success(t("reset_link_sent"))};
  const handleGoogleAuth=async()=>{const {error}=await lovable.auth.signInWithOAuth("google",{redirect_uri:window.location.origin});if(error)toast.error("Google sign-in failed")};

  const field="w-full rounded-2xl border border-[#e7e3db] bg-white/85 ps-10 pe-4 py-3.5 text-sm text-[#252b27] placeholder:text-[#a3a39d] outline-none transition focus:border-[#bab6ad] focus:ring-4 focus:ring-[#7c8d82]/10";
  return <div className="min-h-screen bg-[#e9e6df] px-4 py-8">
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
      <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} className="grid w-full overflow-hidden rounded-[32px] border border-white/80 bg-[#fbfaf7] shadow-[0_24px_70px_rgba(69,59,49,.10)] md:grid-cols-[.85fr_1.15fr]">
        <div className="hidden bg-[#111a14] p-10 text-white md:flex md:flex-col">
          <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10"><Zap className="h-5 w-5"/></div><div className="text-lg font-extrabold">ScriptForge<span className="text-white/45">.</span></div></div>
          <div className="mt-auto"><div className="text-[10px] font-bold uppercase tracking-[.25em] text-white/40">Creative workspace</div><h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-.04em]">Write once.<br/>Make it move.</h2><p className="mt-4 max-w-xs text-sm leading-6 text-white/55">A focused workspace for turning ideas into platform-ready scripts and production prompts.</p></div>
        </div>
        <div className="p-7 sm:p-10">
          <button onClick={()=>navigate("/")} className="mb-7 flex items-center gap-2 text-xs font-semibold text-[#737873] hover:text-[#202721]"><ArrowLeft className="h-4 w-4"/>{t("back_to_home")}</button>
          <div className="mb-7"><div className="text-[10px] font-bold uppercase tracking-[.2em] text-[#969892]">ScriptForge AI</div><h1 className="mt-2 text-3xl font-extrabold tracking-[-.04em] text-[#151b17]">{isLogin?t("welcome_back"):t("create_account")}</h1><p className="mt-2 text-sm text-[#777c77]">{isLogin?t("sign_in_continue"):t("join_scriptforge")}</p></div>
          <Button variant="outline" className="mb-5 h-12 w-full rounded-2xl" onClick={handleGoogleAuth}>Continue with Google</Button>
          <div className="relative mb-5"><div className="absolute inset-x-0 top-1/2 border-t border-[#e8e4dc]"/><div className="relative mx-auto w-fit bg-[#fbfaf7] px-3 text-[10px] uppercase tracking-[.15em] text-[#a2a29d]">{t("or")}</div></div>
          <form onSubmit={handleEmailAuth} className="space-y-3">
            {!isLogin&&<div className="relative"><User className="absolute start-3.5 top-3.5 h-4 w-4 text-[#9a9c97]"/><input type="text" placeholder={t("full_name")} value={fullName} onChange={e=>setFullName(e.target.value)} className={field}/></div>}
            <div className="relative"><Mail className="absolute start-3.5 top-3.5 h-4 w-4 text-[#9a9c97]"/><input type="email" placeholder={t("email_address")} value={email} onChange={e=>setEmail(e.target.value)} required className={field}/></div>
            <div className="relative"><Lock className="absolute start-3.5 top-3.5 h-4 w-4 text-[#9a9c97]"/><input type="password" placeholder={t("password")} value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} className={field}/></div>
            <Button type="submit" variant="glow" size="lg" className="mt-2 h-12 w-full rounded-2xl">{loading?t("please_wait"):isLogin?t("sign_in"):t("create_account")}</Button>
          </form>
          {isLogin&&<button onClick={handleForgotPassword} className="mt-4 w-full text-center text-xs font-medium text-[#7d827d] hover:text-[#202a24]">{t("forgot_password")}</button>}
          <p className="mt-6 text-center text-sm text-[#777c77]">{isLogin?t("no_account"):t("have_account")}{" "}<button onClick={()=>setIsLogin(!isLogin)} className="font-bold text-[#3f5b4b] hover:underline">{isLogin?t("sign_up"):t("sign_in")}</button></p>
        </div>
      </motion.div>
    </div>
  </div>;
}
