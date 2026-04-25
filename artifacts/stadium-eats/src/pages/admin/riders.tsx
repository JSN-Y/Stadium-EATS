import { useState } from "react";
import { useGetAdminRiders, RiderStatus, getGetAdminRidersQueryKey } from "@workspace/api-client-react";
import { useAppStore } from "@/lib/store";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bike, CheckCircle2, Clock, MapPin, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function AdminRidersPage() {
  const { adminId } = useAppStore();
  const stadiumId = adminId || "stadium-casa";
  const [search, setSearch] = useState("");
  
  const { data: riders, isLoading } = useGetAdminRiders(
    stadiumId,
    {
      query: {
        refetchInterval: 10000,
        queryKey: getGetAdminRidersQueryKey(stadiumId)
      }
    }
  );

  const getStatusColor = (status: RiderStatus) => {
    switch (status) {
      case "available": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "busy": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "offline": return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: RiderStatus) => {
    switch (status) {
      case "available": return <CheckCircle2 className="w-4 h-4" />;
      case "busy": return <Clock className="w-4 h-4" />;
      case "offline": return <XCircle className="w-4 h-4" />;
    }
  };

  const filteredRiders = riders?.filter(r => 
    search ? r.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Riders Management</h2>
            <p className="text-muted-foreground">Monitor rider statuses and active deliveries.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search riders..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {filteredRiders?.map(rider => (
              <Card key={rider.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-4 border-b flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                        {rider.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold">{rider.name}</h3>
                        <p className="text-xs text-muted-foreground font-mono">#{rider.id.slice(0, 6)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/20 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Status</span>
                      <Badge variant="outline" className={`flex items-center gap-1.5 font-semibold ${getStatusColor(rider.status)}`}>
                        {getStatusIcon(rider.status)}
                        {rider.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Active Orders</span>
                      <div className="flex items-center gap-1.5 font-bold">
                        <Bike className="w-4 h-4 text-primary" />
                        <span>{rider.activeOrders}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredRiders?.length === 0 && (
              <div className="col-span-full text-center py-12 flex flex-col items-center justify-center text-muted-foreground bg-card border rounded-xl">
                <Bike className="w-12 h-12 mb-4 opacity-20" />
                <p>No riders found matching the search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
