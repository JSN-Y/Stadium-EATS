import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { AppShell } from "@/components/layout/app-shell";
import { useAppStore } from "@/lib/store";
import { useListSessionOrders, getListSessionOrdersQueryKey } from "@workspace/api-client-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderProgressBar } from "@/components/order-progress-bar";
import { ChevronRight, Package, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function OrdersPage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const fanSessionId = useAppStore(state => state.fanSessionId);

  const { data: orders, isLoading } = useListSessionOrders(fanSessionId || "", {
    query: {
      enabled: !!fanSessionId,
      refetchInterval: 5000,
      queryKey: getListSessionOrdersQueryKey(fanSessionId || "")
    }
  });

  useEffect(() => {
    if (!fanSessionId) {
      setLocation("/");
    }
  }, [fanSessionId, setLocation]);

  if (isLoading) {
    return (
      <AppShell>
        <div className="p-4 space-y-4">
          <div className="h-10 bg-muted rounded-xl w-full animate-pulse" />
          <div className="h-40 bg-muted rounded-2xl w-full animate-pulse" />
          <div className="h-40 bg-muted rounded-2xl w-full animate-pulse" />
        </div>
      </AppShell>
    );
  }

  const activeOrders = orders?.filter(o => o.status !== "delivered" && o.status !== "cancelled") || [];
  const pastOrders = orders?.filter(o => o.status === "delivered" || o.status === "cancelled") || [];

  return (
    <AppShell>
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">{t("orders.title")}</h1>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="active" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              {t("orders.active")} {activeOrders.length > 0 && <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">{activeOrders.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              {t("orders.history")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <AnimatePresence>
              {activeOrders.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center py-12 flex flex-col items-center justify-center text-muted-foreground"
                >
                  <Package className="w-12 h-12 mb-4 opacity-20" />
                  <p>{t("orders.no_active")}</p>
                </motion.div>
              ) : (
                activeOrders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setLocation(`/order/${order.id}`)}
                    className="bg-card rounded-2xl border shadow-sm p-4 cursor-pointer hover-elevate transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg leading-none mb-1">{order.standName}</h3>
                        <p className="text-xs text-muted-foreground">{order.items.length} items • {order.totalMad} MAD</p>
                      </div>
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                        {t("orders.eta", { minutes: order.etaMinutes })}
                      </div>
                    </div>
                    
                    <OrderProgressBar status={order.status} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="history" className="space-y-3">
            {pastOrders.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center justify-center text-muted-foreground">
                <Calendar className="w-12 h-12 mb-4 opacity-20" />
                <p>No past orders yet</p>
              </div>
            ) : (
              pastOrders.map(order => (
                <div
                  key={order.id}
                  onClick={() => setLocation(`/order/${order.id}`)}
                  className="bg-card rounded-xl border p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status === 'delivered' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{order.standName}</h4>
                      <p className="text-xs text-muted-foreground">{format(new Date(order.createdAt), "MMM d, h:mm a")} • {order.totalMad} MAD</p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-bold gap-2">
                    <span className={order.status === 'delivered' ? 'text-primary' : 'text-destructive'}>
                      {t(`order.status.${order.status}`)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
