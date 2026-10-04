import { Bell, Command, Search, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAppSettings } from "@/hooks/useAppSettings";
import UsageBadge from "@/components/UsageBadge";

export default function TopBar() {
  const { profile } = useAuth();
  const { t } = useAppSettings();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 -mx-4 mb-6 flex items-center gap-4 border-b border-border/80 bg-muted/92 px-4 py-3 backdrop-blur-xl md:-mx-7 md:px-7">
      <div className="hidden min-w-0 flex-1 lg:block">
        <div className="relative max-w-2xl">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            aria-label="Search"
            placeholder="Search your scripts..."
            className="h-11 w-full rounded-2xl border border-input bg-card/75 ps-10 pe-24 text-sm text-foreground outline-none transition focus:border-ring focus:bg-primary-foreground"
          />
          <span className="absolute end-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-xl border border-border bg-[#f8f7f3] px-2 py-1 text-[10px] font-semibold text-[#a09f99] xl:flex">
            <Command className="h-3 w-3" />K
          </span>
        </div>
      </div>
      <div className="ms-auto flex items-center gap-2">
        <UsageBadge />
        <button onClick={() => navigate("/settings")} className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card/80 text-muted-foreground hover:bg-primary-foreground" title={t("settings")}>
          <Bell className="h-4 w-4" />
          <span className="absolute end-2 top-2 h-1.5 w-1.5 rounded-full bg-secondary" />
        </button>
        <button onClick={() => navigate("/settings")} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card/80 text-muted-foreground hover:bg-primary-foreground" title={profile?.full_name || "Profile"}>
          <UserCircle className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
