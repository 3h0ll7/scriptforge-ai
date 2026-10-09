import type { CSSProperties } from "react";
import { Bookmark, CheckCircle2, Heart, MessageCircle, Mic, Music2, Play, Send, Sparkles, Users } from "lucide-react";
import { useAppSettings } from "@/hooks/useAppSettings";
import type { IdeaTemplate } from "@/lib/ideaTemplates";

const durationLabels: Record<string, string> = {
  "30s": "0:30",
  "60s": "1:00",
  "3min": "3:00",
  "5min": "5:00",
  "10min": "10:00",
  "15min+": "15:00",
};

/**
 * Platform-shaped mockup used as an idea card's thumbnail: a floating
 * device or frame on a soft tint of the idea's colour, in the style of a
 * Dribbble shot.
 */
export default function IdeaShot({ idea }: { idea: IdeaTemplate }) {
  const { language } = useAppSettings();
  const [from, to] = idea.colors;
  const hue = from.split(" ")[0];
  const vars = {
    "--shot-hue": hue,
    "--shot-from": `hsl(${from})`,
    "--shot-to": `hsl(${to})`,
  } as CSSProperties;
  const headline = idea.headline[language];
  const props = { idea, headline };

  return (
    <div
      style={vars}
      className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[hsl(var(--shot-hue)_80%_94%)] dark:bg-[hsl(var(--shot-hue)_28%_15%)]"
      aria-hidden="true"
    >
      <div className="absolute -top-1/4 -end-1/4 w-2/3 aspect-square rounded-full bg-[var(--shot-to)] opacity-25 blur-3xl" />
      <div className="absolute -bottom-1/4 -start-1/4 w-1/2 aspect-square rounded-full bg-[var(--shot-from)] opacity-20 blur-3xl" />
      <div className="absolute inset-0 grid place-items-center p-[7%] transition-transform duration-500 ease-out group-hover:scale-[1.04]">
        {idea.values.platform === "youtube" && <YouTubeShot {...props} />}
        {(idea.values.platform === "tiktok" || idea.values.platform === "reels") && <VerticalShot {...props} />}
        {idea.values.platform === "course" && <CourseShot {...props} />}
        {idea.values.platform === "webinar" && <WebinarShot {...props} />}
      </div>
    </div>
  );
}

interface ShotProps {
  idea: IdeaTemplate;
  headline: string;
}

const gradient = "bg-[linear-gradient(135deg,var(--shot-from),var(--shot-to))]";

function YouTubeShot({ idea, headline }: ShotProps) {
  const Icon = idea.icon;
  return (
    <div className="w-[88%]">
      <div className={`relative aspect-video rounded-lg overflow-hidden shadow-[0_18px_40px_-12px_rgba(13,12,34,0.45)] ${gradient}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.35),transparent_55%)]" />
        <div className="absolute end-[7%] top-1/2 -translate-y-1/2 w-[34%] aspect-square rounded-full bg-white/95 grid place-items-center shadow-lg rotate-6">
          <Icon className="w-1/2 h-1/2 text-[var(--shot-to)]" strokeWidth={2.2} />
        </div>
        <p className="absolute start-[7%] top-1/2 -translate-y-1/2 max-w-[55%] text-white font-bold uppercase leading-[0.95] text-[clamp(1rem,2.4vw,1.6rem)] [text-shadow:0_2px_0_rgba(13,12,34,0.35)]">
          {headline}
        </p>
        <span className="absolute bottom-[9%] end-[4%] rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold text-white tabular-nums">
          {durationLabels[idea.values.targetDuration]}
        </span>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/30">
          <div className="h-full w-2/5 bg-[#ff0033]" />
        </div>
      </div>
      <div className="mt-2.5 flex items-start gap-2">
        <span className={`w-6 h-6 shrink-0 rounded-full ${gradient}`} />
        <div className="flex-1 space-y-1.5 pt-0.5">
          <div className="h-2 w-[85%] rounded-full bg-foreground/15" />
          <div className="h-2 w-1/2 rounded-full bg-foreground/10" />
        </div>
      </div>
    </div>
  );
}

function VerticalShot({ idea, headline }: ShotProps) {
  const Icon = idea.icon;
  const isReels = idea.values.platform === "reels";
  return (
    <div className="relative h-full flex items-center justify-center">
      <div className="relative h-[100%] aspect-[9/17] rounded-[1.1rem] border-[3px] border-[#0d0c22] bg-[#0d0c22] shadow-[0_20px_40px_-12px_rgba(13,12,34,0.5)] -rotate-3 overflow-hidden">
        <div className={`absolute inset-0 ${gradient}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
        <div className="absolute top-1.5 inset-x-0 mx-auto w-8 h-1.5 rounded-full bg-[#0d0c22]" />
        <Icon className="absolute top-[18%] inset-x-0 mx-auto w-[38%] h-auto text-white/90" strokeWidth={1.6} />
        <p className="absolute top-[54%] start-[9%] end-[24%] text-start text-white font-bold uppercase leading-none text-[clamp(0.7rem,1.4vw,0.95rem)] [text-shadow:0_2px_6px_rgba(0,0,0,0.35)]">
          {headline}
        </p>
        <div className="absolute end-[6%] bottom-[22%] flex flex-col items-center gap-1.5 text-white">
          <Heart className="w-3.5 h-3.5 fill-white" />
          <MessageCircle className="w-3.5 h-3.5" />
          {isReels ? <Send className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
        </div>
        <div className="absolute start-[8%] bottom-[7%] end-[28%] space-y-1">
          <div className="h-1.5 w-2/3 rounded-full bg-white/90" />
          <div className="h-1.5 w-full rounded-full bg-white/60" />
          <div className="flex items-center gap-1 text-white/80">
            <Music2 className="w-2.5 h-2.5" />
            <div className="h-1 flex-1 rounded-full bg-white/50" />
          </div>
        </div>
      </div>
      <div className="absolute -end-[62%] top-[8%] rotate-3 rounded-xl bg-card shadow-lg px-2.5 py-2 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-[var(--shot-to)] grid place-items-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </span>
        <div className="space-y-1">
          <div className="h-1.5 w-10 rounded-full bg-foreground/70" />
          <div className="h-1.5 w-7 rounded-full bg-foreground/25" />
        </div>
      </div>
      <span className="absolute -start-[42%] bottom-[12%] -rotate-3 rounded-full bg-card shadow-lg px-2.5 py-1 text-[10px] font-bold text-foreground tabular-nums">
        {durationLabels[idea.values.targetDuration]}
      </span>
    </div>
  );
}

function CourseShot({ idea, headline }: ShotProps) {
  const Icon = idea.icon;
  return (
    <div className="relative w-[86%]">
      <div className="relative aspect-[16/10] rounded-xl bg-card shadow-[0_18px_40px_-12px_rgba(13,12,34,0.35)] p-[6%] flex flex-col">
        <span className="self-start rounded-full bg-[hsl(var(--shot-hue)_80%_94%)] dark:bg-[hsl(var(--shot-hue)_28%_22%)] px-2 py-0.5 text-[10px] font-bold text-[var(--shot-to)] uppercase">
          {headline}
        </span>
        <div className="mt-[5%] flex items-center gap-3 flex-1">
          <span className={`w-[24%] aspect-square rounded-lg ${gradient} grid place-items-center`}>
            <Icon className="w-1/2 h-1/2 text-white" strokeWidth={2} />
          </span>
          <div className="flex-1 space-y-2">
            <div className="h-2.5 w-[90%] rounded-full bg-foreground/80" />
            <div className="h-2 w-[70%] rounded-full bg-foreground/20" />
            <div className="h-2 w-[50%] rounded-full bg-foreground/20" />
          </div>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 3 ? "bg-[var(--shot-to)]" : "bg-foreground/10"}`} />
          ))}
        </div>
      </div>
      <div className="absolute -bottom-[10%] -end-[6%] rounded-xl bg-card shadow-lg px-2.5 py-2 space-y-1.5">
        {[true, true, false].map((done, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <CheckCircle2 className={`w-3 h-3 ${done ? "text-[var(--shot-to)]" : "text-foreground/25"}`} />
            <div className={`h-1.5 rounded-full ${done ? "w-10 bg-foreground/60" : "w-8 bg-foreground/20"}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function WebinarShot({ idea, headline }: ShotProps) {
  const Icon = idea.icon;
  return (
    <div className="w-[90%] rounded-xl bg-card shadow-[0_18px_40px_-12px_rgba(13,12,34,0.35)] overflow-hidden">
      <div className="flex items-center gap-1 px-2.5 py-1.5 border-b border-border">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ff5f57]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#febc2e]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#28c840]" />
        <span className="ms-auto inline-flex items-center gap-1 rounded bg-[#ff3b30] px-1.5 py-px text-[9px] font-bold text-white">
          <span className="w-1 h-1 rounded-full bg-white" />
          LIVE
        </span>
      </div>
      <div className="grid grid-cols-3 grid-rows-2 gap-1 p-1 aspect-[16/8.5]">
        <div className={`relative col-span-2 row-span-2 rounded-md overflow-hidden ${gradient}`}>
          <Icon className="absolute inset-0 m-auto w-[30%] h-[30%] text-white/90" strokeWidth={1.8} />
          <p className="absolute bottom-1.5 start-1.5 rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">{headline}</p>
        </div>
        {[Users, Mic].map((TileIcon, i) => (
          <div key={i} className="rounded-md bg-muted grid place-items-center">
            <span className="w-[42%] aspect-square rounded-full bg-[hsl(var(--shot-hue)_70%_85%)] dark:bg-[hsl(var(--shot-hue)_30%_30%)] grid place-items-center">
              <TileIcon className="w-1/2 h-1/2 text-[var(--shot-to)]" />
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-1.5 pb-1.5">
        {[Mic, Play, MessageCircle].map((CtrlIcon, i) => (
          <span key={i} className={`w-5 h-5 rounded-full grid place-items-center ${i === 1 ? "bg-[var(--shot-to)] text-white" : "bg-muted text-foreground/60"}`}>
            <CtrlIcon className="w-2.5 h-2.5" />
          </span>
        ))}
      </div>
    </div>
  );
}
