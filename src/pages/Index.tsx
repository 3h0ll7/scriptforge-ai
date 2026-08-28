import { useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useAppSettings();
  const { user, usage, refreshUsage } = useAuth();
  const navigate = useNavigate();

  const exhausted = !!usage && usage.remaining <= 0;

  const handleGenerate = async (input: ScriptInput) => {
    if (!user) {
      toast.error(t("sign_in_to_generate"));
      navigate("/auth");
      return;
    }
    if (isLoading) return;
    if (exhausted) {
      toast.error("Your free generations are finished. Upgrade to continue.");
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const data = await generateScript(input);
      setResult(data);
      try {
        await saveToHistory(user.id, input, data.hook?.text ?? input.topic);
      } catch {
        // history is best-effort
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate script";
      toast.error(message);
    } finally {
      await refreshUsage();
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <Navbar />


      {/* Hero */}
      <section className="container max-w-6xl mx-auto px-4 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground leading-tight">
            <span className="text-gradient">{t("craft_scripts")}</span>{" "}
            {t("that_go_viral")}
          </h2>
          <p className="text-muted-foreground text-base">
            {t("hero_subtitle")}
          </p>
        </motion.div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          <ScriptForm onGenerate={handleGenerate} isLoading={isLoading} />
          <div>
            {result ? (
              <ScriptOutput result={result} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl border border-dashed border-border bg-card/50 p-12 flex flex-col items-center justify-center text-center min-h-[400px]"
              >
                <div className="p-4 rounded-2xl bg-muted mb-4">
                  <Zap className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">
                  {t("fill_prompt")} <span className="text-primary font-semibold">{t("generate")}</span> {t("to_create")}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container max-w-6xl mx-auto px-4 py-6 text-center">
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
    </div>
  );
}
