'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { 
  FaUser, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEnvelope,
  FaCreditCard,
  FaMoneyBillWave,
  FaTruck,
  FaClock,
  FaCheckCircle,
  FaSpinner,
  FaArrowLeft
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const params = useParams();
  const locale = params.locale;
  const isArabic = locale === 'ar';
  const router = useRouter();
  const { cartItems, getTotal, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [orderType, setOrderType] = useState('delivery');
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    delivery_address: '',
    delivery_area: '',
    special_instructions: '',
  });

  const total = getTotal();
  const deliveryFee = total > 50 ? 0 : 10;
  const grandTotal = total + deliveryFee;

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push(`/${locale}/menu`);
      toast.error(isArabic ? 'سلة المشتريات فارغة' : 'Cart is empty');
    }
    
    // Get order type from session
    const storedOrderType = sessionStorage.getItem('order_type');
    if (storedOrderType) {
      setOrderType(storedOrderType);
      sessionStorage.removeItem('order_type');
    }
  }, [cartItems, locale, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (orderType === 'delivery' && !formData.delivery_address) {
      toast.error(isArabic ? 'يرجى إدخال عنوان التوصيل' : 'Please enter delivery address');
      return;
    }

    if (!formData.customer_name) {
      toast.error(isArabic ? 'يرجى إدخال الاسم' : 'Please enter your name');
      return;
    }

    if (!formData.customer_phone) {
      toast.error(isArabic ? 'يرجى إدخال رقم الهاتف' : 'Please enter phone number');
      return;
    }

    if (!formData.customer_email) {
      toast.error(isArabic ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter email');
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderPayload = {
        ...formData,
        items: cartItems.map(item => ({
          product_id: item.id,
          product_name_en: item.name_en,
          product_name_ar: item.name_ar,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
        })),
        total_amount: grandTotal,
        discount_amount: 0,
        delivery_fee: deliveryFee,
        order_type: orderType,
        payment_method: paymentMethod,
        special_instructions: formData.special_instructions,
      };

      console.log('Creating order with payload:', orderPayload);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const order = data.order;
        
        if (paymentMethod === 'online') {
          // Store order details and redirect to payment
          sessionStorage.setItem('pending_order_id', order.id.toString());
          sessionStorage.setItem('pending_order_number', order.order_number);
          
          toast.success(isArabic ? 'تم إنشاء الطلب، جاري التوجيه للدفع' : 'Order created, redirecting to payment');
          
          // Clear cart
          // clearCart();
          
          // Redirect to payment page
          router.push(`/${locale}/payment?order_id=${order.id}`);
        } else {
          // Cash on delivery
          clearCart();
          toast.success(isArabic ? 'تم إنشاء الطلب بنجاح' : 'Order created successfully');
          router.push(`/${locale}/order-success?order_id=${order.id}`);
        }
      } else {
        toast.error(data.error || (isArabic ? 'فشل إنشاء الطلب' : 'Failed to create order'));
      }
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error(isArabic ? 'حدث خطأ' : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.push(`/${locale}/cart`)}
        className="flex items-center gap-2 text-gray-500 hover:text-tahini-gold transition-colors mb-4"
      >
        <FaArrowLeft />
        {isArabic ? 'رجوع إلى السلة' : 'Back to Cart'}
      </button>

      <h1 className="text-3xl font-bold text-tahini-dark mb-8">
        {isArabic ? 'إتمام الطلب' : 'Checkout'}
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Order Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-tahini-dark mb-4 flex items-center gap-2">
                <FaUser className="text-tahini-gold" />
                {isArabic ? 'معلومات العميل' : 'Customer Information'}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isArabic ? 'الاسم الكامل' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isArabic ? 'رقم الهاتف' : 'Phone Number'} *
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
                    required
                    placeholder="05xxxxxxxx"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isArabic ? 'البريد الإلكتروني' : 'Email'} *
                  </label>
                  <input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Order Type Display */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-tahini-dark mb-4 flex items-center gap-2">
                <FaTruck className="text-tahini-gold" />
                {isArabic ? 'نوع الطلب' : 'Order Type'}
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  {orderType === 'delivery' ? (
                    <>
                      <FaTruck className="text-tahini-gold text-xl" />
                      <span className="font-semibold">{isArabic ? 'توصيل' : 'Delivery'}</span>
                    </>
                  ) : (
                    <>
                      <FaClock className="text-tahini-gold text-xl" />
                      <span className="font-semibold">{isArabic ? 'استلام' : 'Pickup'}</span>
                    </>
                  )}
                </div>
                {orderType === 'delivery' && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isArabic ? 'عنوان التوصيل' : 'Delivery Address'} *
                    </label>
                    <textarea
                      name="delivery_address"
                      value={formData.delivery_address}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
                      required={orderType === 'delivery'}
                      placeholder={isArabic ? 'العنوان بالتفصيل' : 'Detailed address'}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-tahini-dark mb-4 flex items-center gap-2">
                <FaCreditCard className="text-tahini-gold" />
                {isArabic ? 'طريقة الدفع' : 'Payment Method'}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('online')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    paymentMethod === 'online'
                      ? 'border-tahini-gold bg-tahini-cream'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FaCreditCard className="text-2xl mx-auto mb-2 text-tahini-gold" />
                  <p className="font-semibold">{isArabic ? 'دفع إلكتروني' : 'Online Payment'}</p>
                  <p className="text-xs text-gray-500">Mada, Visa, Mastercard</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-tahini-gold bg-tahini-cream'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FaMoneyBillWave className="text-2xl mx-auto mb-2 text-tahini-gold" />
                  <p className="font-semibold">{isArabic ? 'دفع عند الاستلام' : 'Cash on Delivery'}</p>
                  <p className="text-xs text-gray-500">{isArabic ? 'ادفع عند الاستلام' : 'Pay when you receive'}</p>
                </button>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-tahini-dark mb-4">
                {isArabic ? 'ملاحظات إضافية' : 'Special Instructions'}
              </h2>
              <textarea
                name="special_instructions"
                value={formData.special_instructions}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
                placeholder={isArabic ? 'أي ملاحظات عن الطلب...' : 'Any special notes about your order...'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-tahini-gold text-white py-4 rounded-xl font-semibold hover:bg-tahini-brown transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  {isArabic ? 'جاري المعالجة...' : 'Processing...'}
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  {isArabic ? 'تأكيد الطلب' : 'Place Order'}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-tahini-dark mb-4">
              {isArabic ? 'ملخص الطلب' : 'Order Summary'}
            </h2>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {isArabic ? item.name_ar : item.name_en}
                    <span className="text-gray-400 ml-1">x{item.quantity}</span>
                  </span>
                  <span className="font-semibold">
                    {(item.price * item.quantity).toFixed(2)} SAR
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{isArabic ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span>{total.toFixed(2)} SAR</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{isArabic ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
                <span>{deliveryFee === 0 ? 'Free' : `${deliveryFee} SAR`}</span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-tahini-gold">
                  * {isArabic ? 'طلب فوق 50 ريال يوصل مجاناً' : 'Free delivery on orders over 50 SAR'}
                </p>
              )}
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>{isArabic ? 'المجموع' : 'Total'}</span>
                  <span className="text-tahini-gold">{grandTotal.toFixed(2)} SAR</span>
                </div>
              </div>
            </div>

            {/* Accepted Cards */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-500 text-center">
                {isArabic ? 'طرق الدفع المقبولة' : 'Accepted Payment Methods'}
              </p>
              <div className="flex justify-center gap-2 mt-2 text-2xl">
                <span title="Mada">🏦</span>
                <span title="Visa">💳</span>
                <span title="Mastercard">💳</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}