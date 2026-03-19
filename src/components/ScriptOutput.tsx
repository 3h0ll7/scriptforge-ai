import { motion } from "framer-motion";
import { Clock, Eye, Film, Hash, Lightbulb, Target, Type } from "lucide-react";

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
    hook: "bg-accent/20 text-accent",
    intro: "bg-primary/20 text-primary",
    cta: "bg-accent/20 text-accent",
    outro: "bg-muted text-muted-foreground",
  };
  const cls = colors[section] || "bg-secondary text-secondary-foreground";
  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider ${cls}`}>
      {section.replace("_", " ")}
    </span>
  );
}

export default function ScriptOutput({ result }: { result: ScriptResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-6"
    >
      {/* Titles */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Title Options</h3>
        </div>
        {result.titleOptions.map((t, i) => (
          <div key={i} className="px-4 py-2.5 bg-muted/50 rounded-lg text-foreground font-medium text-sm">
            {i + 1}. {t}
          </div>
        ))}
      </div>

      {/* Hook */}
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 shadow-card space-y-2">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">Hook — {result.hook.hookType.replace("_", " ")}</h3>
        </div>
        <p className="text-foreground text-lg font-medium leading-relaxed">"{result.hook.text}"</p>
      </div>

      {/* Script Sections */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-1">
        <div className="flex items-center gap-2 mb-4">
          <Film className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Full Script</h3>
          <span className="ml-auto text-xs text-muted-foreground">~{result.estimatedWordCount} words</span>
        </div>
        <div className="space-y-4">
          {result.script.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border-l-2 border-primary/30 pl-4 space-y-1.5"
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
                <div className="flex items-start gap-1.5 text-xs text-primary/70">
                  <Film className="w-3 h-3 mt-0.5 shrink-0" />
                  <span>B-Roll: {s.bRollSuggestion}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 shadow-card space-y-2">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Call to Action</h3>
        <p className="text-foreground font-medium">{result.cta}</p>
      </div>

      {/* SEO Tags */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">SEO Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.seoTags.map((tag, i) => (
            <span key={i} className="px-2.5 py-1 bg-secondary rounded-lg text-xs text-secondary-foreground">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Retention Notes */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Retention Strategy</h3>
        </div>
        <p className="text-sm text-secondary-foreground leading-relaxed">{result.retentionStrategyNotes}</p>
      </div>
    </motion.div>
  );
}
