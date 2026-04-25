import { useEffect, useState } from "react";
import { useGetAdminOrders, useUpdateOrderStatus, useAssignOrderRider, OrderStatus, getGetAdminOrdersQueryKey } from "@workspace/api-client-react";
import { useAppStore } from "@/lib/store";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { toast } from "sonner";
import { MapPin, User, ChevronRight, Package, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminOrdersPage() {
  const { adminId } = useAppStore();
  const stadiumId = adminId || "stadium-casa";
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const ordersParams = { status: statusFilter === "all" ? undefined : (statusFilter as OrderStatus) };
  const { data: orders, isLoading, refetch } = useGetAdminOrders(
    stadiumId,
    ordersParams,
    {
      query: {
        refetchInterval: 5000,
        queryKey: getGetAdminOrdersQueryKey(stadiumId, ordersParams)
      }
    }
  );

  const updateStatusMutation = useUpdateOrderStatus();
  const assignRiderMutation = useAssignOrderRider();

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    updateStatusMutation.mutate({
      orderId,
      data: { status: newStatus }
    }, {
      onSuccess: () => {
        toast.success(`Order status updated to ${newStatus}`);
        refetch();
      }
    });
  };

  const filteredOrders = orders?.filter(o => 
    search ? o.id.toLowerCase().includes(search.toLowerCase()) || 
             o.standName.toLowerCase().includes(search.toLowerCase()) ||
             o.seat.section.toLowerCase().includes(search.toLowerCase())
           : true
  );

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Live Orders Queue</h2>
            <p className="text-muted-foreground">Manage and monitor all active orders.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Active Statuses</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="on_the_way">On the Way</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredOrders?.map(order => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Left: Info */}
                    <div className="p-4 md:w-1/3 bg-muted/20 border-r md:border-b-0 border-b">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono text-muted-foreground">#{order.id.slice(0, 8)}</span>
                        <span className="text-xs text-muted-foreground">{format(new Date(order.createdAt), "h:mm a")}</span>
                      </div>
                      <h3 className="font-bold text-lg mb-1">{order.standName}</h3>
                      <p className="text-sm font-bold text-primary mb-4">{order.totalMad} MAD • {order.items.length} items</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>Sect {order.seat.section} • Row {order.seat.row} • Seat {order.seat.seat}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>{order.fanName || "Anonymous Fan"}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Middle: Items & Rider */}
                    <div className="p-4 md:w-1/3 border-r md:border-b-0 border-b flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2">Items</h4>
                        <div className="space-y-1">
                          {order.items.map((item, i) => (
                            <div key={i} className="text-sm flex justify-between">
                              <span><span className="font-bold">{item.quantity}x</span> {item.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2">Assigned Rider</h4>
                        {order.riderName ? (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{order.riderName}</span>
                            <Button variant="outline" size="sm" className="h-7 text-xs">Reassign</Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground italic">Unassigned</span>
                            <Button variant="secondary" size="sm" className="h-7 text-xs">Assign</Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Right: Status */}
                    <div className="p-4 md:w-1/3 flex flex-col justify-between bg-card">
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2">Current Status</h4>
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant={order.status === 'delivered' ? 'default' : order.status === 'cancelled' ? 'destructive' : 'secondary'} className="text-sm px-3 py-1">
                            {order.status.replace("_", " ")}
                          </Badge>
                          {order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <span className="text-sm font-bold text-accent">ETA: {order.etaMinutes}m</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-auto">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase">Force Update Status</h4>
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleUpdateStatus(order.id, 'preparing')}
                            disabled={order.status === 'preparing' || updateStatusMutation.isPending}
                          >
                            Prep
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleUpdateStatus(order.id, 'on_the_way')}
                            disabled={order.status === 'on_the_way' || updateStatusMutation.isPending}
                          >
                            Route
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleUpdateStatus(order.id, 'delivered')}
                            disabled={order.status === 'delivered' || updateStatusMutation.isPending}
                          >
                            Deliv
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                            disabled={order.status === 'cancelled' || updateStatusMutation.isPending}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredOrders?.length === 0 && (
              <div className="text-center py-12 flex flex-col items-center justify-center text-muted-foreground bg-card border rounded-xl">
                <Package className="w-12 h-12 mb-4 opacity-20" />
                <p>No orders found matching the filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
