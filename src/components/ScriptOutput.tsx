import { motion } from "framer-motion";
import { Check, Clock, Copy, Eye, Film, Hash, Lightbulb, Target, Type } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAppSettings } from "@/hooks/useAppSettings";

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
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${cls}`}>
      {section.replace("_", " ")}
    </span>
  );
}

export default function ScriptOutput({ result }: { result: ScriptResult }) {
  const { t } = useAppSettings();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = result.script.map(s => `[${s.timestamp}] ${s.dialogue}`).join("\n\n");
    const full = `${result.titleOptions[0]}\n\n"${result.hook.text}"\n\n${text}\n\n${result.cta}`;
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      toast.success("تم نسخ السكربت!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("فشل النسخ");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-6"
    >
      {/* Titles */}
      <div className="rounded-3xl bg-card p-6 shadow-card space-y-3 relative">
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          title="Copy script"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
        </button>
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-secondary" />
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("title_options")}</h3>
        </div>
        {result.titleOptions.map((title, i) => (
          <div key={i} className="px-4 py-2.5 bg-muted rounded-2xl text-foreground font-medium text-sm">
            {i + 1}. {title}
          </div>
        ))}
      </div>

      {/* Hook */}
      <div className="rounded-3xl chip-pink p-6 shadow-card space-y-2">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          <h3 className="text-sm font-semibold uppercase tracking-wider">{t("hook")} — {result.hook.hookType.replace("_", " ")}</h3>
        </div>
        <p className="text-foreground text-lg font-medium leading-relaxed">"{result.hook.text}"</p>
      </div>

      {/* Script Sections */}
      <div className="rounded-3xl bg-card p-6 shadow-card space-y-1">
        <div className="flex items-center gap-2 mb-4">
          <Film className="w-4 h-4 text-secondary" />
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("full_script")}</h3>
          <span className="ms-auto text-xs text-muted-foreground">~{result.estimatedWordCount} {t("words")}</span>
        </div>
        <div className="space-y-4">
          {result.script.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border-s-2 border-primary/30 ps-4 space-y-1.5"
            >
              <div className="flex items-center gap-2">
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
      <div className="rounded-3xl chip-blue p-6 shadow-card space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider">{t("call_to_action")}</h3>
        <p className="text-foreground font-medium">{result.cta}</p>
      </div>

      {/* SEO Tags */}
      <div className="rounded-3xl bg-card p-6 shadow-card space-y-3">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-secondary" />
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("seo_tags")}</h3>
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
      <div className="rounded-3xl bg-card p-6 shadow-card space-y-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-accent-foreground" />
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("retention_strategy")}</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{result.retentionStrategyNotes}</p>
      </div>
    </motion.div>
  );
}
