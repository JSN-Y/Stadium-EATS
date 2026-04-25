import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { useGetSession, useListStands, Stand, getGetSessionQueryKey, getListStandsQueryKey } from "@workspace/api-client-react";
import { AppShell } from "@/components/layout/app-shell";
import { LiveMatchTicker } from "@/components/live-match-ticker";
import { TrendingStrip } from "@/components/trending-strip";
import { StandCard } from "@/components/stand-card";
import { LanguageSwitcher } from "@/components/language-switcher";
import { FeedTickerToast } from "@/components/feed-ticker-toast";
import { Button } from "@/components/ui/button";
import { Filter, ArrowDownUp, MapPin } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const CATEGORIES = ["All", "Burgers", "Pizza", "Moroccan", "Drinks", "Snacks", "Desserts"];

export default function HomePage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const fanSessionId = useAppStore(state => state.fanSessionId);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"rating" | "wait">("rating");
  
  const { data: session, isLoading: sessionLoading } = useGetSession(fanSessionId || "", {
    query: { enabled: !!fanSessionId, queryKey: getGetSessionQueryKey(fanSessionId || "") }
  });

  const stadiumId = session?.stadiumId || "stadium-casa";

  const standsParams = { category: selectedCategory === "All" ? undefined : selectedCategory };
  const { data: stands, isLoading: standsLoading } = useListStands(stadiumId, 
    standsParams,
    { query: { enabled: !!stadiumId, queryKey: getListStandsQueryKey(stadiumId, standsParams) } }
  );

  useEffect(() => {
    if (!fanSessionId) {
      setLocation("/");
    }
  }, [fanSessionId, setLocation]);

  if (sessionLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const sortedStands = [...(stands || [])].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    return a.waitTimeMinutes - b.waitTimeMinutes;
  });

  return (
    <AppShell>
      <FeedTickerToast stadiumId={stadiumId} />
      
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
              {t("home.welcome")} {session?.stadiumName || "Stadium"}
            </span>
            <div className="flex items-center gap-1 font-bold text-sm">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {t("home.section")} {session?.section || "A"} • {t("home.seat")} {session?.seat || "1"}
            </div>
          </div>
          <LanguageSwitcher />
        </div>
        <LiveMatchTicker stadiumId={stadiumId} />
      </div>

      <TrendingStrip />

      <div className="px-4 py-2 flex items-center justify-between sticky top-[120px] z-30 bg-background/90 backdrop-blur-md">
        <h2 className="text-xl font-bold">{t("home.all_stands")}</h2>
        <Button variant="outline" size="sm" onClick={() => setSortBy(s => s === "rating" ? "wait" : "rating")} className="h-8 text-xs font-semibold rounded-full">
          <ArrowDownUp className="w-3.5 h-3.5 mr-1" />
          {sortBy === "rating" ? "Top Rated" : "Fastest"}
        </Button>
      </div>

      <ScrollArea className="w-full whitespace-nowrap px-4 py-2">
        <div className="flex w-max space-x-2">
          {CATEGORIES.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "secondary"}
              className="rounded-full h-8 px-4 text-xs font-bold"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === "All" ? t("home.all_stands") : cat}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>

      <div className="p-4 space-y-4">
        {standsLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
          ))
        ) : (
          <AnimatePresence>
            {sortedStands.map((stand, i) => (
              <motion.div
                key={stand.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <StandCard stand={stand} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </AppShell>
  );
}
