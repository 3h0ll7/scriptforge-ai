import { Zap, Sun, Moon, Languages, Settings as SettingsIcon, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useAuth } from "@/hooks/useAuth";
import UsageBadge from "@/components/UsageBadge";

export default function Navbar() {
  const { theme, setTheme, language, setLanguage, t } = useAppSettings();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut();
    navigate("/");
  };

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
          {user && <UsageBadge />}

          <Link
            to="/pricing"
            className="hidden sm:inline-flex px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("pricing")}
          </Link>

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
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-xl gradient-primary"
                aria-label="Account menu"
              >
                <User className="w-4 h-4 text-primary-foreground" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute end-0 top-full mt-2 z-50 w-52 rounded-2xl border border-border bg-card p-2 shadow-card">
                    <p className="px-3 py-2 text-xs text-muted-foreground truncate">{user.email}</p>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/settings");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <SettingsIcon className="w-4 h-4" />
                      {t("settings")}
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t("sign_out")}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="px-3.5 py-2 rounded-full text-xs font-semibold text-primary-foreground gradient-primary hover:opacity-90 transition-opacity"
            >
              {t("sign_in")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
