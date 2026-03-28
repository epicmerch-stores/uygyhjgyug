'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { useRouter } from 'next/navigation';
export default function LoginPage() {
  const { store, refreshUser, refreshCart } = useStore(); const router = useRouter();
  const [mode, setMode] = useState<'otp'|'google'>('otp');
  const [contact, setContact] = useState(''); const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'input'|'verify'>('input');
  const [loading, setLoading] = useState(false); const [error, setError] = useState('');
  const isEmail = contact.includes('@');
  async function sendOtp() {
    if (!store||!contact.trim()) return; setLoading(true); setError('');
    try {
      if (isEmail) await store.auth.sendEmailOtp(contact.trim()); else await store.auth.sendPhoneOtp(contact.trim());
      setStep('verify');
    } catch (e: any) { setError(e.message||'Failed to send OTP'); } finally { setLoading(false); }
  }
  async function verifyOtp() {
    if (!store||!otp.trim()) return; setLoading(true); setError('');
    try {
      let res;
      if (isEmail) res = await store.auth.verifyEmailOtp(contact.trim(), otp.trim()); else res = await store.auth.verifyPhoneOtp(contact.trim(), otp.trim());
      const token = res?.token||res?.accessToken||res?.data?.token;
      if (token) { localStorage.setItem('customerInfo', JSON.stringify({ token, user: res.user||res.data?.user })); if (store.setCustomerToken) store.setCustomerToken(token); }
      await refreshUser(); await refreshCart(); router.push('/');
    } catch (e: any) { setError(e.message||'Invalid OTP'); } finally { setLoading(false); }
  }
  async function googleLogin() {
    if (!store) return; setLoading(true); setError('');
    try { const url = await store.auth.getGoogleOAuthUrl(); window.location.href = url; } catch (e: any) { setError(e.message||'Google login failed'); setLoading(false); }
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-black mb-1">Welcome back</h1>
        <p className="text-gray-400 text-sm mb-8">Sign in to continue shopping</p>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>}
        {step === 'input' ? (
          <>
            <button onClick={googleLogin} disabled={loading} className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 py-3 rounded-xl text-sm font-semibold hover:border-gray-400 transition mb-4 disabled:opacity-50">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
            <div className="flex items-center gap-3 mb-4"><div className="flex-1 h-px bg-gray-200"/><span className="text-xs text-gray-400">or</span><div className="flex-1 h-px bg-gray-200"/></div>
            <input type="text" placeholder="Email or phone number" value={contact} onChange={e => setContact(e.target.value)} onKeyDown={e => e.key==='Enter'&&sendOtp()} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-black"/>
            <button onClick={sendOtp} disabled={loading||!contact.trim()} className="w-full bg-black text-white py-3 rounded-xl font-semibold text-sm hover:opacity-80 disabled:opacity-40">{loading?'Sending...':'Send OTP'}</button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">OTP sent to <span className="font-semibold text-black">{contact}</span></p>
            <input type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} onKeyDown={e => e.key==='Enter'&&verifyOtp()} maxLength={6} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm mb-3 text-center text-xl tracking-widest focus:outline-none focus:border-black"/>
            <button onClick={verifyOtp} disabled={loading||otp.length<4} className="w-full bg-black text-white py-3 rounded-xl font-semibold text-sm hover:opacity-80 disabled:opacity-40 mb-3">{loading?'Verifying...':'Verify & Login'}</button>
            <button onClick={() => { setStep('input'); setOtp(''); setError(''); }} className="w-full text-sm text-gray-400 hover:text-black">← Change contact</button>
          </>
        )}
      </div>
    </div>
  );
}