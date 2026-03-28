import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <h3 className="font-black text-2xl tracking-tighter mb-3">MERCH DROP</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">Premium merch for those who stand out</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-widest text-gray-400">Shop</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/products" className="hover:text-white transition">All Products</Link></li>
              <li><Link href="/cart"     className="hover:text-white transition">Cart</Link></li>
              <li><Link href="/orders"   className="hover:text-white transition">Track Order</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-widest text-gray-400">Account</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/login"   className="hover:text-white transition">Login</Link></li>
              <li><Link href="/profile" className="hover:text-white transition">Profile</Link></li>
              <li><Link href="/orders"  className="hover:text-white transition">Orders</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} MERCH DROP. All rights reserved.</p>
          <p>Powered by <a href="https://epicmerch-oms.onrender.com" target="_blank" rel="noopener" className="hover:text-white transition">EpicMerch</a></p>
        </div>
      </div>
    </footer>
  );
}
