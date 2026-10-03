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
    <header className="sticky top-0 z-40 -mx-4 mb-6 flex items-center gap-4 border-b border-[#e9e6df]/80 bg-[#eeece7]/92 px-4 py-3 backdrop-blur-xl md:-mx-7 md:px-7">
      <div className="hidden min-w-0 flex-1 lg:block">
        <div className="relative max-w-2xl">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#858985]" />
          <input
            aria-label="Search"
            placeholder="Search your scripts..."
            className="h-11 w-full rounded-2xl border border-[#e7e3db] bg-white/75 ps-10 pe-24 text-sm text-[#202622] outline-none transition focus:border-[#cbc7bf] focus:bg-white"
          />
          <span className="absolute end-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-xl border border-[#ebe7df] bg-[#f8f7f3] px-2 py-1 text-[10px] font-semibold text-[#a09f99] xl:flex">
            <Command className="h-3 w-3" />K
          </span>
        </div>
      </div>
      <div className="ms-auto flex items-center gap-2">
        <UsageBadge />
        <button onClick={() => navigate("/settings")} className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-[#ebe7df] bg-white/80 text-[#6d736d] hover:bg-white" title={t("settings")}>
          <Bell className="h-4 w-4" />
          <span className="absolute end-2 top-2 h-1.5 w-1.5 rounded-full bg-[#3d6952]" />
        </button>
        <button onClick={() => navigate("/settings")} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#ebe7df] bg-white/80 text-[#6d736d] hover:bg-white" title={profile?.full_name || "Profile"}>
          <UserCircle className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
