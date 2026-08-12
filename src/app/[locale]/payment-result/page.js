'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaShoppingBag, FaReceipt, FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function PaymentResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale;
  const isArabic = locale === 'ar';
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  const paymentId = searchParams.get('id');

  useEffect(() => {
    if (!paymentId) {
      setError(isArabic ? 'لا يوجد معرف دفع' : 'No payment ID found');
      setLoading(false);
      return;
    }

    verifyPayment(paymentId);
  }, [paymentId, locale]);

  const verifyPayment = async (paymentId) => {
    try {
      console.log('Verifying payment:', paymentId);
      
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payment_id: paymentId }),
      });

      const data = await response.json();
      console.log('Verification response:', data);

      if (response.ok && data.success) {
        setPaymentStatus('success');
        setOrderData(data.order);
        // Clear session data
        sessionStorage.removeItem('pending_order_id');
        sessionStorage.removeItem('pending_order_number');
        toast.success(isArabic ? 'تم الدفع بنجاح' : 'Payment successful');
      } else {
        setPaymentStatus('failed');
        setError(data.error || (isArabic ? 'فشل التحقق من الدفع' : 'Payment verification failed'));
        toast.error(isArabic ? 'فشل الدفع' : 'Payment failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setPaymentStatus('failed');
      setError(isArabic ? 'حدث خطأ في التحقق' : 'Verification error');
      toast.error(isArabic ? 'حدث خطأ' : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const message = isArabic 
      ? `مرحباً، لقد قمت بطلب رقم #${orderData?.order_number} من بيت الطهينة`
      : `Hello, I've placed order #${orderData?.order_number} from Tahini House`;
    window.open(`https://wa.me/966549856703?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FaSpinner className="text-5xl text-tahini-gold animate-spin mb-4" />
        <p className="text-gray-500">
          {isArabic ? 'جاري التحقق من الدفع...' : 'Verifying payment...'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className={`bg-white rounded-2xl shadow-2xl p-8 text-center ${
        paymentStatus === 'success' ? 'border-t-4 border-green-500' : 'border-t-4 border-red-500'
      }`}>
        {/* Icon */}
        <div className="mb-6">
          {paymentStatus === 'success' ? (
            <FaCheckCircle className="text-6xl text-green-500 mx-auto animate-bounce" />
          ) : (
            <FaTimesCircle className="text-6xl text-red-500 mx-auto animate-pulse" />
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-tahini-dark mb-2">
          {paymentStatus === 'success' 
            ? (isArabic ? 'تم الدفع بنجاح ✅' : 'Payment Successful ✅')
            : (isArabic ? 'فشل الدفع ❌' : 'Payment Failed ❌')
          }
        </h1>

        <p className="text-gray-500 mb-6">
          {paymentStatus === 'success' 
            ? (isArabic ? 'شكراً لك على طلبك' : 'Thank you for your order')
            : (isArabic ? 'حدث خطأ أثناء معالجة الدفع' : 'An error occurred during payment processing')
          }
        </p>

        {paymentStatus === 'success' && orderData && (
          <>
            <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
              <div className="flex justify-between py-2 border-b border-green-100">
                <span className="text-gray-600">{isArabic ? 'رقم الطلب' : 'Order #'}</span>
                <span className="font-semibold text-tahini-dark">#{orderData.order_number}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-green-100">
                <span className="text-gray-600">{isArabic ? 'المبلغ' : 'Amount'}</span>
                <span className="font-semibold text-tahini-gold">{orderData.total_amount} SAR</span>
              </div>
              <div className="flex justify-between py-2 border-b border-green-100">
                <span className="text-gray-600">{isArabic ? 'نوع الطلب' : 'Order Type'}</span>
                <span className="font-semibold">
                  {orderData.order_type === 'delivery' 
                    ? (isArabic ? 'توصيل' : 'Delivery') 
                    : (isArabic ? 'استلام' : 'Pickup')}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">{isArabic ? 'حالة الدفع' : 'Payment Status'}</span>
                <span className="text-green-600 font-semibold">
                  {isArabic ? 'مدفوع ✅' : 'Paid ✅'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push(`/${locale}/menu`)}
                className="flex-1 bg-tahini-gold text-white py-3 rounded-lg font-semibold hover:bg-tahini-brown transition-colors flex items-center justify-center gap-2"
              >
                <FaShoppingBag />
                {isArabic ? 'مواصلة التسوق' : 'Continue Shopping'}
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaWhatsapp />
                {isArabic ? 'واتساب' : 'WhatsApp'}
              </button>
              {/* <button
                onClick={() => router.push(`/${locale}/admin/orders`)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <FaReceipt />
                {isArabic ? 'عرض الطلبات' : 'View Orders'}
              </button> */}
            </div>
          </>
        )}

        {paymentStatus === 'failed' && (
          <>
            <p className="text-red-500 text-sm mb-6">
              {error || (isArabic ? 'حدث خطأ أثناء معالجة الدفع' : 'An error occurred during payment processing')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  const storedOrderId = sessionStorage.getItem('pending_order_id');
                  if (storedOrderId) {
                    router.push(`/${locale}/payment?order_id=${storedOrderId}`);
                  } else {
                    router.push(`/${locale}/cart`);
                  }
                }}
                className="flex-1 bg-tahini-gold text-white py-3 rounded-lg font-semibold hover:bg-tahini-brown transition-colors"
              >
                {isArabic ? 'المحاولة مرة أخرى' : 'Try Again'}
              </button>
              <button
                onClick={() => router.push(`/${locale}/cart`)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                {isArabic ? 'العودة إلى السلة' : 'Back to Cart'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Support */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-400">
          {isArabic 
            ? '📞 هل تحتاج مساعدة؟ اتصل بنا على 0500000000'
            : '📞 Need help? Call us at 0500000000'
          }
        </p>
      </div>
    </div>
  );
}