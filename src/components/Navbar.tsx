import { Zap, Sun, Moon, Languages, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import UsageBadge from "@/components/UsageBadge";

export default function Navbar() {
  const { theme, setTheme, language, setLanguage, t } = useAppSettings();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();


  return (
    <header className="bg-card/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/50">
      <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="p-2 rounded-2xl gradient-primary">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-foreground tracking-tight">ScriptForge AI</h1>
            <p className="text-xs text-muted-foreground">Video scripts that hook, retain, and convert</p>
          </div>
        </Link>

        <div className="ms-auto flex items-center gap-2">

          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-xl bg-muted hover:bg-muted/70 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-4 h-4 text-muted-foreground" /> : <Sun className="w-4 h-4 text-muted-foreground" />}
          </button>

          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-muted hover:bg-muted/70 transition-colors text-xs font-semibold text-muted-foreground"
            aria-label="Toggle language"
          >
            <Languages className="w-4 h-4" />
            <span>{language === "en" ? "ع" : "EN"}</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs font-medium text-muted-foreground max-w-[140px] truncate">
                {profile?.full_name || user.email}
              </span>
              <button
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
                className="p-2 rounded-xl bg-muted hover:bg-muted/70 transition-colors"
                aria-label={t("sign_out")}
              >
                <LogOut className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <Button size="sm" variant="glow" className="rounded-full" onClick={() => navigate("/auth")}>
              {t("sign_in")}
            </Button>
          )}
        </div>

      </div>
    </header>
  );
}
