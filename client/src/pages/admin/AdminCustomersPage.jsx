import { useState, useEffect, useCallback } from 'react';
import { Search, UserCheck, UserX, ChevronLeft, ChevronRight, MailOpen } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService } from '../../services';
import { formatDate } from '../../utils/helpers';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [total,     setTotal]     = useState(0);
  const [page,      setPage]      = useState(1);
  const [search,    setSearch]    = useState('');
  const [loading,   setLoading]   = useState(true);
  const [acting,    setActing]    = useState(null); // id being toggled
  const limit = 15;

  const load = useCallback(() => {
    setLoading(true);
    adminService.getCustomers({ page, limit })
      .then(r => {
        const d = r.data?.data;
        const p = r.data?.pagination;
        setCustomers(Array.isArray(d) ? d : (d?.items || []));
        setTotal(p?.total ?? d?.total ?? (Array.isArray(d) ? d.length : 0));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (id) => {
    setActing(id);
    try {
      const r = await adminService.updateCustomer(id, {});
      setCustomers(prev => prev.map(c => c._id === id ? { ...c, isActive: r.data?.data?.isActive } : c));
    } catch {}
    setActing(null);
  };

  const filtered = search
    ? customers.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()))
    : customers;

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayout title="Customers" subtitle={`${total} registered customers`}>
      {/* Search + Filter */}
      <div className="mb-5 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="space-y-2 p-6">
            {Array.from({length: 8}).map((_, i) => (
              <div key={i} className="h-10 bg-slate-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Joined</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-500 text-sm">
                      No customers found.
                    </td>
                  </tr>
                ) : filtered.map(c => (
                  <tr key={c._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-700 to-blue-800 flex items-center justify-center text-xs font-bold text-white">
                          {c.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        {c.name || '—'}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <MailOpen className="w-3.5 h-3.5 text-slate-500" />
                        {c.email}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">{c.phone || '—'}</td>
                    <td className="px-5 py-3.5 text-slate-400">{formatDate(c.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border
                        ${c.isActive !== false
                          ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50'
                          : 'bg-red-900/30 text-red-400 border-red-800/50'}`}>
                        {c.isActive !== false ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => toggle(c._id)}
                        disabled={acting === c._id}
                        className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 ml-auto
                          ${c.isActive !== false
                            ? 'bg-red-900/30 text-red-400 hover:bg-red-900/60 border border-red-800/40'
                            : 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/60 border border-emerald-800/40'}`}
                      >
                        {c.isActive !== false
                          ? <><UserX className="w-3 h-3" /> Suspend</>
                          : <><UserCheck className="w-3 h-3" /> Activate</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800">
            <span className="text-xs text-slate-500">
              Page {page} of {totalPages} · {total} customers
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}