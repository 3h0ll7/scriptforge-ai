// Server-only Groq client shared by script and video-prompt generation.
// Never fall back to a credit-funded provider or silently discard image input.

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
      visionModels: list(Deno.env.get("GROQ_VISION_MODELS"), ["meta-llama/llama-4-scout-17b-16e-instruct"]),
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
    signal: AbortSignal.timeout(90_000),
  });
}

export async function chatCompletion(req: ChatRequest): Promise<ChatResult> {
  const all = providers();
  if (all.length === 0) {
    return { ok: false, status: 503, error: "Groq is not configured. Please configure GROQ_API_KEY." };
  }

  const textOnly = withoutImages(req.messages);
  let lastStatus = 503;
  let lastError = "Groq is temporarily unavailable. Please try again later.";

  for (const provider of all) {
    const attempts = req.hasImage
      ? provider.visionModels.map((model) => ({ model, messages: req.messages }))
      : provider.textModels.map((model) => ({ model, messages: textOnly }));

    for (const attempt of attempts) {
      try {
        const res = await post(provider, attempt.model, attempt.messages, req);
        if (res.ok) return { ok: true, provider: provider.name, model: attempt.model, data: await res.json() };

        lastStatus = res.status;
        const errorBody = await res.text();
        console.error(`${provider.name}/${attempt.model} error ${res.status}: ${errorBody.slice(0, 500)}`);
        try {
          lastError = JSON.parse(errorBody)?.error?.message || lastError;
        } catch {
          lastError = "Groq could not complete this request. Please try again.";
        }
        if (NEXT_MODEL.has(res.status)) continue;
        break;
      } catch (e) {
        lastStatus = 502;
        console.error(`${provider.name}/${attempt.model} request failed:`, e);
        break;
      }
    }
  }

  if (lastStatus === 429) {
    return { ok: false, status: 429, error: "Groq is busy or its usage limit was reached. Please try again in a minute." };
  }
  return { ok: false, status: lastStatus, error: lastError };
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
