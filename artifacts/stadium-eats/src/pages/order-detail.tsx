import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useTranslation } from "react-i18next";
import { useGetOrder, useRateOrder, getGetOrderQueryKey } from "@workspace/api-client-react";
import { AppShell } from "@/components/layout/app-shell";
import { OrderProgressBar } from "@/components/order-progress-bar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, Receipt, Star, Loader2 } from "lucide-react";
import { format } from "date-fns";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderDetailPage() {
  const [match, params] = useRoute("/order/:orderId");
  const orderId = params?.orderId || "";
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);

  const { data: order, isLoading } = useGetOrder(orderId, {
    query: {
      enabled: !!orderId,
      refetchInterval: 5000,
      queryKey: getGetOrderQueryKey(orderId)
    }
  });

  const rateMutation = useRateOrder();

  // Trigger confetti when order becomes delivered
  useEffect(() => {
    if (order?.status === "delivered" && !order.rating) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1A6B3A', '#C1272D', '#D4A843']
      });
    }
  }, [order?.status, order?.rating]);

  const handleRate = (value: number) => {
    setRating(value);
    rateMutation.mutate({ orderId, data: { rating: value } }, {
      onSuccess: () => {
        toast.success("Thanks for your feedback!");
      }
    });
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex-1 flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  if (!order) return <div>Order not found</div>;

  return (
    <AppShell>
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/orders")} className="mr-2">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Order #{order.id.slice(0, 6)}</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Status Card */}
        <div className="bg-card rounded-2xl border shadow-sm p-6 text-center hover-elevate">
          <h2 className="text-2xl font-bold text-primary mb-2">
            {t(`order.status.${order.status}`)}
          </h2>
          
          {order.status !== "delivered" && order.status !== "cancelled" && (
            <p className="text-muted-foreground font-medium">
              Estimated arrival: <span className="text-foreground font-bold">{order.etaMinutes} mins</span>
            </p>
          )}
          
          <div className="mt-6">
            <OrderProgressBar status={order.status} />
          </div>

          {order.status === "delivered" && !order.rating && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 pt-6 border-t"
            >
              <h3 className="font-bold mb-4">{t("orders.rate")}</h3>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    disabled={rateMutation.isPending}
                    className="p-2 transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star 
                      className={`w-8 h-8 ${rating >= star ? 'fill-accent text-accent' : 'text-muted-foreground'}`} 
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {order.rating && (
            <div className="mt-8 pt-6 border-t flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={`w-5 h-5 ${order.rating! >= star ? 'fill-accent text-accent' : 'text-muted-foreground opacity-50'}`} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Details Card */}
        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-muted/20">
            <div className="flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                Order Details
              </h3>
              <span className="text-sm text-muted-foreground">{format(new Date(order.createdAt), "h:mm a")}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">From {order.standName}</p>
          </div>
          
          <div className="p-4 space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="bg-secondary text-secondary-foreground font-bold w-6 h-6 rounded-md flex items-center justify-center text-xs">
                    {item.quantity}
                  </span>
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
                <span className="font-medium text-sm">{item.priceMad * item.quantity} MAD</span>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-muted/20 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{order.subtotalMad} MAD</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className="font-medium">{order.deliveryFeeMad} MAD</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
              <span>Total</span>
              <span className="text-primary">{order.totalMad} MAD</span>
            </div>
          </div>
        </div>

        {/* Delivery Location */}
        <div className="bg-card rounded-2xl border shadow-sm p-4">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Delivery Destination
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-lg">
              {order.seat.section}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Section {order.seat.section} • Row {order.seat.row} • Seat {order.seat.seat}</p>
            </div>
          </div>
          
          {order.riderName && (
            <div className="mt-4 pt-4 border-t flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold">
                {order.riderName.charAt(0)}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Your Rider</p>
                <p className="font-bold text-sm">{order.riderName}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
