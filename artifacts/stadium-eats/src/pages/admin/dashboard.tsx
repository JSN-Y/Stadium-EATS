import { useState, useEffect } from "react";
import { useGetAdminDashboard, useTriggerHalftimeMode, getGetAdminDashboardQueryKey } from "@workspace/api-client-react";
import { AdminShell } from "@/components/layout/admin-shell";
import { useAppStore } from "@/lib/store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Activity, CreditCard, ShoppingBag, Users, Zap } from "lucide-react";

export default function AdminDashboardPage() {
  const { adminId } = useAppStore();
  
  const stadiumId = adminId || "stadium-casa";
  const { data: dashboard, isLoading } = useGetAdminDashboard(stadiumId, {
    query: {
      enabled: !!stadiumId,
      refetchInterval: 15000,
      queryKey: getGetAdminDashboardQueryKey(stadiumId)
    }
  });

  const [halftimeActive, setHalftimeActive] = useState(false);
  const [halftimeDiscount, setHalftimeDiscount] = useState("10");
  const halftimeMutation = useTriggerHalftimeMode();

  const handleHalftimeToggle = (checked: boolean) => {
    setHalftimeActive(checked);
    halftimeMutation.mutate({
      stadiumId,
      data: {
        active: checked,
        discountPercent: parseInt(halftimeDiscount),
        message: checked ? `Halalftime special! ${halftimeDiscount}% off!` : undefined
      }
    }, {
      onSuccess: () => {
        toast.success(checked ? "Halftime mode activated!" : "Halftime mode deactivated");
      },
      onError: () => {
        setHalftimeActive(!checked);
        toast.error("Failed to update halftime mode");
      }
    });
  };

  if (isLoading || !dashboard) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">Live metrics for Stadium Eats operations.</p>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders Today</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.ordersToday}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.revenueTodayMad.toLocaleString()} MAD</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Riders</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.activeRiders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.avgDeliveryMinutes} min</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Main Chart */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Orders by Hour</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboard.ordersByHour}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="hour" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Halftime Controls & Top Items */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" fill="currentColor" />
                  Halftime Mode
                </CardTitle>
                <CardDescription>Trigger special promos and push notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="halftime-active" className="font-bold">Enable Halftime Mode</Label>
                  <Switch 
                    id="halftime-active" 
                    checked={halftimeActive}
                    onCheckedChange={handleHalftimeToggle}
                    disabled={halftimeMutation.isPending}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Global Discount %</Label>
                  <Select value={halftimeDiscount} onValueChange={setHalftimeDiscount} disabled={halftimeActive}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select discount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10% Off</SelectItem>
                      <SelectItem value="15">15% Off</SelectItem>
                      <SelectItem value="20">20% Off</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboard.topItems.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm leading-none">{item.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.standName}</p>
                      </div>
                      <div className="font-bold text-sm bg-muted px-2 py-1 rounded">
                        {item.count}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
