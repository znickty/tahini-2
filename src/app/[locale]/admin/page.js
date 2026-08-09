'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  FaBox, 
  FaShoppingCart, 
  FaMoneyBillWave, 
  FaUsers,
  FaPlus,
  FaChartLine 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const params = useParams();
  const locale = params.locale;
  const isArabic = locale === 'ar';
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

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

  const statCards = [
    {
      title: isArabic ? 'المنتجات' : 'Products',
      value: stats.totalProducts,
      icon: <FaBox className="text-2xl" />,
      color: 'bg-blue-500',
    },
    {
      title: isArabic ? 'الطلبات اليوم' : "Today's Orders",
      value: stats.todayOrders,
      icon: <FaShoppingCart className="text-2xl" />,
      color: 'bg-green-500',
    },
    {
      title: isArabic ? 'الإيرادات' : 'Revenue',
      value: `${stats.totalRevenue} SAR`,
      icon: <FaMoneyBillWave className="text-2xl" />,
      color: 'bg-tahini-gold',
    },
    {
      title: isArabic ? 'إجمالي الطلبات' : 'Total Orders',
      value: stats.totalOrders,
      icon: <FaUsers className="text-2xl" />,
      color: 'bg-purple-500',
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-tahini-dark">
          {isArabic ? 'لوحة التحكم' : 'Dashboard'}
        </h1>
        <div className="flex gap-4">
          <button className="bg-tahini-gold text-white px-4 py-2 rounded-lg hover:bg-tahini-brown transition-colors flex items-center gap-2">
            <FaPlus />
            {isArabic ? 'إضافة منتج' : 'Add Product'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
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
        <button className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-left">
          <FaChartLine className="text-tahini-gold text-2xl mb-2" />
          <h3 className="font-semibold text-tahini-dark">
            {isArabic ? 'تتبع المبيعات' : 'Track Sales'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {isArabic ? 'عرض إحصائيات المبيعات اليومية' : 'View daily sales statistics'}
          </p>
        </button>
        
        <button className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-left">
          <FaBox className="text-tahini-gold text-2xl mb-2" />
          <h3 className="font-semibold text-tahini-dark">
            {isArabic ? 'إدارة المنتجات' : 'Manage Products'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {isArabic ? 'إضافة وتعديل وحذف المنتجات' : 'Add, edit, and delete products'}
          </p>
        </button>
        
        <button className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-left">
          <FaShoppingCart className="text-tahini-gold text-2xl mb-2" />
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
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-tahini-dark">
            {isArabic ? 'أحدث الطلبات' : 'Recent Orders'}
          </h2>
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
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.total_amount} SAR
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
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
      </div>
    </div>
  );
}