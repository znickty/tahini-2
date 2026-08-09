'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { FaUtensils, FaAward, FaLeaf, FaClock } from 'react-icons/fa';

export default function AboutPage() {
  const params = useParams();
  const locale = params.locale;
  const isArabic = locale === 'ar';

  const features = [
    {
      icon: <FaUtensils className="text-3xl" />,
      title_en: 'Authentic Recipes',
      title_ar: 'وصفات أصيلة',
      desc_en: 'Traditional Saudi recipes passed down through generations',
      desc_ar: 'وصفات سعودية تقليدية تنتقل عبر الأجيال',
    },
    {
      icon: <FaLeaf className="text-3xl" />,
      title_en: 'Fresh Ingredients',
      title_ar: 'مكونات طازجة',
      desc_en: 'Only the finest and freshest ingredients make it to our kitchen',
      desc_ar: 'أفضل وأطعم المكونات الطازجة فقط في مطبخنا',
    },
    {
      icon: <FaAward className="text-3xl" />,
      title_en: 'Quality Guaranteed',
      title_ar: 'جودة مضمونة',
      desc_en: 'Every dish is prepared with precision and passion',
      desc_ar: 'كل طبق يحضر بدقة وشغف',
    },
    {
      icon: <FaClock className="text-3xl" />,
      title_en: 'Fast Service',
      title_ar: 'خدمة سريعة',
      desc_en: 'Quick preparation and delivery for your convenience',
      desc_ar: 'تحضير سريع وتوصيل لراحتك',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-tahini-dark to-transparent"></div>
        <img
          src="/images/about-hero.jpg"
          alt="About Tahini House"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="px-8 md:px-16 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {isArabic ? 'قصة بيت الطهينة' : 'The Tahini House Story'}
            </h1>
            <p className="text-white text-lg opacity-90">
              {isArabic 
                ? 'منذ عام 2020 ونحن نقدم أشهى المأكولات السعودية بلمسة عصرية'
                : 'Since 2020, we\'ve been serving the finest Saudi cuisine with a modern touch'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
        <div>
          <h2 className="text-3xl font-bold text-tahini-dark mb-4">
            {isArabic ? 'رسالتنا' : 'Our Mission'}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            {isArabic 
              ? 'نهدف في بيت الطهينة إلى تقديم تجربة طعام سعودية أصيلة تجمع بين النكهات التقليدية والإبداع العصري. نحرص على استخدام أجود المكونات الطازجة لنقدم لعملائنا وجبات صحية ولذيذة.'
              : 'At Tahini House, we aim to provide an authentic Saudi dining experience that combines traditional flavors with modern creativity. We carefully select the finest fresh ingredients to serve our customers healthy and delicious meals.'
            }
          </p>
          <p className="text-gray-600 leading-relaxed">
            {isArabic
              ? 'نفخر بتقديم أفضل الخدمات لعملائنا الكرام، ونسعى دائماً لتطوير قائمتنا لتلبي جميع الأذواق.'
              : 'We take pride in serving our valued customers and continuously work on developing our menu to satisfy all tastes.'
            }
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-tahini-cream rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">👨‍🍳</div>
            <h4 className="font-bold text-tahini-dark">
              {isArabic ? 'طهاة خبراء' : 'Expert Chefs'}
            </h4>
          </div>
          <div className="bg-tahini-cream rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">🌿</div>
            <h4 className="font-bold text-tahini-dark">
              {isArabic ? 'مكونات طازجة' : 'Fresh Ingredients'}
            </h4>
          </div>
          <div className="bg-tahini-cream rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">⭐</div>
            <h4 className="font-bold text-tahini-dark">
              {isArabic ? 'جودة عالية' : 'Premium Quality'}
            </h4>
          </div>
          <div className="bg-tahini-cream rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">🚀</div>
            <h4 className="font-bold text-tahini-dark">
              {isArabic ? 'توصيل سريع' : 'Fast Delivery'}
            </h4>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-tahini-dark mb-12">
          {isArabic ? 'لماذا تختار بيت الطهينة؟' : 'Why Choose Tahini House?'}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <div className="w-16 h-16 bg-tahini-cream rounded-full flex items-center justify-center mx-auto mb-4 text-tahini-gold">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-tahini-dark mb-2">
                {isArabic ? feature.title_ar : feature.title_en}
              </h3>
              <p className="text-gray-500 text-sm">
                {isArabic ? feature.desc_ar : feature.desc_en}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div>
        <h2 className="text-3xl font-bold text-center text-tahini-dark mb-12">
          {isArabic ? 'فريقنا' : 'Our Team'}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-tahini-cream to-tahini-gold mx-auto mb-4 flex items-center justify-center text-5xl">
                👨‍🍳
              </div>
              <h4 className="font-bold text-tahini-dark">Chef Name</h4>
              <p className="text-gray-500 text-sm">
                {isArabic ? 'رئيس الطهاة' : 'Head Chef'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}