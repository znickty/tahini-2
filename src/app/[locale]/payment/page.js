'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import MoyasarForm from '@/components/Payment/MoyasarForm';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function PaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale;
  const isArabic = locale === 'ar';
  const router = useRouter();

   
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (!orderId) {
      setError(isArabic ? 'رقم الطلب غير موجود' : 'Order ID not found');
      setLoading(false);
      return;
    }

    fetchOrderDetails(orderId);
  }, [orderId, locale]);

  const fetchOrderDetails = async (orderId) => {
    try {
      console.log('Fetching order details for ID:', orderId);
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();
      
      console.log('Order response:', response.status, data);

      if (response.ok) {
        setOrderData(data);
        // Store in session for callback
        sessionStorage.setItem('pending_order_id', orderId);
        sessionStorage.setItem('pending_order_number', data.order_number);
      } else {
        setError(data.error || (isArabic ? 'فشل تحميل تفاصيل الطلب' : 'Failed to load order details'));
        toast.error(isArabic ? 'فشل تحميل تفاصيل الطلب' : 'Failed to load order details');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError(isArabic ? 'حدث خطأ في تحميل الطلب' : 'Error loading order');
      toast.error(isArabic ? 'حدث خطأ' : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentId, transactionId) => {
    console.log('Payment successful:', { paymentId, transactionId });
    
    try {
      // Update order payment status
      const updateResponse = await fetch(`/api/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_status: 'paid',
          payment_transaction_id: transactionId,
          payment_method: 'online',
          payment_gateway: 'moyasar',
          payment_id: paymentId,
          status: 'confirmed',
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || (isArabic ? 'فشل تحديث حالة الدفع' : 'Failed to update payment status'));
      }

      const updatedOrder = await updateResponse.json();
      console.log('Order updated:', updatedOrder);

      toast.success(isArabic ? 'تم الدفع بنجاح! تم تأكيد طلبك' : 'Payment successful! Your order is confirmed');
      
      // Redirect to order success page
      router.push(`/${locale}/order-success?order_id=${orderId}`);
    } catch (error) {
      console.error('Payment success handling error:', error);
      toast.error(isArabic ? 'تم الدفع ولكن حدث خطأ في تحديث الطلب' : 'Payment successful but failed to update order');
      // Still redirect to success page
      router.push(`/${locale}/order-success?order_id=${orderId}`);
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    toast.error(error);
  };

  const handlePaymentClose = () => {
    if (confirm(isArabic ? 'هل تريد إلغاء الدفع؟' : 'Do you want to cancel payment?')) {
      // Update order status back to pending
      fetch(`/api/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_status: 'pending',
          payment_method: 'online',
          status: 'pending_payment',
        }),
      }).catch(console.error);
      
      router.push(`/${locale}/checkout`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-5xl text-tahini-gold mb-4" />
        <p className="text-gray-500">
          {isArabic ? 'جاري تحميل بيانات الدفع...' : 'Loading payment data...'}
        </p>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-tahini-dark mb-2">
            {isArabic ? 'الطلب غير موجود' : 'Order Not Found'}
          </h2>
          <p className="text-gray-500 mb-6">{error || (isArabic ? 'لم يتم العثور على الطلب' : 'Order not found')}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push(`/${locale}/cart`)}
              className="bg-tahini-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-tahini-brown transition-colors"
            >
              {isArabic ? 'العودة إلى السلة' : 'Back to Cart'}
            </button>
            <button
              onClick={() => router.push(`/${locale}/menu`)}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              {isArabic ? 'تصفح القائمة' : 'Browse Menu'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.push(`/${locale}/checkout`)}
        className="flex items-center gap-2 text-gray-500 hover:text-tahini-gold transition-colors mb-4"
      >
        <FaArrowLeft />
        {isArabic ? 'رجوع' : 'Back'}
      </button>

      <MoyasarForm
        amount={orderData.total_amount}
        description={`Tahini House - Order #${orderData.order_number}`}
        orderId={orderData.id}
        orderNumber={orderData.order_number}
        customerName={orderData.customer_name || 'Guest'}
        customerEmail={orderData.customer_email || ''}
        customerPhone={orderData.customer_phone || ''}
        locale={locale}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
        onClose={handlePaymentClose}
      />
    </div>
  );
}