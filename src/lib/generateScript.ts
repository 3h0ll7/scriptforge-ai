import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { ScriptInput } from "@/components/ScriptForm";
import type { ScriptResult } from "@/components/ScriptOutput";

type GenerateScriptError = Error & { status?: number };

async function buildFunctionError(error: unknown): Promise<GenerateScriptError> {
  if (error instanceof FunctionsHttpError) {
    const status = error.context.status;
    let message = "Failed to generate script";

    try {
      const payload = await error.context.json();
      if (payload?.error) {
        message = payload.error;
      }
    } catch {
      message = error.message || message;
    }

    const enrichedError = new Error(message) as GenerateScriptError;
    enrichedError.status = status;
    return enrichedError;
  }

  const fallbackMessage = error instanceof Error ? error.message : "Failed to generate script";
  return new Error(fallbackMessage) as GenerateScriptError;
}

export async function generateScript(input: ScriptInput): Promise<ScriptResult> {
  const { data, error } = await supabase.functions.invoke("generate-script", {
    body: input,
  });

  if (error) {
    throw await buildFunctionError(error);
  }

  if (data?.error) {
    const dataError = new Error(data.error) as GenerateScriptError;
    throw dataError;
  }

  return data as ScriptResult;
}

export async function saveToHistory(
  userId: string,
  input: ScriptInput,
  preview: string
): Promise<void> {
  await supabase.from("generation_history").insert({
    user_id: userId,
    topic: input.topic,
    platform: input.platform,
    duration: input.targetDuration,
    tone: input.tone,
    language: input.language,
    output_preview: preview.substring(0, 500),
  });
}
