import { useEffect, useState } from "react";
import { Check, Copy, Film, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppSettings } from "@/hooks/useAppSettings";
import { enhancePrompt } from "@/lib/generateScript";
import type { ScriptInput } from "@/components/ScriptForm";
import type { ScriptResult } from "@/components/ScriptOutput";

interface Props {
  input: ScriptInput;
  result: ScriptResult;
}

const formatScript = (result: ScriptResult) =>
  result.script.map((section) => `[${section.timestamp}] ${section.dialogue}`).join("\n\n");

export default function VideoPromptBuilder({ input, result }: Props) {
  const { t } = useAppSettings();
  const [hook, setHook] = useState(result.hook.text);
  const [script, setScript] = useState(() => formatScript(result));
  const [prompt, setPrompt] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setHook(result.hook.text);
    setScript(formatScript(result));
    setPrompt("");
  }, [result]);

  const handleBuild = async () => {
    if (!hook.trim() || !script.trim()) {
      toast.error(t("hook_script_required"));
      return;
    }

    setIsBuilding(true);
    try {
      const sourceText = `${input.sourceText?.trim() ? `${input.sourceText.trim()}\n\n` : ""}${t("hook")}:\n${hook.trim()}\n\n${t("full_script")}:\n${script.trim()}`;
      const detailedPrompt = await enhancePrompt({
        ...input,
        sourceText,
        videoPrompt: `${t("build_video_from_script_instruction")}\n\n${hook.trim()}\n\n${script.trim()}`,
      });
      setPrompt(detailedPrompt);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("prompt_build_failed"));
    } finally {
      setIsBuilding(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast.success(t("copied"));
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error(t("copy_failed"));
    }
  };

  const inputClass = "w-full rounded-2xl border border-input bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-y";

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-card p-5 md:p-6 shadow-card space-y-5"
    >
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-2xl gradient-primary shrink-0">
          <Film className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">{t("video_prompt_builder")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("video_prompt_builder_help")}</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">{t("hook_for_video")}</label>
        <textarea rows={3} value={hook} onChange={(event) => setHook(event.target.value)} placeholder={t("hook_for_video_placeholder")} className={inputClass} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">{t("script_for_video")}</label>
        <textarea rows={8} value={script} onChange={(event) => setScript(event.target.value)} placeholder={t("script_for_video_placeholder")} className={inputClass} />
      </div>

      <Button type="button" variant="outline" className="w-full rounded-full" disabled={isBuilding || !hook.trim() || !script.trim()} onClick={handleBuild}>
        <Wand2 className={`w-4 h-4 ${isBuilding ? "animate-spin" : ""}`} />
        {isBuilding ? t("building_detailed_prompt") : t("build_detailed_prompt")}
      </Button>

      {prompt && (
        <div className="rounded-2xl bg-muted p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-muted-foreground">{t("detailed_video_prompt")}</p>
            <Button type="button" size="icon" variant="ghost" className="rounded-full shrink-0" onClick={handleCopy} title={t("copy")}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <textarea rows={10} value={prompt} onChange={(event) => setPrompt(event.target.value)} className={`${inputClass} bg-card`} />
        </div>
      )}
    </motion.section>
  );
}