'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
doc,
setDoc,
getDoc
} from "firebase/firestore";

export type CartItem = {
id:string;
name:string;
price:number;
image:string;
size:string;
};

type CartContextType = {
cart: CartItem[];
addToCart:(item:CartItem)=>void;
removeFromCart:(index:number)=>void;
clearCart:()=>void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {

  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [cartLoaded, setCartLoaded] = useState(false); // ✅ NEW

  /* WATCH LOGIN */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setUser(u);

      if (u) {
        try {
          const ref = doc(db, "carts", u.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            setCart(snap.data().items || []);
          }
        } catch (err) {
          console.error("Failed to load cart:", err);
        }
      } else {
        setCart([]); // clear cart on logout
      }

      setCartLoaded(true); // ✅ only true AFTER loading from Firestore
    });

    return () => unsub();
  }, []);

  /* AUTO SAVE CART — only after cart is loaded from Firestore */
  useEffect(() => {
    if (!user || !cartLoaded) return; // ✅ prevents overwriting on mount

    try {
      setDoc(doc(db, "carts", user.uid), { items: cart });
    } catch (err) {
      console.error("Failed to save cart:", err);
    }
  }, [cart, user, cartLoaded]);

  function addToCart(item: CartItem) {
    setCart(prev => [...prev, item]);
  }

  function removeFromCart(index: number) {
    setCart(prev => prev.filter((_, i) => i !== index)); // ✅ fixed
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(){

const context = useContext(CartContext);

if(!context){
throw new Error("useCart must be used inside CartProvider");
}

return context;
}
