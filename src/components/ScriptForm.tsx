import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clapperboard, Sparkles } from "lucide-react";

export interface ScriptInput {
  topic: string;
  platform: string;
  targetDuration: string;
  audience: string;
  tone: string;
  keyMessage: string;
  language: string;
}

const platforms = [
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "reels", label: "Reels" },
  { value: "course", label: "Course" },
  { value: "webinar", label: "Webinar" },
];

const durations = [
  { value: "30s", label: "30s" },
  { value: "60s", label: "60s" },
  { value: "3min", label: "3 min" },
  { value: "5min", label: "5 min" },
  { value: "10min", label: "10 min" },
  { value: "15min+", label: "15+ min" },
];

const tones = [
  { value: "educational", label: "Educational" },
  { value: "entertaining", label: "Entertaining" },
  { value: "dramatic", label: "Dramatic" },
  { value: "casual", label: "Casual" },
  { value: "motivational", label: "Motivational" },
];

const languages = [
  { value: "en", label: "English" },
  { value: "ar", label: "Arabic" },
  { value: "both", label: "Both" },
];

interface Props {
  onGenerate: (input: ScriptInput) => void;
  isLoading: boolean;
}

function ChipSelect({ options, value, onChange, label }: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
              value === opt.value
                ? "bg-primary/15 border-primary text-primary shadow-glow"
                : "bg-secondary border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ScriptForm({ onGenerate, isLoading }: Props) {
  const [form, setForm] = useState<ScriptInput>({
    topic: "",
    platform: "youtube",
    targetDuration: "5min",
    audience: "",
    tone: "educational",
    keyMessage: "",
    language: "en",
  });

  const update = (key: keyof ScriptInput, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.topic.trim()) return;
    onGenerate(form);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-card"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl gradient-primary">
          <Clapperboard className="w-5 h-5 text-primary-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Script Parameters</h2>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Topic *</label>
        <input
          value={form.topic}
          onChange={(e) => update("topic", e.target.value)}
          placeholder="e.g. How AI is changing video production"
          className="w-full rounded-lg border border-input bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
      </div>

      <ChipSelect label="Platform" options={platforms} value={form.platform} onChange={(v) => update("platform", v)} />
      <ChipSelect label="Duration" options={durations} value={form.targetDuration} onChange={(v) => update("targetDuration", v)} />
      <ChipSelect label="Tone" options={tones} value={form.tone} onChange={(v) => update("tone", v)} />
      <ChipSelect label="Language" options={languages} value={form.language} onChange={(v) => update("language", v)} />

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Target Audience</label>
        <input
          value={form.audience}
          onChange={(e) => update("audience", e.target.value)}
          placeholder="e.g. Beginner content creators aged 18-30"
          className="w-full rounded-lg border border-input bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Key Message *</label>
        <textarea
          value={form.keyMessage}
          onChange={(e) => update("keyMessage", e.target.value)}
          rows={2}
          placeholder="The one thing viewers must remember..."
          className="w-full rounded-lg border border-input bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
        />
      </div>

      <Button type="submit" variant="glow" size="lg" className="w-full" disabled={isLoading || !form.topic.trim()}>
        {isLoading ? (
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
            <Sparkles className="w-5 h-5" />
          </motion.div>
        ) : (
          <Sparkles className="w-5 h-5" />
        )}
        {isLoading ? "Generating Script..." : "Generate Script"}
      </Button>
    </motion.form>
  );
}
