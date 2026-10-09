import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clapperboard, Sparkles, Link2, FileText, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { useAppSettings } from "@/hooks/useAppSettings";

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

export interface ScriptPreset {
  /** Changes on every request so the same preset can be applied twice. */
  id: number;
  values: Partial<ScriptInput>;
}

interface Props {
  onGenerate: (input: ScriptInput) => void;
  isLoading: boolean;
  preset?: ScriptPreset | null;
}

function ChipSelect({ options, value, onChange, label }: {
  options: { value: string; label: string; chip: string }[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((opt) => (
          <Button
            key={opt.value}
            type="button"
            variant="ghost"
            size="sm"
            aria-pressed={value === opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-4 rounded-full text-xs font-semibold transition-all ${
              value === opt.value
                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                : "bg-card border border-border text-foreground/80 hover:border-foreground/30 hover:bg-card hover:text-foreground"
            }`}
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default function ScriptForm({ onGenerate, isLoading, preset }: Props) {
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
  const fileRef = useRef<HTMLInputElement>(null);
  const topicRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!preset) return;
    setForm((f) => ({ ...f, ...preset.values }));
    topicRef.current?.focus({ preventScroll: true });
  }, [preset]);

  const update = (key: keyof ScriptInput, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleImage = (file?: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error(t("image_too_large"));
    const reader = new FileReader();
    reader.onload = () => update("imageDataUrl", String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.topic.trim()) return;
    onGenerate(form);
  };

  const inputCls = "w-full rounded-xl border border-transparent bg-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground hover:bg-card hover:border-input focus:bg-card focus:border-transparent focus:outline-none focus:ring-4 focus:ring-ring/20 focus:shadow-[0_0_0_1px_hsl(var(--ring))] transition-all";

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-border bg-card p-5 md:p-7 shadow-card"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-accent grid place-items-center">
          <Clapperboard className="w-5 h-5 text-accent-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground tracking-tight">{t("script_parameters")}</h2>
      </div>

      <div className="space-y-2">
        <label htmlFor="script-topic" className="text-sm font-semibold text-foreground">{t("topic")} <span className="text-secondary">*</span></label>
        <input
          ref={topicRef}
          id="script-topic"
          required
          value={form.topic}
          onChange={(e) => update("topic", e.target.value)}
          placeholder={t("topic_placeholder")}
          className={inputCls}
        />
      </div>

      <ChipSelect label={t("platform")} options={platforms} value={form.platform} onChange={(v) => update("platform", v)} />
      <ChipSelect label={t("duration")} options={durations} value={form.targetDuration} onChange={(v) => update("targetDuration", v)} />
      <ChipSelect label={t("tone")} options={tones} value={form.tone} onChange={(v) => update("tone", v)} />
      <ChipSelect label={t("language")} options={languages} value={form.language} onChange={(v) => update("language", v)} />

      <div className="space-y-2">
        <label htmlFor="script-audience" className="text-sm font-semibold text-foreground">{t("target_audience")}</label>
        <input
          id="script-audience"
          value={form.audience}
          onChange={(e) => update("audience", e.target.value)}
          placeholder={t("audience_placeholder")}
          className={inputCls}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="script-message" className="text-sm font-semibold text-foreground">{t("key_message")}</label>
        <textarea
          id="script-message"
          value={form.keyMessage}
          onChange={(e) => update("keyMessage", e.target.value)}
          rows={2}
          placeholder={t("key_message_placeholder")}
          className={`${inputCls} resize-none`}
        />
      </div>

      <div className="space-y-3 border-t border-border pt-5">
        <p className="text-sm font-semibold text-foreground">{t("attachments")}</p>
        <div className="relative">
          <Link2 className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="url" aria-label={t("video_link")} value={form.videoUrl} onChange={(e) => update("videoUrl", e.target.value)} placeholder={t("video_link_placeholder")} className={`${inputCls} ps-11`} />
        </div>
        <div className="relative">
          <FileText className="absolute start-4 top-4 w-4 h-4 text-muted-foreground" />
          <textarea rows={3} aria-label={t("source_text")} value={form.sourceText} onChange={(e) => update("sourceText", e.target.value)} placeholder={t("source_text_placeholder")} className={`${inputCls} ps-11 resize-none`} />
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e.target.files?.[0])} />
        {form.imageDataUrl ? (
          <div className="flex items-center gap-3">
            <img src={form.imageDataUrl} alt="" className="w-16 h-16 rounded-lg object-cover" />
            <Button type="button" variant="ghost" size="sm" className="rounded-full" onClick={() => { update("imageDataUrl", ""); if (fileRef.current) fileRef.current.value = ""; }}>
              <X className="w-4 h-4" /> {t("remove")}
            </Button>
          </div>
        ) : (
          <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => fileRef.current?.click()}>
            <ImagePlus className="w-4 h-4" /> {t("upload_image")}
          </Button>
        )}
      </div>

      <Button type="submit" variant="glow" size="lg" className="w-full rounded-full h-12" disabled={isLoading || !form.topic.trim()}>
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
