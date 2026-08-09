'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  FaBox, 
  FaShoppingCart, 
  FaMoneyBillWave, 
  FaUsers,
  FaPlus,
  FaChartLine,
  FaSignOutAlt,
  FaUtensils,
  FaCalendarDay
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const params = useParams();
  const locale = params.locale;
  const isArabic = locale === 'ar';
  const router = useRouter();
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
    fetchDashboardData();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/check-auth');
      const data = await response.json();
      if (!data.authenticated) {
        router.push(`/${locale}/admin/login`);
      } else {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.push(`/${locale}/admin/login`);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/recent-orders'),
      ]);
      
      const statsData = await statsRes.json();
      const ordersData = await ordersRes.json();
      
      setStats(statsData);
      setRecentOrders(ordersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        toast.success(isArabic ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully');
        router.push(`/${locale}/admin/login`);
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(isArabic ? 'حدث خطأ أثناء تسجيل الخروج' : 'Error logging out');
    }
  };

  const statCards = [
    {
      title: isArabic ? 'المنتجات' : 'Products',
      value: stats.totalProducts,
      icon: <FaBox className="text-2xl" />,
      color: 'bg-blue-500',
      link: `/${locale}/admin/products`,
    },
    {
      title: isArabic ? 'طلبات اليوم' : "Today's Orders",
      value: stats.todayOrders,
      icon: <FaShoppingCart className="text-2xl" />,
      color: 'bg-green-500',
      link: `/${locale}/admin/orders`,
    },
    {
      title: isArabic ? 'إيرادات اليوم' : "Today's Revenue",
      value: `${stats.todayRevenue || 0} SAR`,
      icon: <FaMoneyBillWave className="text-2xl" />,
      color: 'bg-tahini-gold',
      link: `/${locale}/admin/sales`,
    },
    {
      title: isArabic ? 'إجمالي الطلبات' : 'Total Orders',
      value: stats.totalOrders,
      icon: <FaUsers className="text-2xl" />,
      color: 'bg-purple-500',
      link: `/${locale}/admin/orders`,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tahini-gold"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-tahini-dark">
            {isArabic ? 'لوحة التحكم' : 'Dashboard'}
          </h1>
          {user && (
            <p className="text-sm text-gray-500 mt-1">
              {isArabic ? 'مرحباً' : 'Welcome'} {user.name || 'Admin'}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/${locale}/admin/products/new`)}
            className="bg-tahini-gold text-white px-4 py-2 rounded-lg hover:bg-tahini-brown transition-colors flex items-center gap-2"
          >
            <FaPlus />
            {isArabic ? 'إضافة منتج' : 'Add Product'}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <FaSignOutAlt />
            {isArabic ? 'تسجيل الخروج' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => router.push(stat.link)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-tahini-dark mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-full`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => router.push(`/${locale}/admin/sales`)}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-left"
        >
          <FaChartLine className="text-tahini-gold text-2xl mb-2" />
          <h3 className="font-semibold text-tahini-dark">
            {isArabic ? 'تتبع المبيعات' : 'Track Sales'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {isArabic ? 'عرض إحصائيات المبيعات اليومية' : 'View daily sales statistics'}
          </p>
        </button>
        
        <button
          onClick={() => router.push(`/${locale}/admin/products`)}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-left"
        >
          <FaUtensils className="text-tahini-gold text-2xl mb-2" />
          <h3 className="font-semibold text-tahini-dark">
            {isArabic ? 'إدارة المنتجات' : 'Manage Products'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {isArabic ? 'إضافة وتعديل وحذف المنتجات' : 'Add, edit, and delete products'}
          </p>
        </button>
        
        <button
          onClick={() => router.push(`/${locale}/admin/orders`)}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-left"
        >
          <FaCalendarDay className="text-tahini-gold text-2xl mb-2" />
          <h3 className="font-semibold text-tahini-dark">
            {isArabic ? 'الطلبات' : 'Orders'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {isArabic ? 'عرض وإدارة الطلبات' : 'View and manage orders'}
          </p>
        </button>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-tahini-dark">
            {isArabic ? 'أحدث الطلبات' : 'Recent Orders'}
          </h2>
          <button
            onClick={() => router.push(`/${locale}/admin/orders`)}
            className="text-sm text-tahini-gold hover:text-tahini-brown transition-colors"
          >
            {isArabic ? 'عرض الكل' : 'View All'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isArabic ? 'رقم الطلب' : 'Order #'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isArabic ? 'العميل' : 'Customer'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isArabic ? 'المبلغ' : 'Amount'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isArabic ? 'الحالة' : 'Status'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isArabic ? 'التاريخ' : 'Date'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.order_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer_name || 'Guest'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.total_amount} SAR
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {recentOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {isArabic ? 'لا توجد طلبات حديثة' : 'No recent orders'}
          </div>
        )}
      </div>
    </div>
  );
}