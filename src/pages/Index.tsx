import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, LoaderCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ScriptForm, { type ScriptInput } from "@/components/ScriptForm";
import ScriptOutput, { type ScriptResult } from "@/components/ScriptOutput";
import { generateScript, saveToHistory } from "@/lib/generateScript";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";

export default function Index() {
  const [result, setResult] = useState<ScriptResult | null>(null);
  const [generatedInput, setGeneratedInput] = useState<ScriptInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useAppSettings();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGenerate = async (input: ScriptInput) => {
    if (!user) {
      toast.error(t("sign_in_to_generate"));
      navigate("/auth");
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const data = await generateScript(input);
      setResult(data);
      setGeneratedInput(input);
      try {
        await saveToHistory(user.id, input, data.hook?.text ?? input.topic);
      } catch {
        // history is best-effort
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate script";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-background p-0 lg:p-5">
      <Navbar />

      <main className="lg:ms-60 min-h-[calc(100vh-2.5rem)] bg-card/55 lg:rounded-2xl border-border lg:border overflow-hidden">
      <section className="max-w-workspace mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-10 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 lg:mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div>
              <p className="text-[11px] font-semibold uppercase text-muted-foreground mb-2">{t("creative_workspace")}</p>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">ScriptForge AI <span aria-hidden="true">✦</span></h2>
              <p className="text-muted-foreground text-sm md:text-base mt-2 max-w-xl">{t("workspace_subtitle")}</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-secondary"><span className="w-2 h-2 rounded-full bg-secondary" />{t("ai_ready")}</div>
          </div>
        </motion.div>

        <div className="grid xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] gap-5 items-start">
          <div id="script-form" className="min-w-0 scroll-mt-5"><ScriptForm onGenerate={handleGenerate} isLoading={isLoading} /></div>
          <div id="script-output" className="min-w-0 scroll-mt-5" aria-busy={isLoading}>
            {result && generatedInput ? (
              <ScriptOutput result={result} input={generatedInput} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-border bg-card p-7 flex flex-col min-h-[400px] shadow-card"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-lg bg-primary text-primary-foreground"><FileText className="w-5 h-5" /></div>
                </div>
                <div className="mt-auto mb-auto py-12 text-center">
                 <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-muted flex items-center justify-center">{isLoading ? <LoaderCircle className="w-6 h-6 text-secondary animate-spin" /> : <Sparkles className="w-6 h-6 text-secondary" />}</div>
                 <h3 role="status" className="text-lg font-bold text-foreground mb-2">{t(isLoading ? "generating_script" : "results_ready_title")}</h3>
                 {!isLoading && <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  {t("fill_prompt")} <span className="text-primary font-semibold">{t("generate")}</span> {t("to_create")}
                 </p>}
                </div>
                <div className="grid grid-cols-3 gap-2">
                   {["hook", "full_script", "seo_tags"].map((item) => <div key={item} className="rounded-lg bg-muted px-2 py-3 text-center text-xs font-semibold text-muted-foreground">{t(item)}</div>)}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-workspace mx-auto px-4 py-6 text-center">
        <p className="text-muted-foreground text-sm">
          Developed by{" "}
          <a
            href="https://hassanaii.lovable.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline"
          >
            𝓗𝓪𝓼𝓼𝓪𝓷 𝓼𝓪𝓵𝓶𝓪𝓷
          </a>
        </p>
      </footer>
      </main>
    </div>
  );
}
