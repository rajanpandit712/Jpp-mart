import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, Heart, ShoppingCart, Zap, Truck, RotateCcw, ShieldCheck,
  CheckCircle2, ChevronRight, ChevronUp, Share2, AlertCircle, Plus, Minus,
  MessageSquarePlus, Store, MapPin, CreditCard, Ruler, Banknote,
} from 'lucide-react';
import { productService, reviewService } from '../../services';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useLocationContext } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, calcDiscountPct } from '../../utils/helpers';
import ProductCard from '../../components/products/ProductCard';
import Modal from '../../components/common/Modal';
import { FLIPKART_CHECKERED_SHIRT } from '../../data/flipkartMockProducts';
import { MOCK_CATALOG, findMockProduct } from '../../data/mockProductsCatalog';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { selectedLocation, openLocationModal } = useLocationContext();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  // Variant & Option states
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [highlightsOpen, setHighlightsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('specifications'); // 'specifications' | 'manufacturer'

  // Reviews state & filtering
  const [reviews, setReviews] = useState([]);
  const [reviewFilter, setReviewFilter] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Initialize a loaded product safely
  const initProduct = (p, relList = []) => {
    setProduct(p);

    const related = relList.length > 0
      ? relList
      : MOCK_CATALOG.filter((item) => item.slug !== p.slug && item._id !== p._id);
    setRelatedProducts(related);

    // Set colors
    const colors = p.colors || [];
    if (colors.length > 0) {
      setSelectedColor(colors[0]);
      setActiveImage(colors[0].image || (typeof p.images?.[0] === 'string' ? p.images[0] : p.images?.[0]?.url) || '');
    } else {
      setSelectedColor(null);
      const firstImg = typeof p.images?.[0] === 'string' ? p.images[0] : p.images?.[0]?.url;
      setActiveImage(firstImg || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80');
    }

    // Set sizes / configurations
    const sizes = p.sizes || [];
    if (sizes.length > 0) {
      const avail = sizes.find((s) => s.available !== false);
      setSelectedSize(avail ? avail.size : sizes[0].size);
    } else {
      setSelectedSize('');
    }

    setSelectedImgIndex(0);
    setQuantity(1);
    setAppliedOffer(null);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);

    const mockMatch = findMockProduct(slug);

    productService.getBySlug(slug)
      .then((res) => {
        const data = res.data?.data;
        const p = data?.product || data || mockMatch || FLIPKART_CHECKERED_SHIRT;
        initProduct(p, data?.relatedProducts || []);

        if (p?._id) {
          reviewService.getByProduct(p._id)
            .then((rRes) => setReviews(rRes.data?.data || []))
            .catch(() => setReviews([]));
        }
      })
      .catch(() => {
        const fallback = mockMatch || FLIPKART_CHECKERED_SHIRT;
        initProduct(fallback);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container-main py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-10 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-24 bg-gray-200 rounded w-full" />
            <div className="h-12 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  const currentProduct = product || FLIPKART_CHECKERED_SHIRT;
  const {
    _id,
    title,
    brand,
    description = '',
    mrp = 1499,
    price = 312,
    stock = 45,
    ratings = { average: 3.9, count: 3478 },
    images = [],
    seller = { storeName: 'VDLooks', rating: 3.9, yearsWithPlatform: 5 },
    category,
  } = currentProduct;

  const displayName = title || currentProduct.name || 'Product';
  const discPct = calcDiscountPct(mrp, price) || 79;
  const outOfStock = stock <= 0;
  const wishlisted = isWishlisted(_id);

  const colorsList = currentProduct.colors || [];
  const sizesList = currentProduct.sizes || [];
  const bankOffersList = currentProduct.bankOffers || FLIPKART_CHECKERED_SHIRT.bankOffers;
  const sponsoredAd = currentProduct.sponsoredAd;
  const sizeChartData = currentProduct.sizeChart || FLIPKART_CHECKERED_SHIRT.sizeChart;
  const manufacturerInfo = currentProduct.manufacturerInfo || FLIPKART_CHECKERED_SHIRT.manufacturerInfo;

  // Normalized list of images for thumbnails
  const rawImageUrls = (images.length > 0
    ? images.map((img) => (typeof img === 'string' ? img : img.url))
    : (colorsList.length > 0 ? colorsList.map((c) => c.image) : [activeImage])
  ).filter(Boolean);

  // Dynamic delivery date (3 days ahead)
  const deliveryDateObj = new Date();
  deliveryDateObj.setDate(deliveryDateObj.getDate() + 3);
  const formattedDeliveryDate = deliveryDateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    weekday: 'short',
  });

  // Calculate pricing with bank offer if applied
  const finalPrice = appliedOffer ? Math.max(1, price - appliedOffer.amount) : price;
  const specialOfferPrice = Math.max(1, price - 16);

  // Switching colors
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    if (color.image) {
      setActiveImage(color.image);
    }
  };

  // Switching image thumbnail
  const handleThumbnailSelect = (imgUrl, idx) => {
    setSelectedImgIndex(idx);
    setActiveImage(imgUrl);
  };

  const handleAddToCart = async () => {
    if (outOfStock) return;
    setAddingToCart(true);
    const itemToAdd = {
      ...currentProduct,
      selectedColor: selectedColor?.name,
      selectedSize,
      price: finalPrice,
    };
    const result = await addItem(itemToAdd, quantity);
    setAddingToCart(false);
    if (result.success) {
      const details = [selectedColor?.name, selectedSize ? `Size: ${selectedSize}` : ''].filter(Boolean).join(', ');
      toast.success(`Added ${quantity} item(s) to cart ${details ? `(${details})` : ''}!`);
    } else {
      toast.error(result.error || 'Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    if (outOfStock) return;
    setAddingToCart(true);
    const itemToAdd = {
      ...currentProduct,
      selectedColor: selectedColor?.name,
      selectedSize,
      price: finalPrice,
    };
    const result = await addItem(itemToAdd, quantity);
    setAddingToCart(false);
    if (result.success) {
      navigate('/checkout');
    } else {
      toast.error(result.error || 'Failed to proceed to checkout');
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast('Please sign in to save items to your wishlist', { icon: '💡' });
      return;
    }
    const result = await toggle(_id);
    if (result.success) {
      toast.success(result.added ? 'Saved to wishlist!' : 'Removed from wishlist');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: displayName, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  const handleToggleOffer = (offer) => {
    if (appliedOffer?.id === offer.id) {
      setAppliedOffer(null);
      toast('Bank offer removed', { icon: 'ℹ️' });
    } else {
      setAppliedOffer(offer);
      toast.success(`${offer.bankName} offer applied! Extra ₹${offer.amount} saved`);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to submit a review');
      return;
    }
    if (!reviewForm.comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    setSubmittingReview(true);
    try {
      await reviewService.create({
        productId: _id,
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment,
      });
      toast.success('Thank you! Your review has been submitted.');
      setReviewModalOpen(false);
      setReviewForm({ rating: 5, title: '', comment: '' });

      const updated = await reviewService.getByProduct(_id);
      setReviews(updated.data?.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Build specifications list dynamically
  const rawSpecs = currentProduct.specifications instanceof Map
    ? Object.fromEntries(currentProduct.specifications)
    : (currentProduct.specifications || {});

  const specsList = Object.keys(rawSpecs).length > 0
    ? Object.entries(rawSpecs).map(([key, val]) => ({
        key,
        val: key === 'Size' && selectedSize ? selectedSize : (key === 'Color' && selectedColor?.name ? selectedColor.name : String(val)),
      }))
    : [
        { key: 'Brand', val: brand || 'JPP Mart Verified' },
        ...(selectedSize ? [{ key: 'Size / Configuration', val: selectedSize }] : []),
        ...(selectedColor ? [{ key: 'Color', val: selectedColor.name }] : []),
        { key: 'Condition', val: 'Brand New (100% Genuine)' },
        { key: 'Warranty', val: '1 Year Manufacturer Warranty' },
        { key: 'Country of Origin', val: 'India' },
      ];

  // Highlights list dynamically
  const highlightsList = currentProduct.highlights && currentProduct.highlights.length > 0
    ? currentProduct.highlights.map((h) => {
        if (typeof h === 'string') {
          const parts = h.split(':');
          return parts.length > 1
            ? { label: parts[0].trim(), value: parts.slice(1).join(':').trim() }
            : { label: 'Feature', value: h };
        }
        return h;
      })
    : [
        { label: 'Authenticity', value: '100% Genuine & Quality Checked' },
        { label: 'Delivery', value: 'Fast Express Delivery Eligible' },
        { label: 'Returns', value: '10-Day Replacement / Return Policy' },
        { label: 'Payment', value: 'Cash on Delivery & Secure Online Pay' },
      ];

  const isApparel = category?.slug === 'fashion' || colorsList.length > 0 || sizesList.length > 0;

  return (
    <div className="bg-[#f1f2f4] min-h-screen pb-24 sm:pb-16 font-sans">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 py-2.5">
        <div className="container-main">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 truncate" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-gray-400" />
            <Link to="/products" className="hover:text-blue-600 transition-colors">
              {category?.name || 'All Products'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-gray-400" />
            <span className="text-gray-900 font-medium truncate max-w-sm">{displayName}</span>
          </nav>
        </div>
      </div>

      <div className="container-main pt-4 sm:pt-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:divide-x divide-gray-200">
            
            {/* ── LEFT COLUMN: Gallery & Thumbnails ── */}
            <div className="lg:col-span-5 p-4 sm:p-6 flex flex-col gap-4">
              {/* Main Image Container */}
              <div className="relative aspect-4/5 sm:aspect-square bg-white border border-gray-100 rounded-2xl overflow-hidden flex items-center justify-center group">
                <img
                  src={activeImage}
                  alt={displayName}
                  className="w-full h-full object-contain p-2 sm:p-4 group-hover:scale-105 transition-transform duration-300"
                />

                {/* Floating Wishlist Button */}
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  className={`absolute top-3 right-3 p-2.5 rounded-full shadow-sm border transition-all ${
                    wishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'bg-white/95 border-gray-200 text-gray-500 hover:text-rose-600 hover:scale-110'
                  }`}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className="w-5 h-5" fill={wishlisted ? 'currentColor' : 'none'} />
                </button>

                {/* Floating Share Button */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="absolute top-14 right-3 p-2.5 rounded-full shadow-sm border bg-white/95 border-gray-200 text-gray-500 hover:text-blue-600 hover:scale-110 transition-all"
                  aria-label="Share product"
                >
                  <Share2 className="w-5 h-5" />
                </button>

                {/* Discount Badge */}
                {discPct > 0 && (
                  <div className="absolute top-3 left-3 bg-[#388e3c] text-white text-xs font-black px-2.5 py-1 rounded-md shadow-xs">
                    ↓{discPct}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnails of Alternate Views */}
              {rawImageUrls.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                  {rawImageUrls.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleThumbnailSelect(imgUrl, idx)}
                      className={`w-16 h-20 rounded-xl border-2 overflow-hidden shrink-0 transition-all p-0.5 ${
                        activeImage === imgUrl
                          ? 'border-black ring-1 ring-black shadow-xs'
                          : 'border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                    </button>
                  ))}
                </div>
              )}

              {/* Desktop CTA Action Buttons */}
              <div className="hidden sm:grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={outOfStock || addingToCart}
                  className="py-3.5 px-4 rounded-xl font-bold text-sm bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 hover:border-gray-400 shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{outOfStock ? 'Out of Stock' : 'Add to cart'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={outOfStock || addingToCart}
                  className="py-3.5 px-4 rounded-xl font-bold text-sm bg-[#ffc200] hover:bg-[#ffb300] text-gray-900 shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Buy at {formatCurrency(finalPrice)}</span>
                </button>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Product Info & Flipkart UI Sections ── */}
            <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col justify-between">
              <div>
                
                {/* 1. TOP SPONSORED/RECOMMENDED MINI PILL */}
                {sponsoredAd && (
                  <div className="mb-4 p-2 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={sponsoredAd.image}
                        alt="Sponsored recommendation"
                        className="w-8 h-8 rounded-md object-cover border border-gray-200 shrink-0"
                      />
                      <span className="text-gray-700 truncate font-medium">
                        {sponsoredAd.title}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 border border-gray-300 px-1 rounded uppercase shrink-0">
                        AD
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 text-right">
                      <span className="text-[#388e3c] font-bold">↓{sponsoredAd.discountPct}%</span>
                      <span className="text-gray-400 line-through text-[11px]">{formatCurrency(sponsoredAd.mrp)}</span>
                      <span className="font-extrabold text-gray-900">{formatCurrency(sponsoredAd.price)}</span>
                    </div>
                  </div>
                )}

                {/* 2. COLOR SELECTION VARIANT SELECTOR */}
                {colorsList.length > 0 && selectedColor && (
                  <div className="mb-5">
                    <div className="text-sm font-semibold text-gray-900 mb-2.5">
                      Selected Color: <span className="font-bold">{selectedColor.name}</span>
                    </div>
                    <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                      {colorsList.map((color) => {
                        const isSelected = selectedColor.id === color.id;
                        return (
                          <button
                            key={color.id}
                            type="button"
                            onClick={() => handleColorSelect(color)}
                            className={`relative w-16 h-20 sm:w-18 sm:h-22 rounded-xl p-1 bg-white flex flex-col items-center justify-center transition-all shrink-0 ${
                              isSelected
                                ? 'border-2 border-black ring-1 ring-black shadow-xs scale-105'
                                : 'border border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={color.thumbnail || color.image}
                              alt={color.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. SIZE / CONFIGURATION SELECTION */}
                {sizesList.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-sm font-semibold text-gray-900">
                        {isApparel ? 'Select Size' : 'Select Option / Configuration'}
                      </span>
                      {isApparel && sizeChartData && (
                        <button
                          type="button"
                          onClick={() => setSizeChartOpen(true)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Ruler className="w-3.5 h-3.5" />
                          <span>Size Chart</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                      {sizesList.map((s) => {
                        const isSelected = selectedSize === s.size;
                        const isAvailable = s.available !== false;
                        return (
                          <button
                            key={s.size}
                            disabled={!isAvailable}
                            onClick={() => isAvailable && setSelectedSize(s.size)}
                            className={`relative min-w-[50px] h-10 px-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center ${
                              !isAvailable
                                ? 'bg-gray-100 text-gray-400 border border-dashed border-gray-300 cursor-not-allowed overflow-hidden'
                                : isSelected
                                ? 'border-2 border-black bg-white text-gray-900 ring-1 ring-black shadow-xs'
                                : 'border border-gray-300 bg-white text-gray-800 hover:border-gray-500'
                            }`}
                          >
                            {!isAvailable && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-full h-[1.5px] bg-gray-400 transform -rotate-45" />
                              </div>
                            )}
                            <span>{s.size}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. PRODUCT TITLE */}
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight leading-snug mb-2">
                  {displayName}
                </h1>

                {/* 5. FLIPKART GREEN RATING BADGE */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#388e3c] text-white text-xs font-bold shadow-2xs">
                    <span>{ratings.average?.toFixed(1) || '4.2'}</span>
                    <Star className="w-3 h-3 fill-current" />
                    <span className="opacity-60 font-normal">|</span>
                    <span className="font-semibold text-[11px]">
                      {ratings.count?.toLocaleString('en-IN') || '1,240'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Ratings & Reviews</span>
                </div>

                {/* 6. FLIPKART PRICE SECTION */}
                <div className="flex items-baseline gap-3 flex-wrap mb-4">
                  {discPct > 0 && (
                    <span className="text-[#388e3c] font-black text-2xl tracking-tight">
                      ↓{discPct}%
                    </span>
                  )}
                  {mrp > price && (
                    <span className="text-gray-400 line-through text-lg font-medium">
                      {formatCurrency(mrp)}
                    </span>
                  )}
                  <span className="text-gray-900 font-extrabold text-3xl sm:text-4xl tracking-tight">
                    {formatCurrency(price)}
                  </span>
                </div>

                {/* 7. WOW! DEAL SPECIAL SAVINGS CALLOUT BOX */}
                <div className="rounded-2xl overflow-hidden border border-blue-200 mb-6 shadow-xs">
                  <div className="bg-[#1a4fba] text-white px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-white text-[#1a4fba] text-[10px] font-black px-2 py-0.5 rounded-sm tracking-wider uppercase">
                        WOW! DEAL
                      </span>
                      <span className="text-xs font-semibold">Apply offers for maximum savings</span>
                    </div>
                    <ChevronUp className="w-4 h-4 opacity-80" />
                  </div>

                  <div className="bg-[#e8f2fe] px-4 py-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#1a4fba]">
                      Buy at {formatCurrency(appliedOffer ? (price - appliedOffer.amount) : specialOfferPrice)}
                    </span>
                    {appliedOffer && (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Offer applied (Save ₹{appliedOffer.amount})
                      </span>
                    )}
                  </div>
                </div>

                {/* 8. BANK OFFERS CARDS */}
                {bankOffersList.length > 0 && (
                  <div className="mb-6">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                      Available Bank Offers
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {bankOffersList.map((offer) => {
                        const isApplied = appliedOffer?.id === offer.id;
                        return (
                          <div
                            key={offer.id}
                            className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                              isApplied
                                ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-300'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                                <CreditCard className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-gray-900 truncate">{offer.bankName}</span>
                                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
                                    {offer.discountText}
                                  </span>
                                </div>
                                <p className="text-[11px] text-gray-500 truncate">{offer.cardType}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleToggleOffer(offer)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                                isApplied
                                  ? 'bg-emerald-600 text-white'
                                  : 'text-blue-600 hover:bg-blue-50 border border-blue-200'
                              }`}
                            >
                              {isApplied ? 'Applied ✓' : 'Apply'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 9. DELIVERY DETAILS SECTION */}
                <div className="mb-6">
                  <h3 className="text-base font-bold text-gray-900 mb-3">Delivery details</h3>

                  <div className="bg-[#f0f6ff] border border-[#d8e6fd] rounded-xl p-3 flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-xs text-gray-700 truncate">
                        {selectedLocation?.pincode ? (
                          <>
                            Deliver to: <strong className="text-gray-900 font-bold">{selectedLocation.pincode}</strong> - {selectedLocation.locality || selectedLocation.city}
                          </>
                        ) : (
                          <>
                            Location not set <strong className="text-blue-600 font-semibold cursor-pointer">Select delivery location &gt;</strong>
                          </>
                        )}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={openLocationModal}
                      className="text-xs font-bold text-blue-600 hover:underline shrink-0 ml-2"
                    >
                      {selectedLocation?.pincode ? 'Change' : 'Select'}
                    </button>
                  </div>

                  <div className="flex items-center gap-3 py-2 text-xs text-gray-800 border-b border-gray-100">
                    <Truck className="w-4 h-4 text-gray-600 shrink-0" />
                    <span className="font-medium">
                      Delivery by <strong className="font-bold text-gray-900">{formattedDeliveryDate}</strong>
                    </span>
                  </div>

                  <div className="flex items-start gap-3 py-2.5 text-xs text-gray-800 border-b border-gray-100">
                    <Store className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                    <div>
                      <span>Fulfilled by <strong className="font-bold text-gray-900">{seller?.storeName || 'Verified Merchant'}</strong></span>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5 flex-wrap">
                        <span className="bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                          {seller?.rating || '4.5'} <Star className="w-2.5 h-2.5 fill-current" />
                        </span>
                        <span>•</span>
                        <span>{seller?.yearsWithPlatform || 4} years with JPP Mart</span>
                        <span>•</span>
                        <Link to="/products" className="text-blue-600 hover:underline font-semibold">
                          See other sellers
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 10. TRUST & POLICY BADGES */}
                <div className="grid grid-cols-3 gap-3 py-5 border-y border-gray-200 text-center my-6">
                  <div className="flex flex-col items-center">
                    <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 shadow-2xs">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-gray-800">10-Day Return</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 shadow-2xs">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-gray-800">Cash on Delivery</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 shadow-2xs">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-gray-800">JPP Assured</span>
                  </div>
                </div>

                {/* 11. PRODUCT HIGHLIGHTS ACCORDION */}
                <div className="border border-gray-200 rounded-2xl mb-6 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setHighlightsOpen(!highlightsOpen)}
                    className="w-full px-5 py-3.5 flex items-center justify-between text-left bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-bold text-gray-900">Product highlights</span>
                    <ChevronUp className={`w-4 h-4 text-gray-500 transition-transform ${highlightsOpen ? '' : 'rotate-180'}`} />
                  </button>
                  {highlightsOpen && (
                    <div className="px-5 pb-4 pt-1 border-t border-gray-100 bg-white">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6">
                        {highlightsList.map((item, idx) => (
                          <div key={idx} className="flex justify-between py-1 border-b border-gray-50 text-xs">
                            <span className="text-gray-500">{item.label}</span>
                            <span className="font-semibold text-gray-900">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 12. SPECIFICATIONS & MANUFACTURER INFO TABS */}
                <div className="border border-gray-200 rounded-2xl p-4 sm:p-5 mb-6 bg-white shadow-2xs">
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('specifications')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'specifications'
                          ? 'bg-black text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Specifications
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('manufacturer')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'manufacturer'
                          ? 'bg-black text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Manufacturer info
                    </button>
                  </div>

                  {activeTab === 'specifications' ? (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">General Specifications</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                        {specsList.map(({ key, val }) => (
                          <div key={key} className="flex justify-between py-2 border-b border-gray-100 text-xs">
                            <span className="text-gray-500 w-1/2">{key}</span>
                            <span className="text-gray-900 font-semibold w-1/2 text-left pl-2">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                        Manufacturer & Compliance Details
                      </h4>
                      <div className="space-y-2 text-xs">
                        {Object.entries(manufacturerInfo).map(([key, val]) => (
                          <div key={key} className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100 gap-1">
                            <span className="text-gray-500 sm:w-1/3">{key}</span>
                            <span className="text-gray-900 font-medium sm:w-2/3">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Description */}
                {description && (
                  <div className="border border-gray-200 rounded-2xl p-4 sm:p-5 mb-6 bg-white shadow-2xs">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Description</h3>
                    <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                      {description}
                    </p>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                Customer Ratings & Reviews
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#388e3c] text-white text-xs font-bold">
                  <span>{ratings.average?.toFixed(1) || '4.2'}</span>
                  <Star className="w-3 h-3 fill-current" />
                </div>
                <span className="text-sm font-bold text-gray-800">
                  {ratings.count ? `${ratings.count.toLocaleString('en-IN')} ratings and reviews` : '1,240 verified reviews'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  toast('Please sign in to write a review', { icon: '🔑' });
                  navigate('/login');
                  return;
                }
                setReviewModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-xl text-xs transition-colors flex items-center gap-2 border border-blue-200"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Rate Product</span>
            </button>
          </div>

          {/* Rating Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 mb-8 bg-gray-50 rounded-2xl border border-gray-200">
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-3 border-b md:border-b-0 md:border-r border-gray-200">
              <span className="text-5xl font-black text-gray-900 mb-1">
                {ratings.average?.toFixed(1) || '4.2'}
              </span>
              <div className="flex items-center text-amber-400 gap-0.5 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="w-4 h-4"
                    fill={s <= Math.round(ratings.average || 4) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {ratings.count?.toLocaleString('en-IN') || '1,240'} Ratings & Verified Customer Reviews
              </span>
            </div>

            <div className="md:col-span-8 flex flex-col justify-center space-y-1.5">
              {[
                { star: 5, pct: 72 },
                { star: 4, pct: 18 },
                { star: 3, pct: 5 },
                { star: 2, pct: 3 },
                { star: 1, pct: 2 },
              ].map(({ star, pct }) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewFilter(cur => cur === star ? null : star)}
                  className={`flex items-center gap-2.5 text-xs w-full text-left rounded-lg px-2 py-1 transition-colors ${
                    reviewFilter === star ? 'bg-blue-100/70 font-bold' : 'hover:bg-gray-200/50'
                  }`}
                  title={`Filter by ${star} stars`}
                >
                  <span className="w-7 font-bold text-gray-800 flex items-center gap-0.5">
                    {star} ★
                  </span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#388e3c] rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-9 text-right text-gray-500 font-mono text-[11px]">{pct}%</span>
                </button>
              ))}
              {reviewFilter && (
                <div className="pt-1 text-right">
                  <button
                    type="button"
                    onClick={() => setReviewFilter(null)}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sample Reviews */}
          <div className="space-y-4">
            {(reviews.length > 0 ? reviews : [
              {
                _id: 'rev-1',
                user: { name: 'Karan Mehra' },
                rating: 5,
                title: 'Exceptional build quality & performance!',
                comment: 'Delivered before expected date. The packaging was secure and product works flawlessly right out of the box. Highly recommended!',
                createdAt: '2026-11-04T10:00:00Z',
                isVerifiedPurchase: true,
              },
              {
                _id: 'rev-2',
                user: { name: 'Pooja Nair' },
                rating: 5,
                title: 'Value for money product',
                comment: 'Accurate description, exactly as shown in photographs. Customer service was also very responsive.',
                createdAt: '2026-10-29T14:30:00Z',
                isVerifiedPurchase: true,
              },
            ]).map((rev) => (
              <div key={rev._id} className="pb-4 border-b border-gray-100 last:border-none">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                    {rev.rating} ★
                  </span>
                  <span className="text-xs font-bold text-gray-900">{rev.title}</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed mb-2">{rev.comment}</p>
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <span className="font-semibold text-gray-600">{rev.user?.name || 'Verified Customer'}</span>
                  <span>•</span>
                  <span>{new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  {rev.isVerifiedPurchase && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Certified Buyer
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-10 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
              Similar Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} className="bg-white border border-gray-200 shadow-xs" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── STICKY BOTTOM ACTION BAR (Mobile & Floating for Desktop) ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-40 sm:hidden shadow-lg">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock || addingToCart}
            className="flex-1 py-3 px-3 rounded-xl font-bold text-xs bg-white text-gray-900 border border-gray-300 shadow-xs flex items-center justify-center gap-1.5"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to cart</span>
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={outOfStock || addingToCart}
            className="flex-1 py-3 px-3 rounded-xl font-bold text-xs bg-[#ffc200] active:bg-[#ffb300] text-gray-900 shadow-xs flex items-center justify-center gap-1.5"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Buy at {formatCurrency(finalPrice)}</span>
          </button>
        </div>
      </div>

      {/* ── SIZE CHART MODAL ── */}
      {sizeChartOpen && (
        <Modal
          isOpen={sizeChartOpen}
          onClose={() => setSizeChartOpen(false)}
          title="Size Guide & Measurement Chart"
        >
          <div className="space-y-4 pt-1">
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-[11px]">
                  <tr>
                    <th className="px-3 py-2.5 border-b border-gray-200">Size</th>
                    <th className="px-3 py-2.5 border-b border-gray-200">Chest</th>
                    <th className="px-3 py-2.5 border-b border-gray-200">Front Length</th>
                    <th className="px-3 py-2.5 border-b border-gray-200">Shoulder</th>
                    <th className="px-3 py-2.5 border-b border-gray-200">Sleeve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {sizeChartData.map((row) => (
                    <tr
                      key={row.size}
                      className={selectedSize === row.size ? 'bg-blue-50/70 font-bold' : 'hover:bg-gray-50'}
                    >
                      <td className="px-3 py-2 font-bold text-gray-900">{row.size}</td>
                      <td className="px-3 py-2 text-gray-700">{row.chest}</td>
                      <td className="px-3 py-2 text-gray-700">{row.length}</td>
                      <td className="px-3 py-2 text-gray-700">{row.shoulder}</td>
                      <td className="px-3 py-2 text-gray-700">{row.sleeve}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 text-xs text-gray-700 space-y-1">
              <strong className="text-gray-900 block mb-1">How to Measure:</strong>
              <p>• <strong>Chest:</strong> Measure around fullest part of chest, keeping tape horizontal.</p>
              <p>• <strong>Length:</strong> Measure from highest point of shoulder seam to bottom hem.</p>
              <p>• <strong>Shoulder:</strong> Measure from tip of one shoulder across back to other shoulder.</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSizeChartOpen(false)}
                className="px-5 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── WRITE REVIEW MODAL ── */}
      {reviewModalOpen && (
        <Modal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          title="Rate & Review Product"
        >
          <form onSubmit={handleReviewSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Overall Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className="p-1 text-amber-400 hover:scale-125 transition-transform"
                  >
                    <Star
                      className="w-6 h-6"
                      fill={star <= reviewForm.rating ? 'currentColor' : 'none'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Headline / Title
              </label>
              <input
                type="text"
                placeholder="e.g. Great fabric, perfect fit!"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Your Review
              </label>
              <textarea
                rows={4}
                required
                placeholder="Write your honest review..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingReview}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
