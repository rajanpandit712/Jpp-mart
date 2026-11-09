import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        {/* 404 graphic */}
        <div className="text-8xl font-black text-primary-100 select-none mb-2" aria-hidden="true">
          404
        </div>
        <div className="text-5xl mb-6" aria-hidden="true">🔍</div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Page not found
        </h1>
        <p className="text-text-muted mb-8 leading-relaxed">
          Sorry, we couldn't find the page you're looking for.
          It may have moved, been removed, or the URL might be incorrect.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="btn-primary btn"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Go to Homepage
          </Link>
          <Link
            to="/products"
            className="btn-secondary btn"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}