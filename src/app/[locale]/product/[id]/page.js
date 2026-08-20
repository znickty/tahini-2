'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { 
  FaClock, 
  FaFire, 
  FaUtensils, 
  FaShoppingBag, 
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPlus,
  FaMinus
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale;
  const productId = params.id;
  const isArabic = locale === 'ar';
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      setProduct(data);
      
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0]);
      }
      
      // Fetch related products
      if (data.category_id) {
        const relatedResponse = await fetch(`/api/products?category=${data.category_id}&limit=4`);
        const relatedData = await relatedResponse.json();
        setRelatedProducts(relatedData.filter(p => p.id !== data.id));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const price = selectedSize ? selectedSize.price : product.price;
    const productToAdd = {
      ...product,
      price: price,
      size: selectedSize ? selectedSize.name_en : null,
      size_ar: selectedSize ? selectedSize.name_ar : null,
    };
    
    addToCart(productToAdd, quantity);
    toast.success(isArabic ? 'تم إضافة المنتج إلى السلة' : 'Product added to cart');
  };

  const getPrice = () => {
    if (!product) return 0;
    return selectedSize ? selectedSize.price : product.price;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tahini-gold"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{isArabic ? 'المنتج غير موجود' : 'Product not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-tahini-gold transition-colors mb-6"
      >
        <FaArrowLeft />
        {isArabic ? 'رجوع' : 'Back'}
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={isArabic ? product.name_ar : product.name_en}
              className="w-full h-190 object-cover"
            />
          ) : (
            <div className="w-full h-96 bg-tahini-cream flex items-center justify-center text-6xl">
              🍽️
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-tahini-dark">
              {isArabic ? product.name_ar : product.name_en}
            </h1>
            {product.category_name_en && (
              <p className="text-sm text-gray-500 mt-1">
                {isArabic ? product.category_name_ar : product.category_name_en}
              </p>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed">
            {isArabic ? product.description_ar : product.description_en}
          </p>

          {/* Preparation Time & Calories */}
          <div className="flex flex-wrap gap-4">
            {product.preparation_time_minutes > 0 && (
              <div className="flex items-center gap-2 text-sm bg-gray-100 px-4 py-2 rounded-full">
                <FaClock className="text-tahini-gold" />
                <span>{product.preparation_time_minutes} {isArabic ? 'دقيقة' : 'min'}</span>
              </div>
            )}
            {product.kcal > 0 && (
              <div className="flex items-center gap-2 text-sm bg-gray-100 px-4 py-2 rounded-full">
                <FaFire className="text-red-500" />
                <span>{product.kcal} kcal</span>
              </div>
            )}
          </div>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'اختر الحجم' : 'Select Size'}
              </label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedSize?.id === size.id
                        ? 'border-tahini-gold bg-tahini-cream text-tahini-dark'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span>{isArabic ? size.name_ar : size.name_en}</span>
                    <span className="ml-2 text-tahini-gold font-bold">{size.price} SAR</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="border-t pt-4">
            <div className="flex items-baseline gap-3">
              {product.discount_price ? (
                <>
                  <span className="text-3xl font-bold text-tahini-gold">
                    {product.discount_price} SAR
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    {product.price} SAR
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-tahini-gold">
                  {getPrice()} SAR
                </span>
              )}
              {selectedSize && product.sizes && product.sizes.length > 0 && (
                <span className="text-sm text-gray-500">
                  / {isArabic ? selectedSize.name_ar : selectedSize.name_en}
                </span>
              )}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                <FaMinus className="text-sm" />
              </button>
              <span className="px-4 py-2 min-w-[40px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                <FaPlus className="text-sm" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-tahini-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-tahini-brown transition-colors flex items-center justify-center gap-2"
            >
              <FaShoppingBag />
              {isArabic ? 'أضف إلى السلة' : 'Add to Cart'}
            </button>
          </div>

          {/* Alerts */}
          {product.alerts && product.alerts.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <FaExclamationTriangle className="text-yellow-600 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-yellow-800">
                    {isArabic ? 'تنبيهات' : 'Alerts'}
                  </p>
                  <ul className="text-sm text-yellow-700 list-disc list-inside">
                    {product.alerts.map((alert, index) => (
                      <li key={index}>
                        {isArabic ? alert.name_ar : alert.name_en}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Nutritional Info */}
          {product.cholesterol && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-tahini-dark mb-3">
                {isArabic ? 'المعلومات الغذائية' : 'Nutritional Information'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {product.cholesterol > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">{isArabic ? 'الكوليسترول' : 'Cholesterol'}</p>
                    <p className="font-semibold">{product.cholesterol} mg</p>
                  </div>
                )}
                {product.carbohydrates > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">{isArabic ? 'الكاربوهيدرات' : 'Carbohydrates'}</p>
                    <p className="font-semibold">{product.carbohydrates} g</p>
                  </div>
                )}
                {product.fiber > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">{isArabic ? 'الألياف' : 'Fiber'}</p>
                    <p className="font-semibold">{product.fiber} g</p>
                  </div>
                )}
                {product.sodium > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">{isArabic ? 'الصوديوم' : 'Sodium'}</p>
                    <p className="font-semibold">{product.sodium} mg</p>
                  </div>
                )}
                {product.protein > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">{isArabic ? 'البروتين' : 'Protein'}</p>
                    <p className="font-semibold">{product.protein} g</p>
                  </div>
                )}
                {product.fat > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">{isArabic ? 'الدهون' : 'Fat'}</p>
                    <p className="font-semibold">{product.fat} g</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-tahini-dark mb-6">
            {isArabic ? 'قد يعجبك أيضاً' : 'You Might Also Like'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((related) => (
              <div
                key={related.id}
                onClick={() => router.push(`/${locale}/product/${related.id}`)}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="h-40 bg-gray-100">
                  {related.image_url ? (
                    <img
                      src={related.image_url}
                      alt={isArabic ? related.name_ar : related.name_en}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🍽️
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-tahini-dark truncate">
                    {isArabic ? related.name_ar : related.name_en}
                  </h3>
                  <p className="text-tahini-gold font-bold">{related.price} SAR</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}