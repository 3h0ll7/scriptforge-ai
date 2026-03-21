import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
  const navigate = useNavigate();

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
        <h1 className="text-2xl font-bold text-foreground">Payment Cancelled</h1>
        <p className="text-muted-foreground">No worries! You can upgrade anytime.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="glow" onClick={() => navigate("/pricing")}>Try Again</Button>
          <Button variant="outline" onClick={() => navigate("/")}>Continue with Free</Button>
        </div>
      </motion.div>
    </div>
  );
}
