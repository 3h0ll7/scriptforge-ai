import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { chatCompletion, readToolArguments } from "../_shared/ai.ts";

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
    const { topic, platform, targetDuration, audience, tone, keyMessage, language, videoUrl, sourceText, imageDataUrl, videoPrompt } = await req.json();

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
- Reference video link: ${videoUrl || "none"}
- Video visual direction prompt: ${videoPrompt || "none"}
- Reference text: ${sourceText ? String(sourceText).slice(0, 8000) : "none"}
${imageDataUrl ? "- A reference image is attached; use it as visual/source material." : ""}

Use any reference material as source content for the script.
Return the result using the generate_script tool.`;

    const hasImage = typeof imageDataUrl === "string" && imageDataUrl.startsWith("data:image/");
    const userContent = hasImage
      ? [{ type: "text", text: userPrompt }, { type: "image_url", image_url: { url: imageDataUrl } }]
      : [{ type: "text", text: userPrompt }];

    const result = await chatCompletion({
      hasImage,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
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
    });

    if (!result.ok) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: result.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    console.log(`generate-script served by ${result.provider}/${result.model}`);

    const scriptResult = readToolArguments(result.data);

    if (scriptResult.script) {
      scriptResult.script = scriptResult.script.map((section: Record<string, unknown>) => ({
        ...section,
        bRollSuggestion: section.bRollSuggestion || null,
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
