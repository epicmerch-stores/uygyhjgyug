'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
interface User { _id: string; name: string; email?: string; phoneNumber?: string; phone?: string; }
interface StoreContextType { store: any|null; user: User|null; cartCount: number; refreshCart: ()=>Promise<void>; refreshUser: ()=>Promise<void>; logout: ()=>void; }
const StoreContext = createContext<StoreContextType>({ store:null, user:null, cartCount:0, refreshCart:async()=>{}, refreshUser:async()=>{}, logout:()=>{} });
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<any>(null);
  const [user, setUser] = useState<User|null>(null);
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    function init() {
      const raw = (window as any).EpicMerch; if (!raw) return false;
      const EpicMerch = raw?.default || raw; if (typeof EpicMerch !== 'function') return false;
      setStore(new EpicMerch({ apiKey: process.env.NEXT_PUBLIC_EPICMERCH_API_KEY||'', baseUrl: process.env.NEXT_PUBLIC_EPICMERCH_BASE_URL||'https://server.epicmerch.in/api' }));
      return true;
    }
    if (init()) return;
    const t = setInterval(() => { if (init()) clearInterval(t); }, 100);
    return () => clearInterval(t);
  }, []);
  const refreshUser = useCallback(async () => {
    if (!store) return;
    try {
      const saved = localStorage.getItem('customerInfo'); if (!saved) { setUser(null); return; }
      const parsed = JSON.parse(saved);
      if (parsed?.token) { store.setCustomerToken(parsed.token); const s = await store.auth.getSession(); setUser(s?.user||parsed.user||null); }
    } catch { setUser(null); }
  }, [store]);
  const refreshCart = useCallback(async () => {
    if (!store) return;
    try { const saved = localStorage.getItem('customerInfo'); if (!saved) { setCartCount(0); return; } const d = await store.cart.get(); setCartCount(d.cartCount||0); } catch { setCartCount(0); }
  }, [store]);
  const logout = useCallback(() => {
    if (!store) return;
    try { store.auth.logout(); } catch {} try { store.clearCustomerToken(); } catch {}
    localStorage.removeItem('customerInfo'); setUser(null); setCartCount(0);
  }, [store]);
  useEffect(() => { if (store) refreshUser().then(() => refreshCart()); }, [store, refreshUser, refreshCart]);
  return <StoreContext.Provider value={{ store, user, cartCount, refreshCart, refreshUser, logout }}>{children}</StoreContext.Provider>;
}
export const useStore = () => useContext(StoreContext);
