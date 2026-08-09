'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaPlus, FaCheck } from 'react-icons/fa';

export default function ProductCard({ product, onAddToCart, locale }) {
  const [isAdded, setIsAdded] = useState(false);
  const isArabic = locale === 'ar';

  const handleAddToCart = () => {
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
      <div className="relative h-48 bg-gray-100">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={isArabic ? product.name_ar : product.name_en}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-tahini-cream">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        {!product.is_available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg px-4 py-2 bg-red-500 rounded-lg">
              {isArabic ? 'غير متوفر' : 'Not Available'}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-tahini-dark mb-1">
          {isArabic ? product.name_ar : product.name_en}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {isArabic ? product.description_ar : product.description_en}
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-tahini-gold">
              {product.discount_price ? (
                <>
                  <span className="line-through text-sm text-gray-400 mr-2">
                    {product.price} SAR
                  </span>
                  {product.discount_price} SAR
                </>
              ) : (
                `${product.price} SAR`
              )}
            </span>
            {product.preparation_time && (
              <span className="text-xs text-gray-400 block">
                ⏱️ {product.preparation_time} {isArabic ? 'دقيقة' : 'min'}
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.is_available}
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 flex items-center gap-2
              ${product.is_available 
                ? 'bg-tahini-gold hover:bg-tahini-brown text-white' 
                : 'bg-gray-300 cursor-not-allowed text-gray-500'
              }`}
          >
            {isAdded ? (
              <>
                <FaCheck className="text-white" />
                <span>{isArabic ? 'تم الإضافة' : 'Added'}</span>
              </>
            ) : (
              <>
                <FaPlus className="text-white" />
                <span>{isArabic ? 'أضف' : 'Add'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}