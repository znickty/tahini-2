'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaUtensils } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
  const params = useParams();
  const locale = params.locale;
  const isArabic = locale === 'ar';
  const router = useRouter();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
    icon: '',
    image_url: '',
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name_en: category.name_en,
        name_ar: category.name_ar,
        description_en: category.description_en || '',
        description_ar: category.description_ar || '',
        icon: category.icon || '',
        image_url: category.image_url || '',
        sort_order: category.sort_order || 0,
        is_active: category.is_active === 1,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name_en: '',
        name_ar: '',
        description_en: '',
        description_ar: '',
        icon: '',
        image_url: '',
        sort_order: 0,
        is_active: true,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingCategory 
        ? `/api/categories` 
        : `/api/categories`;
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const payload = editingCategory 
        ? { ...formData, id: editingCategory.id }
        : formData;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          isArabic 
            ? editingCategory ? 'تم تحديث التصنيف' : 'تم إضافة التصنيف'
            : editingCategory ? 'Category updated' : 'Category added'
        );
        setShowModal(false);
        fetchCategories();
      } else {
        toast.error(data.error || (isArabic ? 'فشل العملية' : 'Operation failed'));
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(isArabic ? 'حدث خطأ' : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(isArabic ? 'هل أنت متأكد من حذف هذا التصنيف؟' : 'Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success(isArabic ? 'تم حذف التصنيف' : 'Category deleted');
        fetchCategories();
      } else {
        toast.error(isArabic ? 'فشل الحذف' : 'Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-tahini-dark">
          {isArabic ? 'التصنيفات' : 'Categories'}
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({categories.length})
          </span>
        </h1>
        <button
          onClick={() => openModal()}
          className="bg-tahini-gold text-white px-4 py-2 rounded-lg hover:bg-tahini-brown transition-colors flex items-center gap-2"
        >
          <FaPlus />
          {isArabic ? 'إضافة تصنيف' : 'Add Category'}
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-tahini-cream flex items-center justify-center text-2xl">
                    {category.icon || '📂'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-tahini-dark">
                      {isArabic ? category.name_ar : category.name_en}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {isArabic ? category.name_en : category.name_ar}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {category.is_active 
                    ? (isArabic ? 'نشط' : 'Active') 
                    : (isArabic ? 'غير نشط' : 'Inactive')}
                </span>
              </div>
              {category.description_en && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {isArabic ? category.description_ar : category.description_en}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(category)}
                  className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 text-sm"
                >
                  <FaEdit className="text-xs" />
                  {isArabic ? 'تعديل' : 'Edit'}
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="flex-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1 text-sm"
                >
                  <FaTrash className="text-xs" />
                  {isArabic ? 'حذف' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">{isArabic ? 'لا توجد تصنيفات' : 'No categories'}</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-tahini-dark">
                  {editingCategory 
                    ? (isArabic ? 'تعديل التصنيف' : 'Edit Category')
                    : (isArabic ? 'إضافة تصنيف' : 'Add Category')
                  }
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isArabic ? 'الأيقونة (إيموجي)' : 'Icon (Emoji)'}
                    </label>
                    <input
                      type="text"
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
                      placeholder="🍽️"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isArabic ? 'الوصف (إنجليزي)' : 'Description (English)'}
                    </label>
                    <textarea
                      name="description_en"
                      value={formData.description_en}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isArabic ? 'الوصف (عربي)' : 'Description (Arabic)'}
                    </label>
                    <textarea
                      name="description_ar"
                      value={formData.description_ar}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
                      dir="rtl"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isArabic ? 'رابط الصورة' : 'Image URL'}
                    </label>
                    <input
                      type="text"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
                      placeholder="https://example.com/category.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isArabic ? 'ترتيب العرض' : 'Sort Order'}
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

                  <div className="flex items-center mt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-tahini-gold focus:ring-tahini-gold"
                      />
                      <span className="text-sm text-gray-700">
                        {isArabic ? 'نشط' : 'Active'}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-tahini-gold text-white py-2 rounded-lg hover:bg-tahini-brown transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <FaSave />
                        {editingCategory 
                          ? (isArabic ? 'تحديث' : 'Update')
                          : (isArabic ? 'إضافة' : 'Add')
                        }
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {isArabic ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}