import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { useAppStore } from "@/lib/store";
import { useGetSession, getGetSessionQueryKey } from "@workspace/api-client-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Award, LogOut, Moon, Sun, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function ProfilePage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { fanSessionId, setFanSessionId, clearCart } = useAppStore();
  const { theme, setTheme } = useTheme();

  const { data: session, isLoading } = useGetSession(fanSessionId || "", {
    query: {
      enabled: !!fanSessionId,
      queryKey: getGetSessionQueryKey(fanSessionId || "")
    }
  });

  useEffect(() => {
    if (!fanSessionId) {
      setLocation("/");
    }
  }, [fanSessionId, setLocation]);

  const handleLogout = () => {
    setFanSessionId(null);
    clearCart();
    setLocation("/");
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="p-4 space-y-4 animate-pulse">
          <div className="h-32 bg-muted rounded-2xl w-full" />
          <div className="h-40 bg-muted rounded-2xl w-full" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-4 pb-20 space-y-6">
        <h1 className="text-2xl font-bold mb-2">{t("nav.profile")}</h1>
        
        {/* User Card */}
        <Card className="border shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{session?.fanName || "Fan"}</h2>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  Sect {session?.section} • Row {session?.row} • Seat {session?.seat}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t pt-6">
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Orders</p>
                <p className="text-2xl font-bold text-foreground">{session?.ordersCount || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Goal Points</p>
                <p className="text-2xl font-bold text-accent flex items-center justify-center gap-1">
                  {session?.goalPoints || 0}
                  <Award className="w-5 h-5" />
                </p>
              </div>
            </div>
            
            {((session?.ordersCount || 0) >= 3) && (
              <div className="mt-6 bg-accent/10 border border-accent/20 rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-accent-foreground">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-accent">Stadium Regular</h4>
                  <p className="text-xs text-muted-foreground">You unlock special promos!</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="border shadow-sm rounded-2xl">
          <CardContent className="p-0">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <Label className="font-bold text-base">Language</Label>
              </div>
              <LanguageSwitcher />
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
                <Label htmlFor="dark-mode" className="font-bold text-base">Dark Mode</Label>
              </div>
              <Switch 
                id="dark-mode" 
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </CardContent>
        </Card>

        <Button 
          variant="outline" 
          className="w-full h-14 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 font-bold"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          End Session & Exit
        </Button>
      </div>
    </AppShell>
  );
}
