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
    const groqKey = Deno.env.get("GROQ_API_KEY");
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    if (!groqKey && !lovableKey) return json({ error: "AI is not configured" }, 500);

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

    if (groqKey) {
      const userContent: unknown = hasImage
        ? [{ type: "text", text: details }, { type: "image_url", image_url: { url: b.imageDataUrl } }]
        : details;

      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${groqKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            { role: "system", content: instructions },
            { role: "user", content: userContent },
          ],
        }),
      });

      if (groqRes.ok) {
        const data = await groqRes.json();
        const out = String(data?.choices?.[0]?.message?.content ?? "").trim();
        if (out) return json({ prompt: out });
        console.error("Groq returned empty content");
      } else {
        const text = await groqRes.text();
        console.error("Groq error:", groqRes.status, text);
        if (!lovableKey) {
          if (groqRes.status === 429) return json({ error: "Too many requests, please try again shortly." }, 429);
          return json({ error: `AI error (${groqRes.status})` }, groqRes.status >= 500 ? 502 : groqRes.status);
        }
      }
    }

    if (!lovableKey) return json({ error: "AI is not configured" }, 500);

    const content: unknown[] = [{ type: "input_text", text: details }];
    if (hasImage) {
      content.push({ type: "input_image", image_url: b.imageDataUrl });
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Lovable-API-Key": lovableKey,
        Authorization: `Bearer ${lovableKey}`,
        "Content-Type": "application/json",
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        instructions,
        input: [{ role: "user", content }],
        reasoning: { effort: "low" },
        store: false,
        stream: true,
      }),
    });

    if (!res.ok || !res.body) {
      const text = await res.text();
      console.error("gateway", res.status, text);
      if (res.status === 429) return json({ error: "Too many requests, please try again shortly." }, 429);
      if (res.status === 402) return json({ error: "AI credits exhausted." }, 402);
      return json({ error: `AI error (${res.status})` }, res.status >= 500 ? 502 : res.status);
    }

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "", out = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const d = line.slice(5).trim();
        if (!d || d === "[DONE]") continue;
        try {
          const ev = JSON.parse(d);
          if (ev.type === "response.output_text.delta") out += ev.delta ?? "";
          if (ev.type === "response.failed" || ev.type === "error") {
            return json({ error: ev.response?.error?.message || ev.message || "AI failed" }, 502);
          }
        } catch { /* ignore */ }
      }
    }
    out = out.trim();
    if (!out) return json({ error: "The AI returned no prompt. Please adjust your input." }, 502);
    return json({ prompt: out });
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
