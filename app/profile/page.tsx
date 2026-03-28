'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function ProfilePage() {
  const { store, user, refreshUser, logout } = useStore(); const router = useRouter();
  const [name, setName] = useState(''); const [phone, setPhone] = useState(''); const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false);
  useEffect(() => { if (!user) { router.replace('/login'); return; } setName(user.name||''); setPhone((user as any).phoneNumber||(user as any).phone||''); }, [user]);
  async function save(e: React.FormEvent) {
    e.preventDefault(); if (!store) return; setSaving(true);
    try { await store.addresses.updateProfile({ name, phoneNumber: phone }); await refreshUser(); setSaved(true); setTimeout(() => setSaved(false), 2500); } catch (e: any) { alert(e.message); } finally { setSaving(false); }
  }
  if (!user) return null;
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-black mb-8">My Profile</h1>
      <form onSubmit={save} className="border rounded-xl p-6 mb-6 space-y-5">
        <h2 className="font-semibold">Personal Details</h2>
        <div><label className="block text-sm font-medium mb-1.5">Full Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"/></div>
        <div><label className="block text-sm font-medium mb-1.5">Email</label><input type="email" value={user.email||'—'} disabled className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"/></div>
        <div><label className="block text-sm font-medium mb-1.5">Phone</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"/></div>
        <button type="submit" disabled={saving} className={`px-8 py-3 rounded-xl font-semibold text-sm text-white ${saved?'bg-green-600':'bg-black hover:opacity-80 disabled:opacity-50'}`}>{saving?'Saving...':saved?'✓ Saved!':'Save Changes'}</button>
      </form>
      <div className="border rounded-xl p-6 mb-6"><h2 className="font-semibold mb-4">Quick Links</h2><div className="space-y-3"><Link href="/orders" className="flex items-center justify-between text-sm hover:text-gray-600">📦 My Orders <span className="text-gray-400">→</span></Link><Link href="/cart" className="flex items-center justify-between text-sm hover:text-gray-600">🛒 My Cart <span className="text-gray-400">→</span></Link></div></div>
      <button onClick={() => { logout(); router.push('/'); }} className="w-full border-2 border-red-200 text-red-600 py-3 rounded-xl font-semibold text-sm hover:bg-red-50 transition">Logout</button>
    </div>
  );
}