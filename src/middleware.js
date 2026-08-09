import { NextResponse } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

function getLocale(request) {
  // Check for locale in cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE');
  if (cookieLocale && locales.includes(cookieLocale.value)) {
    return cookieLocale.value;
  }

  // Check for locale in accept-language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage.split(',')[0].split('-')[0];
    if (locales.includes(preferredLocale)) {
      return preferredLocale;
    }
  }

  return defaultLocale;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Check if pathname already starts with a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // Extract current locale from pathname
    const currentLocale = pathname.split('/')[1];
    const response = NextResponse.next();
    
    // Update cookie if missing or changed
    if (request.cookies.get('NEXT_LOCALE')?.value !== currentLocale) {
      response.cookies.set('NEXT_LOCALE', currentLocale, { path: '/', maxAge: 31536000 });
    }
    
    return response;
  }

  // 2. Path has no locale: determine locale and REDIRECT
  const locale = getLocale(request);
  const redirectUrl = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set('NEXT_LOCALE', locale, { path: '/', maxAge: 31536000 });

  return response;
}

export const config = {
  matcher: [
    // Ignore static files, api routes, and common image extensions
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};