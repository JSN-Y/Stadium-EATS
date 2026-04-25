import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Clock, Star, AlertCircle } from "lucide-react";
import { Stand, StandStatus } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";

interface StandCardProps {
  stand: Stand;
}

export function StandCard({ stand }: StandCardProps) {
  const { t } = useTranslation();
  
  const getStatusColor = (status: StandStatus) => {
    switch (status) {
      case "open": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "busy": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "temp_closed": return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "closed": return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getStatusText = (status: StandStatus) => {
    switch (status) {
      case "open": return t("stand.status.open");
      case "busy": return t("stand.status.busy");
      case "temp_closed": return t("stand.status.temp_closed");
      case "closed": return t("stand.status.closed");
      default: return status;
    }
  };

  const imageSrc = stand.imageUrl.startsWith('/') ? stand.imageUrl : `/assets/stands/${stand.category.toLowerCase().includes('burger') ? 'burgers' : stand.category.toLowerCase().includes('pizza') ? 'pizza' : 'moroccan'}.png`;

  return (
    <Link href={`/stand/${stand.id}`}>
      <div className="group relative bg-card rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 hover-elevate">
        <div className="aspect-[21/9] w-full overflow-hidden relative bg-muted">
          <img 
            src={imageSrc} 
            alt={stand.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/assets/stands/moroccan.png";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm font-semibold">
              {stand.category}
            </Badge>
            {stand.isHalalOnly && (
              <Badge variant="secondary" className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                Halal
              </Badge>
            )}
          </div>
          
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
            <h3 className="text-white font-bold text-lg leading-tight truncate pr-4">{stand.name}</h3>
            <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold shrink-0 text-foreground">
              <Star className="w-3 h-3 fill-accent text-accent" />
              {stand.rating.toFixed(1)}
            </div>
          </div>
        </div>
        
        <div className="p-4 flex items-center justify-between">
          <Badge variant="outline" className={`font-semibold ${getStatusColor(stand.status)}`}>
            {getStatusText(stand.status)}
          </Badge>
          
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            {stand.status === "open" || stand.status === "busy" ? (
              <>
                <Clock className="w-4 h-4 text-primary" />
                <span>{t("stand.wait_time", { minutes: stand.waitTimeMinutes })}</span>
              </>
            ) : stand.reopenAt ? (
              <>
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span className="text-orange-600">{t("stand.reopens_at", { time: new Date(stand.reopenAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) })}</span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
