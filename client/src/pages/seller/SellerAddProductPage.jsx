import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { sellerService, categoryService, productService } from '../../services';
import toast from 'react-hot-toast';

export default function SellerAddProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    brand: '',
    price: '',
    mrp: '',
    stock: '',
    description: '',
    highlights: [''],
    imageUrls: [''],
    isFeatured: false,
    isDealOfTheDay: false,
  });

  useEffect(() => {
    categoryService.getAll()
      .then((res) => {
        const cats = res.data?.data || [];
        setCategories(cats);
        if (!isEditing && cats.length > 0) {
          setFormData((prev) => ({ ...prev, category: cats[0]._id }));
        }
      })
      .catch(() => {});
  }, [isEditing]);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      productService.getById(id)
        .then((res) => {
          const p = res.data?.data?.product || res.data?.data;
          if (p) {
            setFormData({
              title: p.title || '',
              slug: p.slug || '',
              category: p.category?._id || p.category || '',
              brand: p.brand || '',
              price: p.price || '',
              mrp: p.mrp || '',
              stock: p.stock ?? '',
              description: p.description || '',
              highlights: p.highlights?.length ? p.highlights : [''],
              imageUrls: p.images?.length
                ? p.images.map((img) => (typeof img === 'string' ? img : img.url))
                : [''],
              isFeatured: Boolean(p.isFeatured),
              isDealOfTheDay: Boolean(p.isDealOfTheDay),
            });
          }
        })
        .catch(() => {
          toast.error('Could not load product details');
          navigate('/seller/products');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing, navigate]);

  const handleTitleChange = (val) => {
    const slugVal = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: isEditing ? prev.slug : slugVal,
    }));
  };

  const handleHighlightChange = (index, val) => {
    const updated = [...formData.highlights];
    updated[index] = val;
    setFormData({ ...formData, highlights: updated });
  };

  const addHighlightField = () => {
    setFormData({ ...formData, highlights: [...formData.highlights, ''] });
  };

  const removeHighlightField = (index) => {
    const updated = formData.highlights.filter((_, i) => i !== index);
    setFormData({ ...formData, highlights: updated.length ? updated : [''] });
  };

  const handleImageChange = (index, val) => {
    const updated = [...formData.imageUrls];
    updated[index] = val;
    setFormData({ ...formData, imageUrls: updated });
  };

  const addImageField = () => {
    setFormData({ ...formData, imageUrls: [...formData.imageUrls, ''] });
  };

  const removeImageField = (index) => {
    const updated = formData.imageUrls.filter((_, i) => i !== index);
    setFormData({ ...formData, imageUrls: updated.length ? updated : [''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.mrp || !formData.category) {
      toast.error('Please fill in required fields');
      return;
    }

    const payload = {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: formData.category,
      brand: formData.brand || 'Generic',
      price: Number(formData.price),
      mrp: Number(formData.mrp),
      stock: Number(formData.stock) || 0,
      description: formData.description,
      highlights: formData.highlights.filter((h) => h.trim()),
      images: formData.imageUrls
        .filter((u) => u.trim())
        .map((url, i) => ({ url, alt: formData.title, isPrimary: i === 0 })),
      isFeatured: formData.isFeatured,
      isDealOfTheDay: formData.isDealOfTheDay,
    };

    setSubmitting(true);
    try {
      if (isEditing) {
        await sellerService.updateProduct(id, payload);
        toast.success('Product updated successfully!');
      } else {
        await sellerService.createProduct(payload);
        toast.success('Product created and listed!');
      }
      navigate('/seller/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-sm text-slate-400">Loading product editor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-16">
      {/* Top Bar */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/80 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/seller/products" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-extrabold text-lg text-white">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Card */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-teal-400 uppercase tracking-wider">Product Essentials</h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Brand *</label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="e.g. Sony"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Selling Price (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="26990"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">MRP (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.mrp}
                  onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                  placeholder="34990"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Stock Quantity *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="25"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Product Description</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed features, dimensions, technical specifications..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-teal-400 uppercase tracking-wider">Key Highlights</h2>
              <button
                type="button"
                onClick={addHighlightField}
                className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bullet</span>
              </button>
            </div>

            {formData.highlights.map((h, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={h}
                  onChange={(e) => handleHighlightChange(i, e.target.value)}
                  placeholder={`Feature bullet #${i + 1}`}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeHighlightField(i)}
                  className="p-2 text-slate-400 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Image URLs */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-teal-400 uppercase tracking-wider">Product Images (URLs)</h2>
              <button
                type="button"
                onClick={addImageField}
                className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Image URL</span>
              </button>
            </div>

            {formData.imageUrls.map((u, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="url"
                  value={u}
                  onChange={(e) => handleImageChange(i, e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeImageField(i)}
                  className="p-2 text-slate-400 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Visibility Options */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl flex flex-wrap gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded text-teal-500 focus:ring-teal-400 bg-slate-900 border-slate-700"
              />
              <span className="text-xs font-semibold text-slate-200">Show on Homepage as Featured</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDealOfTheDay}
                onChange={(e) => setFormData({ ...formData, isDealOfTheDay: e.target.checked })}
                className="w-4 h-4 rounded text-teal-500 focus:ring-teal-400 bg-slate-900 border-slate-700"
              />
              <span className="text-xs font-semibold text-slate-200">Mark as Deal of the Day</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <Link
              to="/seller/products"
              className="px-5 py-2.5 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl text-xs font-bold"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg disabled:opacity-50"
            >
              {submitting ? 'Saving...' : isEditing ? 'Update Product' : 'Create & Publish'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}