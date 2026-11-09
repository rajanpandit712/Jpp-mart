import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail, Phone, MapPin, Shield, Truck, RefreshCcw, Headphones,
  ChevronDown, ChevronUp,
} from 'lucide-react';

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const FOOTER_LINKS = {
  company: {
    title: 'Company',
    links: [
      { label: 'About JPP Market', to: '/about' },
      { label: 'Careers',          to: '/careers' },
      { label: 'Press Room',       to: '/press' },
      { label: 'Blog',             to: '/blog' },
      { label: 'Investor Relations',to: '/investors' },
    ],
  },
  shop: {
    title: 'Shop',
    links: [
      { label: 'All Products',     to: '/products' },
      { label: 'Today\'s Deals',   to: '/deals' },
      { label: 'New Arrivals',     to: '/new-arrivals' },
      { label: 'Best Sellers',     to: '/best-sellers' },
      { label: 'Gift Cards',       to: '/gift-cards' },
    ],
  },
  sell: {
    title: 'Sell With Us',
    links: [
      { label: 'Become a Seller',  to: '/seller/register' },
      { label: 'Seller Portal',    to: '/seller/login' },
      { label: 'Seller Guidelines',to: '/seller/guidelines' },
      { label: 'Seller Fees',      to: '/seller/fees' },
      { label: 'Seller Support',   to: '/seller/support' },
    ],
  },
  support: {
    title: 'Support',
    links: [
      { label: 'Help Centre',      to: '/help' },
      { label: 'Track Your Order', to: '/account/orders' },
      { label: 'Returns & Refunds',to: '/returns' },
      { label: 'Shipping Info',    to: '/shipping' },
      { label: 'Contact Us',       to: '/contact' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Privacy Policy',   to: '/privacy' },
      { label: 'Cookie Policy',    to: '/cookies' },
      { label: 'Seller Agreement', to: '/seller-agreement' },
      { label: 'Grievance Officer',to: '/grievance' },
    ],
  },
};

const TRUST_BADGES = [
  { icon: Truck,        title: 'Free Shipping',        desc: 'On orders above ₹499' },
  { icon: RefreshCcw,   title: 'Easy Returns',          desc: '10-day return policy' },
  { icon: Shield,       title: 'Secure Payments',       desc: '100% safe & encrypted' },
  { icon: Headphones,   title: '24/7 Support',          desc: 'Always here to help' },
];

const SOCIAL = [
  { icon: FacebookIcon,  href: '#', label: 'Facebook'  },
  { icon: TwitterIcon,   href: '#', label: 'Twitter'   },
  { icon: InstagramIcon, href: '#', label: 'Instagram' },
  { icon: YoutubeIcon,   href: '#', label: 'YouTube'   },
  { icon: LinkedinIcon,  href: '#', label: 'LinkedIn'  },
];

function AccordionSection({ title, links }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 md:border-0">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between w-full py-4 md:py-0 text-white font-semibold text-sm
                   md:cursor-default md:pointer-events-none"
        aria-expanded={open}
      >
        {title}
        <span className="md:hidden">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>
      <ul className={`space-y-2 pb-4 md:pb-0 md:mt-4 ${open ? 'block' : 'hidden md:block'}`}>
        {links.map(({ label, to }) => (
          <li key={to}>
            <Link
              to={to}
              className="text-sm text-blue-200 hover:text-white transition-colors"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-navy-900 text-white mt-auto">

      {/* Trust badges */}
      <div className="border-b border-white/10">
        <div className="container-main py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_BADGES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary-400" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-blue-300">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-0 md:gap-8">

          {/* Brand column */}
          <div className="md:col-span-1 mb-8 md:mb-0">
            {/* Logo */}
            <Link to="/" className="inline-block mb-3 group">
              <img
                src="/jpp-mart-logo.jpg"
                alt="JPP Mart"
                className="h-10 sm:h-12 w-auto object-contain rounded-lg transition-transform group-hover:scale-105"
              />
            </Link>
            <p className="text-sm text-blue-200 mb-6 leading-relaxed">
              Everything You Need, One Marketplace. India&apos;s trusted multi-vendor shopping destination.
            </p>

            {/* Contact */}
            <div className="space-y-2 text-xs text-blue-300">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                <a href="mailto:support@jppmarket.in" className="hover:text-white transition-colors">
                  support@jppmarket.in
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                <a href="tel:+918000000000" className="hover:text-white transition-colors">
                  +91 80000 00000
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Bengaluru, Karnataka, India</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          <div className="md:col-span-5 grid grid-cols-1 md:grid-cols-5 gap-0 md:gap-6">
            {Object.values(FOOTER_LINKS).map((section) => (
              <AccordionSection key={section.title} title={section.title} links={section.links} />
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-10 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white mb-1">
                Subscribe to our Newsletter
              </h3>
              <p className="text-sm text-blue-300">
                Get the best deals and new arrivals straight to your inbox.
              </p>
            </div>
            {subscribed ? (
              <p className="text-sm text-success-400 font-medium">
                ✅ Thanks for subscribing!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 md:w-64 px-4 py-2.5 text-sm bg-white/10 border border-white/20
                             text-white placeholder:text-blue-300 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg
                             hover:bg-primary-700 transition-colors flex-shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-main py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-blue-300">
              © {new Date().getFullYear()} JPP Market Pvt. Ltd. All rights reserved.
              &nbsp;·&nbsp;CIN: U12345KA2024PTC000001
            </p>

            {/* Social */}
            <div className="flex items-center gap-2">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center
                             transition-colors text-blue-200 hover:text-white"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>

            {/* Payment logos text */}
            <div className="flex items-center gap-2 text-xs text-blue-300">
              <span>Payments:</span>
              <span className="font-medium text-white">UPI · Cards · Net Banking · EMI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
