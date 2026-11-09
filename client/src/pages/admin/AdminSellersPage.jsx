import { useState, useEffect, useCallback } from 'react';
import { Search, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService } from '../../services';
import { formatDate } from '../../utils/helpers';

const STATUS_MAP = {
  pending:  { label: 'Pending',  cls: 'bg-amber-900/30 text-amber-300 border-amber-800/50' },
  approved: { label: 'Approved', cls: 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50' },
  rejected: { label: 'Rejected', cls: 'bg-red-900/30 text-red-400 border-red-800/50' },
  suspended:{ label: 'Suspended',cls: 'bg-slate-700/60 text-slate-400 border-slate-600/50' },
};

export default function AdminSellersPage() {
  const [sellers,  setSellers]  = useState([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [search,   setSearch]   = useState('');
  const [loading,  setLoading]  = useState(true);
  const [acting,   setActing]   = useState(null);
  const limit = 15;

  const load = useCallback(() => {
    setLoading(true);
    adminService.getSellers({ page, limit })
      .then(r => {
        const d = r.data?.data;
        const p = r.data?.pagination;
        setSellers(Array.isArray(d) ? d : (d?.items || []));
        setTotal(p?.total ?? d?.total ?? (Array.isArray(d) ? d.length : 0));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    setActing(id);
    try {
      await adminService.updateSellerStatus(id, { status });
      setSellers(prev => prev.map(s => s._id === id ? { ...s, status } : s));
    } catch {}
    setActing(null);
  };

  const filtered = search
    ? sellers.filter(s =>
        s.storeName?.toLowerCase().includes(search.toLowerCase()) ||
        s.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.user?.email?.toLowerCase().includes(search.toLowerCase()))
    : sellers;

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayout title="Sellers" subtitle={`${total} registered sellers`}>
      <div className="mb-5 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search sellers…"
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
                  <th className="px-5 py-3">Store</th>
                  <th className="px-5 py-3">Owner</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Joined</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-500">No sellers found.</td>
                  </tr>
                ) : filtered.map(s => {
                  const sm = STATUS_MAP[s.status] || STATUS_MAP.pending;
                  return (
                    <tr key={s._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-700 to-indigo-800 flex items-center justify-center text-xs font-bold text-white">
                            {s.storeName?.[0]?.toUpperCase() || 'S'}
                          </div>
                          {s.storeName || '—'}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">{s.user?.name || '—'}</td>
                      <td className="px-5 py-3.5 text-slate-400">{s.user?.email || '—'}</td>
                      <td className="px-5 py-3.5 text-slate-400">{formatDate(s.createdAt)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${sm.cls}`}>
                          {sm.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          {s.status !== 'approved' && (
                            <button
                              onClick={() => updateStatus(s._id, 'approved')}
                              disabled={acting === s._id}
                              className="text-xs px-2.5 py-1.5 rounded-lg font-semibold bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/60 border border-emerald-800/40 flex items-center gap-1 transition-colors disabled:opacity-50"
                            >
                              <CheckCircle className="w-3 h-3" /> Approve
                            </button>
                          )}
                          {s.status === 'approved' && (
                            <button
                              onClick={() => updateStatus(s._id, 'suspended')}
                              disabled={acting === s._id}
                              className="text-xs px-2.5 py-1.5 rounded-lg font-semibold bg-slate-700/50 text-slate-400 hover:bg-slate-700 border border-slate-600/40 flex items-center gap-1 transition-colors disabled:opacity-50"
                            >
                              <XCircle className="w-3 h-3" /> Suspend
                            </button>
                          )}
                          {s.status === 'pending' && (
                            <button
                              onClick={() => updateStatus(s._id, 'rejected')}
                              disabled={acting === s._id}
                              className="text-xs px-2.5 py-1.5 rounded-lg font-semibold bg-red-900/30 text-red-400 hover:bg-red-900/60 border border-red-800/40 flex items-center gap-1 transition-colors disabled:opacity-50"
                            >
                              <XCircle className="w-3 h-3" /> Reject
                            </button>
                          )}
                          {s.status === 'suspended' && (
                            <button
                              onClick={() => updateStatus(s._id, 'approved')}
                              disabled={acting === s._id}
                              className="text-xs px-2.5 py-1.5 rounded-lg font-semibold bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/60 border border-emerald-800/40 flex items-center gap-1 transition-colors disabled:opacity-50"
                            >
                              <CheckCircle className="w-3 h-3" /> Reactivate
                            </button>
                          )}
                          {(s.status === 'rejected') && (
                            <button
                              onClick={() => updateStatus(s._id, 'pending')}
                              disabled={acting === s._id}
                              className="text-xs px-2.5 py-1.5 rounded-lg font-semibold bg-amber-900/30 text-amber-400 hover:bg-amber-900/60 border border-amber-800/40 flex items-center gap-1 transition-colors disabled:opacity-50"
                            >
                              <Clock className="w-3 h-3" /> Re-review
                            </button>
                          )}
                        </div>
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
            <span className="text-xs text-slate-500">Page {page} of {totalPages} · {total} sellers</span>
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