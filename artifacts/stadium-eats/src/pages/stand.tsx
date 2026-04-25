import { useState, useEffect } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useGetStand, useGetStandMenu, getGetStandQueryKey, getGetStandMenuQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ChevronLeft, Clock, AlertCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MenuItemCard } from "@/components/menu-item-card";

export default function StandPage() {
  const [match, params] = useRoute("/stand/:standId");
  const standId = params?.standId || "";
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  
  const cartItems = useAppStore(state => state.cart.items);
  const cartStandId = useAppStore(state => state.cart.standId);
  const cartTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalMad = cartItems.reduce((acc, item) => acc + (item.quantity * item.priceMad), 0);

  const { data: stand, isLoading: standLoading } = useGetStand(standId, {
    query: { enabled: !!standId, queryKey: getGetStandQueryKey(standId) }
  });

  const { data: menu, isLoading: menuLoading } = useGetStandMenu(standId, {
    query: { enabled: !!standId, queryKey: getGetStandMenuQueryKey(standId) }
  });

  if (standLoading || menuLoading) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-background max-w-md mx-auto relative animate-pulse">
        <div className="h-64 bg-muted w-full" />
        <div className="p-4 space-y-4">
          <div className="h-8 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="space-y-4 mt-8">
            <div className="h-24 bg-muted rounded-xl w-full" />
            <div className="h-24 bg-muted rounded-xl w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!stand) return <div>Stand not found</div>;

  const isClosed = stand.status === "closed" || stand.status === "temp_closed";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-green-500 text-white border-green-600";
      case "busy": return "bg-yellow-500 text-white border-yellow-600";
      case "temp_closed": return "bg-orange-500 text-white border-orange-600";
      case "closed": return "bg-red-500 text-white border-red-600";
      default: return "bg-gray-500 text-white border-gray-600";
    }
  };

  const imageSrc = stand.imageUrl.startsWith('/') ? stand.imageUrl : `/assets/stands/${stand.category.toLowerCase().includes('burger') ? 'burgers' : stand.category.toLowerCase().includes('pizza') ? 'pizza' : 'moroccan'}.png`;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background max-w-md mx-auto relative pb-24">
      <div className="h-64 w-full relative bg-muted">
        <img 
          src={imageSrc} 
          alt={stand.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/assets/stands/moroccan.png";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
        
        <div className="absolute top-4 left-4">
          <Button 
            variant="secondary" 
            size="icon" 
            className="rounded-full bg-background/80 backdrop-blur-md hover:bg-background"
            onClick={() => setLocation("/home")}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={`${getStatusColor(stand.status)} shadow-sm border-none`}>
              {t(`stand.status.${stand.status}`)}
            </Badge>
            {stand.isHalalOnly && (
              <Badge variant="secondary" className="bg-primary/90 text-primary-foreground backdrop-blur-sm border-none">
                Halal
              </Badge>
            )}
          </div>
          <h1 className="text-white font-bold text-3xl leading-tight">{stand.name}</h1>
          <p className="text-white/80 text-sm mt-1">{stand.description}</p>
        </div>
      </div>

      <div className="bg-card p-4 border-b flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 text-sm font-medium">
          {!isClosed ? (
            <>
              <Clock className="w-4 h-4 text-primary" />
              <span>{t("stand.wait_time", { minutes: stand.waitTimeMinutes })}</span>
            </>
          ) : stand.reopenAt ? (
            <>
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <span className="text-orange-600">{t("stand.reopens_at", { time: new Date(stand.reopenAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) })}</span>
            </>
          ) : (
            <span className="text-destructive font-bold">{t("stand.status.closed")}</span>
          )}
        </div>
        
        <div className="flex items-center gap-1 font-bold text-sm bg-accent/10 text-accent px-2.5 py-1 rounded-full">
          ★ {stand.rating.toFixed(1)}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {menu?.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <MenuItemCard item={item} standId={stand.id} isStandClosed={isClosed} />
          </motion.div>
        ))}
      </div>

      {cartTotalItems > 0 && cartStandId === standId && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t z-50 max-w-md mx-auto"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
        >
          <Button 
            className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg hover-elevate flex justify-between px-6"
            onClick={() => setLocation("/cart")}
          >
            <div className="flex items-center gap-2 bg-primary-foreground/20 px-3 py-1 rounded-full text-sm">
              <span className="w-5 h-5 flex items-center justify-center bg-primary-foreground text-primary rounded-full text-xs">{cartTotalItems}</span>
              {t("cart.title")}
            </div>
            <span>{cartTotalMad} MAD</span>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
