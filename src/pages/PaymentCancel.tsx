import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAppSettings } from "@/hooks/useAppSettings";

export default function PaymentCancel() {
  const navigate = useNavigate();
  const { t } = useAppSettings();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md space-y-6"
      >
        <div className="inline-flex p-4 rounded-full bg-muted">
          <XCircle className="w-16 h-16 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{t("payment_cancelled")}</h1>
        <p className="text-muted-foreground">{t("no_worries")}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="glow" onClick={() => navigate("/pricing")}>{t("try_again")}</Button>
          <Button variant="outline" onClick={() => navigate("/")}>{t("continue_free")}</Button>
        </div>
      </motion.div>
    </div>
  );
}