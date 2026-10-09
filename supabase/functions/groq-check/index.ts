const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const key = Deno.env.get("GROQ_API_KEY");
  if (!key) {
    return new Response(JSON.stringify({ ok: false, reason: "GROQ_API_KEY not set" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const res = await fetch("https://api.groq.com/openai/v1/models", {
    headers: { Authorization: `Bearer ${key}` },
  });
  const body = await res.text();
  let modelIds: string[] = [];
  try {
    const parsed = JSON.parse(body);
    if (Array.isArray(parsed?.data)) modelIds = parsed.data.map((m: { id: string }) => m.id);
  } catch { /* ignore */ }
  return new Response(
    JSON.stringify({ ok: res.ok, status: res.status, modelCount: modelIds.length, models: modelIds.slice(0, 40), raw: res.ok ? undefined : body.slice(0, 300) }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
