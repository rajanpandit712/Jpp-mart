import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Clock, Flame, ChevronRight, Tag, Percent, ArrowRight } from 'lucide-react';
import { productService } from '../../services';
import ProductCard from '../../components/products/ProductCard';
import { ProductGridSkeleton } from '../../components/common/Skeleton';
import { FLIPKART_CHECKERED_SHIRT } from '../../data/flipkartMockProducts';

export default function DealsPage() {
  const [deals, setDeals] = useState([]);
  const [discountProducts, setDiscountProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      productService.getDeals(),
      productService.getAll({ sort: 'discount', limit: 12 }),
    ])
      .then(([dealsRes, discRes]) => {
        const dList = dealsRes.data?.data || [];
        setDeals(dList.length > 0 ? dList : [FLIPKART_CHECKERED_SHIRT]);
        const pList = discRes.data?.data || [];
        setDiscountProducts(pList.length > 0 ? pList : [FLIPKART_CHECKERED_SHIRT]);
      })
      .catch(() => {
        setDeals([FLIPKART_CHECKERED_SHIRT]);
        setDiscountProducts([FLIPKART_CHECKERED_SHIRT]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-surface-bg min-h-screen pb-16">
      {/* Banner */}
      <div className="bg-linear-to-r from-amber-600 via-rose-600 to-primary-700 text-white py-12 px-4 shadow-md">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-xs text-rose-100 mb-4" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Deals & Offers</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider mb-3">
                <Flame className="w-4 h-4 text-amber-300" />
                <span>Limited Time Offers</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-2">
                Today's Flash Deals
              </h1>
              <p className="text-sm sm:text-base text-rose-100 max-w-xl">
                Unbeatable savings up to 70% off across electronics, fashion, and everyday essentials.
              </p>
            </div>

            {/* Countdown Badge */}
            <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 text-center min-w-[240px]">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-200 uppercase tracking-wider mb-2">
                <Clock className="w-4 h-4 text-amber-300" />
                <span>Offers Expire In</span>
              </div>
              <div className="flex items-center justify-center gap-2 font-mono font-black text-2xl sm:text-3xl">
                <span className="bg-white/10 px-3 py-1.5 rounded-lg">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-white/10 px-3 py-1.5 rounded-lg">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-white/10 px-3 py-1.5 rounded-lg text-amber-300">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-main pt-8 space-y-12">
        {/* Deal of the Day Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
              <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">
                Deals of the Day
              </h2>
            </div>
            <Link to="/products?sort=discount" className="text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1">
              <span>View All Discounts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : deals.length === 0 ? (
            <div className="bg-white border border-surface-border rounded-xl p-8 text-center text-text-muted">
              No flash deals currently active. Check out our biggest discounts below!
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {deals.map((p) => (
                <ProductCard key={p._id} product={p} className="bg-white border border-surface-border shadow-xs" />
              ))}
            </div>
          )}
        </section>

        {/* Highest Discounts Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Percent className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">
                Mega Price Drops
              </h2>
            </div>
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {discountProducts.map((p) => (
                <ProductCard key={p._id} product={p} className="bg-white border border-surface-border shadow-xs" />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}