'use client';
import { useEffect, useState, Suspense } from 'react';
import { useStore } from '@/context/StoreContext';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
function ProductDetailContent() {
  const { store, user, refreshCart } = useStore(); const searchParams = useSearchParams(); const router = useRouter();
  const productId = searchParams.get('id');
  const [product, setProduct] = useState<any>(null); const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string|null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1); const [adding, setAdding] = useState(false); const [added, setAdded] = useState(false);
  useEffect(() => {
    if (!store||!productId) return;
    store.products.get(productId).then((p: any) => { setProduct(p); if (p.variants?.length>0) setSelectedVariant(p.variants[0]); }).catch(() => setProduct(null)).finally(() => setLoading(false));
  }, [store, productId]);
  async function handleAdd() {
    if (!user) { router.push('/login'); return; } if (!store||!product) return; setAdding(true);
    try { await store.cart.add(product._id, qty, selectedVariant||undefined); await refreshCart(); setAdded(true); setTimeout(() => setAdded(false), 2500); } catch (e: any) { alert(e.message); } finally { setAdding(false); }
  }
  if (loading) return <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-14 animate-pulse"><div className="bg-gray-100 aspect-square rounded-2xl"/><div className="space-y-4 pt-4"><div className="h-8 bg-gray-100 rounded w-3/4"/><div className="h-32 bg-gray-100 rounded"/></div></div>;
  if (!product) return <div className="text-center py-32"><p className="text-5xl mb-4">😕</p><Link href="/products" className="underline">← Back</Link></div>;
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link href="/products" className="text-sm text-gray-400 hover:text-black mb-8 inline-block">← Back to Shop</Link>
      <div className="grid md:grid-cols-2 gap-14 mt-4">
        <div>
          <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-square mb-4">{product.images?.[selectedImage]?<img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center text-8xl">👕</div>}</div>
          {product.images?.length > 1 && <div className="flex gap-2">{product.images.map((img: string, i: number) => <button key={i} onClick={() => setSelectedImage(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${selectedImage===i?'border-black':'border-transparent'}`}><img src={img} alt="" className="w-full h-full object-cover"/></button>)}</div>}
        </div>
        <div className="flex flex-col">
          {product.type && <span className="text-xs text-gray-400 uppercase tracking-widest mb-2">{product.type}</span>}
          <h1 className="text-3xl font-black mb-3">{product.name}</h1>
          <p className="text-3xl font-semibold mb-6">₹{product.price?.toLocaleString()}</p>
          {product.description && <p className="text-gray-600 mb-8 leading-relaxed text-sm">{product.description}</p>}
          {product.variants?.length > 0 && <div className="mb-6"><p className="text-sm font-semibold mb-3">Size / Variant</p><div className="flex gap-2 flex-wrap">{product.variants.map((v: string) => <button key={v} onClick={() => setSelectedVariant(v)} className={`px-5 py-2.5 border rounded-lg text-sm font-medium transition ${selectedVariant===v?'bg-black text-white border-black':'hover:border-black'}`}>{v}</button>)}</div></div>}
          <div className="flex items-center gap-4 mb-8"><p className="text-sm font-semibold">Qty</p><div className="flex items-center border rounded-lg overflow-hidden"><button onClick={() => setQty(q => Math.max(1,q-1))} className="px-4 py-2.5 hover:bg-gray-100">−</button><span className="px-5 py-2.5 text-sm font-semibold border-x">{qty}</span><button onClick={() => setQty(q => q+1)} className="px-4 py-2.5 hover:bg-gray-100">+</button></div></div>
          <button onClick={handleAdd} disabled={adding} className="w-full py-4 rounded-xl font-bold text-lg text-white transition hover:opacity-90 disabled:opacity-50" style={{background: added?'#16a34a':'var(--brand)'}}>{adding?'Adding...':added?'✓ Added to Cart!':'Add to Cart'}</button>
          {!user && <p className="text-center text-sm text-gray-400 mt-3"><Link href="/login" className="underline">Login</Link> to add items</p>}
          {added && <div className="mt-4 flex gap-3"><Link href="/cart" className="flex-1 text-center border-2 border-black py-3 rounded-xl font-semibold text-sm hover:bg-black hover:text-white transition">View Cart</Link><Link href="/checkout" className="flex-1 text-center bg-black text-white py-3 rounded-xl font-semibold text-sm hover:opacity-80 transition">Checkout →</Link></div>}
          <div className="mt-8 pt-8 border-t space-y-2 text-sm text-gray-500"><p>🚚 Free shipping</p><p>🔒 Secure payment via Razorpay</p><p>↩️ Easy returns within 7 days</p></div>
        </div>
      </div>
    </div>
  );
}
export default function ProductDetailPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}><ProductDetailContent /></Suspense>;
}