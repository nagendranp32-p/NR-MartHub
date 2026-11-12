import React, { useState } from 'react';
import { Shirt, ArrowRight, ShieldCheck, Phone, User } from 'lucide-react';
import { registerCustomerLead } from '../services/api';

export default function LoginModal({ onLoginSuccess }) {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phoneNumber.trim()) {
      setError('Name and phone number enter cheyyuka.');
      return;
    }

    if (phoneNumber.replace(/\D/g, '').length < 10) {
      setError('Valid 10-digit mobile number enter cheyyuka.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await registerCustomerLead(name, phoneNumber);
    } catch (err) {
      console.warn('Backend unavailable, saving locally.');
    } finally {
      const userData = { name, phoneNumber };
      localStorage.setItem('nr_catalog_user', JSON.stringify(userData));
      setLoading(false);
      onLoginSuccess(userData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/80 backdrop-blur-md">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-rose-100">
        
        <div className="w-14 h-14 bg-rose-950 text-amber-300 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
          <Shirt size={28} />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-rose-950 font-serif tracking-tight">NR Mart Boutique</h2>
          <p className="text-xs text-rose-800/70 mt-1">Exclusive Textile & Designer Collection Access</p>
        </div>

        <p className="text-xs text-slate-600 text-center mb-6 bg-rose-50/60 p-3 rounded-2xl border border-rose-100">
          Puthiya sarees, kurtis, menswear designs kaanuvaan name and phone number enter cheyyuka.
        </p>

        {error && (
          <div className="mb-4 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
              Customer Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                required
                placeholder="e.g. Anitha Priya"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
              WhatsApp / Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-rose-950 hover:bg-rose-900 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 cursor-pointer"
          >
            {loading ? 'Accessing Boutique...' : 'Enter Clothing Catalog'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="text-emerald-600" size={14} />
          <span>Ningalude vivarangal safe aayirikkum.</span>
        </div>

      </div>
    </div>
  );
}