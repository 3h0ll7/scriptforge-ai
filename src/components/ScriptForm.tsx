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
  { value: "youtube", label: "YouTube", chip: "chip-pink" },
  { value: "tiktok", label: "TikTok", chip: "chip-blue" },
  { value: "reels", label: "Reels", chip: "chip-purple" },
  { value: "course", label: "Course", chip: "chip-green" },
  { value: "webinar", label: "Webinar", chip: "chip-yellow" },
];

const durations = [
  { value: "30s", label: "30s", chip: "chip-yellow" },
  { value: "60s", label: "60s", chip: "chip-pink" },
  { value: "3min", label: "3 min", chip: "chip-blue" },
  { value: "5min", label: "5 min", chip: "chip-green" },
  { value: "10min", label: "10 min", chip: "chip-purple" },
  { value: "15min+", label: "15+ min", chip: "chip-pink" },
];

const tones = [
  { value: "educational", label: "Educational", chip: "chip-blue" },
  { value: "entertaining", label: "Entertaining", chip: "chip-pink" },
  { value: "dramatic", label: "Dramatic", chip: "chip-purple" },
  { value: "casual", label: "Casual", chip: "chip-green" },
  { value: "motivational", label: "Motivational", chip: "chip-yellow" },
];

const languages = [
  { value: "en", label: "English", chip: "chip-blue" },
  { value: "ar", label: "Arabic", chip: "chip-green" },
  { value: "both", label: "Both", chip: "chip-purple" },
];

interface Props {
  onGenerate: (input: ScriptInput) => void;
  isLoading: boolean;
}

function ChipSelect({ options, value, onChange, label }: {
  options: { value: string; label: string; chip: string }[];
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
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              value === opt.value
                ? `${opt.chip} ring-2 ring-current/20 scale-105`
                : "bg-muted text-muted-foreground hover:bg-muted/80"
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
      className="space-y-6 rounded-3xl bg-card p-6 md:p-8 shadow-card"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 rounded-2xl gradient-primary">
          <Clapperboard className="w-5 h-5 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Script Parameters</h2>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Topic *</label>
        <input
          value={form.topic}
          onChange={(e) => update("topic", e.target.value)}
          placeholder="e.g. How AI is changing video production"
          className="w-full rounded-2xl border border-input bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
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
          className="w-full rounded-2xl border border-input bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Key Message *</label>
        <textarea
          value={form.keyMessage}
          onChange={(e) => update("keyMessage", e.target.value)}
          rows={2}
          placeholder="The one thing viewers must remember..."
          className="w-full rounded-2xl border border-input bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
        />
      </div>

      <Button type="submit" variant="glow" size="lg" className="w-full rounded-full" disabled={isLoading || !form.topic.trim()}>
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
