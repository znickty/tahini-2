'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ProductsList() {
  const params = useParams();
  const locale = params.locale;
  const isArabic = locale === 'ar';
  const router = useRouter();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(isArabic ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success(isArabic ? 'تم حذف المنتج بنجاح' : 'Product deleted successfully');
        fetchProducts();
      } else {
        toast.error(isArabic ? 'فشل حذف المنتج' : 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(isArabic ? 'حدث خطأ' : 'An error occurred');
    }
  };

  const filteredProducts = products.filter(product => {
    const name = isArabic ? product.name_ar : product.name_en;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-tahini-dark">
          {isArabic ? 'المنتجات' : 'Products'}
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={isArabic ? 'بحث...' : 'Search...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tahini-gold"
            />
          </div>
          <button
            onClick={() => router.push(`/${locale}/admin/products/new`)}
            className="bg-tahini-gold text-white px-4 py-2 rounded-lg hover:bg-tahini-brown transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <FaPlus />
            {isArabic ? 'إضافة منتج' : 'Add Product'}
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isArabic ? 'المنتج' : 'Product'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isArabic ? 'التصنيف' : 'Category'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isArabic ? 'السعر' : 'Price'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isArabic ? 'الحالة' : 'Status'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isArabic ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={isArabic ? product.name_ar : product.name_en}
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            🍽️
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {isArabic ? product.name_ar : product.name_en}
                        </p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {isArabic ? product.description_ar : product.description_en}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {isArabic ? product.category_name_ar : product.category_name_en}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-tahini-gold">
                      {product.discount_price ? (
                        <>
                          <span className="line-through text-gray-400 mr-1">
                            {product.price}
                          </span>
                          {product.discount_price}
                        </>
                      ) : (
                        product.price
                      )} SAR
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      product.is_available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.is_available 
                        ? (isArabic ? 'متوفر' : 'Available') 
                        : (isArabic ? 'غير متوفر' : 'Unavailable')
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/${locale}/admin/products/${product.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {isArabic ? 'لا توجد منتجات' : 'No products found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}