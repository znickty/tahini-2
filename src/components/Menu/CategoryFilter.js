'use client';

import { useState } from 'react';
import { FaUtensils, FaFilter } from 'react-icons/fa';

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory, locale }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isArabic = locale === 'ar';

  const allCategory = {
    id: 'all',
    name_en: 'All Items',
    name_ar: 'جميع العناصر',
    icon: '🍽️'
  };

  const allCategories = [allCategory, ...categories];

  return (
    <div className="mb-8">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-md"
        >
          <span className="flex items-center gap-2 font-semibold">
            <FaFilter className="text-tahini-gold" />
            {isArabic ? 'تصفية الفئات' : 'Filter Categories'}
          </span>
          <span className="text-tahini-gold">
            {isMobileOpen ? '▲' : '▼'}
          </span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className={`
        ${isMobileOpen ? 'flex' : 'hidden'} 
        lg:flex 
        flex-wrap gap-3 
        bg-white p-4 rounded-xl shadow-md
      `}>
        {allCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              onSelectCategory(category.id);
              setIsMobileOpen(false);
            }}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
              ${selectedCategory === category.id 
                ? 'bg-tahini-gold text-white shadow-lg scale-105' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <span className="text-lg">{category.icon || '📋'}</span>
            <span className="font-medium whitespace-nowrap">
              {isArabic ? category.name_ar : category.name_en}
            </span>
            {selectedCategory === category.id && (
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            )}
          </button>
        ))}
      </div>

      {/* Selected Category Indicator */}
      <div className="mt-2 text-sm text-gray-500 hidden lg:block">
        {isArabic ? 'الفئة المحددة: ' : 'Selected category: '}
        <span className="font-semibold text-tahini-dark">
          {isArabic 
            ? allCategories.find(c => c.id === selectedCategory)?.name_ar 
            : allCategories.find(c => c.id === selectedCategory)?.name_en
          }
        </span>
      </div>
    </div>
  );
}