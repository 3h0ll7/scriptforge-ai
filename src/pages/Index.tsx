import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { FileText, Heart, LoaderCircle, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import ScriptForm, { type ScriptInput, type ScriptPreset } from "@/components/ScriptForm";
import ScriptOutput, { type ScriptResult } from "@/components/ScriptOutput";
import IdeaGallery from "@/components/IdeaGallery";
import { generateScript } from "@/lib/generateScript";
import type { IdeaTemplate } from "@/lib/ideaTemplates";
import { useAppSettings } from "@/hooks/useAppSettings";
import Navbar from "@/components/Navbar";
import SupportDialog from "@/components/SupportDialog";
import { donationEnabled } from "@/lib/donation";

const trendingKeys = ["trend_ai", "trend_productivity", "trend_health", "trend_money"];

export default function Index() {
  const [result, setResult] = useState<ScriptResult | null>(null);
  const [generatedInput, setGeneratedInput] = useState<ScriptInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preset, setPreset] = useState<ScriptPreset | null>(null);
  const [heroTopic, setHeroTopic] = useState("");
  const { t, language } = useAppSettings();

  const applyPreset = (values: Partial<ScriptInput>) => {
    setPreset({ id: Date.now(), values });
    document.getElementById("script-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleHeroSubmit = (e: FormEvent) => {
    e.preventDefault();
    applyPreset(heroTopic.trim() ? { topic: heroTopic.trim() } : {});
  };

  const handleUseIdea = (idea: IdeaTemplate) => {
    applyPreset({ ...idea.values, topic: idea.title[language], audience: idea.audience[language] });
  };

  const handleGenerate = async (input: ScriptInput) => {
    setIsLoading(true);
    setResult(null);
    try {
      const data = await generateScript(input);
      setResult(data);
      setGeneratedInput(input);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate script";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[420px] gradient-accent opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-14 md:pt-24 pb-10 md:pb-14 text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
              <span className="w-2 h-2 rounded-full bg-brand" aria-hidden="true" />
              {t("ai_ready")}
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight leading-[1.08]">
              {t("hero_title_1")} <span className="text-secondary">{t("hero_title_2")}</span>
            </h1>
            <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-xl mx-auto">{t("workspace_subtitle")}</p>

            <form onSubmit={handleHeroSubmit} className="mt-8 max-w-xl mx-auto relative" role="search">
              <label htmlFor="hero-topic" className="sr-only">{t("topic")}</label>
              <input
                id="hero-topic"
                value={heroTopic}
                onChange={(e) => setHeroTopic(e.target.value)}
                placeholder={t("hero_search_placeholder")}
                className="w-full h-14 md:h-16 rounded-full bg-muted ps-6 pe-16 text-sm md:text-base text-foreground placeholder:text-muted-foreground border border-transparent hover:bg-card hover:border-input focus:bg-card focus:outline-none focus:ring-4 focus:ring-ring/20 focus:shadow-[0_0_0_1px_hsl(var(--ring))] transition-all"
              />
              <button
                type="submit"
                className="absolute end-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary text-secondary-foreground grid place-items-center hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
                aria-label={t("start_new_script")}
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground font-medium">{t("trending")}</span>
              {trendingKeys.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => applyPreset({ topic: t(key) })}
                  className="px-3 py-1.5 rounded-full bg-card border border-border text-xs font-semibold text-foreground/80 hover:border-foreground/30 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {t(key)}
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        <IdeaGallery onUse={handleUseIdea} />

        {/* Workspace */}
        <section className="border-t border-border bg-muted/40">
          <div className="max-w-workspace mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            <div className="mb-6 md:mb-8">
              <p className="text-xs font-bold uppercase text-secondary mb-1">{t("creative_workspace")}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{t("workspace_title")}</h2>
            </div>

            <div className="grid xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] gap-6 items-start">
              <div id="script-form" className="min-w-0 scroll-mt-28">
                <ScriptForm onGenerate={handleGenerate} isLoading={isLoading} preset={preset} />
              </div>
              <div id="script-output" className="min-w-0 scroll-mt-28" aria-busy={isLoading}>
                {result && generatedInput ? (
                  <ScriptOutput result={result} input={generatedInput} />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl border-2 border-dashed border-border bg-card p-7 flex flex-col min-h-[420px]"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent grid place-items-center">
                      <FileText className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div className="my-auto py-12 text-center">
                      <div className="mx-auto mb-4 w-16 h-16 rounded-full gradient-accent grid place-items-center">
                        {isLoading ? <LoaderCircle className="w-7 h-7 text-secondary animate-spin" /> : <Sparkles className="w-7 h-7 text-secondary" />}
                      </div>
                      <h3 role="status" className="text-lg font-bold text-foreground mb-2">{t(isLoading ? "generating_script" : "results_ready_title")}</h3>
                      {!isLoading && (
                        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                          {t("fill_prompt")} <span className="text-secondary font-semibold">{t("generate")}</span> {t("to_create")}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {["hook", "full_script", "seo_tags"].map((item) => (
                        <div key={item} className={`rounded-xl bg-muted px-2 py-3 text-center text-xs font-semibold text-muted-foreground ${isLoading ? "animate-pulse" : ""}`}>{t(item)}</div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-workspace mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-lg font-bold tracking-tight text-foreground">scriptforge<span className="text-brand">.</span></p>
          {donationEnabled && (
            <SupportDialog>
              <button type="button" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-secondary hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Heart className="w-4 h-4 fill-current" />
                {t("support_project")}
              </button>
            </SupportDialog>
          )}
          <p className="text-muted-foreground text-sm">
            Developed by{" "}
            <a
              href="https://hassanaii.lovable.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary font-semibold hover:underline"
            >
              𝓗𝓪𝓼𝓼𝓪𝓷 𝓼𝓪𝓵𝓶𝓪𝓷
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
