import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAppSettings } from "@/hooks/useAppSettings";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const { t } = useAppSettings();

  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex p-4 rounded-full bg-primary/10"
        >
          <CheckCircle className="w-16 h-16 text-primary" />
        </motion.div>
        <h1 className="text-3xl font-bold text-foreground">{t("pro_member")}</h1>
        <p className="text-muted-foreground">{t("enjoy_unlimited")}</p>
        <Button variant="glow" size="lg" onClick={() => navigate("/")}>
          <Zap className="w-4 h-4" />
          {t("start_creating")}
        </Button>
      </motion.div>
    </div>
  );
}