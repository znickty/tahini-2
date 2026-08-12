'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { FaCheckCircle, FaShoppingBag, FaPrint, FaWhatsapp, FaSpinner } from 'react-icons/fa';

export default function OrderSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale;
  const isArabic = locale === 'ar';
  const router = useRouter();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      router.push(`/${locale}/menu`);
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();
      
      if (response.ok) {
        setOrder(data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const message = isArabic 
      ? `مرحباً، لقد قمت بطلب رقم #${order?.order_number} من بيت الطهينة`
      : `Hello, I've placed order #${order?.order_number} from Tahini House`;
    window.open(`https://wa.me/966500000000?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-5xl text-tahini-gold mb-4" />
        <p className="text-gray-500">
          {isArabic ? 'جاري تحميل تفاصيل الطلب...' : 'Loading order details...'}
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{isArabic ? 'الطلب غير موجود' : 'Order not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="mb-6">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto animate-bounce" />
        </div>

        <h1 className="text-3xl font-bold text-tahini-dark mb-2">
          {isArabic ? 'شكراً لك! تم تأكيد طلبك' : 'Thank You! Your Order is Confirmed'}
        </h1>
        <p className="text-gray-600 mb-6">
          {isArabic 
            ? `رقم الطلب #${order.order_number}`
            : `Order #${order.order_number}`
          }
        </p>

        <div className="bg-green-50 rounded-xl p-6 mb-6 text-left">
          <h2 className="font-semibold mb-3 text-green-800">
            {isArabic ? 'تفاصيل الطلب' : 'Order Details'}
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-green-100">
              <span className="text-gray-600">{isArabic ? 'التاريخ' : 'Date'}</span>
              <span className="font-medium">
                {new Date(order.order_date).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-green-100">
              <span className="text-gray-600">{isArabic ? 'نوع الطلب' : 'Order Type'}</span>
              <span className="font-medium">{order.order_type}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-green-100">
              <span className="text-gray-600">{isArabic ? 'طريقة الدفع' : 'Payment'}</span>
              <span className="font-medium">
                {order.payment_method === 'online' ? (isArabic ? 'دفع إلكتروني' : 'Online') : (isArabic ? 'كاش' : 'Cash')}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600">{isArabic ? 'حالة الدفع' : 'Payment Status'}</span>
              <span className={`font-medium ${
                order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {order.payment_status === 'paid' ? (isArabic ? 'مدفوع ✅' : 'Paid ✅') : (isArabic ? 'قيد الانتظار' : 'Pending')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={() => router.push(`/${locale}/menu`)}
            className="flex-1 bg-tahini-gold text-white py-3 rounded-lg font-semibold hover:bg-tahini-brown transition-colors flex items-center justify-center gap-2"
          >
            <FaShoppingBag />
            {isArabic ? 'مواصلة التسوق' : 'Continue Shopping'}
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <FaPrint />
            {isArabic ? 'طباعة' : 'Print'}
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <FaWhatsapp />
            {isArabic ? 'واتساب' : 'WhatsApp'}
          </button>
        </div>

        <p className="text-sm text-gray-500">
          {isArabic 
            ? 'سيتم إعلامك عند تجهيز طلبك. شكراً لتسوقك من بيت الطهينة!'
            : 'You will be notified when your order is ready. Thank you for ordering from Tahini House!'
          }
        </p>
      </div>
    </div>
  );
}