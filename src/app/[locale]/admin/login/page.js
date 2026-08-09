'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;
  const isArabic = locale === 'ar';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      cosole.log('Login response:', data);

      if (response.ok) {
        toast.success(isArabic ? 'تم تسجيل الدخول بنجاح' : 'Login successful');
        router.push(`/${locale}/admin`);
      } else {
        toast.error(data.message || (isArabic ? 'فشل تسجيل الدخول' : 'Login failed'));
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(isArabic ? 'حدث خطأ أثناء تسجيل الدخول' : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-tahini-cream to-white">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Tahini House" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-tahini-dark">
            {isArabic ? 'لوحة التحكم' : 'Admin Dashboard'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isArabic ? 'تسجيل الدخول للمسؤولين' : 'Admin Login'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'البريد الإلكتروني' : 'Email'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold focus:border-transparent transition-colors"
                placeholder={isArabic ? 'admin@tahinihouse.com' : 'admin@tahinihouse.com'}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold focus:border-transparent transition-colors"
                placeholder={isArabic ? '********' : '********'}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-tahini-gold text-white py-3 rounded-lg font-semibold hover:bg-tahini-brown transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isArabic ? 'جاري تسجيل الدخول...' : 'Logging in...'}
              </>
            ) : (
              <>
                <FaSignInAlt />
                {isArabic ? 'تسجيل الدخول' : 'Login'}
              </>
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 text-center">
            {isArabic ? 'بيانات الدخول الافتراضية:' : 'Default credentials:'}
          </p>
          <p className="text-xs text-gray-400 text-center mt-1">
            Email: admin@tahinihouse.com
            <br />
            Password: admin123
          </p>
        </div>
      </div>
    </div>
  );
}