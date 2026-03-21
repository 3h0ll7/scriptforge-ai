import { motion, AnimatePresence } from "framer-motion";
import { Lock, Check, CreditCard, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  onClose: () => void;
}

const features = [
  "Unlimited script generation",
  "All platforms (YouTube, TikTok, Reels, Course, Webinar)",
  "Multi-language (English + Arabic)",
  "Export as PDF/JSON",
];

export default function PaywallModal({ open, onClose }: Props) {
  const navigate = useNavigate();

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
            className="relative z-10 w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-border bg-card p-8 shadow-card"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-2xl bg-destructive/10">
                <Lock className="w-8 h-8 text-destructive" />
              </div>

              <h2 className="text-xl font-bold text-foreground">
                You've used all 5 free scripts this month
              </h2>
              <p className="text-sm text-muted-foreground">
                Upgrade to Pro for unlimited scripts, all platforms, and advanced features
              </p>

              <p className="text-4xl font-bold text-primary">
                $3<span className="text-lg font-normal text-muted-foreground">/month</span>
              </p>

              <div className="w-full space-y-2 text-left">
                {features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <CreditCard className="w-5 h-5" />
                <span className="text-xs">Mastercard & Visa accepted</span>
              </div>

              <Button
                variant="glow"
                size="lg"
                className="w-full"
                onClick={() => {
                  onClose();
                  navigate("/pricing");
                }}
              >
                <Zap className="w-4 h-4" />
                Upgrade to Pro — $3/month
              </Button>

              <button
                onClick={onClose}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Maybe Later
              </button>

              <p className="text-xs text-muted-foreground/70">
                Join 500+ creators already using Pro
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
