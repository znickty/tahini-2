'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { 
  FaTrash, 
  FaPlus, 
  FaMinus, 
  FaShoppingBag, 
  FaCreditCard,
  FaTruck,
  FaClock,
  FaArrowLeft
} from 'react-icons/fa';

export default function CartPage() {
  const params = useParams();
  const locale = params.locale;
  const isArabic = locale === 'ar';
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();
  
  const [orderType, setOrderType] = useState('delivery');

  const total = getTotal();
  const deliveryFee = total > 50 ? 0 : 10;
  const grandTotal = total + deliveryFee;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }
    // Store order type in session for checkout
    sessionStorage.setItem('order_type', orderType);
    router.push(`/${locale}/checkout`);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-tahini-dark mb-2">
          {isArabic ? 'سلة المشتريات فارغة' : 'Your Cart is Empty'}
        </h2>
        <p className="text-gray-500 mb-6">
          {isArabic ? 'أضف بعض الأطباق الشهية من قائمتنا' : 'Add some delicious items from our menu'}
        </p>
        <button
          onClick={() => router.push(`/${locale}/menu`)}
          className="bg-tahini-gold text-white px-8 py-3 rounded-lg font-semibold hover:bg-tahini-brown transition-colors"
        >
          {isArabic ? 'تصفح القائمة' : 'Browse Menu'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-tahini-gold transition-colors mb-4"
      >
        <FaArrowLeft />
        {isArabic ? 'رجوع' : 'Back'}
      </button>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-tahini-dark">
          {isArabic ? 'سلة المشتريات' : 'Shopping Cart'}
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({cartItems.length} {isArabic ? 'عناصر' : 'items'})
          </span>
        </h1>
        <button
          onClick={() => router.push(`/${locale}/menu`)}
          className="text-tahini-gold hover:text-tahini-brown transition-colors text-sm flex items-center gap-1"
        >
          <FaShoppingBag className="text-xs" />
          {isArabic ? 'مواصلة التسوق' : 'Continue Shopping'}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="divide-y">
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={isArabic ? item.name_ar : item.name_en} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-tahini-dark truncate">
                      {isArabic ? item.name_ar : item.name_en}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {isArabic ? 'السعر' : 'Price'}: <span className="font-bold text-tahini-gold">{item.price} SAR</span>
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-2 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right min-w-[80px]">
                    <p className="font-semibold text-tahini-dark">
                      {(item.price * item.quantity).toFixed(2)} SAR
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart */}
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 transition-colors text-sm flex items-center gap-1"
              >
                <FaTrash className="text-xs" />
                {isArabic ? 'مسح السلة' : 'Clear Cart'}
              </button>
              <span className="text-sm text-gray-400">
                {cartItems.length} {isArabic ? 'عناصر' : 'items'}
              </span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-tahini-dark mb-4">
              {isArabic ? 'ملخص الطلب' : 'Order Summary'}
            </h2>
            
            {/* Order Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'نوع الطلب' : 'Order Type'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setOrderType('delivery')}
                  className={`p-2 text-sm rounded-lg border-2 transition-all ${
                    orderType === 'delivery'
                      ? 'border-tahini-gold bg-tahini-cream text-tahini-dark'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FaTruck className="mx-auto mb-1" />
                  {isArabic ? 'توصيل' : 'Delivery'}
                </button>
                <button
                  onClick={() => setOrderType('pickup')}
                  className={`p-2 text-sm rounded-lg border-2 transition-all ${
                    orderType === 'pickup'
                      ? 'border-tahini-gold bg-tahini-cream text-tahini-dark'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FaClock className="mx-auto mb-1" />
                  {isArabic ? 'استلام' : 'Pickup'}
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{isArabic ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span>{total.toFixed(2)} SAR</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{isArabic ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
                  <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                    {deliveryFee === 0 ? (isArabic ? 'مجاناً' : 'Free') : `${deliveryFee} SAR`}
                  </span>
                </div>
              )}
              {orderType === 'delivery' && deliveryFee > 0 && (
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

            <button
              onClick={handleCheckout}
              className="w-full mt-6 bg-tahini-gold text-white py-3 rounded-lg font-semibold hover:bg-tahini-brown transition-colors flex items-center justify-center gap-2"
            >
              <FaCreditCard />
              {isArabic ? 'إتمام الطلب' : 'Proceed to Checkout'}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              🔒 {isArabic ? 'مدفوعات آمنة 100%' : '100% Secure Payments'}
            </p>

            {orderType === 'delivery' && (
              <div className="mt-4 pt-4 border-t text-center">
                <p className="text-xs text-gray-500">
                  ⏱️ {isArabic ? 'وقت التوصيل المتوقع: 30-45 دقيقة' : 'Estimated delivery: 30-45 minutes'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}