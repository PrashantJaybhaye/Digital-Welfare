"use client";

import { useState } from 'react';
import { Bell, X, Check, MessageSquare, Mail, ChevronDown, ShieldCheck } from 'lucide-react';

const ALERT_CATEGORIES = [
  'All New Government Schemes',
  'Scholarships & Student Aid',
  'Farmer Subsidies & Agriculture Grants',
  'Women & Child Welfare Schemes',
  'MSME, Business & Self-Employment Loans',
  'Free Healthcare & Hospital Benefits'
];

export default function SchemeAlertModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState(ALERT_CATEGORIES[0]);
  const [channel, setChannel] = useState<'WhatsApp' | 'Email'>('WhatsApp');
  const [state] = useState('All India');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/subscribe-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, category, state, channel })
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white/95 backdrop-blur-2xl border border-black/5 w-full max-w-[420px] rounded-[28px] p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.12)] relative animate-in zoom-in-95 duration-200 ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS Circular Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5 pr-6">
          <div className="w-12 h-12 rounded-[22%] bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-xs border border-blue-100/60">
            <Bell className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-950 tracking-tight leading-tight">
              Welfare Scheme Alerts
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Get notified when new subsidies open
            </p>
          </div>
        </div>

        {/* Modal Body */}
        {submitted ? (
          <div className="text-center py-6 space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-950">Subscription Confirmed</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Alerts will be sent to <span className="font-semibold text-slate-900">{contact}</span> as soon as verified schemes are published.
              </p>
            </div>
            <button
              onClick={() => { setSubmitted(false); onClose(); }}
              className="mt-2 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-semibold transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* iOS Segmented Control */}
            <div className="bg-slate-100/90 p-1 rounded-2xl grid grid-cols-2 gap-1 border border-slate-200/50">
              <button
                type="button"
                onClick={() => setChannel('WhatsApp')}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  channel === 'WhatsApp'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('Email')}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  channel === 'Email'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>Email</span>
              </button>
            </div>

            {/* Contact Input Field */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5 pl-0.5">
                {channel === 'WhatsApp' ? 'Mobile Number' : 'Email Address'}
              </label>
              <div className="relative">
                {channel === 'WhatsApp' && (
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-semibold text-slate-400 pointer-events-none">
                    +91
                  </span>
                )}
                <input
                  type={channel === 'WhatsApp' ? 'tel' : 'email'}
                  required
                  placeholder={channel === 'WhatsApp' ? '98765 43210' : 'citizen@example.com'}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className={`w-full py-2.5 pr-3.5 bg-slate-50/90 border border-slate-200/70 rounded-2xl text-xs sm:text-sm font-medium text-slate-950 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    channel === 'WhatsApp' ? 'pl-11' : 'pl-3.5'
                  }`}
                />
              </div>
            </div>

            {/* Focus Sector Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5 pl-0.5">
                Scheme Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50/90 border border-slate-200/70 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer appearance-none"
                >
                  {ALERT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="text-xs font-medium text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                {errorMsg}
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading || !contact.trim()}
              className="w-full mt-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <span>Subscribe for Alerts</span>
              )}
            </button>

            {/* Apple Style Footer Info */}
            <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1 font-medium pt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Official Notifications • No Spam Guarantee</span>
            </p>

          </form>
        )}
      </div>
    </div>
  );
}
