'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  FaMoneyBillWave, 
  FaShoppingCart, 
  FaUsers,
  FaCalendarDay,
  FaCalendarAlt,
  FaChartLine,
  FaPrint,
  FaPlus,
  FaTimes
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function SalesPage() {
  const params = useParams();
  const locale = params.locale;
  const isArabic = locale === 'ar';
  
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCustomSale, setShowCustomSale] = useState(false);
  const [customSaleForm, setCustomSaleForm] = useState({
    description_en: '',
    description_ar: '',
    amount: '',
    payment_method: 'cash',
  });

  useEffect(() => {
    fetchSalesData();
  }, [selectedDate]);

  const fetchSalesData = async () => {
    try {
      const response = await fetch(`/api/admin/sales?date=${selectedDate}`);
      const data = await response.json();
      setSalesData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      setLoading(false);
    }
  };

  const handleCustomSaleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sale_date: selectedDate,
          ...customSaleForm,
          amount: parseFloat(customSaleForm.amount),
        }),
      });

      if (response.ok) {
        toast.success(isArabic ? 'تم إضافة البيع المخصص' : 'Custom sale added');
        setShowCustomSale(false);
        setCustomSaleForm({
          description_en: '',
          description_ar: '',
          amount: '',
          payment_method: 'cash',
        });
        fetchSalesData();
      } else {
        toast.error(isArabic ? 'فشل إضافة البيع' : 'Failed to add sale');
      }
    } catch (error) {
      console.error('Error adding custom sale:', error);
      toast.error(isArabic ? 'حدث خطأ' : 'An error occurred');
    }
  };

  const formatCurrency = (amount) => {
    return `${amount || 0} SAR`;
  };

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
          {isArabic ? 'تتبع المبيعات' : 'Sales Tracking'}
        </h1>
        <div className="flex gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
          />
          <button
            onClick={() => setShowCustomSale(true)}
            className="bg-tahini-gold text-white px-4 py-2 rounded-lg hover:bg-tahini-brown transition-colors flex items-center gap-2"
          >
            <FaPlus />
            {isArabic ? 'إضافة بيع مخصص' : 'Add Custom Sale'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{isArabic ? 'إجمالي الإيرادات' : 'Total Revenue'}</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(salesData?.total_revenue)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaMoneyBillWave className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{isArabic ? 'إجمالي الطلبات' : 'Total Orders'}</p>
              <p className="text-2xl font-bold text-blue-600">{salesData?.total_orders || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaShoppingCart className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{isArabic ? 'مبيعات الكاش' : 'Cash Sales'}</p>
              <p className="text-2xl font-bold text-tahini-gold">{formatCurrency(salesData?.cash_payments)}</p>
            </div>
            <div className="bg-tahini-cream p-3 rounded-full">
              <FaUsers className="text-tahini-gold text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{isArabic ? 'مبيعات البطاقة' : 'Card Sales'}</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(salesData?.card_payments)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaChartLine className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Custom Sales List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-tahini-dark flex items-center gap-2">
            <FaCalendarDay className="text-tahini-gold" />
            {isArabic ? 'المبيعات المخصصة' : 'Custom Sales'}
          </h2>
          <span className="text-sm text-gray-500">
            {new Date(selectedDate).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isArabic ? 'الوصف' : 'Description'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isArabic ? 'المبلغ' : 'Amount'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isArabic ? 'طريقة الدفع' : 'Payment Method'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isArabic ? 'التاريخ' : 'Date'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {salesData?.custom_sales?.length > 0 ? (
                salesData.custom_sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {isArabic ? sale.description_ar : sale.description_en}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-tahini-gold">
                      {sale.amount} SAR
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        sale.payment_method === 'cash' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {sale.payment_method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(sale.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    {isArabic ? 'لا توجد مبيعات مخصصة' : 'No custom sales'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Sale Modal */}
      {showCustomSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-tahini-dark">
                  {isArabic ? 'إضافة بيع مخصص' : 'Add Custom Sale'}
                </h2>
                <button
                  onClick={() => setShowCustomSale(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleCustomSaleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isArabic ? 'الوصف (إنجليزي)' : 'Description (English)'}
                    </label>
                    <input
                      type="text"
                      value={customSaleForm.description_en}
                      onChange={(e) => setCustomSaleForm({
                        ...customSaleForm,
                        description_en: e.target.value
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isArabic ? 'الوصف (عربي)' : 'Description (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={customSaleForm.description_ar}
                      onChange={(e) => setCustomSaleForm({
                        ...customSaleForm,
                        description_ar: e.target.value
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
                      required
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isArabic ? 'المبلغ (ريال)' : 'Amount (SAR)'}
                    </label>
                    <input
                      type="number"
                      value={customSaleForm.amount}
                      onChange={(e) => setCustomSaleForm({
                        ...customSaleForm,
                        amount: e.target.value
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isArabic ? 'طريقة الدفع' : 'Payment Method'}
                    </label>
                    <select
                      value={customSaleForm.payment_method}
                      onChange={(e) => setCustomSaleForm({
                        ...customSaleForm,
                        payment_method: e.target.value
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
                    >
                      <option value="cash">{isArabic ? 'كاش' : 'Cash'}</option>
                      <option value="card">{isArabic ? 'بطاقة' : 'Card'}</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-tahini-gold text-white py-2 rounded-lg hover:bg-tahini-brown transition-colors"
                  >
                    {isArabic ? 'إضافة' : 'Add Sale'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomSale(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {isArabic ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}