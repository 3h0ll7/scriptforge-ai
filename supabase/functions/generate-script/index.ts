import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // --- Authentication (server-side, never trust the client) ---
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
      return json({ error: "Authentication required" }, 401);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const { data: userData, error: userError } = await admin.auth.getUser(token);
    const user = userData?.user;
    if (userError || !user) {
      return json({ error: "Authentication required" }, 401);
    }

    // --- Free allowance check (server authoritative) ---
    const { data: usageRow } = await admin
      .from("user_usage")
      .select("generations_used, free_limit, current_period_end")
      .eq("user_id", user.id)
      .maybeSingle();

    if (usageRow) {
      const periodActive = new Date(usageRow.current_period_end).getTime() > Date.now();
      if (periodActive && usageRow.generations_used >= usageRow.free_limit) {
        return json(
          {
            error: "Your free generations are finished. Upgrade to continue.",
            code: "usage_limit_reached",
            generations_used: usageRow.generations_used,
            free_limit: usageRow.free_limit,
            remaining: 0,
          },
          402
        );
      }
    }

    const { topic, platform, targetDuration, audience, tone, keyMessage, language } = await req.json();

    if (!topic) {
      return json({ error: "Topic is required" }, 400);
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
        return new Response(JSON.stringify({ error: "AI provider is temporarily rate limited. Please try again in a moment." }), {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
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

    // --- Consume exactly one generation, atomically, after success ---
    const { data: consumed, error: consumeError } = await admin.rpc("consume_generation", {
      _user_id: user.id,
    });
    const usage = Array.isArray(consumed) ? consumed[0] : consumed;

    if (consumeError) {
      console.error("consume_generation error:", consumeError);
    } else if (usage && usage.allowed === false) {
      return json(
        {
          error: "Your free generations are finished. Upgrade to continue.",
          code: "usage_limit_reached",
          generations_used: usage.generations_used,
          free_limit: usage.free_limit,
          remaining: 0,
        },
        402
      );
    }

    return json({ ...scriptResult, usage: usage ?? null });

  } catch (e) {
    console.error("generate-script error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
