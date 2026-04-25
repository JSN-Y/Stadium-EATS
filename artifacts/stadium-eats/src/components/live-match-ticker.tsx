import { useGetLiveMatch, getGetLiveMatchQueryKey } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";

export function LiveMatchTicker({ stadiumId }: { stadiumId: string }) {
  const { data: match, isLoading } = useGetLiveMatch(stadiumId, {
    query: {
      enabled: !!stadiumId,
      refetchInterval: 15000,
      queryKey: getGetLiveMatchQueryKey(stadiumId),
    }
  });

  if (isLoading || !match) {
    return (
      <div className="bg-primary text-primary-foreground p-3 flex items-center justify-center h-14 animate-pulse">
        <div className="w-4 h-4 rounded-full bg-primary-foreground/30 mr-2" />
        <div className="h-4 bg-primary-foreground/30 rounded w-32" />
      </div>
    );
  }

  const isLive = match.status === "first_half" || match.status === "second_half";
  const isHalftime = match.status === "halftime";

  return (
    <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between shadow-md relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '12px 12px' }} />
      
      <div className="flex items-center gap-2 relative z-10">
        {isLive && (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Activity className="w-4 h-4 text-accent" />
          </motion.div>
        )}
        <span className="font-mono font-bold text-sm bg-background/20 px-2 py-0.5 rounded text-accent">
          {match.minute}'
        </span>
      </div>
      
      <div className="flex items-center gap-4 relative z-10 font-bold text-lg">
        <span className="truncate max-w-[80px] text-right">{match.homeTeam}</span>
        <div className="bg-background/20 px-3 py-1 rounded-lg tabular-nums tracking-widest text-xl text-accent shadow-inner">
          {match.homeScore} - {match.awayScore}
        </div>
        <span className="truncate max-w-[80px]">{match.awayTeam}</span>
      </div>
      
      <div className="text-xs font-semibold uppercase tracking-wider relative z-10 opacity-80">
        {isHalftime ? "HT" : isLive ? "LIVE" : match.status.replace("_", " ")}
      </div>
    </div>
  );
}
