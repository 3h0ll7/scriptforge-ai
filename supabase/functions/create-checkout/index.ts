import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DEFAULT_APP_BASE_URL = "https://scriptforgeaii.lovable.app";

function normalizeBaseUrl(url: string | null | undefined) {
  if (!url) return null;

  try {
    return new URL(url).origin.replace(/\/$/, "");
  } catch {
    return null;
  }
}

function getForwardedOrigin(req: Request) {
  const forwardedHost = req.headers.get("x-forwarded-host");
  if (!forwardedHost) {
    return null;
  }

  const forwardedProto = req.headers.get("x-forwarded-proto") || "https";
  return normalizeBaseUrl(`${forwardedProto}://${forwardedHost}`);
}

function getAppBaseUrl(req: Request) {
  return (
    normalizeBaseUrl(Deno.env.get("APP_BASE_URL")) ||
    normalizeBaseUrl(req.headers.get("origin")) ||
    normalizeBaseUrl(req.headers.get("referer")) ||
    getForwardedOrigin(req) ||
    DEFAULT_APP_BASE_URL
  );
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const authorization = req.headers.get("Authorization");

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error("Supabase environment variables are not configured");
    }

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

    const { billing_period } = await req.json().catch(() => ({ billing_period: undefined }));

    const checkoutUrl = Deno.env.get("GAMMAL_TECH_CHECKOUT_URL");
    if (!checkoutUrl) {
      return new Response(
        JSON.stringify({ error: "Payment system is being configured. Please try again later." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const appBaseUrl = getAppBaseUrl(req);
    const url = new URL(checkoutUrl);
    url.searchParams.set("user_id", user.id);
    url.searchParams.set("success_url", `${appBaseUrl}/payment-success`);
    url.searchParams.set("cancel_url", `${appBaseUrl}/payment-cancel`);
    if (typeof billing_period === "string" && billing_period.length > 0) {
      url.searchParams.set("billing_period", billing_period);
    }

    return new Response(JSON.stringify({ url: url.toString() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("create-checkout error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
