import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { useAppStore } from "@/lib/store";
import { useRiderLogin } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Bike, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function RiderLoginPage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { setRiderId } = useAppStore();
  const [pin, setPin] = useState("");

  const loginMutation = useRiderLogin({
    mutation: {
      onSuccess: (data) => {
        setRiderId(data.id);
        toast.success(`Welcome back, ${data.name}!`);
        setLocation("/rider/dashboard");
      },
      onError: () => {
        toast.error("Invalid PIN");
        setPin("");
      }
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) return;
    
    loginMutation.mutate({ data: { pin } });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background max-w-md mx-auto relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-8 text-accent">
          <Bike className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">{t("rider.login.title")}</h1>
        <p className="text-muted-foreground mb-12">{t("rider.login.pin")}</p>
        
        <form onSubmit={handleLogin} className="space-y-12 w-full flex flex-col items-center">
          <InputOTP 
            maxLength={4} 
            value={pin} 
            onChange={setPin}
            disabled={loginMutation.isPending}
            className="gap-4"
          >
            <InputOTPGroup className="gap-4">
              <InputOTPSlot index={0} className="w-16 h-16 text-2xl font-bold rounded-xl border-2" />
              <InputOTPSlot index={1} className="w-16 h-16 text-2xl font-bold rounded-xl border-2" />
              <InputOTPSlot index={2} className="w-16 h-16 text-2xl font-bold rounded-xl border-2" />
              <InputOTPSlot index={3} className="w-16 h-16 text-2xl font-bold rounded-xl border-2" />
            </InputOTPGroup>
          </InputOTP>
          
          <div className="w-full">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 hover-elevate"
              disabled={pin.length !== 4 || loginMutation.isPending}
            >
              {loginMutation.isPending ? "Verifying..." : t("rider.login.button")}
            </Button>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 text-accent" />
              <span>Demo PIN: <strong>1234</strong></span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
