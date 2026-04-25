import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useScanTicket, useGetSession, getGetSessionQueryKey } from "@workspace/api-client-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { QrCode, ArrowRight, Utensils, MapPin } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { toast } from "sonner";

const steps = [
  {
    id: "step1",
    icon: QrCode,
    title: "splash.step1.title",
    desc: "splash.step1.desc"
  },
  {
    id: "step2",
    icon: Utensils,
    title: "splash.step2.title",
    desc: "splash.step2.desc"
  },
  {
    id: "step3",
    icon: MapPin,
    title: "splash.step3.title",
    desc: "splash.step3.desc"
  }
];

export default function SplashPage() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  
  const { fanSessionId, setFanSessionId } = useAppStore();
  const { data: session, isLoading: isLoadingSession, isError: isSessionError } = useGetSession(fanSessionId || "", {
    query: {
      enabled: !!fanSessionId,
      retry: 0,
      queryKey: getGetSessionQueryKey(fanSessionId || "")
    }
  });

  useEffect(() => {
    if (session && !isSessionError) {
      setLocation("/home");
    } else if (isSessionError) {
      setFanSessionId(null);
    }
  }, [session, isSessionError, setLocation, setFanSessionId]);

  const scanMutation = useScanTicket({
    mutation: {
      onSuccess: (data) => {
        setFanSessionId(data.id);
        toast.success(`Welcome to ${data.stadiumName}!`);
        setLocation("/home");
      },
      onError: () => {
        toast.error("Invalid ticket QR code");
      }
    }
  });

  const handleDemo = () => {
    scanMutation.mutate({ data: { qrCode: "DEMO-CASA-A-12-15" } });
  };

  if (isLoadingSession && fanSessionId) {
    return <div className="min-h-screen flex items-center justify-center bg-primary text-primary-foreground"><span className="animate-pulse font-bold text-2xl">STADIUM EATS</span></div>;
  }

  if (showScanner) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-background">
        <div className="p-4 flex justify-between items-center bg-card border-b">
          <Button variant="ghost" onClick={() => setShowScanner(false)}>Back</Button>
          <LanguageSwitcher />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
          <div className="w-full aspect-square max-w-sm bg-muted rounded-xl border-2 border-dashed border-primary flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/5" />
            <QrCode className="w-16 h-16 text-muted-foreground opacity-50" />
            <div className="absolute inset-x-0 h-1 bg-primary animate-[scan_2s_ease-in-out_infinite]" />
          </div>
          
          <div className="space-y-4 w-full max-w-sm">
            <Button 
              className="w-full text-lg h-14" 
              onClick={handleDemo}
              disabled={scanMutation.isPending}
            >
              {scanMutation.isPending ? "Scanning..." : t("splash.button.demo")}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              For demo purposes, tap the button to simulate a successful scan.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-primary text-primary-foreground overflow-hidden relative">
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      
      {/* Decorative Zellige Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div 
          className="w-32 h-32 rounded-full bg-card flex items-center justify-center shadow-2xl mb-12"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 100 }}
        >
          <img src="/assets/logo.png" alt="Stadium Eats" className="w-24 h-24 object-contain" />
        </motion.div>

        <div className="h-48 w-full max-w-sm relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center text-center space-y-4"
            >
              {(() => {
                const Icon = steps[step].icon;
                return (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center shadow-lg">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{t(steps[step].title)}</h2>
                      <p className="text-primary-foreground/80">{t(steps[step].desc)}</p>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex gap-2 mb-12">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === step ? 'w-6 bg-accent' : 'bg-primary-foreground/30'}`}
            />
          ))}
        </div>

        <div className="w-full max-w-sm">
          {step < steps.length - 1 ? (
            <Button 
              size="lg" 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg h-14"
              onClick={() => setStep(s => s + 1)}
            >
              Next <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          ) : (
            <Button 
              size="lg" 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg h-14 shadow-lg shadow-accent/20"
              onClick={() => setShowScanner(true)}
            >
              {t("splash.button.scan")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
