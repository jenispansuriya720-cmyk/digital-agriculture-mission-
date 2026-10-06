import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!emailOrMobile.trim() || !password) {
      setError('Please enter your email or mobile and password.');
      return;
    }

    try {
      setIsLoading(true);
      await login({ emailOrMobile, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = (role: 'farmer' | 'admin') => {
    if (role === 'farmer') {
      setEmailOrMobile('ramesh.farmer@krishidigital.com');
      setPassword('Farmer@123');
    } else {
      setEmailOrMobile('admin@krishidigital.com');
      setPassword('Admin@123');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md">
            <Sprout className="w-7 h-7 text-secondary" />
          </div>
          <span className="font-extrabold text-2xl text-primary tracking-tight">
            KRISHI DIGITAL
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-gray-900 tracking-tight">
          Welcome to Digital Agriculture
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Sign in to access your digital farm profile, IoT telemetry, and Mandi intelligence
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-soft-lg rounded-3xl border border-gray-100">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                Email / Mobile Number
              </label>
              <div className="mt-1.5 relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  placeholder="farmer@krishidigital.com or 9825112345"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-gray-900 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Please use the Demo Login credentials or contact your district agricultural extension officer.'); }} className="text-xs text-primary hover:underline font-semibold">
                  Forgot Password?
                </a>
              </div>
              <div className="mt-1.5 relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-gray-900 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary-dark shadow-md shadow-primary/20 hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Farm Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo 1-Click Fill Buttons */}
          <div className="mt-6 pt-5 border-t border-gray-100 space-y-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">
              Quick 1-Click Demo Logins
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleDemoFill('farmer')}
                className="py-2 px-2.5 rounded-xl bg-light-green/60 hover:bg-light-green text-primary border border-secondary/30 text-[11px] font-bold flex items-center justify-center space-x-1 transition-all"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Fill Demo Farmer</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('admin')}
                className="py-2 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold flex items-center justify-center space-x-1 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Fill Demo Admin</span>
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center">
              Demo passwords: Farmer@123 / Admin@123
            </p>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <span>Don&apos;t have an account yet? </span>
            <Link to="/register" className="font-bold text-primary hover:underline">
              Create Farmer Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
