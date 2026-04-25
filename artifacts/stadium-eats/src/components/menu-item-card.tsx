import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MenuItem } from "@workspace/api-client-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface MenuItemCardProps {
  item: MenuItem;
  standId: string;
  isStandClosed?: boolean;
}

export function MenuItemCard({ item, standId, isStandClosed }: MenuItemCardProps) {
  const { t } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);
  const cartItems = useAppStore(state => state.cart.items);
  const addToCart = useAppStore(state => state.addToCart);
  const updateQuantity = useAppStore(state => state.updateQuantity);
  const removeFromCart = useAppStore(state => state.removeFromCart);
  
  const cartItem = cartItems.find(i => i.menuItemId === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    if (quantity === 0) {
      addToCart(standId, {
        menuItemId: item.id,
        name: item.name,
        priceMad: item.priceMad,
        quantity: 1,
        imageUrl: item.imageUrl
      });
    } else {
      updateQuantity(item.id, quantity + 1);
    }
  };

  const handleRemove = () => {
    if (quantity === 1) {
      removeFromCart(item.id);
    } else if (quantity > 1) {
      updateQuantity(item.id, quantity - 1);
    }
  };

  const imageSrc = item.imageUrl.startsWith('/') ? item.imageUrl : `/assets/menu/${item.name.toLowerCase().includes('burger') ? 'burger' : item.name.toLowerCase().includes('kefta') ? 'kefta' : item.name.toLowerCase().includes('tea') ? 'mint-tea' : 'tagine'}.png`;

  return (
    <>
      <div className="bg-card border rounded-2xl p-3 flex gap-3 shadow-sm relative overflow-hidden">
        <div className="w-24 h-24 rounded-xl bg-muted shrink-0 relative overflow-hidden">
          <img 
            src={imageSrc} 
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/assets/menu/tagine.png";
            }}
          />
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Sold Out
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col justify-between py-0.5">
          <div>
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-base leading-tight pr-4">{item.name}</h4>
              <button 
                onClick={() => setShowInfo(true)}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-muted-foreground text-xs line-clamp-2 mt-1">{item.description}</p>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {item.isHalal && (
                <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-primary/10 text-primary hover:bg-primary/20">Halal</Badge>
              )}
              {item.isVegetarian && (
                <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-green-500/10 text-green-600 hover:bg-green-500/20">Veg</Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-accent">{item.priceMad} MAD</span>
            
            {item.isAvailable && !isStandClosed && (
              quantity > 0 ? (
                <div className="flex items-center bg-secondary rounded-full overflow-hidden border">
                  <button onClick={handleRemove} className="p-1.5 hover:bg-black/5 active:bg-black/10 transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm">{quantity}</span>
                  <button onClick={handleAdd} className="p-1.5 hover:bg-black/5 active:bg-black/10 transition-colors text-primary">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  className="h-8 rounded-full px-4 text-xs font-bold hover-elevate"
                  onClick={handleAdd}
                >
                  {t("menu.add_to_cart")}
                </Button>
              )
            )}
          </div>
        </div>
      </div>

      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="max-w-[320px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>{item.name}</DialogTitle>
            <DialogDescription>{item.description}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <h5 className="font-semibold text-sm mb-2">Allergens</h5>
            {item.allergens && item.allergens.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {item.allergens.map(a => (
                  <Badge key={a} variant="outline" className="bg-destructive/5 text-destructive border-destructive/20">{a}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No allergens listed.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
