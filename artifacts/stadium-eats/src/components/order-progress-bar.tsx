import { motion } from "framer-motion";
import { Check, Clock, ChefHat, Bike, Package } from "lucide-react";
import { OrderStatus } from "@workspace/api-client-react";
import { useTranslation } from "react-i18next";

const steps = [
  { id: "received", icon: Clock, label: "order.status.received" },
  { id: "preparing", icon: ChefHat, label: "order.status.preparing" },
  { id: "on_the_way", icon: Bike, label: "order.status.on_the_way" },
  { id: "delivered", icon: Package, label: "order.status.delivered" }
];

export function OrderProgressBar({ status }: { status: OrderStatus }) {
  const { t } = useTranslation();
  
  if (status === "cancelled") {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-center font-bold">
        {t("order.status.cancelled")}
      </div>
    );
  }

  const currentStepIndex = steps.findIndex(s => s.id === status);
  const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

  return (
    <div className="relative py-4">
      {/* Background Line */}
      <div className="absolute top-8 left-6 right-6 h-1 bg-muted rounded-full" />
      
      {/* Active Line */}
      <motion.div 
        className="absolute top-8 left-6 h-1 bg-primary rounded-full"
        initial={{ width: "0%" }}
        animate={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      
      <div className="relative flex justify-between">
        {steps.map((step, i) => {
          const isCompleted = i < activeIndex;
          const isActive = i === activeIndex;
          const Icon = isCompleted ? Check : step.icon;
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 z-10 w-16">
              <motion.div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  isCompleted ? "bg-primary border-primary text-primary-foreground" :
                  isActive ? "bg-background border-primary text-primary shadow-[0_0_15px_rgba(26,107,58,0.5)]" :
                  "bg-background border-muted text-muted-foreground"
                }`}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={isActive ? { repeat: Infinity, duration: 2 } : {}}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              <span className={`text-[10px] font-bold text-center leading-tight transition-colors ${
                isCompleted || isActive ? "text-foreground" : "text-muted-foreground"
              }`}>
                {t(step.label)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
