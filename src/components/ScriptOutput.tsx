import { motion } from "framer-motion";
import { Check, Clock, Copy, Eye, Film, Hash, Lightbulb, Target, Type } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAppSettings } from "@/hooks/useAppSettings";
import { Button } from "@/components/ui/button";
import VideoPromptBuilder from "@/components/VideoPromptBuilder";
import type { ScriptInput } from "@/components/ScriptForm";
import { platformLabels } from "@/lib/ideaTemplates";

export interface ScriptSection {
  timestamp: string;
  section: string;
  dialogue: string;
  visualDirection: string;
  bRollSuggestion: string | null;
}

export interface ScriptResult {
  titleOptions: string[];
  hook: { text: string; hookType: string };
  script: ScriptSection[];
  cta: string;
  seoTags: string[];
  estimatedWordCount: number;
  retentionStrategyNotes: string;
}

function SectionBadge({ section }: { section: string }) {
  const colors: Record<string, string> = {
    hook: "chip-pink",
    intro: "chip-blue",
    cta: "chip-yellow",
    outro: "bg-muted text-muted-foreground",
  };
  const cls = colors[section] || "bg-muted text-muted-foreground";
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${cls}`}>
      {section.replace("_", " ")}
    </span>
  );
}

export default function ScriptOutput({ result, input }: { result: ScriptResult; input: ScriptInput }) {
  const { t } = useAppSettings();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = result.script.map(s => `[${s.timestamp}] ${s.dialogue}`).join("\n\n");
    const full = `${result.titleOptions[0]}\n\n"${result.hook.text}"\n\n${text}\n\n${result.cta}`;
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      toast.success(t("copied"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("copy_failed"));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-5"
    >
      {/* Cover: lead title + hook, styled like a featured shot */}
      <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-card">
        <div className="gradient-accent p-6 md:p-7 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-card text-xs font-bold text-foreground">{platformLabels[input.platform] ?? input.platform}</span>
            <span className="px-3 py-1 rounded-full bg-card text-xs font-semibold text-muted-foreground">{input.targetDuration}</span>
            <span className="px-3 py-1 rounded-full bg-card text-xs font-semibold text-muted-foreground">~{result.estimatedWordCount} {t("words")}</span>
            <Button type="button" variant="default" size="sm" className="ms-auto shrink-0 rounded-full" onClick={handleCopy} title={t("copy_script")}>
              {copied ? <Check /> : <Copy />}
              <span>{copied ? t("copied") : t("copy_script")}</span>
            </Button>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight">{result.titleOptions[0]}</h2>
          <div className="flex items-start gap-3">
            <span className="mt-1 w-8 h-8 shrink-0 rounded-full bg-secondary text-secondary-foreground grid place-items-center"><Target className="w-4 h-4" /></span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase text-accent-foreground">{t("hook")} · {result.hook.hookType.replace("_", " ")}</p>
              <p className="text-foreground text-base md:text-lg font-medium leading-relaxed">"{result.hook.text}"</p>
            </div>
          </div>
        </div>

        {result.titleOptions.length > 1 && (
          <div className="p-5 md:p-6 space-y-2 border-t border-border">
            <div className="flex items-center gap-2 mb-1">
              <Type className="w-4 h-4 text-secondary" />
              <h3 className="text-sm font-bold text-foreground">{t("title_options")}</h3>
            </div>
            {result.titleOptions.map((title, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-2.5 bg-muted rounded-xl text-foreground font-medium text-sm">
                <span className="text-muted-foreground font-bold">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0">{title}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Script Sections */}
      <div className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card space-y-1">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Film className="w-4 h-4 text-secondary" />
          <h3 className="text-sm font-bold text-foreground">{t("full_script")}</h3>
          <span className="ms-auto text-xs text-muted-foreground">{result.script.length} {t("scenes")}</span>
        </div>
        <div className="space-y-4">
          {result.script.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl bg-muted/60 p-4 space-y-1.5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs font-mono text-muted-foreground">{s.timestamp}</span>
                <SectionBadge section={s.section} />
              </div>
              <p className="text-foreground text-sm leading-relaxed">{s.dialogue}</p>
              <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Eye className="w-3 h-3 mt-0.5 shrink-0" />
                <span>{s.visualDirection}</span>
              </div>
              {s.bRollSuggestion && (
                <div className="flex items-start gap-1.5 text-xs text-secondary">
                  <Film className="w-3 h-3 mt-0.5 shrink-0" />
                  <span>{t("b_roll")}: {s.bRollSuggestion}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl gradient-primary text-white p-6 shadow-glow space-y-2">
        <h3 className="text-xs font-bold uppercase text-white/85">{t("call_to_action")}</h3>
        <p className="text-white text-lg font-semibold leading-snug">{result.cta}</p>
      </div>

      {/* SEO Tags */}
      <div className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card space-y-3">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-secondary" />
          <h3 className="text-sm font-bold text-foreground">{t("seo_tags")}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.seoTags.map((tag, i) => {
            const chips = ["chip-pink", "chip-blue", "chip-yellow", "chip-green", "chip-purple"];
            return (
              <span key={i} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${chips[i % chips.length]}`}>
                #{tag}
              </span>
            );
          })}
        </div>
      </div>

      {/* Retention Notes */}
      <div className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card space-y-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-secondary" />
          <h3 className="text-sm font-bold text-foreground">{t("retention_strategy")}</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{result.retentionStrategyNotes}</p>
      </div>

      <VideoPromptBuilder input={input} result={result} />
    </motion.div>
  );
}
