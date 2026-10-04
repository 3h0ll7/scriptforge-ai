import { motion } from "framer-motion";
import { Check, Clock, Copy, Eye, Film, Hash, Lightbulb, Target, Type } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAppSettings } from "@/hooks/useAppSettings";
import VideoPromptBuilder from "@/components/VideoPromptBuilder";
import type { ScriptInput } from "@/components/ScriptForm";

export interface ScriptSection { timestamp: string; section: string; dialogue: string; visualDirection: string; bRollSuggestion: string | null; }
export interface ScriptResult { titleOptions: string[]; hook: { text: string; hookType: string }; script: ScriptSection[]; cta: string; seoTags: string[]; estimatedWordCount: number; retentionStrategyNotes: string; }

function SectionBadge({ section }: { section: string }) {
  return <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-secondary">{section.replace("_"," ")}</span>;
}

export default function ScriptOutput({ result, input }: { result: ScriptResult; input: ScriptInput }) {
  const { t } = useAppSettings();
  const [copied,setCopied] = useState(false);
  const handleCopy = async () => {
    const text = result.script.map(s => `[${s.timestamp}] ${s.dialogue}`).join("\n\n");
    const full = `${result.titleOptions[0]}\n\n"${result.hook.text}"\n\n${text}\n\n${result.cta}`;
    try { await navigator.clipboard.writeText(full); setCopied(true); toast.success(t("copied")); window.setTimeout(()=>setCopied(false),1800); } catch { toast.error(t("copy_failed")); }
  };
  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="space-y-4">
      <div className="rounded-[28px] border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent"><Type className="h-4 w-4 text-secondary"/></div>
          <div className="min-w-0 flex-1"><div className="text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">{t("title_options")}</div><div className="mt-1 text-lg font-bold text-foreground truncate">{result.titleOptions[0]}</div></div>
          <button onClick={handleCopy} className="rounded-2xl border border-border bg-card/80 p-2.5 hover:bg-primary-foreground">{copied?<Check className="h-4 w-4"/>:<Copy className="h-4 w-4 text-muted-foreground"/>}</button>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">{result.titleOptions.slice(0,3).map((title,i)=><div key={i} className="rounded-2xl bg-muted px-3 py-3 text-sm font-medium text-foreground">{i+1}. {title}</div>)}</div>
      </div>

      <div className="rounded-[28px] border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2"><Target className="h-4 w-4"/><span className="text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">{t("hook")} · {result.hook.hookType.replace("_"," ")}</span></div>
        <p className="mt-3 text-xl font-semibold leading-8 tracking-[-.02em] text-[#1b221e]">“{result.hook.text}”</p>
      </div>

      <div className="rounded-[28px] border border-border bg-card p-6 shadow-card">
        <div className="mb-5 flex items-center gap-2"><Film className="h-4 w-4 text-secondary"/><span className="text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">{t("full_script")}</span><span className="ms-auto text-[10px] font-semibold text-muted-foreground">~{result.estimatedWordCount} {t("words")}</span></div>
        <div className="space-y-5">
          {result.script.map((s,i)=><motion.div key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*.035}} className="border-s-2 border-border ps-4">
            <div className="flex flex-wrap items-center gap-2"><Clock className="h-3.5 w-3.5 text-muted-foreground"/><span className="text-xs font-mono text-muted-foreground">{s.timestamp}</span><SectionBadge section={s.section}/></div>
            <p className="mt-2 text-sm leading-6 text-foreground">{s.dialogue}</p>
            <div className="mt-2 flex items-start gap-2 text-xs leading-5 text-muted-foreground"><Eye className="mt-0.5 h-3.5 w-3.5 shrink-0"/><span>{s.visualDirection}</span></div>
            {s.bRollSuggestion && <div className="mt-1.5 flex items-start gap-2 text-xs leading-5 text-secondary"><Film className="mt-0.5 h-3.5 w-3.5 shrink-0"/><span>{t("b_roll")}: {s.bRollSuggestion}</span></div>}
          </motion.div>)}
        </div>
      </div>

      <div className="rounded-[28px] bg-primary p-6 text-primary-foreground shadow-glow">
        <div className="text-[10px] font-bold uppercase tracking-[.18em] text-primary-foreground/45">{t("call_to_action")}</div>
        <p className="mt-2 text-sm font-semibold leading-6">{result.cta}</p>
      </div>

      <div className="rounded-[28px] border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-secondary"/><span className="text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">{t("seo_tags")}</span></div>
        <div className="mt-4 flex flex-wrap gap-2">{result.seoTags.map((tag,i)=><span key={i} className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-secondary">#{tag}</span>)}</div>
      </div>

      <div className="rounded-[28px] border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2"><Lightbulb className="h-4 w-4 text-secondary"/><span className="text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">{t("retention_strategy")}</span></div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{result.retentionStrategyNotes}</p>
      </div>
      <VideoPromptBuilder input={input} result={result}/>
    </motion.div>
  );
}
