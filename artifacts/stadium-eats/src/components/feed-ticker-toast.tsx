import { useEffect, useState } from "react";
import { useGetStadiumFeed, getGetStadiumFeedQueryKey } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils } from "lucide-react";

export function FeedTickerToast({ stadiumId }: { stadiumId: string }) {
  const { data: feed } = useGetStadiumFeed(stadiumId, {
    query: {
      enabled: !!stadiumId,
      refetchInterval: 10000,
      queryKey: getGetStadiumFeedQueryKey(stadiumId),
    }
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!feed || feed.length === 0) return;
    
    // Show a toast every 15 seconds
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % feed.length);
      setIsVisible(true);
      
      // Hide after 4 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    }, 15000);

    return () => clearInterval(interval);
  }, [feed]);

  if (!feed || feed.length === 0) return null;

  const currentEvent = feed[currentIndex];

  return (
    <div className="fixed top-36 left-4 right-4 z-50 pointer-events-none flex justify-center">
      <AnimatePresence>
        {isVisible && currentEvent && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="bg-card text-card-foreground border shadow-lg rounded-full px-4 py-2.5 flex items-center gap-3 max-w-sm w-full mx-auto"
          >
            <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
              <Utensils className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 truncate">
              <p className="text-xs font-medium truncate">
                Someone in <span className="font-bold text-primary">Section {currentEvent.section}</span> just ordered
              </p>
              <p className="text-sm font-bold truncate">{currentEvent.itemName}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
