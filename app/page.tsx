'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

function NewsletterForm() {
  const { store } = useStore();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'done'|'error'>('idle');
  async function submit(e: React.FormEvent) {
    e.preventDefault(); if (!store||!email) return; setStatus('loading');
    try { await store.newsletter.subscribe(email); setStatus('done'); setEmail(''); } catch { setStatus('error'); }
  }
  if (status === 'done') return <p style={{color:'#4ade80'}} className="font-medium text-lg">You're in! 🎉</p>;
  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 px-5 py-3 rounded-lg focus:outline-none focus:border-white" />
      <button type="submit" disabled={status==='loading'} className="bg-white text-black px-7 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 whitespace-nowrap">{status==='loading' ? '...' : 'Subscribe'}</button>
    </form>
  );
}

export default function HomePage() {
  const { store } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  useEffect(() => {
    if (!store) return;
    store.products.list({ limit: 8, sort: 'newest' }).then((d: any) => setProducts(d.products || [])).catch(() => {}).finally(() => setLoading(false));
  }, [store]);
  return (
    <>
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-32 md:py-44 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-5">New Collection</p>
            <h1 className="text-6xl md:text-8xl font-black leading-none mb-6 tracking-tight">FRESH DROPS</h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-sm">Limited edition pieces crafted for the bold.</p>
            <div className="flex gap-4">
              <Link href="/products" className="inline-block text-white px-8 py-4 text-sm font-semibold hover:opacity-80 transition" style={{background:'var(--brand)'}}>Shop Now →</Link>
              <Link href="/products" className="inline-block border border-gray-300 px-8 py-4 text-sm font-medium hover:border-black transition">View All</Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full flex items-center justify-center text-9xl" style={{background:'var(--brand-light)'}}>
              🛍️
            </div>
          </div>
        </div>
      </section>
      <div className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
          <span>🚚 Free Shipping</span>
          <span>✅ Premium Quality</span>
          <span>🔒 Secure Payments</span>
          <span>↩️ Easy Returns</span>
        </div>
      </div>
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">Just dropped</p>
            <h2 className="text-4xl font-black">New Arrivals</h2>
          </div>
          <Link href="/products" className="text-sm font-semibold underline hover:no-underline hidden sm:block">View all</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">{[...Array(8)].map((_,i) => <div key={i} className="space-y-3"><div className="bg-gray-100 rounded-xl aspect-square animate-pulse"/><div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"/></div>)}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400"><p className="text-4xl mb-3">🛍️</p><p>Products coming soon!</p></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">{products.map(p => <ProductCard key={p._id} product={p} />)}</div>
        )}
        <div className="text-center mt-12">
          <Link href="/products" className="inline-block border-2 border-black px-10 py-3 font-semibold hover:bg-black hover:text-white transition rounded-lg">Shop Now →</Link>
        </div>
      </section>
      <section className="bg-black text-white py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-3">Get early access to drops</h2>
          <p className="text-gray-400 mb-8">No spam. Just new merch, before it sells out.</p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
