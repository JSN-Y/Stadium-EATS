import { useState } from "react";
import { useListStands, useUpdateStandStatus, StandStatus, Stand } from "@workspace/api-client-react";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Store, Clock, Settings2 } from "lucide-react";

export default function AdminStandsPage() {
  const { data: stands, isLoading, refetch } = useListStands("casa-1");
  const updateMutation = useUpdateStandStatus();

  const handleUpdateStatus = (standId: string, status: StandStatus, reopenAt?: string, maxPendingOrders?: number) => {
    updateMutation.mutate({
      standId,
      data: { status, reopenAt, maxPendingOrders }
    }, {
      onSuccess: () => {
        toast.success("Stand updated successfully");
        refetch();
      }
    });
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Stands Management</h2>
          <p className="text-muted-foreground">Control stand statuses and capacities.</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stands?.map(stand => (
              <StandAdminCard key={stand.id} stand={stand} onUpdate={handleUpdateStatus} />
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}

function StandAdminCard({ stand, onUpdate }: { stand: Stand, onUpdate: (id: string, status: StandStatus, reopen?: string, max?: number) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<StandStatus>(stand.status);
  const [reopenTime, setReopenTime] = useState("");
  const [maxOrders, setMaxOrders] = useState(stand.maxPendingOrders.toString());

  const handleSave = () => {
    let reopenAtIso;
    if (status === "temp_closed" && reopenTime) {
      const [hours, minutes] = reopenTime.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      reopenAtIso = date.toISOString();
    }
    
    onUpdate(stand.id, status, reopenAtIso, parseInt(maxOrders));
    setIsOpen(false);
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case "open": return "bg-green-500/10 text-green-600";
      case "busy": return "bg-yellow-500/10 text-yellow-600";
      case "temp_closed": return "bg-orange-500/10 text-orange-600";
      case "closed": return "bg-red-500/10 text-red-600";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg leading-tight">{stand.name}</h3>
            <p className="text-xs text-muted-foreground">{stand.category}</p>
          </div>
          <Badge variant="outline" className={getStatusColor(stand.status)}>
            {stand.status.replace("_", " ")}
          </Badge>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1"><Clock className="w-4 h-4"/> Wait Time</span>
            <span className="font-bold">{stand.waitTimeMinutes} min</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1"><Store className="w-4 h-4"/> Pending Orders</span>
            <span className="font-bold">{stand.pendingOrders} / {stand.maxPendingOrders}</span>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Settings2 className="w-4 h-4 mr-2" />
              Manage Stand
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage {stand.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as StandStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                    <SelectItem value="temp_closed">Temporarily Closed</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {status === "temp_closed" && (
                <div className="space-y-2">
                  <Label>Reopen Time</Label>
                  <Input type="time" value={reopenTime} onChange={(e) => setReopenTime(e.target.value)} />
                </div>
              )}

              <div className="space-y-2">
                <Label>Max Pending Orders</Label>
                <Input type="number" value={maxOrders} onChange={(e) => setMaxOrders(e.target.value)} min="1" />
              </div>
              
              <Button onClick={handleSave} className="w-full mt-4">Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
