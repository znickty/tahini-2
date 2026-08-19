'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaCheck, FaHeart, FaRegHeart, FaStar, FaClock } from 'react-icons/fa';

export default function ProductCard({ product, onAddToCart, locale }) {
  const router = useRouter();
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isArabic = locale === 'ar';

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent navigation to product details
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleFavorite = (e) => {
    e.stopPropagation(); // Prevent navigation to product details
    setIsFavorite(!isFavorite);
  };

  const handleCardClick = () => {
    router.push(`/${locale}/product/${product.id}`);
  };

  // Get the name and description based on locale
  const name = isArabic ? product.name_ar : product.name_en;
  const description = isArabic ? product.description_ar : product.description_en;
  const price = product.discount_price || product.price;
  const hasDiscount = product.discount_price && product.discount_price < product.price;

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-tahini-gold cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative h-56 bg-gradient-to-br from-tahini-cream to-white overflow-hidden">
        {product.image_url && !imageError ? (
          <img
            src={product.image_url}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-30">🍽️</span>
          </div>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
          </div>
        )}

        {/* Availability Badge */}
        {!product.is_available && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold text-lg px-6 py-3 bg-red-500 rounded-full shadow-lg">
              {isArabic ? 'غير متوفر حالياً' : 'Currently Unavailable'}
            </span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
        >
          {isFavorite ? (
            <FaHeart className="text-red-500 text-xl" />
          ) : (
            <FaRegHeart className="text-gray-400 text-xl hover:text-red-500 transition-colors" />
          )}
        </button>

        {/* Preparation Time */}
        {product.preparation_time_minutes > 0 && (
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
            <FaClock className="text-tahini-gold" />
            <span>{product.preparation_time_minutes} {isArabic ? 'دقيقة' : 'min'}</span>
          </div>
        )}

        {/* Category Tag */}
        {product.category_name_en && (
          <div className="absolute bottom-3 right-3 bg-tahini-gold text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            {isArabic ? product.category_name_ar : product.category_name_en}
          </div>
        )}

        {/* Calories Badge */}
        {product.kcal > 0 && (
          <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <span>🔥</span>
            <span>{product.kcal}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-tahini-dark line-clamp-2 flex-1">
            {name}
          </h3>
          {product.is_featured && (
            <FaStar className="text-tahini-gold text-sm ml-2 flex-shrink-0" />
          )}
        </div>

        <p className="text-sm text-gray-500 mb-3 line-clamp-2 min-h-[40px]">
          {description}
        </p>

        {/* Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.sizes.slice(0, 3).map((size) => (
              <span key={size.id} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                {isArabic ? size.name_ar : size.name_en}
              </span>
            ))}
            {product.sizes.length > 3 && (
              <span className="text-xs text-gray-400">+{product.sizes.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <div>
            {hasDiscount ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-tahini-gold">
                  {price} SAR
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {product.price} SAR
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-tahini-gold">
                {price} SAR
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.is_available}
            className={`
              px-5 py-2.5 rounded-full font-semibold transition-all duration-300 flex items-center gap-2
              ${product.is_available 
                ? 'bg-tahini-gold hover:bg-tahini-brown text-white hover:scale-105 hover:shadow-lg' 
                : 'bg-gray-300 cursor-not-allowed text-gray-500'
              }
            `}
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

        {/* Quick Add Quantity Selector (Optional) */}
        {product.is_available && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>✓ {isArabic ? 'طازج' : 'Fresh'}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>✓ {isArabic ? 'جودة عالية' : 'Premium Quality'}</span>
              {product.kcal > 0 && (
                <>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{product.kcal} {isArabic ? 'سعرة' : 'kcal'}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}