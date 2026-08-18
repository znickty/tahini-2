import Link from "next/link";
import Image from "next/image";

export default function HomePage({ params }) {
  const isArabic = params.locale === "ar";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/hero-banner.png" // Replace with your image filename inside the /public folder
          alt="Hero Background"
          fill
          priority
          className="object-fit -z-10"
        />

        {/* Dark Overlay for Text Contrast */}
        <div className="absolute inset-0 bg-black/40 -z-10" />

        {/* Optional Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-pattern -z-10" />

        {/* Main Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            {isArabic ? "مطاعم ثلث كيلوغرام" : "One-third Kilogram Restaurants"}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            {isArabic ? "لحوم محلية أصلية" : "Authentic Local Meat"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${params.locale}/about`}
              className="bg-tahini-gold text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-tahini-brown transition-colors shadow-lg"
            >
              {isArabic ? "معلومات عنا" : "About Us"}
            </Link>
            <Link
              href={`/${params.locale}/menu`}
              className="bg-white text-tahini-dark px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg border-2 border-tahini-gold"
            >
              {isArabic ? "عرض القائمة" : "View Menu"}
            </Link>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 bg-tahini-cream">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-tahini-dark mb-12">
            {isArabic
              ? "لماذا مطاعم ثلث كيلوغرام؟"
              : "Why Choose One-third Kilogram Restaurants?"}
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-tahini-dark mb-2">
                  {isArabic ? feature.title_ar : feature.title_en}
                </h3>
                <p className="text-gray-600">
                  {isArabic ? feature.description_ar : feature.description_en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: "🍽️",
    title_en: "Authentic Cuisine",
    title_ar: "مأكولات أصيلة",
    description_en: "Traditional Saudi recipes made with love",
    description_ar: "وصفات سعودية تقليدية محضرة بحب",
  },
  {
    icon: "🌿",
    title_en: "Taking care of your health",
    title_ar: "رعاية صحتك",
    description_en: "We do not use hydrogenated oils",
    description_ar: "نحن لا نستخدم الزيوت المهدرجة",
  },
  {
    icon: "🚚",
    title_en: "Fast Delivery",
    title_ar: "توصيل سريع",
    description_en: "Fresh food delivered to your doorstep",
    description_ar: "طعام طازج يوصل لباب بيتك",
  },
  {
    icon: "⭐",
    title_en: "Quality Guaranteed",
    title_ar: "جودة مضمونة",
    description_en: "Premium ingredients, exceptional taste",
    description_ar: "مكونات فاخرة، طعم استثنائي",
  },
];
