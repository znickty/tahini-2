'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { FaTimes, FaPlus, FaMinus, FaTrash, FaShoppingBag } from 'react-icons/fa';

export default function CartSidebar({ isOpen, onClose, locale }) {
  const { cartItems, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();
  const isArabic = locale === 'ar';
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const total = getTotal();
  const deliveryFee = total > 50 ? 0 : 10;
  const grandTotal = total + deliveryFee;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[9999] transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`
        fixed top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-[10000] transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : isArabic ? 'translate-x-full' : 'translate-x-full'}
        ${isArabic ? 'left-0' : 'right-0'}
      `}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${isArabic ? 'flex-row-reverse' : ''}`}>
          <h2 className={`text-xl font-bold text-tahini-dark flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
            <FaShoppingBag className="text-tahini-gold" />
            {isArabic ? 'سلة المشتريات' : 'Shopping Cart'}
            <span className="text-sm text-gray-400 font-normal">
              ({cartItems.length} {isArabic ? 'عناصر' : 'items'})
            </span>
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <FaTimes className="text-gray-500 text-xl" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4" style={{ height: 'calc(100vh - 300px)' }}>
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-lg font-medium">
                {isArabic ? 'سلة المشتريات فارغة' : 'Your cart is empty'}
              </p>
              <p className="text-sm mt-1">
                {isArabic ? 'أضف بعض الأطباق الشهية' : 'Add some delicious items'}
              </p>
              <button
                onClick={onClose}
                className="mt-4 bg-tahini-gold text-white px-6 py-2 rounded-lg hover:bg-tahini-brown transition-colors"
              >
                {isArabic ? 'تصفح القائمة' : 'Browse Menu'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className={`flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${isArabic ? 'flex-row-reverse' : ''}`}>
                  {/* Product Image */}
                  <div className="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={isArabic ? item.name_ar : item.name_en}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        🍽️
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className={`flex-1 min-w-0 ${isArabic ? 'text-right' : ''}`}>
                    <h4 className={`font-semibold text-tahini-dark truncate ${isArabic ? 'text-right' : ''}`}>
                      {isArabic ? item.name_ar : item.name_en}
                    </h4>
                    <p className={`text-sm text-tahini-gold font-bold ${isArabic ? 'text-right' : ''}`}>
                      {item.price} SAR
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className={`flex items-center gap-2 mt-1 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className={`${isArabic ? 'mr-auto' : 'ml-auto'} text-red-400 hover:text-red-600 transition-colors`}
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                className={`text-sm text-red-500 hover:text-red-700 transition-colors ${isArabic ? 'text-right block w-full' : ''}`}
              >
                {isArabic ? 'مسح السلة' : 'Clear Cart'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4">
            <div className="space-y-2 mb-4">
              <div className={`flex justify-between text-sm text-gray-600 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span>{isArabic ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span>{total.toFixed(2)} SAR</span>
              </div>
              <div className={`flex justify-between text-sm text-gray-600 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span>{isArabic ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
                <span>{deliveryFee === 0 ? 'Free' : `${deliveryFee} SAR`}</span>
              </div>
              {deliveryFee > 0 && (
                <div className={`text-xs text-tahini-gold ${isArabic ? 'text-right' : ''}`}>
                  * {isArabic ? 'طلب فوق 50 ريال يوصل مجاناً' : 'Free delivery on orders over 50 SAR'}
                </div>
              )}
              <div className="border-t pt-2">
                <div className={`flex justify-between font-bold text-lg ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <span>{isArabic ? 'المجموع الكلي' : 'Total'}</span>
                  <span className="text-tahini-gold">{grandTotal.toFixed(2)} SAR</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-tahini-gold text-white py-3 rounded-lg font-semibold hover:bg-tahini-brown transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCheckingOut ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isArabic ? 'جاري المعالجة...' : 'Processing...'}
                </>
              ) : (
                <>
                  <FaShoppingBag />
                  {isArabic ? 'إتمام الطلب' : 'Proceed to Checkout'}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}