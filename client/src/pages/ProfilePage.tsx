import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Wheat,
  Lock,
  LogOut,
  Save,
  Check,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    village: user?.village || 'Sanand',
    district: user?.district || 'Ahmedabad',
    state: user?.state || 'Gujarat',
    landArea: String(user?.landArea || '5'),
    primaryCrop: user?.primaryCrop || 'Cotton',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&q=80&w=300',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      await updateProfile({
        name: formData.name,
        mobile: formData.mobile,
        village: formData.village,
        district: formData.district,
        state: formData.state,
        landArea: Number(formData.landArea),
        primaryCrop: formData.primaryCrop,
        avatar: formData.avatar,
      });
      setToastMessage('✓ Profile details updated successfully.');
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error updating profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New passwords do not match.');
      return;
    }
    if (passwords.newPassword.length < 6) {
      alert('New password must be at least 6 characters.');
      return;
    }

    setIsChangingPass(true);
    try {
      await authService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setToastMessage('✓ Password updated successfully.');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error changing password. Check current password.');
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-primary text-white shadow-xl flex items-center space-x-2 text-xs font-bold animate-in fade-in">
          <Check className="w-4 h-4 text-secondary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Profile Badge Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
          <img
            src={formData.avatar}
            alt={formData.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-primary shadow-md"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-light-green text-primary capitalize">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{user?.email} • {user?.mobile}</p>
            <div className="flex items-center justify-center sm:justify-start space-x-3 text-xs text-gray-600 mt-2 font-medium">
              <span>🌾 {user?.landArea} Acres</span>
              <span>•</span>
              <span>Crop: {user?.primaryCrop}</span>
              <span>•</span>
              <span>{user?.village}, {user?.district}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center space-x-1.5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Edit Profile Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft space-y-5">
          <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
            Edit Farmer Profile
          </h3>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1.5 w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 outline-none focus:border-primary font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">Mobile Phone</label>
              <input
                type="text"
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="mt-1.5 w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 outline-none focus:border-primary font-medium"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Village</label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="mt-1.5 w-full px-3 py-2 text-xs rounded-xl border border-gray-200 outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="mt-1.5 w-full px-3 py-2 text-xs rounded-xl border border-gray-200 outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="mt-1.5 w-full px-3 py-2 text-xs rounded-xl border border-gray-200 outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Land Area (Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.landArea}
                  onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                  className="mt-1.5 w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Primary Crop</label>
                <select
                  value={formData.primaryCrop}
                  onChange={(e) => setFormData({ ...formData, primaryCrop: e.target.value })}
                  className="mt-1.5 w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white outline-none focus:border-primary font-medium"
                >
                  <option value="Cotton">Cotton</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Rice">Rice</option>
                  <option value="Groundnut">Groundnut</option>
                  <option value="Maize">Maize</option>
                  <option value="Tomato">Tomato</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">Avatar Photo URL</label>
              <input
                type="text"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="mt-1.5 w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 outline-none focus:border-primary font-mono text-[11px]"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="py-3 px-6 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark transition-all flex items-center space-x-2 shadow-md shadow-primary/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-secondary" />
              <span>{isUpdatingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>

        {/* Right: Change Password */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft space-y-5">
          <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
            Account Security & Password
          </h3>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">Current Password</label>
              <input
                type="password"
                required
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                placeholder="••••••••"
                className="mt-1.5 w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">New Password</label>
              <input
                type="password"
                required
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                placeholder="Min 6 characters"
                className="mt-1.5 w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                placeholder="Repeat new password"
                className="mt-1.5 w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={isChangingPass}
              className="w-full py-3 px-4 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4 text-secondary" />
              <span>{isChangingPass ? 'Updating...' : 'Update Password'}</span>
            </button>
          </form>

          <div className="p-4 rounded-2xl bg-cream border border-gray-100 text-xs text-gray-600 space-y-1">
            <span className="font-bold text-primary">AgriStack Authentication</span>
            <p className="text-[11px] leading-relaxed">
              Your profile is verified with state land records. Changing contact details may require SMS verification in future production releases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
