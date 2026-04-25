import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { useAppStore } from "@/lib/store";
import { useAdminLogin } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function AdminLoginPage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { setAdminId } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useAdminLogin({
    mutation: {
      onSuccess: (data) => {
        setAdminId(data.stadiumId);
        toast.success(`Welcome back, Admin!`);
        setLocation("/admin/dashboard");
      },
      onError: () => {
        toast.error("Invalid credentials");
      }
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    loginMutation.mutate({ data: { email, password } });
  };

  const handleDemoLogin = () => {
    setEmail("admin@stadiumeats.ma");
    setPassword("admin2030");
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background max-w-md mx-auto relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-8 text-primary">
          <Shield className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-bold mb-8 text-center">{t("admin.login.title")}</h1>
        
        <form onSubmit={handleLogin} className="space-y-6 w-full">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
              placeholder="admin@stadiumeats.ma"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="h-12"
              placeholder="••••••••"
            />
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-14 text-lg font-bold rounded-xl shadow-lg hover-elevate"
              disabled={!email || !password || loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </div>
          
          <div className="mt-6 flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 p-4 rounded-xl cursor-pointer hover:bg-muted/80 transition-colors" onClick={handleDemoLogin}>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-primary" />
              <span className="font-bold text-foreground">Demo Credentials (Tap to fill)</span>
            </div>
            <span>Email: admin@stadiumeats.ma</span>
            <span>Password: admin2030</span>
          </div>
        </form>
      </div>
    </div>
  );
}
