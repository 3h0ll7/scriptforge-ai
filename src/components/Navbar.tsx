import { Sun, Moon, Languages, Compass, FilePenLine, Film, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSettings } from "@/hooks/useAppSettings";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#explore", key: "explore", icon: Compass },
  { href: "#script-form", key: "new_script", icon: FilePenLine },
  { href: "#script-output", key: "results", icon: Film },
];

export default function Navbar() {
  const { theme, setTheme, language, setLanguage, t } = useAppSettings();

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border">
      <div className="max-w-workspace mx-auto h-16 md:h-[72px] px-4 sm:px-6 lg:px-8 flex items-center gap-4 md:gap-8">
        <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="ScriptForge AI">
          <span className="w-8 h-8 rounded-full bg-brand text-white grid place-items-center text-sm font-bold" aria-hidden="true">S</span>
          <span className="text-lg md:text-xl font-bold tracking-tight text-foreground">
            scriptforge<span className="text-brand">.</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {links.map(({ href, key }) => (
            <a key={key} href={href} className="px-3 py-2 rounded-full text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-muted transition-colors">
              {t(key)}
            </a>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-1.5 sm:gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-full hover:bg-muted"
            aria-label={t("theme")}
            title={t("theme")}
          >
            {theme === "light" ? <Moon className="text-muted-foreground" /> : <Sun className="text-muted-foreground" />}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="rounded-full hover:bg-muted text-xs text-muted-foreground"
            aria-label={t("app_language")}
            title={t("app_language")}
          >
            <Languages />
            <span>{language === "en" ? "ع" : "EN"}</span>
          </Button>

          <Button asChild variant="default" size="sm" className="rounded-full px-4 h-10">
            <a href="#script-form">
              <Plus />
              <span className="hidden sm:inline">{t("start_new_script")}</span>
            </a>
          </Button>
        </div>
      </div>

      <nav className="md:hidden flex gap-1 overflow-x-auto px-4 pb-2 -mt-1" aria-label="Mobile navigation">
        {links.map(({ href, key, icon: Icon }) => (
          <a key={key} href={href} className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-xs font-semibold text-foreground/80">
            <Icon className="w-3.5 h-3.5" />
            {t(key)}
          </a>
        ))}
      </nav>
    </header>
  );
}
