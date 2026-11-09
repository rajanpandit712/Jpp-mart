import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Zap } from 'lucide-react';

const CATEGORIES = [
  { label: 'All Categories', to: '/categories', icon: '🏪' },
  { label: 'Electronics',    to: '/category/electronics',   icon: '📱' },
  { label: 'Fashion',        to: '/category/fashion',       icon: '👗' },
  { label: 'Home & Kitchen', to: '/category/home-kitchen',  icon: '🏠' },
  { label: 'Beauty & Care',  to: '/category/beauty',        icon: '✨' },
  { label: 'Grocery',        to: '/category/grocery',       icon: '🛒' },
  { label: 'Sports',         to: '/category/sports',        icon: '⚽' },
  { label: 'Books',          to: '/category/books',         icon: '📚' },
  { label: 'Toys & Baby',    to: '/category/toys',          icon: '🧸' },
  { label: 'Footwear',       to: '/category/footwear',      icon: '👟' },
  { label: 'Accessories',    to: '/category/accessories',   icon: '🎒' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav
      className="hidden lg:block bg-[#132238] border-b border-white/10"
      aria-label="Main category navigation"
    >
      <div className="container-main">
        <div className="flex items-center gap-0 overflow-x-auto scrollbar-none py-0.5">

          {CATEGORIES.map(({ label, to, icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium whitespace-nowrap
                            transition-all duration-150 rounded-sm flex-shrink-0
                            ${active
                              ? 'text-white bg-white/15'
                              : 'text-white/80 hover:text-white hover:bg-white/10'
                            }`}
                aria-current={active ? 'page' : undefined}
              >
                <span aria-hidden="true" className="text-sm">{icon}</span>
                {label}
              </Link>
            );
          })}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Deals highlight */}
          <Link
            to="/deals"
            className="flex items-center gap-1.5 px-4 py-2 ml-2 text-sm font-semibold
                       text-navy-900 bg-warning-400 hover:bg-warning-300
                       rounded-lg transition-colors duration-150 flex-shrink-0"
          >
            <Zap className="w-3.5 h-3.5" aria-hidden="true" />
            Deals &amp; Offers
          </Link>
        </div>
      </div>
    </nav>
  );
}
