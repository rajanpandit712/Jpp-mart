import config from '../config/app.config';

/**
 * Format a number as Indian Rupees.
 * e.g. formatCurrency(1299) → "₹1,299"
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat(config.currency.locale, {
    style:    'currency',
    currency: config.currency.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate discount percentage from MRP and selling price.
 */
export function calcDiscountPct(mrp, price) {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

/**
 * Truncate a string to a given max length, appending ellipsis.
 */
export function truncate(str, maxLen = 80) {
  if (!str) return '';
  return str.length > maxLen ? `${str.slice(0, maxLen).trimEnd()}…` : str;
}

/**
 * Slugify a string → url-safe lowercase slug
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Debounce a function call.
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Format a date to a human-readable string.
 */
export function formatDate(date, options = {}) {
  if (!date) return '';
  const defaults = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Intl.DateTimeFormat('en-IN', { ...defaults, ...options }).format(new Date(date));
}

/**
 * Format a date-time string.
 */
export function formatDateTime(date) {
  return formatDate(date, {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/**
 * Generate a star rating array for display.
 * e.g. starsArray(4.3) → [1,1,1,1,0] (1=full, 0.5=half, 0=empty)
 */
export function starsArray(rating, total = 5) {
  const arr = [];
  for (let i = 1; i <= total; i++) {
    if (rating >= i) arr.push(1);
    else if (rating >= i - 0.5) arr.push(0.5);
    else arr.push(0);
  }
  return arr;
}

/**
 * Get initials from a full name string.
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('');
}

/**
 * Safely parse a JSON string, returning a fallback value on error.
 */
export function safeJsonParse(str, fallback = null) {
  try { return JSON.parse(str); }
  catch { return fallback; }
}

/**
 * Build a query string from a params object, omitting empty values.
 */
export function buildQueryString(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.set(k, v);
  });
  const str = qs.toString();
  return str ? `?${str}` : '';
}

/**
 * Scroll to the top of the page smoothly.
 */
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Convert bytes to a human-readable file size string.
 */
export function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
