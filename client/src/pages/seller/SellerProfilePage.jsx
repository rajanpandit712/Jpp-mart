import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, ArrowLeft, Save, Building2, Star } from 'lucide-react';
import { sellerService } from '../../services';
import toast from 'react-hot-toast';

export default function SellerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    storeName: '',
    description: '',
    logo: '',
    businessDetails: {
      gstNumber: '',
      businessType: 'proprietorship',
      registeredAddress: '',
    },
  });

  useEffect(() => {
    setLoading(true);
    sellerService.getProfile()
      .then((res) => {
        const p = res.data?.data;
        if (p) {
          setProfile({
            storeName: p.storeName || '',
            description: p.description || '',
            logo: p.logo || '',
            businessDetails: {
              gstNumber: p.businessDetails?.gstNumber || '',
              businessType: p.businessDetails?.businessType || 'proprietorship',
              registeredAddress: p.businessDetails?.registeredAddress || '',
            },
          });
        }
      })
      .catch(() => toast.error('Could not load seller profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await sellerService.updateProfile(profile);
      toast.success('Store profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update store profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-sm text-slate-400">Loading store profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-16">
      {/* Top Bar */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/80 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/seller/dashboard" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-extrabold text-lg text-white">Store Settings & Branding</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Store Info */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-teal-400 uppercase tracking-wider">Store Identity</h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Store / Brand Name *</label>
              <input
                type="text"
                required
                value={profile.storeName}
                onChange={(e) => setProfile({ ...profile, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Store Description</label>
              <textarea
                rows={3}
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="Tell customers about your brand story, craftsmanship, or guarantee..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Store Logo URL</label>
              <input
                type="url"
                value={profile.logo}
                onChange={(e) => setProfile({ ...profile, logo: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          {/* Business Details */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-teal-400 uppercase tracking-wider">Business & Tax Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">GSTIN (Optional)</label>
                <input
                  type="text"
                  value={profile.businessDetails.gstNumber}
                  onChange={(e) => setProfile({
                    ...profile,
                    businessDetails: { ...profile.businessDetails, gstNumber: e.target.value },
                  })}
                  placeholder="29ABCDE1234F1Z5"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Business Type</label>
                <select
                  value={profile.businessDetails.businessType}
                  onChange={(e) => setProfile({
                    ...profile,
                    businessDetails: { ...profile.businessDetails, businessType: e.target.value },
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="proprietorship">Sole Proprietorship</option>
                  <option value="partnership">Partnership Firm</option>
                  <option value="llp">Limited Liability Partnership (LLP)</option>
                  <option value="private_limited">Private Limited Company</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Registered Business Address</label>
              <input
                type="text"
                value={profile.businessDetails.registeredAddress}
                onChange={(e) => setProfile({
                  ...profile,
                  businessDetails: { ...profile.businessDetails, registeredAddress: e.target.value },
                })}
                placeholder="Koramangala, Bengaluru, Karnataka"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Changes...' : 'Save Store Profile'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}