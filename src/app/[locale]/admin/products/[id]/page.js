'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaSave, FaTimes, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function EditProductPage() {
  const params = useParams();
  const locale = params.locale;
  const productId = params.id;
  const isArabic = locale === 'ar';
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    preparation_time_minutes: 0,
    kcal: '',
    sort_order: 0,
    // Nutritional info
    calories: '',
    cholesterol: '',
    carbohydrates: '',
    fiber: '',
    sodium: '',
    protein: '',
    fat: '',
    // Sizes
    sizes: [],
    // Alerts
    alerts: [],
  });

  const [newSize, setNewSize] = useState({ name_en: '', name_ar: '', price: '' });
  const [newAlert, setNewAlert] = useState({ alert_type: 'allergy', name_en: '', name_ar: '' });

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      
      setFormData({
        category_id: data.category_id || '',
        name_en: data.name_en || '',
        name_ar: data.name_ar || '',
        description_en: data.description_en || '',
        description_ar: data.description_ar || '',
        price: data.price || '',
        discount_price: data.discount_price || '',
        image_url: data.image_url || '',
        is_available: data.is_available === 1,
        is_featured: data.is_featured === 1,
        preparation_time_minutes: data.preparation_time_minutes || 0,
        kcal: data.kcal || '',
        sort_order: data.sort_order || 0,
        calories: data.calories || '',
        cholesterol: data.cholesterol || '',
        carbohydrates: data.carbohydrates || '',
        fiber: data.fiber || '',
        sodium: data.sodium || '',
        protein: data.protein || '',
        fat: data.fat || '',
        sizes: data.sizes || [],
        alerts: data.alerts || [],
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error(isArabic ? 'فشل تحميل المنتج' : 'Failed to load product');
      setLoading(false);
    }
  };

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

  const handleNutritionChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addSize = () => {
    if (newSize.name_en && newSize.name_ar && newSize.price) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, { ...newSize, sort_order: formData.sizes.length }]
      });
      setNewSize({ name_en: '', name_ar: '', price: '' });
    } else {
      toast.error(isArabic ? 'يرجى ملء جميع حقول الحجم' : 'Please fill all size fields');
    }
  };

  const removeSize = (index) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((_, i) => i !== index)
    });
  };

  const addAlert = () => {
    if (newAlert.alert_type && newAlert.name_en && newAlert.name_ar) {
      setFormData({
        ...formData,
        alerts: [...formData.alerts, { ...newAlert }]
      });
      setNewAlert({ alert_type: 'allergy', name_en: '', name_ar: '' });
    } else {
      toast.error(isArabic ? 'يرجى ملء جميع حقول التنبيه' : 'Please fill all alert fields');
    }
  };

  const removeAlert = (index) => {
    setFormData({
      ...formData,
      alerts: formData.alerts.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
          preparation_time_minutes: parseInt(formData.preparation_time_minutes) || 0,
          kcal: formData.kcal ? parseInt(formData.kcal) : null,
          calories: formData.calories ? parseFloat(formData.calories) : null,
          cholesterol: formData.cholesterol ? parseFloat(formData.cholesterol) : null,
          carbohydrates: formData.carbohydrates ? parseFloat(formData.carbohydrates) : null,
          fiber: formData.fiber ? parseFloat(formData.fiber) : null,
          sodium: formData.sodium ? parseFloat(formData.sodium) : null,
          protein: formData.protein ? parseFloat(formData.protein) : null,
          fat: formData.fat ? parseFloat(formData.fat) : null,
          sort_order: parseInt(formData.sort_order) || 0,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(isArabic ? 'تم تحديث المنتج بنجاح' : 'Product updated successfully');
        router.push(`/${locale}/admin/products`);
      } else {
        toast.error(data.error || (isArabic ? 'فشل تحديث المنتج' : 'Failed to update product'));
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(isArabic ? 'حدث خطأ' : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(isArabic ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success(isArabic ? 'تم حذف المنتج بنجاح' : 'Product deleted successfully');
        router.push(`/${locale}/admin/products`);
      } else {
        toast.error(isArabic ? 'فشل حذف المنتج' : 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(isArabic ? 'حدث خطأ' : 'An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tahini-gold"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-tahini-dark">
          {isArabic ? 'تعديل المنتج' : 'Edit Product'}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <FaTrash />
            {isArabic ? 'حذف' : 'Delete'}
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <FaTimes />
            {isArabic ? 'إلغاء' : 'Cancel'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-tahini-dark mb-4 border-b pb-2">
              {isArabic ? 'المعلومات الأساسية' : 'Basic Information'}
            </h2>
          </div>

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
              dir="rtl"
            />
          </div>

          {/* Description EN */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'الوصف (إنجليزي)' : 'Description (English)'} *
            </label>
            <textarea
              name="description_en"
              value={formData.description_en}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
              required
            />
          </div>

          {/* Description AR */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'الوصف (عربي)' : 'Description (Arabic)'} *
            </label>
            <textarea
              name="description_ar"
              value={formData.description_ar}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
              required
              dir="rtl"
            />
          </div>

          {/* Price & Discount */}
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
            />
          </div>

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

          {/* Preparation & Calories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'وقت التحضير (دقائق)' : 'Preparation Time (minutes)'}
            </label>
            <input
              type="number"
              name="preparation_time_minutes"
              value={formData.preparation_time_minutes}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'السعرات الحرارية (kcal)' : 'Calories (kcal)'}
            </label>
            <input
              type="number"
              name="kcal"
              value={formData.kcal}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
              min="0"
            />
          </div>

          {/* Nutritional Information */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-tahini-dark mb-4 border-b pb-2">
              {isArabic ? 'المعلومات الغذائية' : 'Nutritional Information'}
            </h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'الكوليسترول (mg)' : 'Cholesterol (mg)'}
            </label>
            <input
              type="number"
              name="cholesterol"
              value={formData.cholesterol}
              onChange={handleNutritionChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'الكاربوهيدرات (g)' : 'Carbohydrates (g)'}
            </label>
            <input
              type="number"
              name="carbohydrates"
              value={formData.carbohydrates}
              onChange={handleNutritionChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'الألياف (g)' : 'Fiber (g)'}
            </label>
            <input
              type="number"
              name="fiber"
              value={formData.fiber}
              onChange={handleNutritionChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'الصوديوم (mg)' : 'Sodium (mg)'}
            </label>
            <input
              type="number"
              name="sodium"
              value={formData.sodium}
              onChange={handleNutritionChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'البروتين (g)' : 'Protein (g)'}
            </label>
            <input
              type="number"
              name="protein"
              value={formData.protein}
              onChange={handleNutritionChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'الدهون (g)' : 'Fat (g)'}
            </label>
            <input
              type="number"
              name="fat"
              value={formData.fat}
              onChange={handleNutritionChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
              step="0.01"
            />
          </div>

          {/* Sizes */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-tahini-dark mb-4 border-b pb-2">
              {isArabic ? 'الأحجام والأسعار' : 'Sizes & Prices'}
            </h2>
          </div>

          <div className="md:col-span-2">
            <div className="flex flex-wrap gap-4 mb-4">
              <input
                type="text"
                placeholder={isArabic ? 'الاسم (إنجليزي)' : 'Name (English)'}
                value={newSize.name_en}
                onChange={(e) => setNewSize({ ...newSize, name_en: e.target.value })}
                className="flex-1 min-w-[150px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
              />
              <input
                type="text"
                placeholder={isArabic ? 'الاسم (عربي)' : 'Name (Arabic)'}
                value={newSize.name_ar}
                onChange={(e) => setNewSize({ ...newSize, name_ar: e.target.value })}
                className="flex-1 min-w-[150px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
                dir="rtl"
              />
              <input
                type="number"
                placeholder={isArabic ? 'السعر' : 'Price'}
                value={newSize.price}
                onChange={(e) => setNewSize({ ...newSize, price: e.target.value })}
                className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
                step="0.01"
                min="0"
              />
              <button
                type="button"
                onClick={addSize}
                className="px-4 py-2 bg-tahini-gold text-white rounded-lg hover:bg-tahini-brown transition-colors flex items-center gap-2"
              >
                <FaPlus /> {isArabic ? 'إضافة' : 'Add'}
              </button>
            </div>

            {formData.sizes.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-4 gap-4 font-semibold text-sm text-gray-600 mb-2">
                  <span>{isArabic ? 'الاسم (إنجليزي)' : 'Name (English)'}</span>
                  <span>{isArabic ? 'الاسم (عربي)' : 'Name (Arabic)'}</span>
                  <span>{isArabic ? 'السعر' : 'Price'}</span>
                  <span>{isArabic ? 'إجراء' : 'Action'}</span>
                </div>
                {formData.sizes.map((size, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 items-center py-2 border-t">
                    <span>{size.name_en}</span>
                    <span>{size.name_ar}</span>
                    <span>{size.price} SAR</span>
                    <button
                      type="button"
                      onClick={() => removeSize(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Alerts */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-tahini-dark mb-4 border-b pb-2">
              {isArabic ? 'التنبيهات والتحذيرات' : 'Alerts & Warnings'}
            </h2>
          </div>

          <div className="md:col-span-2">
            <div className="flex flex-wrap gap-4 mb-4">
              <select
                value={newAlert.alert_type}
                onChange={(e) => setNewAlert({ ...newAlert, alert_type: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
              >
                <option value="allergy">{isArabic ? 'حساسية' : 'Allergy'}</option>
                <option value="preparation">{isArabic ? 'تحضير' : 'Preparation'}</option>
                <option value="dietary">{isArabic ? 'حمية' : 'Dietary'}</option>
              </select>
              <input
                type="text"
                placeholder={isArabic ? 'الاسم (إنجليزي)' : 'Name (English)'}
                value={newAlert.name_en}
                onChange={(e) => setNewAlert({ ...newAlert, name_en: e.target.value })}
                className="flex-1 min-w-[150px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
              />
              <input
                type="text"
                placeholder={isArabic ? 'الاسم (عربي)' : 'Name (Arabic)'}
                value={newAlert.name_ar}
                onChange={(e) => setNewAlert({ ...newAlert, name_ar: e.target.value })}
                className="flex-1 min-w-[150px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
                dir="rtl"
              />
              <button
                type="button"
                onClick={addAlert}
                className="px-4 py-2 bg-tahini-gold text-white rounded-lg hover:bg-tahini-brown transition-colors flex items-center gap-2"
              >
                <FaPlus /> {isArabic ? 'إضافة' : 'Add'}
              </button>
            </div>

            {formData.alerts.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-4 gap-4 font-semibold text-sm text-gray-600 mb-2">
                  <span>{isArabic ? 'النوع' : 'Type'}</span>
                  <span>{isArabic ? 'الاسم (إنجليزي)' : 'Name (English)'}</span>
                  <span>{isArabic ? 'الاسم (عربي)' : 'Name (Arabic)'}</span>
                  <span>{isArabic ? 'إجراء' : 'Action'}</span>
                </div>
                {formData.alerts.map((alert, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 items-center py-2 border-t">
                    <span className="text-sm capitalize">{alert.alert_type}</span>
                    <span>{alert.name_en}</span>
                    <span>{alert.name_ar}</span>
                    <button
                      type="button"
                      onClick={() => removeAlert(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
            disabled={saving}
            className="flex-1 bg-tahini-gold text-white py-3 rounded-lg font-semibold hover:bg-tahini-brown transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isArabic ? 'جاري التحديث...' : 'Updating...'}
              </>
            ) : (
              <>
                <FaSave />
                {isArabic ? 'تحديث المنتج' : 'Update Product'}
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