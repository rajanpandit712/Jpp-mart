import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

/**
 * Pagination – page number controls.
 * @param {number} currentPage   - 1-based current page
 * @param {number} totalPages    - total page count
 * @param {function} onPageChange - called with new page number
 */
export default function Pagination({ currentPage, totalPages, onPageChange, className = '' }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2; // siblings around current page

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (
      i === currentPage - delta - 1 ||
      i === currentPage + delta + 1
    ) {
      pages.push('...');
    }
  }

  const btnBase = 'inline-flex items-center justify-center w-9 h-9 text-sm font-medium rounded-lg transition-colors duration-150 border';

  return (
    <nav className={`flex items-center gap-1 ${className}`} aria-label="Pagination">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btnBase} border-surface-border text-text-secondary hover:bg-surface-bg disabled:opacity-40 disabled:pointer-events-none`}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p, idx) =>
        p === '...' ? (
          <span key={`ellipsis-${idx}`} className="inline-flex items-center justify-center w-9 h-9 text-text-muted">
            <MoreHorizontal className="w-4 h-4" />
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? 'page' : undefined}
            className={`${btnBase} ${
              p === currentPage
                ? 'bg-primary-600 text-white border-primary-600'
                : 'border-surface-border text-text-secondary hover:bg-surface-bg'
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btnBase} border-surface-border text-text-secondary hover:bg-surface-bg disabled:opacity-40 disabled:pointer-events-none`}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
