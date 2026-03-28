'use client';
import { useEffect, useState, useCallback } from 'react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';
const SORTS = [{ label:'Newest', value:'newest' },{ label:'Popular', value:'popularity' },{ label:'Price ↑', value:'price_asc' },{ label:'Price ↓', value:'price_desc' }];
export default function ProductsPage() {
  const { store } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const load = useCallback(async () => {
    if (!store) return; setLoading(true);
    try {
      const p: Record<string,any> = { sort, page, limit:12 };
      if (activeCategory !== 'All') p.type = activeCategory;
      if (search) p.keyword = search;
      const d = await store.products.list(p);
      setProducts(d.products||[]); setTotalPages(d.pages||1);
    } catch {} finally { setLoading(false); }
  }, [store, activeCategory, sort, page, search]);
  useEffect(() => { if (store) store.categories.list().then((c: string[]) => setCategories(c||[])).catch(() => {}); }, [store]);
  useEffect(() => { load(); }, [load]);
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black mb-8">Shop All</h1>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(1); }} className="flex flex-1 gap-2">
          <input type="text" placeholder="Search..." value={searchInput} onChange={e => setSearchInput(e.target.value)} className="flex-1 border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-black"/>
          <button type="submit" className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium">Search</button>
          {search && <button type="button" onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }} className="px-4 py-2.5 border rounded-lg text-sm hover:border-black">Clear</button>}
        </form>
        <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }} className="border border-gray-300 px-4 py-2.5 rounded-lg text-sm bg-white">
          {SORTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      {categories.length > 0 && <div className="flex gap-2 flex-wrap mb-8">{['All',...categories].map(cat => <button key={cat} onClick={() => { setCategory(cat); setPage(1); }} className={`px-4 py-2 rounded-full text-sm font-medium border transition ${activeCategory===cat?'bg-black text-white border-black':'border-gray-300 hover:border-black'}`}>{cat}</button>)}</div>}
      {loading ? <div className="grid grid-cols-2 md:grid-cols-4 gap-6">{[...Array(12)].map((_,i) => <div key={i} className="space-y-3"><div className="bg-gray-100 aspect-square rounded-xl animate-pulse"/><div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"/></div>)}</div>
        : products.length === 0 ? <div className="text-center py-32 text-gray-400"><p className="text-5xl mb-4">🔍</p><p>No products found.</p></div>
        : <div className="grid grid-cols-2 md:grid-cols-4 gap-6">{products.map(p => <ProductCard key={p._id} product={p}/>)}</div>}
      {totalPages > 1 && !loading && <div className="flex justify-center gap-2 mt-14"><button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="px-4 py-2 border rounded-lg text-sm hover:border-black disabled:opacity-30">← Prev</button>{[...Array(totalPages)].map((_,i) => <button key={i} onClick={() => setPage(i+1)} className={`w-10 h-10 rounded-lg font-medium text-sm ${page===i+1?'bg-black text-white':'border hover:border-black'}`}>{i+1}</button>)}<button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-4 py-2 border rounded-lg text-sm hover:border-black disabled:opacity-30">Next →</button></div>}
    </div>
  );
}