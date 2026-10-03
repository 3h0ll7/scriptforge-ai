import { Zap, Sun, Moon, Languages, LogOut, Home, FilePenLine, Film, Settings, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { theme, setTheme, language, setLanguage, t } = useAppSettings();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();


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
          <Link to="/" className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2.5 text-sm font-semibold text-foreground"><Home className="w-4 h-4" />{t("home")}</Link>
          <a href="#script-form" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"><FilePenLine className="w-4 h-4" />{t("new_script")}</a>
          <a href="#script-output" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"><Film className="w-4 h-4" />{t("results")}</a>
          <div className="mt-5 mb-2 px-3 text-[10px] font-semibold uppercase text-muted-foreground">{t("workspace")}</div>
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground"><Sparkles className="w-4 h-4" />AI Studio</div>
        </nav>

        <div className="ms-auto lg:ms-0 lg:mt-auto flex lg:flex-col items-center lg:items-stretch gap-2">

          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors lg:self-start"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-4 h-4 text-muted-foreground" /> : <Sun className="w-4 h-4 text-muted-foreground" />}
          </button>

          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="flex items-center gap-1 px-2.5 py-2 rounded-lg bg-muted hover:bg-accent transition-colors text-xs font-semibold text-muted-foreground lg:self-start"
            aria-label="Toggle language"
          >
            <Languages className="w-4 h-4" />
            <span>{language === "en" ? "ع" : "EN"}</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs font-medium text-muted-foreground max-w-[110px] truncate">
                {profile?.full_name || user.email}
              </span>
              <button
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
                className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
                aria-label={t("sign_out")}
              >
                <LogOut className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <Button size="sm" variant="glow" className="rounded-lg lg:w-full" onClick={() => navigate("/auth")}> 
              {t("sign_in")}
            </Button>
          )}
          <div className="hidden lg:flex items-center gap-3 border-t border-border pt-4 mt-2 text-muted-foreground">
            <Settings className="w-4 h-4" /><span className="text-xs">{t("settings")}</span>
          </div>
        </div>

      </div>
    </header>
  );
}
