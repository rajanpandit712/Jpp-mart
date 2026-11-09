import { useState, useEffect } from 'react';
import { X, Truck, Tag } from 'lucide-react';

const MESSAGES = [
  { icon: Truck, text: '🚚 Free shipping on orders above ₹499! Shop now.' },
  { icon: Tag,   text: '🎉 New sellers: List your first 10 products FREE. Join JPP Market today!' },
  { icon: Truck, text: '📦 Same-day delivery available in select cities. Check your pincode.' },
];

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [msgIdx,    setMsgIdx]    = useState(0);

  // Rotate messages every 4s
  useEffect(() => {
    if (dismissed) return;
    const timer = setInterval(() => {
      setMsgIdx(prev => (prev + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [dismissed]);

  // Respect user dismiss (persist per session)
  useEffect(() => {
    const saved = sessionStorage.getItem('jpp_ann_dismissed');
    if (saved === '1') setDismissed(true);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('jpp_ann_dismissed', '1');
  };

  if (dismissed) return null;

  const current = MESSAGES[msgIdx];

  return (
    <div
      role="banner"
      className="announcement-bar relative overflow-hidden"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Subtle gradient shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 opacity-50" aria-hidden="true" />

      <div className="relative container-main flex items-center justify-between">
        <div className="flex-1 text-center text-xs sm:text-sm text-white/90 py-0.5 truncate px-8">
          {current.text}
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1 py-0.5" aria-hidden="true">
        {MESSAGES.map((_, i) => (
          <span
            key={i}
            className={`block h-0.5 rounded-full transition-all duration-300 ${
              i === msgIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
