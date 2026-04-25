import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";
import { useAppStore } from "@/lib/store";
import { useCreateOrder, useGetSession, getGetSessionQueryKey } from "@workspace/api-client-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, CreditCard, Apple, Trash2, Clock, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export default function CartPage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { cart, removeFromCart, updateQuantity, clearCart, fanSessionId } = useAppStore();
  
  const { data: session } = useGetSession(fanSessionId || "", {
    query: { enabled: !!fanSessionId, queryKey: getGetSessionQueryKey(fanSessionId || "") }
  });

  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple_pay" | "google_pay">("card");
  const [scheduleForLater, setScheduleForLater] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("");

  const subtotal = cart.items.reduce((sum, item) => sum + (item.priceMad * item.quantity), 0);
  const deliveryFee = 15; // Hardcoded for demo
  const total = subtotal + deliveryFee;

  const createOrder = useCreateOrder({
    mutation: {
      onSuccess: (data) => {
        clearCart();
        toast.success("Order placed successfully!");
        setLocation(`/order/${data.id}`);
      },
      onError: (err) => {
        toast.error("Failed to place order");
        console.error(err);
      }
    }
  });

  const handleCheckout = () => {
    if (!fanSessionId || !cart.standId || cart.items.length === 0) return;
    
    createOrder.mutate({
      data: {
        sessionId: fanSessionId,
        standId: cart.standId,
        items: cart.items.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
        paymentMethod,
        ...(scheduleForLater && scheduledTime ? { scheduledFor: new Date(Date.now() + parseInt(scheduledTime) * 60000).toISOString() } : {})
      }
    });
  };

  const getFutureTimes = () => {
    const times = [];
    for (let i = 15; i <= 90; i += 15) {
      times.push({ value: i.toString(), label: `In ${i} mins` });
    }
    return times;
  };

  return (
    <AppShell>
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/home")} className="mr-2">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">{t("cart.title")}</h1>
          {cart.items.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearCart} className="ml-auto text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {cart.items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 mt-20">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
            <ShoppingCart className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold">{t("cart.empty")}</h2>
          <Button onClick={() => setLocation("/home")}>Browse Stands</Button>
        </div>
      ) : (
        <div className="p-4 space-y-6 pb-32">
          {/* Items */}
          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
            {cart.items.map((item, i) => (
              <div key={item.menuItemId} className={`p-4 flex gap-4 ${i !== cart.items.length - 1 ? 'border-b' : ''}`}>
                <div className="w-16 h-16 bg-muted rounded-lg shrink-0 overflow-hidden">
                  <img 
                    src={item.imageUrl?.startsWith('/') ? item.imageUrl : `/assets/menu/${item.name.toLowerCase().includes('burger') ? 'burger' : 'tagine'}.png`} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/assets/menu/tagine.png";
                    }}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-sm leading-tight pr-2">{item.name}</h3>
                    <span className="font-bold text-sm whitespace-nowrap">{item.priceMad * item.quantity} MAD</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center bg-secondary rounded-full overflow-hidden border">
                      <button 
                        onClick={() => item.quantity === 1 ? removeFromCart(item.menuItemId) : updateQuantity(item.menuItemId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors text-primary"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Location */}
          <div className="bg-card rounded-2xl border shadow-sm p-4">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {t("cart.destination")}
            </h3>
            <div className="bg-muted/50 rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                {session?.section || "A"}
              </div>
              <div>
                <p className="font-semibold">{session?.stadiumName || "Stadium"}</p>
                <p className="text-sm text-muted-foreground">Section {session?.section} • Row {session?.row} • Seat {session?.seat}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 italic text-center">
              Your order will be delivered directly to your seat.
            </p>
          </div>

          {/* Schedule */}
          <div className="bg-card rounded-2xl border shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                {t("cart.schedule")}
              </h3>
              <Switch checked={scheduleForLater} onCheckedChange={setScheduleForLater} />
            </div>
            
            <AnimatePresence>
              {scheduleForLater && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2">
                    <Select value={scheduledTime} onValueChange={setScheduledTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select delivery time" />
                      </SelectTrigger>
                      <SelectContent>
                        {getFutureTimes().map(time => (
                          <SelectItem key={time.value} value={time.value}>{time.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Payment */}
          <div className="bg-card rounded-2xl border shadow-sm p-4">
            <h3 className="font-bold mb-3">{t("cart.payment_method")}</h3>
            <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)} className="space-y-2">
              <div className="flex items-center space-x-2 border rounded-xl p-3 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex-1 flex items-center gap-2 cursor-pointer">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                  Credit / Debit Card
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-xl p-3 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="apple_pay" id="apple" />
                <Label htmlFor="apple" className="flex-1 flex items-center gap-2 cursor-pointer">
                  <Apple className="w-5 h-5" />
                  Apple Pay
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Summary */}
          <div className="bg-card rounded-2xl border shadow-sm p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("cart.subtotal")}</span>
              <span className="font-medium">{subtotal} MAD</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("cart.delivery_fee")}</span>
              <span className="font-medium">{deliveryFee} MAD</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
              <span>{t("cart.total")}</span>
              <span className="text-primary">{total} MAD</span>
            </div>
          </div>
        </div>
      )}

      {cart.items.length > 0 && (
        <div className="fixed bottom-[64px] left-0 right-0 p-4 bg-background/90 backdrop-blur-md border-t z-40 max-w-md mx-auto">
          <Button 
            className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg hover-elevate flex justify-between px-6"
            onClick={handleCheckout}
            disabled={createOrder.isPending || (scheduleForLater && !scheduledTime)}
          >
            <span>{createOrder.isPending ? "Processing..." : t("cart.checkout")}</span>
            <span>{total} MAD</span>
          </Button>
        </div>
      )}
    </AppShell>
  );
}

// Icon fallback
function ShoppingCart(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>;
}
