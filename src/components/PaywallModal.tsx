import { motion, AnimatePresence } from "framer-motion";
import { Lock, Check, CreditCard, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAppSettings } from "@/hooks/useAppSettings";

interface Props {
  open: boolean;
  onClose: () => void;
}

const featureKeys = [
  "paywall_feat_1",
  "paywall_feat_2",
  "paywall_feat_3",
  "paywall_feat_4",
];

export default function PaywallModal({ open, onClose }: Props) {
  const navigate = useNavigate();
  const { t } = useAppSettings();

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative z-10 w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-card p-8 shadow-card"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-2xl bg-destructive/10">
                <Lock className="w-8 h-8 text-destructive" />
              </div>

              <h2 className="text-xl font-bold text-foreground">
                {t("paywall_title")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("paywall_subtitle")}
              </p>

              <div className="space-y-1">
                <p className="text-4xl font-bold text-primary">
                  $3<span className="text-lg font-normal text-muted-foreground">{t("per_month")}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("or_yearly")} <span className="text-primary font-semibold">$24{t("per_year")}</span> {t("save_yearly")}
                </p>
              </div>

              <div className="w-full space-y-2 text-start">
                {featureKeys.map((key) => (
                  <div key={key} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {t(key)}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <CreditCard className="w-5 h-5" />
                <span className="text-xs">{t("mastercard_visa")}</span>
              </div>

              <Button
                variant="glow"
                size="lg"
                className="w-full rounded-full"
                onClick={() => {
                  onClose();
                  navigate("/pricing");
                }}
              >
                <Zap className="w-4 h-4" />
                {t("paywall_upgrade_btn")}
              </Button>

              <button
                onClick={onClose}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("maybe_later")}
              </button>

              <p className="text-xs text-muted-foreground/70">
                {t("join_creators")}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
