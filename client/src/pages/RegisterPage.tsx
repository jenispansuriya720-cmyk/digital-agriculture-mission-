import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, User, Mail, Phone, Lock, MapPin, Wheat, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    state: 'Gujarat',
    district: 'Ahmedabad',
    village: 'Sanand',
    landArea: '5',
    primaryCrop: 'Cotton',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.mobile.trim() ||
      !formData.password
    ) {
      setError('Please fill in all mandatory farmer registration fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    try {
      setIsLoading(true);
      await register({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        state: formData.state,
        district: formData.district,
        village: formData.village,
        landArea: Number(formData.landArea),
        primaryCrop: formData.primaryCrop,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Registration failed. An account with this email may already exist.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md">
            <Sprout className="w-7 h-7 text-secondary" />
          </div>
          <span className="font-extrabold text-2xl text-primary tracking-tight">
            KRISHI DIGITAL
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-gray-900 tracking-tight">
          Farmer Digital Enrollment
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Create your verified AgriStack digital farmer ID to unlock subsidized inputs, soil testing, and direct Mandi market access.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-soft-lg rounded-3xl border border-gray-100">
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name & Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Full Name *
                </label>
                <div className="mt-1.5 relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ramesh Patel"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Mobile Number *
                </label>
                <div className="mt-1.5 relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+91 98251 12345"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Email & Passwords */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                Email Address *
              </label>
              <div className="mt-1.5 relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ramesh.farmer@krishidigital.com"
                  className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Password *
                </label>
                <div className="mt-1.5 relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Confirm Password *
                </label>
                <div className="mt-1.5 relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Farm Details: State, District, Village */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                🌾 Agricultural Land Profile
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700">State</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white"
                  >
                    <option value="Gujarat">Gujarat</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Haryana">Haryana</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700">District</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Ahmedabad"
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700">Village</label>
                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    placeholder="Sanand"
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
              </div>
            </div>

            {/* Land Area and Primary Crop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Total Land Area (Acres)
                </label>
                <div className="mt-1.5 relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="number"
                    step="0.1"
                    name="landArea"
                    value={formData.landArea}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Primary Crop
                </label>
                <div className="mt-1.5 relative">
                  <Wheat className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <select
                    name="primaryCrop"
                    value={formData.primaryCrop}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white font-medium"
                  >
                    <option value="Cotton">Cotton (કપાસ)</option>
                    <option value="Wheat">Wheat (ઘઉં)</option>
                    <option value="Rice">Rice / Paddy (ડાંગર)</option>
                    <option value="Groundnut">Groundnut (મગફળી)</option>
                    <option value="Maize">Maize (મકાઈ)</option>
                    <option value="Tomato">Tomato (ટામેટા)</option>
                    <option value="Onion">Onion (ડુંગળી)</option>
                    <option value="Potato">Potato (બટાટા)</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3.5 px-4 rounded-xl bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary-dark shadow-md shadow-primary/20 hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              <span>{isLoading ? 'Creating Farmer Profile...' : 'Create Farmer Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            <span>Already registered? </span>
            <Link to="/login" className="font-bold text-primary hover:underline">
              Log in to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
