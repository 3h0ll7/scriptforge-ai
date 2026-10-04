import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, FileText, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ScriptForm, { type ScriptInput } from "@/components/ScriptForm";
import ScriptOutput, { type ScriptResult } from "@/components/ScriptOutput";
import { generateScript, saveToHistory } from "@/lib/generateScript";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function Index() {
  const [result, setResult] = useState<ScriptResult | null>(null);
  const [generatedInput, setGeneratedInput] = useState<ScriptInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { t } = useAppSettings();
  const { user, profile } = useAuth();
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
      } catch {}
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate script");
    } finally {
      setIsLoading(false);
    }
  };

  const displayName = profile?.full_name?.split(" ")[0] || "Creator";

  return (
    <div className="min-h-screen bg-background p-0 lg:p-5">
      <Sidebar mobileOpen={mobileNavOpen} onMobileOpenChange={setMobileNavOpen} />
      <main className="min-h-[calc(100vh-2.5rem)] overflow-hidden rounded-[30px] border border-card/80 bg-muted shadow-card lg:ms-[270px]">
        <div className="mx-auto min-h-full max-w-[1480px] px-4 md:px-7">
          <TopBar />
          <section className="pb-10">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[.28em] text-muted-foreground">{t("creative_workspace")}</p>
                <h1 className="text-4xl font-extrabold tracking-[-.045em] text-foreground md:text-5xl">
                  Good to see you, {displayName}.
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground md:text-[15px]">
                  Turn a clear idea into a platform-ready script, then take it straight into visual production.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start rounded-full border border-border bg-card/70 px-3 py-2 text-xs font-semibold text-secondary lg:self-auto">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                {t("ai_ready")}
              </div>
            </motion.div>

            <div className="mb-5 grid gap-4 xl:grid-cols-[1.55fr_.85fr]">
              <div className="rounded-[28px] border border-border bg-card p-5 shadow-card md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-secondary"><Sparkles className="h-5 w-5" /></div>
                    <div><div className="text-xs font-bold uppercase tracking-[.17em] text-muted-foreground">Creative engine</div><div className="mt-1 text-lg font-bold text-foreground">Build once. Refine faster.</div></div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    ["01","Brief","Define topic, platform and audience"],
                    ["02","Forge","Generate the script with AI"],
                    ["03","Produce","Convert the result into video prompts"],
                  ].map(([n,tit,desc]) => (
                    <div key={n} className="rounded-2xl border border-border bg-card/75 p-4">
                      <div className="text-[10px] font-bold text-muted-foreground">{n}</div>
                      <div className="mt-2 text-sm font-bold text-foreground">{tit}</div>
                      <div className="mt-1 text-xs leading-5 text-muted-foreground">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[28px] bg-primary p-5 text-primary-foreground shadow-glow md:p-6">
                <div className="flex items-start justify-between">
                  <div><div className="text-[10px] font-bold uppercase tracking-[.2em] text-primary-foreground/45">Workspace state</div><div className="mt-2 text-2xl font-bold tracking-[-.03em]">{user ? "Ready to create" : "Explore the studio"}</div></div>
                  <Wand2 className="h-5 w-5 text-primary-foreground/60" />
                </div>
                <p className="mt-3 text-sm leading-6 text-primary-foreground/60">Keep the interface calm and the creation flow focused on one thing: better scripts.</p>
                {!user && <button onClick={() => navigate("/auth")} className="mt-5 rounded-2xl bg-primary-foreground px-4 py-2.5 text-xs font-bold text-primary hover:bg-card/90">{t("sign_in")}</button>}
              </div>
            </div>

            <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,.93fr)_minmax(0,1.07fr)]">
              <div id="script-form"><ScriptForm onGenerate={handleGenerate} isLoading={isLoading} /></div>
              <div id="script-output">
                {result && generatedInput ? (
                  <ScriptOutput result={result} input={generatedInput} />
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[520px] rounded-[28px] border border-border bg-card p-7 shadow-card">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><FileText className="h-5 w-5" /></div>
                      <span className="rounded-full border border-input bg-card/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.15em] text-muted-foreground">Output</span>
                    </div>
                    <div className="flex min-h-[390px] flex-col items-center justify-center py-12 text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-secondary"><Sparkles className="h-7 w-7" /></div>
                      <h3 className="text-xl font-bold tracking-[-.02em] text-foreground">{t("results_ready_title")}</h3>
                      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{t("fill_prompt")} <span className="font-bold text-foreground">{t("generate")}</span> {t("to_create")}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {["Hook","Script","Video prompt"].map(item => <div key={item} className="rounded-2xl bg-[#f1efe9] px-3 py-3 text-center text-[11px] font-bold text-muted-foreground">{item}</div>)}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </section>
          <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">Developed by <a href="https://hassanaii.lovable.app" target="_blank" rel="noopener noreferrer" className="font-bold text-secondary hover:underline">𝓗𝓪𝓼𝓼𝓪𝓷 𝓼𝓪𝓵𝓶𝓪𝓷</a></footer>
        </div>
      </main>
    </div>
  );
}
