import { NextResponse } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

function getLocale(request) {
  // 1. Cookie check
  const cookieLocale = request.cookies.get('NEXT_LOCALE');
  if (cookieLocale && locales.includes(cookieLocale.value)) {
    return cookieLocale.value;
  }

  // 2. Accept-Language header check
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

  // 1. Skip API routes and static assets early
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|webp|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // 2. Check if path has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Determine current locale and path normalized without locale
  const currentLocale = pathnameHasLocale ? pathname.split('/')[1] : getLocale(request);
  const pathWithoutLocale = pathnameHasLocale
    ? '/' + pathname.split('/').slice(2).join('/')
    : pathname;

  // 3. Unlocalized URL -> Redirect to include locale prefix
  if (!pathnameHasLocale) {
    const redirectUrl = new URL(
      `/${currentLocale}${pathname === '/' ? '' : pathname}`,
      request.url
    );
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set('NEXT_LOCALE', currentLocale, { path: '/', maxAge: 31536000 });
    return response;
  }

  // 4. Admin Protection Logic (Evaluated on normalized path)
  const isAdminRoute = pathWithoutLocale.startsWith('/admin');
  const isLoginPage = pathWithoutLocale.startsWith('/admin/login');

  if (isAdminRoute && !isLoginPage) {
    const token = request.cookies.get('admin_token')?.value;

    // Direct to login if missing token
    if (!token) {
      const loginUrl = new URL(`/${currentLocale}/admin/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 5. Pass through & update locale cookie if changed
  const response = NextResponse.next();
  if (request.cookies.get('NEXT_LOCALE')?.value !== currentLocale) {
    response.cookies.set('NEXT_LOCALE', currentLocale, { path: '/', maxAge: 31536000 });
  }

  return response;
}

export const config = {
  matcher: [
    // Exclude API routes, next internal files, and static file formats
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|gif|ico|svg|webp|css|js)$).*)',
  ],
};