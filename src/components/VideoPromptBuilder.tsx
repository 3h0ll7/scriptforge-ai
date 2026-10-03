import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Film, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppSettings } from "@/hooks/useAppSettings";
import { enhancePrompt } from "@/lib/generateScript";
import type { ScriptInput } from "@/components/ScriptForm";
import type { ScriptResult } from "@/components/ScriptOutput";

interface Props { input: ScriptInput; result: ScriptResult; onPromptChange?: (prompt: string) => void; }
const formatScript = (result: ScriptResult) => result.script.map(section => \`[\${section.timestamp}] \${section.dialogue}\`).join("\\n\\n");

export default function VideoPromptBuilder({ input, result, onPromptChange }: Props) {
  const { t } = useAppSettings();
  const [hook,setHook]=useState(result.hook.text);
  const [script,setScript]=useState(()=>formatScript(result));
  const [prompt,setPrompt]=useState("");
  const [isBuilding,setIsBuilding]=useState(false);
  const [copied,setCopied]=useState(false);
  useEffect(()=>{setHook(result.hook.text);setScript(formatScript(result));setPrompt("");onPromptChange?.("");},[result,onPromptChange]);
  const handleBuild=async()=>{
    if(!hook.trim()||!script.trim()){toast.error(t("hook_script_required"));return;}
    setIsBuilding(true);
    try{
      const sourceText = \`\${input.sourceText?.trim()?\`\${input.sourceText.trim()}\\n\\n\`:""}\${t("hook")}:\\n\${hook.trim()}\\n\\n\${t("full_script")}:\\n\${script.trim()}\`;
      const detailedPrompt=await enhancePrompt({...input,sourceText,videoPrompt:\`\${t("build_video_from_script_instruction")}\\n\\n\${hook.trim()}\\n\\n\${script.trim()}\`});
      setPrompt(detailedPrompt);onPromptChange?.(detailedPrompt);
    }catch(error){toast.error(error instanceof Error?error.message:t("prompt_build_failed"))}
    finally{setIsBuilding(false)}
  };
  const handleCopy=async()=>{try{await navigator.clipboard.writeText(prompt);setCopied(true);toast.success(t("copied"));window.setTimeout(()=>setCopied(false),1500)}catch{toast.error(t("copy_failed"))}};
  const inputClass="w-full rounded-2xl border border-[#e7e3db] bg-white/80 px-4 py-3.5 text-sm text-[#252b27] placeholder:text-[#a3a39d] outline-none transition focus:border-[#bab6ad] focus:bg-white focus:ring-4 focus:ring-[#7c8d82]/10 resize-y";
  return (
    <motion.section initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="rounded-[28px] border border-[#e4e0d8] bg-[#fbfaf7] p-5 shadow-[0_18px_50px_rgba(73,64,56,.055)] md:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#111a14] text-white"><Film className="h-5 w-5"/></div>
        <div className="min-w-0"><h3 className="text-[18px] font-bold tracking-[-.02em] text-[#1c231f]">{t("video_prompt_builder")}</h3><p className="mt-1 text-xs leading-5 text-[#858984]">{t("video_prompt_builder_help")}</p></div>
      </div>
      <div className="mt-6 space-y-2"><label className="text-[10px] font-bold uppercase tracking-[.16em] text-[#8d8f8a]">{t("hook_for_video")}</label><textarea rows={3} value={hook} onChange={event=>setHook(event.target.value)} placeholder={t("hook_for_video_placeholder")} className={inputClass}/></div>
      <div className="mt-5 space-y-2"><label className="text-[10px] font-bold uppercase tracking-[.16em] text-[#8d8f8a]">{t("script_for_video")}</label><textarea rows={8} value={script} onChange={event=>setScript(event.target.value)} placeholder={t("script_for_video_placeholder")} className={inputClass}/></div>
      <Button type="button" variant="glow" className="mt-5 h-12 w-full rounded-2xl" disabled={isBuilding||!hook.trim()||!script.trim()} onClick={handleBuild}><Wand2 className={isBuilding?"h-4 w-4 animate-spin":"h-4 w-4"}/>{isBuilding?t("building_detailed_prompt"):t("build_detailed_prompt")}</Button>
      {prompt && <div className="mt-5 rounded-2xl border border-[#e8e4dc] bg-[#f5f3ee] p-4">
        <div className="flex items-center justify-between gap-3"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#777b76]">{t("detailed_video_prompt")}</p><Button type="button" size="icon" variant="ghost" className="rounded-xl" onClick={handleCopy}>{copied?<Check className="h-4 w-4"/>:<Copy className="h-4 w-4"/>}</Button></div>
        <textarea rows={10} value={prompt} onChange={event=>setPrompt(event.target.value)} className={inputClass+" mt-3 bg-white/90"}/>
      </div>}
    </motion.section>
  );
}
