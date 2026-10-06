import { Zap, Sun, Moon, Languages, Home, FilePenLine, Film } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSettings } from "@/hooks/useAppSettings";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { theme, setTheme, language, setLanguage, t } = useAppSettings();


  return (
    <header className="lg:fixed lg:inset-y-5 lg:start-5 lg:w-56 z-50 bg-card/95 backdrop-blur-xl border-b lg:border border-border lg:rounded-2xl shadow-card">
      <div className="h-full px-4 py-3 lg:p-5 flex lg:flex-col items-center lg:items-stretch gap-3">
        <Link to="/" className="flex items-center gap-3 lg:pb-6 lg:border-b lg:border-border">
          <div className="p-2 rounded-lg gradient-primary">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block min-w-0">
            <h1 className="text-base font-bold text-foreground">ScriptForge<span className="text-secondary">.</span></h1>
            <p className="hidden lg:block text-[11px] text-muted-foreground">AI script workspace</p>
          </div>
        </Link>

        <nav className="hidden lg:flex flex-col gap-1 pt-5" aria-label="Main navigation">
          <Button asChild variant="ghost" className="justify-start bg-muted"><Link to="/"><Home />{t("home")}</Link></Button>
          <Button asChild variant="ghost" className="justify-start text-muted-foreground"><Link to="/#script-form"><FilePenLine />{t("new_script")}</Link></Button>
          <Button asChild variant="ghost" className="justify-start text-muted-foreground"><Link to="/#script-output"><Film />{t("results")}</Link></Button>
        </nav>

        <div className="ms-auto lg:ms-0 lg:mt-auto flex lg:flex-col items-center lg:items-stretch gap-2">

           <Button
             type="button"
             variant="ghost"
             size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors lg:self-start"
            aria-label="Toggle theme"
             title={t("theme")}
          >
            {theme === "light" ? <Moon className="w-4 h-4 text-muted-foreground" /> : <Sun className="w-4 h-4 text-muted-foreground" />}
           </Button>

           <Button
             type="button"
             variant="ghost"
             size="sm"
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="flex items-center gap-1 px-2.5 py-2 rounded-lg bg-muted hover:bg-accent transition-colors text-xs font-semibold text-muted-foreground lg:self-start"
            aria-label="Toggle language"
             title={t("app_language")}
          >
            <Languages className="w-4 h-4" />
            <span>{language === "en" ? "ع" : "EN"}</span>
           </Button>

        </div>

      </div>
    </header>
  );
}
