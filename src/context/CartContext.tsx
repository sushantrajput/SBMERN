
import React, { createContext, useContext, useState } from "react";
import { CartItem, Product } from "../types/product";
import { toast } from "@/components/ui/use-toast";
import { useWishlist } from "./WishlistContext";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { removeFromWishlist, isInWishlist } = useWishlist();

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      
      if (existingItem) {
        const updatedQuantity = Math.min(existingItem.quantity + quantity, product.stock);
        if (updatedQuantity === existingItem.quantity) {
          toast({
            title: "Maximum stock reached",
            description: `You can't add more of this item to your cart`,
            variant: "destructive",
          });
          return prevItems;
        }
        
        toast({
          title: "Cart updated",
          description: `Updated ${product.name} quantity in your cart`,
        });
        
        return prevItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: updatedQuantity } : item
        );
      } else {
        toast({
          title: "Item added to cart",
          description: `Added ${product.name} to your cart`,
        });
        
        // Auto-remove from wishlist if product is in wishlist
        if (isInWishlist(product.id)) {
          removeFromWishlist(product.id);
          toast({
            title: "Removed from wishlist",
            description: `${product.name} was removed from your wishlist`,
          });
        }
        
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.product.id === productId);
      if (itemToRemove) {
        toast({
          title: "Item removed",
          description: `Removed ${itemToRemove.product.name} from your cart`,
        });
      }
      return prevItems.filter((item) => item.product.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => 
        item.product.id === productId 
          ? { ...item, quantity: Math.min(Math.max(1, quantity), item.product.stock) } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.discount
        ? item.product.price * (1 - item.product.discount / 100)
        : item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getItemQuantity = (productId: string) => {
    const item = cartItems.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
