"use client";

import { useState, useEffect, useRef } from 'react';
import { X, Check, MessageSquare, Mail, ChevronDown } from 'lucide-react';
import Logo from '@/components/Logo';

const CATEGORIES = [
  'All Government Schemes',
  'Scholarships & Higher Education',
  'Farmer Subsidies & Agriculture',
  'Women & Child Welfare',
  'MSME & Startup Loans',
  'Free Healthcare & Medical'
];

const STATES = [
  'All India (Central + States)',
  'Maharashtra',
  'Delhi',
  'Karnataka',
  'Uttar Pradesh',
  'Gujarat',
  'Tamil Nadu',
  'Rajasthan',
  'Madhya Pradesh'
];

export default function SchemeAlertModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [state, setState] = useState(STATES[0]);
  const [channel, setChannel] = useState<'WhatsApp' | 'Email'>('WhatsApp');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
        body: JSON.stringify({ 
          contact: contact.trim(), 
          category, 
          state, 
          channel 
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || 'Unable to register alert. Please try again.');
      }
    } catch {
      setErrorMsg('Connection error. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-[#F2F2F7] border border-[#E5E5EA] w-full max-w-[360px] rounded-[24px] p-4.5 sm:p-5 shadow-[0_16px_40px_rgba(0,0,0,0.14)] relative animate-in zoom-in-[0.98] duration-150 text-[#000000]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-6.5 h-6.5 rounded-full bg-[#E5E5EA] hover:bg-[#D1D1D6] text-[#8E8E93] hover:text-[#000000] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-3 mb-4 pr-6">
          <div className="w-10 h-10 rounded-[20%] bg-white border border-[#E5E5EA] flex items-center justify-center shrink-0 shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
            <Logo size={24} color="#000000" />
          </div>
          <div>
            <h3 className="font-semibold text-[16px] text-[#000000] tracking-tight leading-tight">
              Scheme Alerts
            </h3>
            <p className="text-[12px] text-[#8E8E93] font-normal">
              DigitalWelfare Push Service
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="text-center py-4 space-y-3.5 animate-in fade-in duration-200">
            <div className="w-12 h-12 bg-[#34C759]/10 text-[#34C759] rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>

            <div className="space-y-0.5">
              <h4 className="text-[16px] font-semibold text-[#000000]">
                Alerts Enabled
              </h4>
              <p className="text-[12px] text-[#6E6E73] max-w-[260px] mx-auto leading-relaxed">
                You will receive instant updates for <span className="font-medium text-[#000000]">{category}</span> on <span className="font-medium text-[#000000]">{contact}</span>.
              </p>
            </div>

            <button
              onClick={() => { setSubmitted(false); onClose(); }}
              className="w-full py-2.5 bg-[#007AFF] hover:bg-[#0066D6] text-white rounded-[12px] text-[14px] font-semibold transition-colors cursor-pointer active:scale-[0.98]"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="bg-[#E5E5EA] p-[2.5px] rounded-[9px] grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setChannel('WhatsApp')}
                className={`py-1.5 px-2.5 rounded-[7px] text-[12.5px] font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  channel === 'WhatsApp'
                    ? 'bg-white text-[#000000] shadow-[0_1px_2px_rgba(0,0,0,0.12)] font-semibold'
                    : 'text-[#6E6E73] hover:text-[#000000]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#34C759]" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('Email')}
                className={`py-1.5 px-2.5 rounded-[7px] text-[12.5px] font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  channel === 'Email'
                    ? 'bg-white text-[#000000] shadow-[0_1px_2px_rgba(0,0,0,0.12)] font-semibold'
                    : 'text-[#6E6E73] hover:text-[#000000]'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-[#007AFF]" />
                <span>Email</span>
              </button>
            </div>

            <div className="bg-white rounded-[14px] border border-[#E5E5EA] divide-y divide-[#E5E5EA] overflow-hidden shadow-2xs">
              <div className="px-3 py-2 flex items-center gap-2">
                <span className="text-[12px] font-medium text-[#8E8E93] w-12 shrink-0">
                  {channel === 'WhatsApp' ? 'Mobile' : 'Email'}
                </span>
                {channel === 'WhatsApp' && (
                  <span className="text-[13px] font-medium text-[#000000] shrink-0">
                    +91
                  </span>
                )}
                <input
                  ref={inputRef}
                  type={channel === 'WhatsApp' ? 'tel' : 'email'}
                  required
                  placeholder={channel === 'WhatsApp' ? '98765 43210' : 'name@example.com'}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="flex-1 bg-transparent text-[13px] font-normal text-[#000000] placeholder:text-[#C7C7CC] focus:outline-none min-w-0"
                />
                {contact && (
                  <button
                    type="button"
                    onClick={() => setContact('')}
                    className="w-3.5 h-3.5 rounded-full bg-[#C7C7CC] text-white flex items-center justify-center text-[9px] shrink-0 hover:bg-[#8E8E93]"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="px-3 py-2 relative flex flex-col justify-center">
                <span className="text-[10.5px] font-medium text-[#8E8E93] uppercase tracking-wide leading-none mb-0.5">
                  Scheme Category
                </span>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-transparent text-[13px] font-medium text-[#000000] text-left focus:outline-none cursor-pointer appearance-none pr-6 truncate"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="text-[#000000] bg-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8E8E93] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="px-3 py-2 relative flex flex-col justify-center">
                <span className="text-[10.5px] font-medium text-[#8E8E93] uppercase tracking-wide leading-none mb-0.5">
                  State / Region
                </span>
                <div className="relative">
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-transparent text-[13px] font-medium text-[#000000] text-left focus:outline-none cursor-pointer appearance-none pr-6 truncate"
                  >
                    {STATES.map((st) => (
                      <option key={st} value={st} className="text-[#000000] bg-white">
                        {st}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8E8E93] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2 rounded-[9px] bg-[#FF3B30]/10 text-[#FF3B30] text-[11.5px] text-center font-medium">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !contact.trim()}
              className="w-full py-2.5 bg-[#007AFF] hover:bg-[#0066D6] disabled:opacity-40 text-white font-semibold text-[14px] rounded-[12px] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Subscribe for Alerts</span>
              )}
            </button>

            <p className="text-[10.5px] text-[#8E8E93] text-center font-normal">
              Official notifications only. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
