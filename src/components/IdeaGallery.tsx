import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import { useAppSettings } from "@/hooks/useAppSettings";
import { ideaTemplates, platformLabels, type IdeaTemplate } from "@/lib/ideaTemplates";

const filters = ["all", "youtube", "tiktok", "reels", "course", "webinar"] as const;
type Filter = (typeof filters)[number];

interface Props {
  onUse: (template: IdeaTemplate) => void;
}

export default function IdeaGallery({ onUse }: Props) {
  const { t, language } = useAppSettings();
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(
    () => (filter === "all" ? ideaTemplates : ideaTemplates.filter((item) => item.values.platform === filter)),
    [filter],
  );

  return (
    <section id="explore" className="scroll-mt-28 max-w-workspace mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-6 md:mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{t("explore_ideas")}</h2>
          <p className="text-muted-foreground text-sm md:text-base mt-1">{t("explore_ideas_subtitle")}</p>
        </div>

        <div className="flex gap-1.5 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-1" role="group" aria-label={t("filter_by_platform")}>
          {filters.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                filter === key ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {key === "all" ? t("all") : platformLabels[key]}
            </button>
          ))}
        </div>
      </div>

      <motion.ul layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
        <AnimatePresence mode="popLayout">
          {visible.map((item) => {
            const Icon = item.icon;
            const title = item.title[language];
            return (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  type="button"
                  onClick={() => onUse(item)}
                  className="group block w-full text-start rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                  aria-label={`${t("use_idea")}: ${title}`}
                >
                  <div
                    className="relative aspect-[4/3] rounded-xl overflow-hidden"
                    style={{ background: `linear-gradient(135deg, hsl(${item.colors[0]}), hsl(${item.colors[1]}))` }}
                  >
                    <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_45%),radial-gradient(circle_at_85%_80%,white_0,transparent_35%)]" aria-hidden="true" />
                    <Icon className="absolute inset-0 m-auto w-14 h-14 text-white/90 drop-shadow-sm transition-transform duration-300 group-hover:scale-110" strokeWidth={1.6} aria-hidden="true" />
                    <span className="absolute top-3 start-3 rounded-full bg-white/90 text-[11px] font-bold text-[hsl(243_48%_9%)] px-2.5 py-1">
                      {platformLabels[item.values.platform]}
                    </span>

                    <div className="absolute inset-x-0 bottom-0 p-4 pt-12 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-between gap-3 opacity-100 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 sm:group-focus-visible:opacity-100 sm:group-focus-visible:translate-y-0 transition-all duration-200">
                      <p className="text-white text-sm font-semibold leading-snug line-clamp-2">{title}</p>
                      <span className="shrink-0 w-9 h-9 rounded-full bg-white text-[hsl(243_48%_9%)] grid place-items-center" aria-hidden="true">
                        <ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" />
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 rounded-full shrink-0" style={{ background: `hsl(${item.colors[0]})` }} aria-hidden="true" />
                    <p className="text-sm font-semibold text-foreground truncate">{item.audience[language]}</p>
                    <span className="ms-auto shrink-0 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      {item.values.targetDuration}
                    </span>
                  </div>
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </section>
  );
}
