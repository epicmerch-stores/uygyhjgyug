'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const STATUS: Record<string,string> = { pending:'bg-yellow-100 text-yellow-700', processing:'bg-blue-100 text-blue-700', shipped:'bg-purple-100 text-purple-700', delivered:'bg-green-100 text-green-700', cancelled:'bg-red-100 text-red-700' };
export default function OrdersPage() {
  const { store, user } = useStore(); const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) { router.replace('/login'); return; }
    if (!store) return;
    store.orders.list().then((d: any) => setOrders(d.orders||d||[])).catch(() => {}).finally(() => setLoading(false));
  }, [store, user]);
  if (loading) return <div className="max-w-3xl mx-auto px-6 py-12 space-y-4 animate-pulse">{[...Array(3)].map((_,i) => <div key={i} className="h-28 bg-gray-100 rounded-xl"/>)}</div>;
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-black mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-24 text-gray-400"><p className="text-5xl mb-4">📦</p><p className="text-lg font-medium mb-6">No orders yet</p><Link href="/products" className="inline-block bg-black text-white px-8 py-3 rounded-xl font-semibold">Start Shopping</Link></div>
      ) : (
        <div className="space-y-4">
          {orders.map((o: any) => {
            const s = (o.status||'pending').toLowerCase();
            return (
              <Link key={o._id} href={`/order?id=${o._id}`} className="block border rounded-xl p-5 hover:border-gray-400 transition">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">Order #{o._id?.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{new Date(o.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</p>
                    <p className="text-sm font-bold mt-2">₹{o.totalPrice?.toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize shrink-0 ${STATUS[s]||'bg-gray-100 text-gray-600'}`}>{o.status}</span>
                </div>
                {o.orderItems?.length > 0 && <div className="mt-3 flex gap-2 flex-wrap">{o.orderItems.slice(0,3).map((it: any,i: number) => <span key={i} className="text-xs bg-gray-100 px-2.5 py-1 rounded-full">{it.name}</span>)}{o.orderItems.length>3&&<span className="text-xs text-gray-400">+{o.orderItems.length-3} more</span>}</div>}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}