"use client";

import { useState } from 'react';
import { Bell, X, CheckCircle2, ShieldCheck, Sparkles, Send } from 'lucide-react';

const ALERT_CATEGORIES = [
  '⚡ All New Government Schemes',
  '🎓 Scholarships & Student Aid',
  '🌾 Farmer Subsidies & Agriculture Grants',
  '👩 Women & Child Welfare Schemes',
  '💼 MSME, Business & Self-Employment Loans',
  '🏥 Free Healthcare & Hospital Benefits'
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
  const [state, setState] = useState('All India');
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
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 relative">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-700 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-3 backdrop-blur-sm">
            <Bell className="w-6 h-6 text-white" />
          </div>
          
          <h3 className="text-2xl font-black">Get Free Scheme Alerts</h3>
          <p className="text-xs text-primary-100 mt-1">
            Never miss new government subsidies, scholarship deadlines, or direct benefit launches.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-6 animate-fade-in space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">You are Subscribed! 🎉</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                We will notify you on <strong>{contact}</strong> as soon as new schemes matching your preferences are released.
              </p>
              <button
                onClick={() => { setSubmitted(false); onClose(); }}
                className="mt-4 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Channel Selector (WhatsApp / Email) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Receive Alerts Via:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel('WhatsApp')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                      channel === 'WhatsApp'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    💬 WhatsApp Alerts
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('Email')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                      channel === 'Email'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    📧 Email Alerts
                  </button>
                </div>
              </div>

              {/* Contact Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {channel === 'WhatsApp' ? 'WhatsApp Mobile Number *' : 'Email Address *'}
                </label>
                <input
                  type={channel === 'WhatsApp' ? 'tel' : 'email'}
                  required
                  placeholder={channel === 'WhatsApp' ? 'e.g. 9876543210' : 'e.g. citizen@example.com'}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all"
                />
              </div>

              {/* Category Preference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Scheme Category of Interest
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all cursor-pointer"
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
                className="w-full mt-2 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-primary-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : (
                  <>
                    <Send className="w-4 h-4" /> Subscribe to Free Alerts
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1 mt-3">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Free. No spam. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
