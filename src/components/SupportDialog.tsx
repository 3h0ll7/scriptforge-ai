import { useState, type ReactNode } from "react";
import { AlertTriangle, Check, Copy, Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAppSettings } from "@/hooks/useAppSettings";
import { donation } from "@/lib/donation";

export default function SupportDialog({ children }: { children: ReactNode }) {
  const { t } = useAppSettings();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(donation.address);
      setCopied(true);
      toast.success(t("address_copied"));
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("copy_failed"));
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader className="items-center text-center sm:text-center">
          <span className="w-12 h-12 rounded-full bg-accent grid place-items-center mb-1">
            <Heart className="w-6 h-6 text-secondary fill-secondary" />
          </span>
          <DialogTitle className="text-xl">{t("support_title")}</DialogTitle>
          <DialogDescription>{t("support_desc")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#26a17b] text-white px-3 py-1 text-xs font-bold">{donation.asset}</span>
            <span className="rounded-full bg-[#f0b90b] text-[#0d0c22] px-3 py-1 text-xs font-bold">{donation.network}</span>
          </div>

          <div className="rounded-xl bg-muted p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-1.5">{t("wallet_address")}</p>
            <p dir="ltr" className="font-mono text-sm text-foreground break-all select-all text-start">{donation.address}</p>
          </div>

          <Button type="button" variant="glow" className="w-full rounded-full h-11" onClick={handleCopy}>
            {copied ? <Check /> : <Copy />}
            {copied ? t("copied") : t("copy_address")}
          </Button>

          <div className="flex items-start gap-2 rounded-xl border border-[#f0b90b]/50 bg-[#f0b90b]/10 p-3 text-xs text-foreground">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#c99400]" />
            <p>{t("network_warning")}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
