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

export async function checkAndTrackUsage(userId: string, tier: string): Promise<{ allowed: boolean; count: number }> {
  const now = new Date();
  const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  if (tier === "pro") {
    // Still track usage for pro users but always allow
    const { data } = await supabase
      .from("usage_tracking")
      .select("generation_count")
      .eq("user_id", userId)
      .eq("month_year", monthYear)
      .single();

    return { allowed: true, count: data?.generation_count ?? 0 };
  }

  // Get or create usage record
  const { data: existing } = await supabase
    .from("usage_tracking")
    .select("generation_count")
    .eq("user_id", userId)
    .eq("month_year", monthYear)
    .single();

  const count = existing?.generation_count ?? 0;

  if (count >= 5) {
    return { allowed: false, count };
  }

  return { allowed: true, count };
}

export async function incrementUsage(userId: string): Promise<void> {
  const now = new Date();
  const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const { data: existing } = await supabase
    .from("usage_tracking")
    .select("id, generation_count")
    .eq("user_id", userId)
    .eq("month_year", monthYear)
    .single();

  if (existing) {
    await supabase
      .from("usage_tracking")
      .update({
        generation_count: existing.generation_count + 1,
        last_generation_at: now.toISOString(),
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("usage_tracking").insert({
      user_id: userId,
      month_year: monthYear,
      generation_count: 1,
      last_generation_at: now.toISOString(),
    });
  }
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
