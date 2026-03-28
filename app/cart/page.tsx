'use client';
import { useEffect, useState, useCallback } from 'react';
import { useStore } from '@/context/StoreContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function CartPage() {
  const { store, user, refreshCart } = useStore(); const router = useRouter();
  const [cart, setCart] = useState<any[]>([]); const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true); const [updating, setUpdating] = useState<string|null>(null);
  const fetchCart = useCallback(async () => {
    if (!store||!user) { setLoading(false); return; }
    try { const d = await store.cart.get(); setCart(d.cart||[]); setTotal(d.cartTotal||0); } catch { setCart([]); } finally { setLoading(false); }
  }, [store, user]);
  useEffect(() => { fetchCart(); }, [fetchCart]);
  async function updateQty(itemId: string, qty: number) {
    if (!store) return; setUpdating(itemId);
    try { if (qty < 1) await store.cart.remove(itemId); else await store.cart.update(itemId, qty); await fetchCart(); await refreshCart(); } catch {} finally { setUpdating(null); }
  }
  if (!user) return <div className="max-w-2xl mx-auto px-6 py-32 text-center"><p className="text-5xl mb-4">🛒</p><p className="text-xl font-semibold mb-6">Sign in to view your cart</p><Link href="/login" className="inline-block bg-black text-white px-8 py-3 rounded-xl font-semibold">Login</Link></div>;
  if (loading) return <div className="max-w-3xl mx-auto px-6 py-12 space-y-4 animate-pulse">{[...Array(3)].map((_,i) => <div key={i} className="h-24 bg-gray-100 rounded-xl"/>)}</div>;
  if (cart.length === 0) return <div className="text-center py-32"><p className="text-5xl mb-4">🛒</p><p className="text-xl font-semibold mb-6">Your cart is empty</p><Link href="/products" className="inline-block bg-black text-white px-8 py-3 rounded-xl font-semibold">Shop Now</Link></div>;
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-black mb-8">My Cart ({cart.length})</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.map((item: any) => (
            <div key={item._id} className="flex gap-4 p-4 border rounded-xl">
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">{item.image?<img src={item.image} alt="" className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center">👕</div>}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{item.name}</p>
                {item.variant&&<p className="text-xs text-gray-400 mt-0.5">Size: {item.variant}</p>}
                <p className="text-sm font-bold mt-1">₹{(item.price*item.qty).toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={()=>updateQty(item._id,item.qty-1)} disabled={!!updating} className="w-7 h-7 border rounded-lg text-sm hover:border-black disabled:opacity-40">−</button>
                  <span className="text-sm font-semibold w-6 text-center">{updating===item._id?'…':item.qty}</span>
                  <button onClick={()=>updateQty(item._id,item.qty+1)} disabled={!!updating} className="w-7 h-7 border rounded-lg text-sm hover:border-black disabled:opacity-40">+</button>
                  <button onClick={()=>updateQty(item._id,0)} disabled={!!updating} className="ml-2 text-xs text-red-400 hover:text-red-600">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border rounded-xl p-5 h-fit space-y-4">
          <h2 className="font-semibold">Order Summary</h2>
          <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
          <div className="flex justify-between text-sm"><span>Shipping</span><span className="text-green-600">Free</span></div>
          <div className="flex justify-between font-bold border-t pt-3"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          <button onClick={()=>router.push('/checkout')} className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-80 transition">Proceed to Checkout →</button>
        </div>
      </div>
    </div>
  );
}