'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { useRouter } from 'next/navigation';
const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh','Chandigarh','Puducherry'];
export default function CheckoutPage() {
  const { store, user, refreshCart } = useStore(); const router = useRouter();
  const [cart, setCart] = useState<any[]>([]); const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true); const [placing, setPlacing] = useState(false);
  const [method, setMethod] = useState<'razorpay'|'cod'>('razorpay');
  const [addr, setAddr] = useState({ fullName:'', address:'', city:'', state:'Maharashtra', pincode:'', phone:'' });
  useEffect(() => {
    if (!store||!user) { setLoading(false); return; }
    store.cart.get().then((d: any) => { setCart(d.cart||[]); setTotal(d.cartTotal||0); }).catch(() => {}).finally(() => setLoading(false));
  }, [store, user]);
  const change = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => setAddr(a => ({...a,[k]:e.target.value}));
  async function placeOrder() {
    if (!store||!user) return;
    const missing = (['fullName','address','city','state','pincode','phone'] as const).find(k => !addr[k].trim());
    if (missing) { alert('Please fill all address fields.'); return; }
    setPlacing(true);
    try {
      const idem = store.generateIdempotencyKey ? store.generateIdempotencyKey() : Date.now().toString();
      if (method === 'razorpay') {
        const order = await store.orders.create({ shippingAddress: addr, paymentMethod: 'razorpay', idempotencyKey: idem });
        const opts = { key: order.razorpayKeyId, amount: order.razorpayAmount, currency: 'INR', name: 'EpicMerch', order_id: order.razorpayOrderId,
          handler: async (resp: any) => { await store.orders.verifyPayment(order._id, resp); await refreshCart(); router.push(`/orders/${order._id}?success=1`); },
          prefill: { name: addr.fullName, contact: addr.phone }, theme: { color: 'var(--brand)' } };
        const rz = new (window as any).Razorpay(opts); rz.open();
      } else {
        const order = await store.orders.create({ shippingAddress: addr, paymentMethod: 'cod', idempotencyKey: idem });
        await refreshCart(); router.push(`/orders/${order._id}?success=1`);
      }
    } catch (e: any) { alert(e.message); } finally { setPlacing(false); }
  }
  if (!user) return <div className="text-center py-32"><p className="text-xl font-semibold mb-4">Please login to checkout</p><a href="/login" className="underline">Go to Login</a></div>;
  if (loading) return <div className="max-w-2xl mx-auto px-6 py-12 animate-pulse space-y-4"><div className="h-8 bg-gray-100 rounded w-1/3"/><div className="h-64 bg-gray-100 rounded-xl"/></div>;
  if (cart.length === 0) return <div className="text-center py-32"><p className="text-xl font-semibold mb-4">Your cart is empty</p><a href="/products" className="underline">Shop Now</a></div>;
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-black mb-8">Checkout</h1>
      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3 space-y-6">
          <div className="border rounded-xl p-6">
            <h2 className="font-semibold mb-4">Shipping Address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {([['fullName','Full Name'],['phone','Phone'],['address','Street Address'],['city','City'],['pincode','Pincode']] as [string,string][]).map(([k,label]) => (
                <div key={k} className={k==='address'?'sm:col-span-2':''}>
                  <label className="block text-sm font-medium mb-1.5">{label}</label>
                  <input type={k==='phone'?'tel':'text'} value={(addr as any)[k]} onChange={change(k)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black"/>
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1.5">State</label>
                <select value={addr.state} onChange={change('state')} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black bg-white">
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="border rounded-xl p-6">
            <h2 className="font-semibold mb-4">Payment Method</h2>
            <div className="space-y-3">
              {([['razorpay','💳 Pay Online (Razorpay)','Cards, UPI, NetBanking, Wallets'],['cod','📦 Cash on Delivery','Pay when your order arrives']] as [string,string,string][]).map(([val,label,sub]) => (
                <button key={val} onClick={() => setMethod(val as any)} className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl text-left transition ${method===val?'border-black bg-gray-50':'border-gray-200 hover:border-gray-300'}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method===val?'border-black':'border-gray-300'}`}>{method===val&&<div className="w-2.5 h-2.5 rounded-full bg-black"/>}</div>
                  <div><p className="font-medium text-sm">{label}</p><p className="text-xs text-gray-400">{sub}</p></div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="border rounded-xl p-5 sticky top-24 space-y-4">
            <h2 className="font-semibold">Order Summary</h2>
            <div className="space-y-3 max-h-48 overflow-auto">
              {cart.map((item: any) => <div key={item._id} className="flex justify-between text-sm"><span className="truncate pr-2">{item.name} ×{item.qty}</span><span className="shrink-0">₹{(item.price*item.qty).toLocaleString()}</span></div>)}
            </div>
            <div className="flex justify-between text-sm border-t pt-3"><span>Shipping</span><span className="text-green-600">Free</span></div>
            <div className="flex justify-between font-bold text-lg border-t pt-3"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
            <button onClick={placeOrder} disabled={placing} className="w-full bg-black text-white py-4 rounded-xl font-bold hover:opacity-80 disabled:opacity-50 transition">{placing?'Placing...':'Place Order →'}</button>
            <p className="text-xs text-gray-400 text-center">🔒 Secure checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
}