import { supabase } from "@/integrations/supabase/client";
import type { ScriptInput } from "@/components/ScriptForm";
import type { ScriptResult } from "@/components/ScriptOutput";

export async function generateScript(input: ScriptInput): Promise<ScriptResult> {
  const { data, error } = await supabase.functions.invoke("generate-script", {
    body: input,
  });

  if (error) {
    throw new Error(error.message || "Failed to generate script");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data as ScriptResult;
}
