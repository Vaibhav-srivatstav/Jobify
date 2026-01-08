import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = [
    '/',
    '/login',
    '/register',
  ];

  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/jobs',
    '/applications',
    '/resume',
    '/analyze',
  ];

  const isPublicRoute = publicRoutes.includes(pathname);
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(
      new URL('/login', request.url)
    );
  }

  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(
      new URL('/dashboard', request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
