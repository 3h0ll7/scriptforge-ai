import { useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import ScriptForm, { type ScriptInput } from "@/components/ScriptForm";
import ScriptOutput, { type ScriptResult } from "@/components/ScriptOutput";
import { generateScript } from "@/lib/generateScript";

export default function Index() {
  const [result, setResult] = useState<ScriptResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (input: ScriptInput) => {
    setIsLoading(true);
    setResult(null);
    try {
      const data = await generateScript(input);
      setResult(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to generate script");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="p-2 rounded-xl gradient-primary">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">ScriptForge AI</h1>
            <p className="text-xs text-muted-foreground">Video scripts that hook, retain, and convert</p>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container max-w-6xl mx-auto px-4 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gradient">Craft Scripts</span>{" "}
            <span className="text-foreground">That Go Viral</span>
          </h2>
          <p className="text-muted-foreground">
            Platform-optimized scripts with hooks, retention strategies, and calls to action — built for YouTube, TikTok, Reels, and more.
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
                className="rounded-2xl border border-dashed border-border bg-card/30 p-12 flex flex-col items-center justify-center text-center min-h-[400px]"
              >
                <div className="p-4 rounded-2xl bg-muted mb-4">
                  <Zap className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">
                  Fill in your parameters and hit <span className="text-primary font-semibold">Generate</span> to create your script.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
