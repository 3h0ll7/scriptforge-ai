import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link2, FileText, ImagePlus, X, Sparkles, Target, Users, Wand2 } from "lucide-react";
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
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "reels", label: "Reels" },
  { value: "course", label: "Course" },
  { value: "webinar", label: "Webinar" },
];
const durations = [
  { value: "30s", label: "30 sec" },
  { value: "60s", label: "60 sec" },
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
  { value: "both", label: "English + Arabic" },
];

interface Props { onGenerate: (input: ScriptInput) => void; isLoading: boolean; }

function ChoicePills({ options, value, onChange }: { options: { value: string; label: string }[]; value: string; onChange: (value: string) => void; }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            type="button"
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-2xl border px-3.5 py-2 text-xs font-semibold transition-all ${selected ? "border-primary bg-primary text-primary-foreground shadow-glow" : "border-input bg-card/70 text-muted-foreground hover:bg-[#f5f4f0] hover:text-foreground"}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function ScriptForm({ onGenerate, isLoading }: Props) {
  const { t } = useAppSettings();
  const [form, setForm] = useState<ScriptInput>({
    topic: "", platform: "youtube", targetDuration: "5min", audience: "", tone: "educational", keyMessage: "", language: "en", videoUrl: "", sourceText: "", imageDataUrl: "", videoPrompt: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const update = (key: keyof ScriptInput, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const handleImage = (file?: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error(t("image_too_large")); return; }
    const reader = new FileReader();
    reader.onload = () => update("imageDataUrl", String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.topic.trim() || !form.keyMessage.trim()) return;
    onGenerate(form);
  };

  const inputClass = "w-full rounded-2xl border border-input bg-card/80 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-ring focus:bg-primary-foreground focus:ring-4 focus:ring-ring/10";

  return (
    <motion.form initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="rounded-[28px] border border-border bg-card p-5 shadow-card md:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-secondary"><Target className="h-5 w-5" /></div>
        <div><h2 className="text-[19px] font-bold tracking-[-.025em] text-foreground">{t("script_parameters")}</h2><p className="mt-0.5 text-xs text-muted-foreground">Define the essentials before generation.</p></div>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-[.15em] text-muted-foreground">{t("topic")} *</label>
          <input value={form.topic} onChange={(event) => update("topic", event.target.value)} placeholder={t("topic_placeholder")} className={inputClass} />
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <div className="space-y-2"><label className="text-xs font-bold uppercase tracking-[.15em] text-muted-foreground">{t("platform")}</label><ChoicePills options={platforms} value={form.platform} onChange={(value) => update("platform", value)} /></div>
          <div className="space-y-2"><label className="text-xs font-bold uppercase tracking-[.15em] text-muted-foreground">{t("duration")}</label><ChoicePills options={durations} value={form.targetDuration} onChange={(value) => update("targetDuration", value)} /></div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <div className="space-y-2"><label className="text-xs font-bold uppercase tracking-[.15em] text-muted-foreground">{t("tone")}</label><ChoicePills options={tones} value={form.tone} onChange={(value) => update("tone", value)} /></div>
          <div className="space-y-2"><label className="text-xs font-bold uppercase tracking-[.15em] text-muted-foreground">{t("language")}</label><ChoicePills options={languages} value={form.language} onChange={(value) => update("language", value)} /></div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-muted-foreground"><Users className="h-3.5 w-3.5" />{t("target_audience")}</label>
          <input value={form.audience} onChange={(event) => update("audience", event.target.value)} placeholder={t("audience_placeholder")} className={inputClass} />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-[.15em] text-muted-foreground">{t("key_message")} *</label>
          <textarea value={form.keyMessage} onChange={(event) => update("keyMessage", event.target.value)} rows={4} placeholder={t("key_message_placeholder")} className={inputClass + " resize-none"} />
        </div>

        <div className="rounded-2xl border border-border bg-muted p-4">
          <div className="mb-3 flex items-center gap-2"><Wand2 className="h-4 w-4 text-secondary" /><div className="text-xs font-bold uppercase tracking-[.15em] text-muted-foreground">{t("attachments")}</div><span className="ms-auto text-[10px] text-muted-foreground">Optional</span></div>
          <div className="space-y-3">
            <div className="relative"><Link2 className="absolute start-3.5 top-3.5 h-4 w-4 text-muted-foreground" /><input type="url" value={form.videoUrl} onChange={(event) => update("videoUrl", event.target.value)} placeholder={`${t("video_link")} — ${t("video_link_placeholder")}`} className={inputClass + " ps-10"} /></div>
            <div className="relative"><FileText className="absolute start-3.5 top-3.5 h-4 w-4 text-muted-foreground" /><textarea rows={3} value={form.sourceText} onChange={(event) => update("sourceText", event.target.value)} placeholder={t("source_text_placeholder")} className={inputClass + " ps-10 resize-none"} /></div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(event) => handleImage(event.target.files?.[0])} />
            {form.imageDataUrl ? (
              <div className="flex items-center gap-3 rounded-2xl border border-input bg-card/80 p-2.5">
                <img src={form.imageDataUrl} alt="" className="h-14 w-14 rounded-xl object-cover" />
                <div className="flex-1"><div className="text-xs font-semibold text-foreground">Image attached</div><div className="text-[10px] text-muted-foreground">Ready for AI context.</div></div>
                <Button type="button" variant="ghost" size="sm" className="rounded-xl text-muted-foreground" onClick={() => { update("imageDataUrl", ""); if (fileRef.current) fileRef.current.value = ""; }}><X className="h-4 w-4" />{t("remove")}</Button>
              </div>
            ) : <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={() => fileRef.current?.click()}><ImagePlus className="h-4 w-4" />{t("upload_image")}</Button>}
          </div>
        </div>

        <Button type="submit" variant="glow" size="lg" className="h-12 w-full rounded-2xl text-sm shadow-glow" disabled={isLoading || !form.topic.trim() || !form.keyMessage.trim()}>
          {isLoading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Sparkles className="h-5 w-5" /></motion.div> : <Sparkles className="h-5 w-5" />}
          {isLoading ? t("generating_script") : t("generate_script")}
        </Button>
      </div>
    </motion.form>
  );
}
