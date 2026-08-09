'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  FaSearch, 
  FaEye, 
  FaCheck, 
  FaTimes, 
  FaUtensils,
  FaTruck,
  FaClock,
  FaFilter
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const params = useParams();
  const locale = params.locale;
  const isArabic = locale === 'ar';
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const statuses = [
    { value: 'all', label_en: 'All', label_ar: 'الكل' },
    { value: 'pending', label_en: 'Pending', label_ar: 'قيد الانتظار' },
    { value: 'confirmed', label_en: 'Confirmed', label_ar: 'مؤكد' },
    { value: 'preparing', label_en: 'Preparing', label_ar: 'قيد التحضير' },
    { value: 'ready', label_en: 'Ready', label_ar: 'جاهز' },
    { value: 'completed', label_en: 'Completed', label_ar: 'مكتمل' },
    { value: 'cancelled', label_en: 'Cancelled', label_ar: 'ملغي' },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(isArabic ? 'تم تحديث حالة الطلب' : 'Order status updated');
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        toast.error(isArabic ? 'فشل تحديث الحالة' : 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error(isArabic ? 'حدث خطأ' : 'An error occurred');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FaClock />,
      confirmed: <FaCheck />,
      preparing: <FaUtensils />,
      ready: <FaTruck />,
      completed: <FaCheck />,
      cancelled: <FaTimes />,
    };
    return icons[status] || <FaClock />;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone?.includes(searchTerm);
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-tahini-dark">
          {isArabic ? 'الطلبات' : 'Orders'}
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({orders.length} {isArabic ? 'طلب' : 'orders'})
          </span>
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={isArabic ? 'بحث عن طلب...' : 'Search orders...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
            />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {isArabic ? status.label_ar : status.label_en}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
                  {isArabic ? 'نوع الطلب' : 'Type'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isArabic ? 'الحالة' : 'Status'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isArabic ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.order_number}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{order.customer_name || 'Guest'}</div>
                    <div className="text-xs text-gray-500">{order.customer_phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-tahini-gold">
                    {order.total_amount} SAR
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.order_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 w-fit ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetails(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={isArabic ? 'عرض التفاصيل' : 'View details'}
                      >
                        <FaEye />
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-tahini-gold"
                      >
                        {statuses.filter(s => s.value !== 'all').map((status) => (
                          <option key={status.value} value={status.value}>
                            {isArabic ? status.label_ar : status.label_en}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {isArabic ? 'لا توجد طلبات' : 'No orders found'}
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-tahini-dark">
                  {isArabic ? 'تفاصيل الطلب' : 'Order Details'}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    #{selectedOrder.order_number}
                  </span>
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">{isArabic ? 'العميل' : 'Customer'}</p>
                  <p className="font-semibold">{selectedOrder.customer_name || 'Guest'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{isArabic ? 'رقم الهاتف' : 'Phone'}</p>
                  <p className="font-semibold">{selectedOrder.customer_phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{isArabic ? 'نوع الطلب' : 'Order Type'}</p>
                  <p className="font-semibold">{selectedOrder.order_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{isArabic ? 'طريقة الدفع' : 'Payment Method'}</p>
                  <p className="font-semibold">{selectedOrder.payment_method}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">{isArabic ? 'عنوان التوصيل' : 'Delivery Address'}</p>
                  <p className="font-semibold">{selectedOrder.delivery_address || '-'}</p>
                </div>
                {selectedOrder.special_instructions && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">{isArabic ? 'ملاحظات' : 'Special Instructions'}</p>
                    <p className="font-semibold">{selectedOrder.special_instructions}</p>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">{isArabic ? 'المنتجات' : 'Items'}</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {isArabic ? item.product_name_ar : item.product_name_en}
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      </span>
                      <span className="font-semibold">{item.total_price} SAR</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>{isArabic ? 'المجموع' : 'Total'}</span>
                    <span className="text-tahini-gold">{selectedOrder.total_amount} SAR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}