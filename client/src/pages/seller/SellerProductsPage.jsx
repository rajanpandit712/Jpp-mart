import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, Plus, Edit3, Trash2, ArrowLeft, ExternalLink,
  AlertCircle, CheckCircle2,
} from 'lucide-react';
import { sellerService } from '../../services';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function SellerProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = () => {
    setLoading(true);
    sellerService.getProducts()
      .then((res) => setProducts(res.data?.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await sellerService.deleteProduct(id);
      toast.success('Product removed from catalog');
      loadProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-16">
      {/* Top Bar */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/80 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/seller/dashboard" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-extrabold text-lg text-white">Manage Products</h1>
          </div>
          <Link
            to="/seller/products/add"
            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-6">
            <h2 className="text-base font-bold text-white">Your Listed Inventory ({products.length})</h2>
          </div>

          {loading ? (
            <div className="space-y-3 py-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-750 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No products listed yet</h3>
              <p className="text-xs text-slate-400 mb-6">Start expanding your storefront by adding your first product.</p>
              <Link
                to="/seller/products/add"
                className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold rounded-xl text-xs transition-colors inline-block"
              >
                Add First Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 border-b border-slate-700 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Price / MRP</th>
                    <th className="pb-3">Stock</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-200">
                  {products.map((p) => {
                    const rawImg = p.images?.[0];
                    const imgUrl = typeof rawImg === 'string' ? rawImg : rawImg?.url;

                    return (
                      <tr key={p._id} className="hover:bg-slate-750">
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-3">
                            {imgUrl ? (
                              <img src={imgUrl} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-700 shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                                <Package className="w-4 h-4 text-slate-500" />
                              </div>
                            )}
                            <div className="truncate max-w-xs">
                              <p className="font-semibold text-white truncate text-sm">{p.title}</p>
                              <span className="text-[11px] text-slate-400">{p.brand}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 text-slate-300">
                          {p.category?.name || 'General'}
                        </td>
                        <td className="py-3.5">
                          <span className="font-bold text-teal-400 block">{formatCurrency(p.price)}</span>
                          {p.mrp > p.price && (
                            <span className="text-[11px] text-slate-500 line-through">{formatCurrency(p.mrp)}</span>
                          )}
                        </td>
                        <td className="py-3.5">
                          <span className={`font-semibold ${p.stock <= 5 ? 'text-amber-400' : 'text-slate-300'}`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className="capitalize px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                            {p.status || 'Active'}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/products/${p.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
                              title="View on site"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/seller/products/${p._id}/edit`}
                              className="p-1.5 text-slate-400 hover:text-teal-400 rounded-lg hover:bg-slate-700"
                              title="Edit product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(p._id, p.title)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-700"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}