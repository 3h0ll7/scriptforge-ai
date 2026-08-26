import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function getCurrentMonthYear() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function hasActivePro(profile: { subscription_tier?: string; subscription_end_date?: string | null } | null): boolean {
  if (!profile || profile.subscription_tier !== "pro" || !profile.subscription_end_date) return false;
  return new Date(profile.subscription_end_date).getTime() > Date.now();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY || !LOVABLE_API_KEY) {
      throw new Error("Server environment is not fully configured");
    }

    const authorization = req.headers.get("Authorization");
    if (!authorization) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authorization } },
    });

    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const { topic, platform, targetDuration, audience, tone, keyMessage, language } = body;

    if (!topic) {
      return new Response(JSON.stringify({ error: "Topic is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Enforce free plan limit server-side
    const { data: profile } = await adminClient
      .from("profiles")
      .select("subscription_tier, subscription_end_date")
      .eq("id", user.id)
      .single();

    if (!hasActivePro(profile)) {
      const monthYear = getCurrentMonthYear();
      const { data: usage } = await adminClient
        .from("usage_tracking")
        .select("generation_count")
        .eq("user_id", user.id)
        .eq("month_year", monthYear)
        .single();

      const count = usage?.generation_count ?? 0;
      if (count >= 5) {
        return new Response(
          JSON.stringify({
            error:
              "You have used all 5 free scripts this month. Upgrade to Pro for unlimited scripts.",
          }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const systemPrompt = `You are ScriptForge AI — an expert video scriptwriter specializing in YouTube, TikTok, Reels, courses, and webinars.

Rules:
- Hook must appear in the first 3 seconds — no intros before hooks
- Use pattern interrupts every 30-60 seconds for retention
- Write for spoken word — short sentences, conversational
- Include at least one "open loop" to maintain curiosity
- End with a strong CTA that matches the platform culture
- If language is "ar", write the script in Arabic (MSA). If "both", write dialogue in both English and Arabic.
- Adapt script length to the target duration.`;

    const userPrompt = `Generate a complete video script with these parameters:
- Topic: ${topic}
- Platform: ${platform}
- Target Duration: ${targetDuration}
- Target Audience: ${audience || "general audience"}
- Tone: ${tone}
- Key Message: ${keyMessage || "not specified"}
- Language: ${language}

Return the result using the generate_script tool.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_script",
              description: "Generate a structured video script with all sections",
              parameters: {
                type: "object",
                properties: {
                  titleOptions: {
                    type: "array",
                    items: { type: "string" },
                    description: "3 title/thumbnail text ideas",
                  },
                  hook: {
                    type: "object",
                    properties: {
                      text: { type: "string", description: "First 3-5 seconds hook text" },
                      hookType: {
                        type: "string",
                        enum: ["question", "shocking_stat", "story", "controversy", "pain_point"],
                      },
                    },
                    required: ["text", "hookType"],
                  },
                  script: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        timestamp: { type: "string", description: "MM:SS format" },
                        section: {
                          type: "string",
                          enum: ["hook", "intro", "point_1", "point_2", "point_3", "climax", "cta", "outro"],
                        },
                        dialogue: { type: "string", description: "What to say" },
                        visualDirection: { type: "string", description: "What the viewer sees" },
                        bRollSuggestion: { type: "string", description: "B-roll idea or null" },
                      },
                      required: ["timestamp", "section", "dialogue", "visualDirection"],
                    },
                  },
                  cta: { type: "string", description: "Call to action text" },
                  seoTags: {
                    type: "array",
                    items: { type: "string" },
                    description: "SEO/hashtag tags for optimization",
                  },
                  estimatedWordCount: { type: "number" },
                  retentionStrategyNotes: {
                    type: "string",
                    description: "Explanation of retention techniques used",
                  },
                },
                required: [
                  "titleOptions",
                  "hook",
                  "script",
                  "cta",
                  "seoTags",
                  "estimatedWordCount",
                  "retentionStrategyNotes",
                ],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_script" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "AI provider is temporarily rate limited. Please try again in a moment." }),
          { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("No structured output returned from AI");
    }

    const scriptResult = JSON.parse(toolCall.function.arguments);

    if (scriptResult.script) {
      scriptResult.script = scriptResult.script.map((section: Record<string, unknown>) => ({
        ...section,
        bRollSuggestion: section.bRollSuggestion || null,
      }));
    }

    // Track usage and history after a successful generation
    const monthYear = getCurrentMonthYear();
    const { data: existingUsage } = await adminClient
      .from("usage_tracking")
      .select("generation_count")
      .eq("user_id", user.id)
      .eq("month_year", monthYear)
      .single();

    const nextCount = (existingUsage?.generation_count ?? 0) + 1;
    const { error: usageError } = await adminClient
      .from("usage_tracking")
      .upsert(
        {
          user_id: user.id,
          month_year: monthYear,
          generation_count: nextCount,
          last_generation_at: new Date().toISOString(),
        },
        { onConflict: "user_id,month_year" }
      );

    if (usageError) {
      console.error("usage upsert error:", usageError);
    }

    const preview = scriptResult.script
      ?.map((s: { dialogue?: string }) => s.dialogue)
      .filter(Boolean)
      .join(" ")
      .substring(0, 500) ?? "";

    const { error: historyError } = await adminClient.from("generation_history").insert({
      user_id: user.id,
      topic,
      platform,
      duration: targetDuration,
      tone,
      language,
      output_preview: preview,
    });

    if (historyError) {
      console.error("history insert error:", historyError);
    }

    return new Response(JSON.stringify(scriptResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-script error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
