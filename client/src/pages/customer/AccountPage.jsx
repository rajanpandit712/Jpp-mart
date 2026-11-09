import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Lock, MapPin, Package, Heart, LogOut,
  ChevronRight, CheckCircle2, Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await userService.updateProfile(profileForm);
      if (updateUser) updateUser(res.data?.data);
      toast.success('Profile details updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);
    try {
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <div className="bg-surface-bg min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white border-b border-surface-border py-4">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-xs text-text-muted mb-1" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text-primary font-medium">My Account</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Account Overview
          </h1>
        </div>
      </div>

      <div className="container-main pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar Cards (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* User Profile Card */}
            <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-xs text-center">
              <div className="w-20 h-20 rounded-full bg-linear-to-tr from-primary-600 to-teal-500 text-white font-extrabold text-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h2 className="text-lg font-bold text-text-primary">{user?.name}</h2>
              <p className="text-xs text-text-muted mt-0.5">{user?.email}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200">
                <Shield className="w-3.5 h-3.5" />
                <span className="capitalize">{user?.role || 'Customer'} Account</span>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="bg-white border border-surface-border rounded-2xl p-3 shadow-xs space-y-1">
              <Link
                to="/account/orders"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-bg text-sm font-semibold text-text-primary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-primary-600" />
                  <span>My Orders</span>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted" />
              </Link>
              <Link
                to="/account/addresses"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-bg text-sm font-semibold text-text-primary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  <span>Saved Addresses</span>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted" />
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-bg text-sm font-semibold text-text-primary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-primary-600" />
                  <span>My Wishlist</span>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-rose-50 text-sm font-semibold text-rose-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </div>
              </button>
            </div>
          </div>

          {/* Right Forms (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Personal Info Form */}
            <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-xs">
              <h2 className="text-base font-bold text-text-primary mb-4 pb-3 border-b border-surface-border">
                Personal Information
              </h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-surface-border rounded-xl focus:ring-1 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-surface-border rounded-xl focus:ring-1 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3 py-2 text-sm border border-surface-border rounded-xl bg-gray-50 text-text-muted cursor-not-allowed outline-none"
                  />
                  <p className="text-[11px] text-text-muted mt-1">Email address cannot be changed.</p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs disabled:opacity-50"
                  >
                    {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-xs">
              <h2 className="text-base font-bold text-text-primary mb-4 pb-3 border-b border-surface-border">
                Security & Password
              </h2>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-surface-border rounded-xl focus:ring-1 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-surface-border rounded-xl focus:ring-1 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-surface-border rounded-xl focus:ring-1 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl text-xs transition-colors shadow-xs disabled:opacity-50"
                  >
                    {changingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}