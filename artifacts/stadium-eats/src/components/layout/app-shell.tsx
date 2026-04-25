import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ShoppingBag, Receipt, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/lib/store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { t } = useTranslation();
  const cartItems = useAppStore((state) => state.cart.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const tabs = [
    { href: "/home", icon: Home, label: t("nav.home") },
    { href: "/orders", icon: Receipt, label: t("nav.orders") },
    { href: "/cart", icon: ShoppingBag, label: t("cart.title"), badge: cartCount > 0 ? cartCount : null },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground pb-16">
      <main className="flex-1 w-full max-w-md mx-auto relative">{children}</main>
      
      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="max-w-md mx-auto flex items-center justify-around h-16 px-4">
          {tabs.map((tab) => {
            const isActive = location.startsWith(tab.href);
            const Icon = tab.icon;
            
            return (
              <Link key={tab.href} href={tab.href} className="relative flex flex-col items-center justify-center w-full h-full space-y-1">
                <div className="relative">
                  <Icon className={`w-6 h-6 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  {tab.badge && (
                    <span className="absolute -top-1 -right-2 bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-4 text-center">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="bottom-nav-indicator"
                    className="absolute -bottom-[22px] w-8 h-1 bg-primary rounded-t-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
