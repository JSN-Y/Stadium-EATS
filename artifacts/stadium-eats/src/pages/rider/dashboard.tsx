import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { useAppStore } from "@/lib/store";
import { useGetRiderStats, useGetRiderOrders, useUpdateOrderStatus, OrderStatus, Order, getGetRiderStatsQueryKey, getGetRiderOrdersQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { MapPin, Package, Clock, CheckCircle2, ChevronRight, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function RiderDashboardPage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { riderId, setRiderId } = useAppStore();

  const { data: stats } = useGetRiderStats(riderId || "", {
    query: {
      enabled: !!riderId,
      refetchInterval: 10000,
      queryKey: getGetRiderStatsQueryKey(riderId || "")
    }
  });

  const { data: orders, isLoading } = useGetRiderOrders(riderId || "", {
    query: {
      enabled: !!riderId,
      refetchInterval: 5000,
      queryKey: getGetRiderOrdersQueryKey(riderId || "")
    }
  });

  const updateStatusMutation = useUpdateOrderStatus();

  useEffect(() => {
    if (!riderId) {
      setLocation("/rider");
    }
  }, [riderId, setLocation]);

  const handleLogout = () => {
    setRiderId(null);
  };

  const handleUpdateStatus = (orderId: string, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus;
    
    switch (currentStatus) {
      case "preparing":
      case "received":
        nextStatus = "on_the_way";
        break;
      case "on_the_way":
        nextStatus = "delivered";
        break;
      default:
        return;
    }
    
    updateStatusMutation.mutate({
      orderId,
      data: { status: nextStatus, riderId: riderId ?? undefined }
    }, {
      onSuccess: () => {
        toast.success(`Order marked as ${t(`order.status.${nextStatus}`)}`);
      },
      onError: () => {
        toast.error("Failed to update status");
      }
    });
  };

  if (!riderId) return null;

  const activeOrders = orders?.filter(o => o.status !== "delivered" && o.status !== "cancelled") || [];
  
  // Group by stand for efficiency
  const groupedOrders = activeOrders.reduce((acc, order) => {
    if (!acc[order.standId]) {
      acc[order.standId] = {
        standName: order.standName,
        orders: []
      };
    }
    acc[order.standId].orders.push(order);
    return acc;
  }, {} as Record<string, { standName: string, orders: Order[] }>);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background max-w-md mx-auto relative pb-20">
      <div className="bg-card border-b p-4 sticky top-0 z-40">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-primary">{t("rider.dashboard.title")}</h1>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
        </div>
        
        {stats && (
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-muted rounded-xl p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">{t("rider.dashboard.active_orders")}</p>
              <p className="text-xl font-bold text-accent">{stats.activeOrders}</p>
            </div>
            <div className="bg-muted rounded-xl p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">{t("rider.dashboard.delivered_today")}</p>
              <p className="text-xl font-bold text-primary">{stats.deliveredToday}</p>
            </div>
            <div className="bg-muted rounded-xl p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">{t("rider.dashboard.avg_time")}</p>
              <p className="text-xl font-bold">{Math.round(stats.avgDeliveryMinutes)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-6">
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : activeOrders.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center justify-center text-muted-foreground">
            <CheckCircle2 className="w-16 h-16 mb-4 text-green-500/50" />
            <h2 className="text-xl font-bold text-foreground mb-2">You're all caught up!</h2>
            <p>Wait for new orders to be assigned to you.</p>
          </div>
        ) : (
          Object.values(groupedOrders).map((group) => (
            <div key={group.standName} className="space-y-3">
              <h2 className="font-bold flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Pickup from {group.standName}
              </h2>
              
              <div className="space-y-3">
                {group.orders.map(order => (
                  <motion.div 
                    key={order.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card rounded-2xl border shadow-sm overflow-hidden"
                  >
                    <div className="p-4 border-b bg-muted/20">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs font-bold text-muted-foreground">#{order.id.slice(0, 8)}</span>
                          <h3 className="font-bold text-lg leading-tight">Deliver to Sect {order.seat.section}</h3>
                          <p className="text-sm text-muted-foreground">Row {order.seat.row} • Seat {order.seat.seat}</p>
                        </div>
                        <div className="bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap">
                          {order.etaMinutes} min left
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs bg-secondary px-2 py-1 rounded font-medium">
                          {order.items.length} items
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                          {order.fanName || "Fan"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-card flex justify-between items-center gap-3">
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Current Status</p>
                        <p className="text-sm font-bold text-foreground">{t(`order.status.${order.status}`)}</p>
                      </div>
                      
                      <Button 
                        className={`h-12 px-6 rounded-xl font-bold shadow-md hover-elevate ${
                          order.status === 'on_the_way' 
                            ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                            : 'bg-accent hover:bg-accent/90 text-accent-foreground'
                        }`}
                        onClick={() => handleUpdateStatus(order.id, order.status)}
                        disabled={updateStatusMutation.isPending}
                      >
                        {order.status === 'on_the_way' ? t("rider.action.delivered") : t("rider.action.en_route")}
                        <ChevronRight className="w-5 h-5 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
