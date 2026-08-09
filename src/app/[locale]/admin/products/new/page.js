'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaSave, FaTimes, FaImage, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function NewProductPage() {
  const params = useParams();
  const locale = params.locale;
  const isArabic = locale === 'ar';
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category_id: '',
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
    price: '',
    discount_price: '',
    image_url: '',
    is_available: true,
    is_featured: false,
    preparation_time: 15,
    calories: '',
    sort_order: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
          preparation_time: parseInt(formData.preparation_time),
          calories: formData.calories ? parseInt(formData.calories) : null,
          sort_order: parseInt(formData.sort_order),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(isArabic ? 'تم إضافة المنتج بنجاح' : 'Product added successfully');
        router.push(`/${locale}/admin/products`);
      } else {
        toast.error(data.error || (isArabic ? 'فشل إضافة المنتج' : 'Failed to add product'));
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(isArabic ? 'حدث خطأ' : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-tahini-dark">
          {isArabic ? 'إضافة منتج جديد' : 'Add New Product'}
        </h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <FaTimes />
          {isArabic ? 'إلغاء' : 'Cancel'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'التصنيف' : 'Category'} *
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
              required
            >
              <option value="">{isArabic ? 'اختر التصنيف' : 'Select category'}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {isArabic ? category.name_ar : category.name_en}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'ترتيب العرض' : 'Display Order'}
            </label>
            <input
              type="number"
              name="sort_order"
              value={formData.sort_order}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
              min="0"
            />
          </div>

          {/* Name EN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'الاسم (إنجليزي)' : 'Name (English)'} *
            </label>
            <input
              type="text"
              name="name_en"
              value={formData.name_en}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
              required
              placeholder="e.g., Chicken Shawarma"
            />
          </div>

          {/* Name AR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'الاسم (عربي)' : 'Name (Arabic)'} *
            </label>
            <input
              type="text"
              name="name_ar"
              value={formData.name_ar}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
              required
              placeholder="مثال: شاورما دجاج"
              dir="rtl"
            />
          </div>

          {/* Description EN */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'الوصف (إنجليزي)' : 'Description (English)'}
            </label>
            <textarea
              name="description_en"
              value={formData.description_en}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
              placeholder="Describe the product in English"
            />
          </div>

          {/* Description AR */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'الوصف (عربي)' : 'Description (Arabic)'}
            </label>
            <textarea
              name="description_ar"
              value={formData.description_ar}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
              placeholder="وصف المنتج بالعربية"
              dir="rtl"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'السعر' : 'Price (SAR)'} *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
              required
              step="0.01"
              min="0"
              placeholder="25.00"
            />
          </div>

          {/* Discount Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'سعر الخصم' : 'Discount Price (SAR)'}
            </label>
            <input
              type="number"
              name="discount_price"
              value={formData.discount_price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
              step="0.01"
              min="0"
              placeholder="20.00"
            />
          </div>

          {/* Image URL */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'رابط الصورة' : 'Image URL'}
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
                placeholder="https://example.com/image.jpg"
              />
              {formData.image_url && (
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Preparation Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'وقت التحضير' : 'Preparation Time (min)'}
            </label>
            <input
              type="number"
              name="preparation_time"
              value={formData.preparation_time}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
              min="1"
              placeholder="15"
            />
          </div>

          {/* Calories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'السعرات الحرارية' : 'Calories'}
            </label>
            <input
              type="number"
              name="calories"
              value={formData.calories}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
              min="0"
              placeholder="350"
            />
          </div>

          {/* Checkboxes */}
          <div className="md:col-span-2">
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-tahini-gold focus:ring-tahini-gold"
                />
                <span className="text-sm text-gray-700">
                  {isArabic ? 'متوفر' : 'Available'}
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-tahini-gold focus:ring-tahini-gold"
                />
                <span className="text-sm text-gray-700">
                  {isArabic ? 'مميز' : 'Featured'}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8 pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-tahini-gold text-white py-3 rounded-lg font-semibold hover:bg-tahini-brown transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isArabic ? 'جاري الإضافة...' : 'Adding...'}
              </>
            ) : (
              <>
                <FaSave />
                {isArabic ? 'إضافة المنتج' : 'Add Product'}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {isArabic ? 'إلغاء' : 'Cancel'}
          </button>
        </div>
      </form>
    </div>
  );
}