import { useState } from "react";
import { useGetOrderHeatmap, getGetOrderHeatmapQueryKey } from "@workspace/api-client-react";
import { useAppStore } from "@/lib/store";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AdminHeatmapPage() {
  const { adminId } = useAppStore();
  const stadiumId = adminId || "stadium-casa";
  const { data: heatmap, isLoading } = useGetOrderHeatmap(stadiumId, {
    query: {
      refetchInterval: 10000,
      queryKey: getGetOrderHeatmapQueryKey(stadiumId)
    }
  });

  const maxCount = heatmap ? Math.max(...heatmap.map(cell => cell.count), 1) : 1;

  const getHeatColor = (count: number) => {
    if (count === 0) return "bg-muted/30 border-muted";
    
    const intensity = count / maxCount;
    if (intensity < 0.2) return "bg-green-500/20 border-green-500/40 text-green-700";
    if (intensity < 0.5) return "bg-yellow-500/40 border-yellow-500/60 text-yellow-800";
    if (intensity < 0.8) return "bg-orange-500/60 border-orange-500/80 text-orange-900 font-bold";
    return "bg-destructive border-destructive text-destructive-foreground font-bold shadow-[0_0_15px_rgba(255,0,0,0.5)]";
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Section Heatmap</h2>
          <p className="text-muted-foreground">Live order density across the stadium bowl.</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <Card className="border-2">
            <CardContent className="p-8">
              <div className="relative w-full max-w-2xl mx-auto aspect-video border-4 border-muted rounded-[100px] p-8 flex items-center justify-center bg-card shadow-inner">
                {/* Pitch */}
                <div className="absolute inset-x-24 inset-y-16 border-2 border-green-500/30 rounded-xl bg-green-500/5 flex items-center justify-center">
                  <div className="w-16 h-16 border-2 border-green-500/30 rounded-full" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-24 border-2 border-l-0 border-green-500/30" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-24 border-2 border-r-0 border-green-500/30" />
                  <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-green-500/30" />
                </div>
                
                {/* Sections (simplified ring) */}
                <div className="absolute inset-0 m-4 flex flex-wrap content-around justify-between pointer-events-none">
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((sectionName, i) => {
                    const cell = heatmap?.find(c => c.section === sectionName);
                    const count = cell?.count || 0;
                    
                    // Simple positioning around the edge
                    const angle = (i / 10) * Math.PI * 2;
                    const radiusX = 45; // %
                    const radiusY = 35; // %
                    const left = 50 + radiusX * Math.cos(angle);
                    const top = 50 + radiusY * Math.sin(angle);
                    
                    return (
                      <div 
                        key={sectionName}
                        className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-lg border-2 flex items-center justify-center pointer-events-auto transition-colors duration-500 ${getHeatColor(count)}`}
                        style={{ left: `${left}%`, top: `${top}%` }}
                        title={`Section ${sectionName}: ${count} orders`}
                      >
                        <div className="text-center">
                          <div className="text-[10px] font-bold opacity-80 leading-none">{sectionName}</div>
                          {count > 0 && <div className="text-sm leading-none">{count}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-muted/30 border border-muted" />
                  <span className="text-sm text-muted-foreground">0</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/40" />
                  <span className="text-sm text-muted-foreground">Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-500/40 border border-yellow-500/60" />
                  <span className="text-sm text-muted-foreground">Med</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-orange-500/60 border border-orange-500/80" />
                  <span className="text-sm text-muted-foreground">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-destructive border border-destructive" />
                  <span className="text-sm text-muted-foreground">Max</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminShell>
  );
}
