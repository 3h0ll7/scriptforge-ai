import type { ScriptInput } from "@/components/ScriptForm";
import type { ScriptResult } from "@/components/ScriptOutput";

export function generateMockScript(input: ScriptInput): ScriptResult {
  const isShort = ["30s", "60s"].includes(input.targetDuration);

  return {
    titleOptions: [
      `${input.topic} — What Nobody Tells You`,
      `I Tried ${input.topic} For 30 Days (Here's What Happened)`,
      `Stop Doing ${input.topic} Wrong — Do THIS Instead`,
    ],
    hook: {
      text: `Most people get ${input.topic.toLowerCase()} completely wrong — and it's costing them everything. In the next ${input.targetDuration}, I'll show you the exact framework that changed my results overnight.`,
      hookType: "pain_point",
    },
    script: [
      {
        timestamp: "00:00",
        section: "hook",
        dialogue: `Most people get ${input.topic.toLowerCase()} completely wrong — and it's costing them everything.`,
        visualDirection: "Close-up on speaker, dramatic lighting, quick zoom",
        bRollSuggestion: "Quick montage of common mistakes",
      },
      {
        timestamp: "00:05",
        section: "intro",
        dialogue: `I've spent the last 6 months diving deep into ${input.topic.toLowerCase()}, and what I found blew my mind. Stick around because point #3 is the real game-changer.`,
        visualDirection: "Speaker at desk, credentials/proof on screen",
        bRollSuggestion: "Screenshots, data visuals",
      },
      {
        timestamp: isShort ? "00:15" : "00:45",
        section: "point_1",
        dialogue: `Here's the first thing: ${input.keyMessage || "the fundamentals matter more than you think"}. Most ${input.audience || "people"} skip this step entirely, and that's why they fail.`,
        visualDirection: "Text overlay with key stat, speaker gestures",
        bRollSuggestion: "Animated infographic showing the concept",
      },
      {
        timestamp: isShort ? "00:20" : "02:00",
        section: "point_2",
        dialogue: `Now here's where it gets interesting. The second principle flips everything on its head. Instead of doing what everyone tells you, try the opposite approach.`,
        visualDirection: "Split screen comparison, before/after",
        bRollSuggestion: "Real-world examples or case studies",
      },
      {
        timestamp: isShort ? "00:25" : "03:30",
        section: "climax",
        dialogue: `And here's the part I promised — the framework that ties it all together. Once you see this, you can't unsee it.`,
        visualDirection: "Full-screen diagram or framework visual, dramatic pause",
        bRollSuggestion: "Whiteboard animation or slide deck reveal",
      },
      {
        timestamp: isShort ? "00:28" : "04:30",
        section: "cta",
        dialogue: input.platform === "youtube"
          ? "If this changed how you think about this topic, smash that subscribe button — I drop videos like this every week."
          : input.platform === "tiktok"
          ? "Follow for part 2 where I go even deeper 🔥"
          : "Save this for later and share it with someone who needs to hear this.",
        visualDirection: "Subscribe animation / follow prompt overlay",
        bRollSuggestion: null,
      },
    ],
    cta: input.platform === "youtube"
      ? "Subscribe + hit the bell for weekly videos on this topic. Drop a comment with your biggest takeaway!"
      : "Follow for more — Part 2 drops tomorrow 🔥",
    seoTags: [
      input.topic.toLowerCase().replace(/\s+/g, ""),
      input.platform,
      input.tone,
      "viral",
      "howto",
      "tips",
      "2024",
      "contentcreator",
    ],
    estimatedWordCount: isShort ? 120 : 650,
    retentionStrategyNotes:
      "Open loop planted at 00:05 ('point #3 is the game-changer') keeps viewers watching past the intro. Pattern interrupt at the climax section with a visual framework reveal. The split-screen comparison in point_2 resets attention. CTA is placed after delivering maximum value to maximize conversion.",
  };
}
