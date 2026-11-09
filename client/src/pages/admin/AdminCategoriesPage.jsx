import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Tag, X, Check } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService } from '../../services';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(null); // null | 'create' | category object
  const [form,       setForm]       = useState({ name: '', description: '', image: '', isFeatured: false });
  const [saving,     setSaving]     = useState(false);
  const [deleting,   setDeleting]   = useState(null);
  const [error,      setError]      = useState('');

  const load = () => {
    setLoading(true);
    adminService.getCategories()
      .then(r => setCategories(r.data?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ name: '', description: '', image: '', isFeatured: false });
    setError('');
    setModal('create');
  };

  const openEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || '', image: cat.image || '', isFeatured: !!cat.isFeatured });
    setError('');
    setModal(cat);
  };

  const save = async () => {
    if (!form.name.trim()) { setError('Category name is required.'); return; }
    setSaving(true);
    setError('');
    try {
      if (modal === 'create') {
        const r = await adminService.createCategory(form);
        setCategories(prev => [r.data?.data, ...prev]);
      } else {
        const r = await adminService.updateCategory(modal._id, form);
        setCategories(prev => prev.map(c => c._id === modal._id ? r.data?.data : c));
      }
      setModal(null);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save category.');
    }
    setSaving(false);
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this category? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await adminService.updateCategory(id, { isActive: false }); // soft delete
      setCategories(prev => prev.filter(c => c._id !== id));
    } catch {}
    setDeleting(null);
  };

  return (
    <AdminLayout title="Categories" subtitle="Manage product categories">
      <div className="flex justify-end mb-5">
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({length:6}).map((_,i) => <div key={i} className="h-28 bg-slate-800 rounded-2xl animate-pulse" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <Tag className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No categories yet. Create the first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map(cat => (
            <div key={cat._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 hover:border-indigo-700/60 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-10 h-10 rounded-xl object-cover bg-slate-800" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-800 to-purple-900 flex items-center justify-center">
                      <Tag className="w-5 h-5 text-indigo-300" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-white text-sm leading-tight">{cat.name}</p>
                    {cat.isFeatured && (
                      <span className="text-xs text-amber-400 font-medium">Featured</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => remove(cat._id)} disabled={deleting === cat._id} className="p-1.5 rounded-lg hover:bg-red-900/40 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {cat.description && (
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{cat.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal !== null && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h3 className="font-bold text-white">{modal === 'create' ? 'Create Category' : 'Edit Category'}</h3>
              <button onClick={() => setModal(null)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {error && <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">{error}</p>}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Category Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Electronics"
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Optional short description…"
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Image URL</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                  placeholder="https://…"
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                  className="w-4 h-4 accent-indigo-500"
                />
                <span className="text-sm text-slate-300">Featured category (shown on homepage)</span>
              </label>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-800">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-slate-400 hover:text-white font-medium transition-colors">
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {saving ? 'Saving…' : modal === 'create' ? 'Create' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}