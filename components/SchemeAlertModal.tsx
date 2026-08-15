"use client";

import { useState } from 'react';
import { Bell, X, CheckCircle2, ShieldCheck, Send } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-black/8 relative">

        {/* Header */}
        <div className="p-7 bg-slate-950 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
            <Bell className="w-5 h-5 text-amber-400" />
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">Public Welfare Alerts</h3>
          <p className="text-xs text-slate-400 mt-1">
            Receive direct updates on new subsidies, scholarship windows, and DBT disbursements.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-6 animate-fade-in space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-950">Subscription Confirmed</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                You will receive alerts on <strong>{contact}</strong> as soon as matching official notifications are issued.
              </p>
              <button
                onClick={() => { setSubmitted(false); onClose(); }}
                className="mt-2 px-6 py-2.5 bg-slate-950 hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-all shadow-sm"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Segmented Control */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Preferred Delivery Method
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setChannel('WhatsApp')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${channel === 'WhatsApp'
                        ? 'bg-white text-slate-950 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                      }`}
                  >
                    💬 WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('Email')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${channel === 'Email'
                        ? 'bg-white text-slate-950 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                      }`}
                  >
                    📧 Email
                  </button>
                </div>
              </div>

              {/* Contact Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  {channel === 'WhatsApp' ? 'WhatsApp Mobile Number *' : 'Email Address *'}
                </label>
                <input
                  type={channel === 'WhatsApp' ? 'tel' : 'email'}
                  required
                  placeholder={channel === 'WhatsApp' ? 'e.g. 9876543210' : 'e.g. citizen@example.com'}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                />
              </div>

              {/* Category Preference */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Focus Sector
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                >
                  {ALERT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {errorMsg && (
                <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !contact.trim()}
                className="w-full mt-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
              >
                {loading ? 'Subscribing...' : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Subscribe to Verified Alerts
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1 mt-2 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Free Public Service • Zero Spam
              </p>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
