import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clapperboard, Sparkles, Link2, FileText, ImagePlus, X, Wand2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useAppSettings } from "@/hooks/useAppSettings";
import { enhancePrompt } from "@/lib/generateScript";

export interface ScriptInput {
  topic: string;
  platform: string;
  targetDuration: string;
  audience: string;
  tone: string;
  keyMessage: string;
  language: string;
  videoUrl?: string;
  sourceText?: string;
  imageDataUrl?: string;
  videoPrompt?: string;
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
  const { t } = useAppSettings();
  const [form, setForm] = useState<ScriptInput>({
    topic: "",
    platform: "youtube",
    targetDuration: "5min",
    audience: "",
    tone: "educational",
    keyMessage: "",
    language: "en",
    videoUrl: "",
    sourceText: "",
    imageDataUrl: "",
    videoPrompt: "",
  });
  const [rebuilt, setRebuilt] = useState("");
  const [rebuilding, setRebuilding] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (key: keyof ScriptInput, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleImage = (file?: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error(t("image_too_large"));
    const reader = new FileReader();
    reader.onload = () => update("imageDataUrl", String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleRebuild = async () => {
    if (!form.videoPrompt?.trim()) return;
    setRebuilding(true);
    try {
      setRebuilt(await enhancePrompt(form));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setRebuilding(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(rebuilt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.topic.trim()) return;
    onGenerate(form);
  };

  const inputCls = "w-full rounded-2xl border border-input bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all";

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
        <h2 className="text-xl font-bold text-foreground">{t("script_parameters")}</h2>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">{t("topic")} *</label>
        <input
          value={form.topic}
          onChange={(e) => update("topic", e.target.value)}
          placeholder={t("topic_placeholder")}
          className="w-full rounded-2xl border border-input bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
      </div>

      <ChipSelect label={t("platform")} options={platforms} value={form.platform} onChange={(v) => update("platform", v)} />
      <ChipSelect label={t("duration")} options={durations} value={form.targetDuration} onChange={(v) => update("targetDuration", v)} />
      <ChipSelect label={t("tone")} options={tones} value={form.tone} onChange={(v) => update("tone", v)} />
      <ChipSelect label={t("language")} options={languages} value={form.language} onChange={(v) => update("language", v)} />

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">{t("target_audience")}</label>
        <input
          value={form.audience}
          onChange={(e) => update("audience", e.target.value)}
          placeholder={t("audience_placeholder")}
          className="w-full rounded-2xl border border-input bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">{t("key_message")} *</label>
        <textarea
          value={form.keyMessage}
          onChange={(e) => update("keyMessage", e.target.value)}
          rows={2}
          placeholder={t("key_message_placeholder")}
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
        {isLoading ? t("generating_script") : t("generate_script")}
      </Button>
    </motion.form>
  );
}
