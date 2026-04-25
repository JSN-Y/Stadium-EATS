import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import SplashPage from "@/pages/splash";
import HomePage from "@/pages/home";
import StandPage from "@/pages/stand";
import CartPage from "@/pages/cart";
import OrdersPage from "@/pages/orders";
import OrderDetailPage from "@/pages/order-detail";
import ProfilePage from "@/pages/profile";

import RiderLoginPage from "@/pages/rider/login";
import RiderDashboardPage from "@/pages/rider/dashboard";

import AdminLoginPage from "@/pages/admin/login";
import AdminDashboardPage from "@/pages/admin/dashboard";
import AdminOrdersPage from "@/pages/admin/orders";
import AdminStandsPage from "@/pages/admin/stands";
import AdminRidersPage from "@/pages/admin/riders";
import AdminHeatmapPage from "@/pages/admin/heatmap";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={SplashPage} />
      <Route path="/home" component={HomePage} />
      <Route path="/stand/:standId" component={StandPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/orders" component={OrdersPage} />
      <Route path="/order/:orderId" component={OrderDetailPage} />
      <Route path="/profile" component={ProfilePage} />
      
      <Route path="/rider" component={RiderLoginPage} />
      <Route path="/rider/dashboard" component={RiderDashboardPage} />
      
      <Route path="/admin" component={AdminLoginPage} />
      <Route path="/admin/dashboard" component={AdminDashboardPage} />
      <Route path="/admin/orders" component={AdminOrdersPage} />
      <Route path="/admin/stands" component={AdminStandsPage} />
      <Route path="/admin/riders" component={AdminRidersPage} />
      <Route path="/admin/heatmap" component={AdminHeatmapPage} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
