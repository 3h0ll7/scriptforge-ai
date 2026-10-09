import { chatCompletion } from "../_shared/ai.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const b = await req.json();
    const prompt = String(b.prompt ?? "").trim();
    if (!prompt) return json({ error: "Prompt is required" }, 400);

    const instructions = `You are an expert prompt engineer for AI video generators (Veo, Sora, Runway, Kling).
Rewrite the user's video prompt into one rich, production-ready video generation prompt tailored to their selections.
Include: subject & action, setting, camera framing & movement, lighting, visual style, mood, pacing, and aspect ratio suited to the platform (9:16 for TikTok/Reels, 16:9 for YouTube/course/webinar).
Use any attached source material (text, image, video link) as reference.
Write the prompt in ${b.language === "ar" ? "Arabic" : "English"}. Return ONLY the final prompt text, no preamble, no quotes.`;

    const details = `Original prompt: ${prompt}
Topic: ${b.topic || "-"}
Platform: ${b.platform}
Duration: ${b.targetDuration}
Tone: ${b.tone}
Audience: ${b.audience || "general"}
Key message: ${b.keyMessage || "-"}
Reference video link: ${b.videoUrl || "-"}
Reference text: ${(b.sourceText || "-").slice(0, 8000)}`;

    const hasImage = typeof b.imageDataUrl === "string" && b.imageDataUrl.startsWith("data:image/");
    const content: unknown[] = [{ type: "text", text: details }];
    if (hasImage) content.push({ type: "image_url", image_url: { url: b.imageDataUrl } });

    const result = await chatCompletion({
      hasImage,
      messages: [
        { role: "system", content: instructions },
        { role: "user", content },
      ],
    });
    if (!result.ok) return json({ error: result.error }, result.status);
    console.log(`enhance-prompt served by ${result.provider}/${result.model}`);

    const out = String(result.data?.choices?.[0]?.message?.content ?? "").trim();
    if (!out) return json({ error: "The AI returned no prompt. Please adjust your input." }, 502);
    return json({ prompt: out });
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
