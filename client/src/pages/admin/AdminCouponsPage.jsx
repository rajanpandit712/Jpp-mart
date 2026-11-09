import { useState, useEffect } from 'react';
import { Plus, Trash2, Ticket, X, Check, Percent, DollarSign, Calendar } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService } from '../../services';
import { formatDate, formatCurrency } from '../../utils/helpers';

const EMPTY_FORM = {
  code: '',
  discountType: 'percentage',
  discountValue: '',
  minOrderAmount: '',
  maxUses: '',
  expiresAt: '',
  isActive: true,
};

export default function AdminCouponsPage() {
  const [coupons,  setCoupons]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error,    setError]    = useState('');

  const load = () => {
    setLoading(true);
    adminService.getCoupons()
      .then(r => setCoupons(r.data?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setError('');
    setModal(true);
  };

  const save = async () => {
    if (!form.code.trim())         { setError('Coupon code is required.');  return; }
    if (!form.discountValue)       { setError('Discount value is required.'); return; }
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        code: form.code.trim().toUpperCase(),
        discountValue: Number(form.discountValue),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
        maxUses: form.maxUses ? Number(form.maxUses) : undefined,
        expiresAt: form.expiresAt || undefined,
      };
      const r = await adminService.createCoupon(payload);
      setCoupons(prev => [r.data?.data, ...prev]);
      setModal(false);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create coupon.');
    }
    setSaving(false);
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    setDeleting(id);
    try {
      await adminService.deleteCoupon(id);
      setCoupons(prev => prev.filter(c => c._id !== id));
    } catch {}
    setDeleting(null);
  };

  const update = f => setForm(prev => ({ ...prev, ...f }));

  return (
    <AdminLayout title="Coupons" subtitle="Manage discount codes and promotions">
      <div className="flex justify-end mb-5">
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Coupon
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({length:5}).map((_,i) => <div key={i} className="h-16 bg-slate-800 rounded-2xl animate-pulse" />)}
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <Ticket className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No coupons yet. Create your first one.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Code</th>
                  <th className="px-5 py-3">Discount</th>
                  <th className="px-5 py-3">Min Order</th>
                  <th className="px-5 py-3">Uses</th>
                  <th className="px-5 py-3">Expires</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {coupons.map(c => {
                  const expired = c.expiresAt && new Date(c.expiresAt) < new Date();
                  return (
                    <tr key={c._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-mono font-bold text-indigo-400 bg-indigo-950/40 border border-indigo-800/40 px-2.5 py-0.5 rounded-lg text-xs">
                          {c.code}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-semibold">
                        {c.discountType === 'percentage'
                          ? `${c.discountValue}%`
                          : formatCurrency(c.discountValue)}
                        <span className="ml-1.5 text-xs text-slate-500">
                          {c.discountType === 'percentage' ? 'off' : 'flat'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">
                        {c.minOrderAmount ? formatCurrency(c.minOrderAmount) : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">
                        {c.usedCount || 0}
                        {c.maxUses ? ` / ${c.maxUses}` : ''}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">
                        {c.expiresAt ? (
                          <span className={expired ? 'text-red-400' : ''}>{formatDate(c.expiresAt)}</span>
                        ) : 'No expiry'}
                      </td>
                      <td className="px-5 py-3.5">
                        {expired ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-700/50 text-slate-400 border border-slate-600/50">Expired</span>
                        ) : c.isActive ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-900/30 text-emerald-400 border border-emerald-800/50">Active</span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-900/30 text-red-400 border border-red-800/50">Inactive</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => remove(c._id)}
                          disabled={deleting === c._id}
                          className="p-1.5 rounded-lg hover:bg-red-900/30 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {modal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Ticket className="w-4 h-4 text-indigo-400" />
                Create Coupon
              </h3>
              <button onClick={() => setModal(false)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto">
              {error && <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">{error}</p>}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Coupon Code *</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={e => update({ code: e.target.value.toUpperCase() })}
                    placeholder="e.g. SAVE20"
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Discount Type</label>
                  <select
                    value={form.discountType}
                    onChange={e => update({ discountType: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    {form.discountType === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'} *
                  </label>
                  <div className="relative">
                    {form.discountType === 'percentage'
                      ? <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                      : <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />}
                    <input
                      type="number"
                      value={form.discountValue}
                      onChange={e => update({ discountValue: e.target.value })}
                      min={1}
                      max={form.discountType === 'percentage' ? 100 : undefined}
                      className="w-full pl-8 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Min Order Amount (₹)</label>
                  <input
                    type="number"
                    value={form.minOrderAmount}
                    onChange={e => update({ minOrderAmount: e.target.value })}
                    min={0}
                    placeholder="0 = no minimum"
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Max Uses</label>
                  <input
                    type="number"
                    value={form.maxUses}
                    onChange={e => update({ maxUses: e.target.value })}
                    min={1}
                    placeholder="Unlimited"
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    <Calendar className="inline w-3.5 h-3.5 mr-1" />
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={e => update({ expiresAt: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div className="col-span-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={e => update({ isActive: e.target.checked })}
                      className="w-4 h-4 accent-indigo-500"
                    />
                    <span className="text-sm text-slate-300">Active (usable immediately)</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-800 shrink-0">
              <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white font-medium transition-colors">Cancel</button>
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {saving ? 'Creating…' : 'Create Coupon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}