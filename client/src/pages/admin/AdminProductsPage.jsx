import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService } from '../../services';
import { formatCurrency, formatDate } from '../../utils/helpers';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [search,   setSearch]   = useState('');
  const [loading,  setLoading]  = useState(true);
  const limit = 15;

  const load = useCallback(() => {
    setLoading(true);
    adminService.getPendingProducts({ page, limit })
      .then(r => {
        const d = r.data?.data;
        const p = r.data?.pagination;
        setProducts(Array.isArray(d) ? d : (d?.items || []));
        setTotal(p?.total ?? d?.total ?? (Array.isArray(d) ? d.length : 0));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const approve = async (id) => {
    try {
      await adminService.approveProduct(id);
      setProducts(prev => prev.map(p => p._id === id ? { ...p, status: 'approved' } : p));
    } catch {}
  };

  const reject = async (id) => {
    const reason = prompt('Reason for rejection (optional):') || 'Does not meet guidelines';
    try {
      await adminService.rejectProduct(id, reason);
      setProducts(prev => prev.map(p => p._id === id ? { ...p, status: 'rejected' } : p));
    } catch {}
  };

  const filtered = search
    ? products.filter(p =>
        (p.title || p.name)?.toLowerCase().includes(search.toLowerCase()) ||
        p.seller?.storeName?.toLowerCase().includes(search.toLowerCase()))
    : products;

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayout title="Products" subtitle="Review and moderate product listings">
      <div className="mb-5 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search products or sellers…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="space-y-2 p-6">
            {Array.from({length:8}).map((_,i) => <div key={i} className="h-10 bg-slate-800 rounded-lg animate-pulse" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Seller</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                      <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      No products found.
                    </td>
                  </tr>
                ) : filtered.map(p => {
                  const img = typeof p.images?.[0] === 'string' ? p.images[0] : p.images?.[0]?.url;
                  return (
                  <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {img ? (
                          <img src={img} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-800" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                            <Package className="w-5 h-5 text-slate-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-white truncate max-w-[180px]">{p.title || p.name}</p>
                          <p className="text-xs text-slate-500">{formatDate(p.createdAt)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">{p.seller?.storeName || p.seller?.name || '—'}</td>
                    <td className="px-5 py-3.5 font-semibold">{formatCurrency(p.price)}</td>
                    <td className="px-5 py-3.5 text-slate-400">{p.category?.name || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize
                        ${p.status === 'approved'
                          ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50'
                          : p.status === 'rejected'
                          ? 'bg-red-900/30 text-red-400 border-red-800/50'
                          : 'bg-amber-900/30 text-amber-300 border-amber-800/50'}`}>
                        {p.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {p.status !== 'approved' && (
                        <div className="flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => approve(p._id)}
                            className="text-xs px-2.5 py-1.5 rounded-lg font-semibold bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/60 border border-emerald-800/40 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => reject(p._id)}
                            className="text-xs px-2.5 py-1.5 rounded-lg font-semibold bg-red-900/30 text-red-400 hover:bg-red-900/60 border border-red-800/40 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800">
            <span className="text-xs text-slate-500">Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}