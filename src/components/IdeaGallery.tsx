import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import { useAppSettings } from "@/hooks/useAppSettings";
import IdeaShot from "@/components/IdeaShot";
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
                  <div className="relative">
                    <IdeaShot idea={item} />
                    <span className="absolute top-3 start-3 rounded-full bg-card/90 backdrop-blur text-[11px] font-bold text-foreground px-2.5 py-1 shadow-sm">
                      {platformLabels[item.values.platform]}
                    </span>

                    <div className="absolute inset-x-0 bottom-0 rounded-b-xl p-4 pt-12 bg-gradient-to-t from-black/70 via-black/30 to-transparent hidden sm:flex items-end justify-between gap-3 opacity-0 translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 sm:group-focus-visible:opacity-100 sm:group-focus-visible:translate-y-0 transition-all duration-200">
                      <p className="text-white text-sm font-semibold leading-snug line-clamp-2">{title}</p>
                      <span className="shrink-0 w-9 h-9 rounded-full bg-white text-[hsl(243_48%_9%)] grid place-items-center" aria-hidden="true">
                        <ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" />
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-sm font-bold text-foreground leading-snug line-clamp-1 sm:hidden">{title}</p>
                  <div className="mt-1.5 sm:mt-3 flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 rounded-full shrink-0" style={{ background: `linear-gradient(135deg, hsl(${item.colors[0]}), hsl(${item.colors[1]}))` }} aria-hidden="true" />
                    <p className="text-sm font-semibold text-foreground/80 truncate">{item.audience[language]}</p>
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
