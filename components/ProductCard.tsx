'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { useRouter } from 'next/navigation';
interface Product { _id: string; name: string; price: number; images?: string[]; type?: string; variants?: string[]; }
export default function ProductCard({ product }: { product: Product }) {
  const { store, user, refreshCart } = useStore(); const router = useRouter();
  const [adding, setAdding] = useState(false); const [added, setAdded] = useState(false);
  async function handleAdd(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation();
    if (!user) { router.push('/login'); return; } if (!store) return; setAdding(true);
    try { await store.cart.add(product._id, 1, product.variants?.[0]); await refreshCart(); setAdded(true); setTimeout(() => setAdded(false), 2000); } catch {} finally { setAdding(false); }
  }
  return (
    <Link href={`/product?id=${product._id}`} className="group block">
      <div className="relative overflow-hidden bg-gray-100 aspect-square rounded-xl mb-3">
        {product.images?.[0] ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500"/> : <div className="w-full h-full flex items-center justify-center text-5xl text-gray-300">👕</div>}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleAdd} disabled={adding} className="w-full py-2.5 text-sm font-semibold rounded-lg text-white transition hover:opacity-90 disabled:opacity-60" style={{background: added ? '#16a34a' : 'var(--brand)'}}>{adding ? 'Adding...' : added ? '✓ Added!' : '+ Add to Cart'}</button>
        </div>
      </div>
      {product.type && <p className="text-xs text-gray-400 uppercase tracking-wider">{product.type}</p>}
      <h3 className="font-semibold text-sm leading-snug group-hover:underline truncate">{product.name}</h3>
      <p className="text-sm font-medium">₹{product.price?.toLocaleString()}</p>
    </Link>
  );
}
