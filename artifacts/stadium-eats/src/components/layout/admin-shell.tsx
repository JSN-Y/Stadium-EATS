import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, ShoppingBag, Store, Users, Map, LogOut } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { adminId, setAdminId } = useAppStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!adminId) {
      setLocation("/admin");
    }
  }, [adminId, setLocation]);

  const nav = [
    { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders Queue", icon: ShoppingBag },
    { href: "/admin/stands", label: "Stands", icon: Store },
    { href: "/admin/riders", label: "Riders", icon: Users },
    { href: "/admin/heatmap", label: "Section Heatmap", icon: Map },
  ];

  const handleLogout = () => {
    setAdminId(null);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
        <h1 className="font-bold text-lg text-primary">Stadium Eats Admin</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 border-r bg-card flex flex-col`}>
        <div className="p-6 hidden md:block">
          <h1 className="font-bold text-2xl text-primary leading-none">Stadium Eats</h1>
          <p className="text-sm text-muted-foreground mt-1">Admin Portal</p>
        </div>
        
        <nav className="flex-1 px-4 py-4 md:py-0 space-y-1">
          {nav.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={() => setIsSidebarOpen(false)}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${isActive ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                  <Icon className="w-5 h-5" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive w-full transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto h-[100dvh]">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
