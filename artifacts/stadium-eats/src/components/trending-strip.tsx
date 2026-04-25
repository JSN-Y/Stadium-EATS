import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { useGetTrendingItems, getGetTrendingItemsQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Flame, ChevronRight } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function TrendingStrip() {
  const { t } = useTranslation();
  const fanSessionId = useAppStore(state => state.fanSessionId);
  const stadiumId = "stadium-casa";
  const { data: trendingItems, isLoading } = useGetTrendingItems(stadiumId, undefined, {
    query: {
      enabled: true,
      queryKey: getGetTrendingItemsQueryKey(stadiumId),
    }
  });

  if (isLoading || !trendingItems || trendingItems.length === 0) {
    return null;
  }

  return (
    <div className="py-4">
      <div className="px-4 flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Flame className="w-5 h-5 text-destructive" fill="currentColor" />
          {t("home.trending")}
        </h2>
      </div>
      
      <div className="overflow-x-auto pb-4 px-4 scrollbar-hide">
        <div className="flex gap-4 w-max">
          {trendingItems.map((item, i) => (
            <Link key={`${item.menuItemId}-${i}`} href={`/stand/${item.standId}`}>
              <motion.div 
                className="w-40 bg-card rounded-xl overflow-hidden border shadow-sm flex flex-col"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="aspect-square bg-muted relative">
                  <img 
                    src={item.imageUrl.startsWith('/') ? item.imageUrl : `/assets/menu/${item.name.toLowerCase().includes('burger') ? 'burger' : 'tagine'}.png`} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/assets/menu/tagine.png";
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm text-xs font-bold px-1.5 py-0.5 rounded text-foreground">
                    {item.priceMad} MAD
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{item.standName}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
