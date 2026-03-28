'use client';
import { useEffect, useState, Suspense } from 'react';
import { useStore } from '@/context/StoreContext';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
const STEPS = ['pending','processing','shipped','delivered'];
const STATUS: Record<string,string> = { pending:'bg-yellow-100 text-yellow-700 border-yellow-200', processing:'bg-blue-100 text-blue-700 border-blue-200', shipped:'bg-purple-100 text-purple-700 border-purple-200', delivered:'bg-green-100 text-green-700 border-green-200', cancelled:'bg-red-100 text-red-700 border-red-200' };
function OrderDetailContent() {
  const { store, user } = useStore(); const searchParams = useSearchParams(); const router = useRouter();
  const orderId = searchParams.get('id');
  const isSuccess = searchParams.get('success') === '1';
  const [order, setOrder] = useState<any>(null); const [loading, setLoading] = useState(true); const [cancelling, setCancelling] = useState(false);
  useEffect(() => {
    if (!user) { router.replace('/login'); return; }
    if (!store||!orderId) return;
    store.orders.get(orderId).then(setOrder).catch(() => setOrder(null)).finally(() => setLoading(false));
  }, [store, user, orderId]);
  async function handleCancel() {
    if (!store||!order) return; setCancelling(true);
    try { await store.orders.cancel(order._id); setOrder((o: any) => ({...o, status:'cancelled'})); } catch (e: any) { alert(e.message); } finally { setCancelling(false); }
  }
  if (loading) return <div className="max-w-3xl mx-auto px-6 py-12 animate-pulse space-y-4"><div className="h-8 bg-gray-100 rounded w-1/3"/><div className="h-40 bg-gray-100 rounded-xl"/></div>;
  if (!order) return <div className="text-center py-32"><p className="text-5xl mb-4">😕</p><Link href="/orders" className="underline">← My Orders</Link></div>;
  const s = (order.status||'pending').toLowerCase(); const si = STEPS.indexOf(s); const isCancelled = s==='cancelled';
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {isSuccess&&<div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3"><span className="text-2xl">🎉</span><div><p className="font-semibold text-green-800">Order placed!</p><p className="text-sm text-green-600">We'll notify you when it ships.</p></div></div>}
      <Link href="/orders" className="text-sm text-gray-400 hover:text-black mb-6 inline-block">← All Orders</Link>
      <div className="flex items-start justify-between mb-6 mt-2">
        <div><h1 className="text-2xl font-black">Order #{order._id?.slice(-8).toUpperCase()}</h1><p className="text-sm text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</p></div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border capitalize ${STATUS[s]||'bg-gray-100 text-gray-600'}`}>{order.status}</span>
      </div>
      {!isCancelled&&<div className="border rounded-xl p-6 mb-6"><p className="text-sm font-semibold mb-4">Tracking</p><div className="flex items-center">{STEPS.map((step,i) => (<div key={step} className="flex items-center flex-1 last:flex-none"><div className="flex flex-col items-center gap-1"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${i<=si?'bg-black text-white border-black':'border-gray-300 text-gray-400'}`}>{i<si?'✓':i+1}</div><p className={`text-xs capitalize ${i<=si?'font-semibold':'text-gray-400'}`}>{step}</p></div>{i<STEPS.length-1&&<div className={`flex-1 h-0.5 mb-5 mx-1 ${i<si?'bg-black':'bg-gray-200'}`}/>}</div>))}</div></div>}
      <div className="border rounded-xl p-6 mb-6"><p className="text-sm font-semibold mb-4">Items</p><div className="space-y-4">{order.orderItems?.map((item: any,i: number) => (<div key={i} className="flex gap-3"><div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0">{item.image?<img src={item.image} alt="" className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center">👕</div>}</div><div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{item.name}</p>{item.variant&&<p className="text-xs text-gray-400">Size:{item.variant}</p>}<p className="text-xs text-gray-500">Qty:{item.qty}</p></div><p className="text-sm font-semibold">₹{(item.price*item.qty).toLocaleString()}</p></div>))}</div></div>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="border rounded-xl p-5"><p className="text-sm font-semibold mb-3">Shipping</p>{order.shippingAddress?<div className="text-sm text-gray-600 space-y-0.5"><p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p><p>{order.shippingAddress.address}</p><p>{order.shippingAddress.city}, {order.shippingAddress.state}</p><p>{order.shippingAddress.phone}</p></div>:<p className="text-sm text-gray-400">N/A</p>}</div>
        <div className="border rounded-xl p-5"><p className="text-sm font-semibold mb-3">Payment</p><div className="text-sm text-gray-600 space-y-1.5"><div className="flex justify-between"><span>Method</span><span className="font-medium text-gray-900">{order.paymentMethod}</span></div><div className="flex justify-between"><span>Status</span><span className={`font-medium ${order.isPaid?'text-green-600':'text-gray-900'}`}>{order.isPaid?'✓ Paid':'Pending'}</span></div><div className="flex justify-between border-t pt-2 font-bold"><span>Total</span><span>₹{order.totalPrice?.toLocaleString()}</span></div></div></div>
      </div>
      <div className="flex gap-3"><Link href="/products" className="flex-1 text-center border-2 border-black py-3 rounded-xl font-semibold text-sm hover:bg-black hover:text-white transition">Shop More</Link>{['pending','processing'].includes(s)&&<button onClick={handleCancel} disabled={cancelling} className="flex-1 border-2 border-red-200 text-red-600 py-3 rounded-xl font-semibold text-sm hover:bg-red-50 disabled:opacity-40">{cancelling?'Cancelling...':'Cancel Order'}</button>}</div>
    </div>
  );
}
export default function OrderDetailPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}><OrderDetailContent /></Suspense>;
}