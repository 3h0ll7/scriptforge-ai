import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function constantTimeEqual(a: string, b: string) {
  const encoder = new TextEncoder();
  const first = encoder.encode(a);
  const second = encoder.encode(b);
  const maxLength = Math.max(first.length, second.length);
  let result = first.length ^ second.length;

  for (let index = 0; index < maxLength; index += 1) {
    const firstByte = first[index] ?? 0;
    const secondByte = second[index] ?? 0;
    result |= firstByte ^ secondByte;
  }

  return result === 0;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookSecret = Deno.env.get("GAMMAL_TECH_WEBHOOK_SECRET");
    if (!webhookSecret) {
      return new Response(JSON.stringify({ error: "Webhook secret is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const signature = req.headers.get("x-webhook-signature") ?? "";
    if (!constantTimeEqual(signature, webhookSecret)) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const userId = body.user_id;

    if (!userId) {
      return new Response(JSON.stringify({ error: "user_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 30);

    const { error } = await supabase
      .from("profiles")
      .update({
        subscription_tier: "pro",
        subscription_start_date: now.toISOString(),
        subscription_end_date: endDate.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("Update error:", error);
      throw error;
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("payment-webhook error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
