import { afterEach, describe, expect, it, vi } from "vitest";
import { chatCompletion } from "../../supabase/functions/_shared/ai";

afterEach(() => vi.unstubAllGlobals());

function configureGroq(key = "test-key") {
  vi.stubGlobal("Deno", { env: { get: (name: string) => name === "GROQ_API_KEY" ? key : name === "LOVABLE_API_KEY" ? "unused-key" : undefined } });
}

describe("Groq generation", () => {
  it("routes completions only to Groq even when Lovable credentials exist", async () => {
    configureGroq();
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [{ message: { content: "Prompt" } }] }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const result = await chatCompletion({ messages: [{ role: "user", content: "Write a script" }] });
    expect(result.ok).toBe(true);
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.groq.com/openai/v1/chat/completions");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("never falls back to Lovable credits on Groq rate limits", async () => {
    configureGroq();
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: { message: "Rate limit" } }), { status: 429 }));
    vi.stubGlobal("fetch", fetchMock);
    const result = await chatCompletion({ messages: [{ role: "user", content: "Build a prompt" }] });
    expect(result).toMatchObject({ ok: false, status: 429 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("requires the saved Groq key rather than another provider", async () => {
    configureGroq("");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(await chatCompletion({ messages: [] })).toMatchObject({ ok: false, status: 503 });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});