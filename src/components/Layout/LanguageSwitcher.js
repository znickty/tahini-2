'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSwitcher({ locale }) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    const currentPath = pathname.replace(/^\/[a-z]{2}/, '');
    router.push(`/${newLocale}${currentPath}`);
  };

  return (
    <button
      onClick={switchLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
    >
      <span className="text-sm font-medium">
        {locale === 'en' ? 'العربية' : 'English'}
      </span>
      <span className="text-xs">
        {locale === 'en' ? '🇸🇦' : '🇬🇧'}
      </span>
    </button>
  );
}