// Chat-completion client with provider and model fallback.
// Order: Groq (free tier, open-weight models) → OpenRouter (free open models)
// → Lovable AI Gateway. A provider is skipped when its key is missing; the next
// model or provider is tried on retired models, out-of-credits, rate limits or
// server errors. Every model can be overridden with an env var.

type Message = { role: "system" | "user" | "assistant"; content: unknown };

interface Provider {
  name: string;
  url: string;
  key: string;
  /** Strongest first; later entries are used if a model is retired or rejected. */
  textModels: string[];
  visionModels: string[];
}

export interface ChatRequest {
  messages: Message[];
  tools?: unknown[];
  tool_choice?: unknown;
  temperature?: number;
  /** True when a message carries an image part; selects the provider's vision models. */
  hasImage?: boolean;
}

export type ChatResult =
  | { ok: true; provider: string; model: string; data: any }
  | { ok: false; status: number; error: string };

/** Errors that usually mean this model (or its input) was rejected; try the provider's next model. */
const NEXT_MODEL = new Set([400, 404, 413, 422]);

const list = (value: string | undefined, fallback: string[]) =>
  value ? value.split(",").map((s) => s.trim()).filter(Boolean) : fallback;

function providers(): Provider[] {
  const result: Provider[] = [];
  const groq = Deno.env.get("GROQ_API_KEY");
  if (groq) {
    result.push({
      name: "groq",
      url: "https://api.groq.com/openai/v1/chat/completions",
      key: groq,
      textModels: list(Deno.env.get("GROQ_MODELS"), ["openai/gpt-oss-120b", "openai/gpt-oss-20b"]),
      visionModels: list(Deno.env.get("GROQ_VISION_MODELS"), ["qwen/qwen3.8-27b", "meta-llama/llama-4-scout-17b-16e-instruct"]),
    });
  }
  const openrouter = Deno.env.get("OPENROUTER_API_KEY");
  if (openrouter) {
    result.push({
      name: "openrouter",
      url: "https://openrouter.ai/api/v1/chat/completions",
      key: openrouter,
      textModels: list(Deno.env.get("OPENROUTER_MODELS"), ["openai/gpt-oss-120b:free", "deepseek/deepseek-chat-v3.1:free"]),
      visionModels: list(Deno.env.get("OPENROUTER_VISION_MODELS"), ["google/gemma-3-27b-it:free"]),
    });
  }
  const lovable = Deno.env.get("LOVABLE_API_KEY");
  if (lovable) {
    result.push({
      name: "lovable",
      url: "https://ai.gateway.lovable.dev/v1/chat/completions",
      key: lovable,
      textModels: ["google/gemini-3-flash-preview"],
      visionModels: ["google/gemini-3-flash-preview"],
    });
  }
  return result;
}

/** Drops image parts so a text-only attempt is possible. */
function withoutImages(messages: Message[]): Message[] {
  return messages.map((m) =>
    Array.isArray(m.content)
      ? { ...m, content: (m.content as Array<{ type: string }>).filter((part) => part.type === "text") }
      : m,
  );
}

function post(provider: Provider, model: string, messages: Message[], req: ChatRequest) {
  return fetch(provider.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${provider.key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      ...(req.tools ? { tools: req.tools, tool_choice: req.tool_choice } : {}),
      ...(req.temperature !== undefined ? { temperature: req.temperature } : {}),
    }),
  });
}

export async function chatCompletion(req: ChatRequest): Promise<ChatResult> {
  const all = providers();
  if (all.length === 0) {
    return { ok: false, status: 500, error: "AI is not configured. Set GROQ_API_KEY (free) or another provider key." };
  }

  // With an image, every provider's vision models are tried before any text-only fallback,
  // so a retired vision model on one provider doesn't silently drop the image.
  const passes: Array<{ models: (p: Provider) => string[]; messages: Message[] }> = [
    ...(req.hasImage ? [{ models: (p: Provider) => p.visionModels, messages: req.messages }] : []),
    { models: (p: Provider) => p.textModels, messages: withoutImages(req.messages) },
  ];
  let lastStatus = 503;

  for (const pass of passes) {
    for (const provider of all) {
      for (const model of pass.models(provider)) {
        try {
          const res = await post(provider, model, pass.messages, req);
          if (res.ok) return { ok: true, provider: provider.name, model, data: await res.json() };

          lastStatus = res.status;
          console.error(`${provider.name}/${model} error ${res.status}: ${(await res.text()).slice(0, 500)}`);
          if (NEXT_MODEL.has(res.status)) continue;
          break;
        } catch (e) {
          lastStatus = 502;
          console.error(`${provider.name}/${model} request failed:`, e);
          break;
        }
      }
    }
  }

  if (lastStatus === 429) {
    return { ok: false, status: 429, error: "The AI is busy right now. Please try again in a minute." };
  }
  return { ok: false, status: 503, error: "The AI service is temporarily unavailable. Please try again later." };
}

/** Reads structured output from a forced tool call, falling back to JSON in the message text. */
export function readToolArguments(data: any): any {
  const message = data?.choices?.[0]?.message;
  const args = message?.tool_calls?.[0]?.function?.arguments;
  if (typeof args === "string" && args.trim()) return JSON.parse(args);
  if (args && typeof args === "object") return args;

  const text: string = message?.content ?? "";
  const match = text.match(/\{[\s\S]*\}/);
  if (match) return JSON.parse(match[0]);
  throw new Error("No structured output returned from AI");
}
