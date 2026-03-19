import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { topic, platform, targetDuration, audience, tone, keyMessage, language } = await req.json();

    if (!topic) {
      return new Response(JSON.stringify({ error: "Topic is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings → Workspace → Usage." }),
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

    // Ensure bRollSuggestion is string | null
    if (scriptResult.script) {
      scriptResult.script = scriptResult.script.map((s: any) => ({
        ...s,
        bRollSuggestion: s.bRollSuggestion || null,
      }));
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
