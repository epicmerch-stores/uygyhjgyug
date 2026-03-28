'use client';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { user, cartCount, logout } = useStore();
  const pathname = usePathname(); const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2"><span className="font-black text-xl tracking-tighter" style={{fontFamily:'var(--font-heading, inherit)'}}>MERCH DROP</span></Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/products" className={`text-sm font-medium transition ${pathname.startsWith('/products') ? 'underline underline-offset-4' : 'hover:underline'}`}>Shop</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            {cartCount > 0 && <span className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold" style={{background:'var(--brand)'}}>{cartCount > 9 ? '9+' : cartCount}</span>}
          </Link>
          {user ? (
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 text-sm font-medium border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-400 transition">
                <div className="w-6 h-6 text-white rounded-full flex items-center justify-center text-xs font-bold" style={{background:'var(--brand)'}}>{user.name?.charAt(0).toUpperCase()||'U'}</div>
                <span>{user.name?.split(' ')[0]||'Account'}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-12 bg-white border rounded-xl shadow-lg py-2 w-44 z-50">
                  <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50">👤 Profile</Link>
                  <Link href="/orders"  onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50">📦 My Orders</Link>
                  <div className="border-t border-gray-100 my-1"/>
                  <button onClick={() => { setDropdownOpen(false); logout(); router.push('/'); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">↩️ Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden md:inline-flex text-white px-4 py-2 text-sm font-semibold rounded-lg" style={{background:'var(--brand)'}}>Login</Link>
          )}
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{menuOpen?<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>:<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}</svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t bg-white px-6 py-4 space-y-3">
          <Link href="/products" className="block text-sm font-medium py-2">Shop</Link>
          {user ? (<><Link href="/orders" className="block text-sm font-medium py-2">My Orders</Link><Link href="/profile" className="block text-sm font-medium py-2">Profile</Link><button onClick={() => { logout(); router.push('/'); }} className="block text-sm font-medium text-red-600 py-2 w-full text-left">Logout</button></>) : (<Link href="/login" className="block text-white text-sm font-semibold px-4 py-3 rounded-lg text-center" style={{background:'var(--brand)'}}>Login</Link>)}
        </div>
      )}
    </nav>
  );
}
